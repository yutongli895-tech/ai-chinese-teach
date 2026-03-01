interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === "GET") {
    try {
      const result = await env.DB.prepare("SELECT value FROM stats WHERE key = 'visitor_count'").first<{ value: number }>();
      if (!result) {
        // If not found, try to insert it
        await env.DB.prepare("INSERT OR IGNORE INTO stats (key, value) VALUES ('visitor_count', 0)").run();
        return Response.json({ visitor_count: 0 });
      }
      return Response.json({ visitor_count: result.value || 0 });
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  if (request.method === "POST") {
    try {
      // Increment visitor count
      await env.DB.prepare("UPDATE stats SET value = value + 1 WHERE key = 'visitor_count'").run();
      const result = await env.DB.prepare("SELECT value FROM stats WHERE key = 'visitor_count'").first<{ value: number }>();
      return Response.json({ visitor_count: result?.value || 0 });
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};
