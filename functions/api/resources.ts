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

    // Ensure all fields have at least a default value to prevent D1 errors
    const id = body.id || crypto.randomUUID();
    const title = body.title || "未命名文章";
    const description = body.description || "";
    const type = body.type || "article";
    const author = body.author || "管理员";
    const date = body.date || new Date().toISOString().split("T")[0];
    const tags = Array.isArray(body.tags) ? body.tags : [];
    const link = body.link || "#";
    const likes = Number(body.likes) || 0;
    const content = body.content || "";
    const createdAt = Math.floor(Date.now() / 1000);

    const result = await env.DB.prepare(
      "INSERT INTO resources (id, title, description, type, author, date, tags, link, likes, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(id, title, description, type, author, date, JSON.stringify(tags), link, likes, content, createdAt)
      .run();

    if (!result.success) {
      throw new Error("D1 写入失败");
    }

    return new Response(JSON.stringify({ success: true, resource: { id, title } }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // Return the actual error message so we can diagnose it in the browser console
    return new Response(JSON.stringify({ 
      error: "数据库写入失败", 
      details: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json() as any;

    const { id, title, description, type, author, date, tags, link, likes, content } = body;

    await env.DB.prepare(
      "UPDATE resources SET title = ?, description = ?, type = ?, author = ?, date = ?, tags = ?, link = ?, likes = ?, content = ? WHERE id = ?"
    )
      .bind(title, description, type, author, date, JSON.stringify(tags), link, likes, content || "", id)
      .run();

    return new Response(JSON.stringify({ success: true, resource: body }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update resource", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.DB.prepare("DELETE FROM resources WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete resource", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
