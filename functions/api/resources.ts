export interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;
    const { results } = await env.DB.prepare("SELECT * FROM resources ORDER BY created_at DESC").all();
    
    // Parse tags from JSON string back to array
    const resources = results.map((r: any) => ({
      ...r,
      tags: JSON.parse(r.tags || "[]")
    }));

    return new Response(JSON.stringify(resources), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch resources", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json() as any;

    const { id, title, description, type, author, date, tags, link, likes } = body;

    await env.DB.prepare(
      "INSERT INTO resources (id, title, description, type, author, date, tags, link, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(id, title, description, type, author, date, JSON.stringify(tags), link, likes)
      .run();

    return new Response(JSON.stringify({ success: true, resource: body }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create resource", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
