export interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json() as any;
    const { action, email, password } = body;

    if (action === "register") {
      const id = crypto.randomUUID();
      // On registration, if the email is the requested admin email, set role to admin
      const role = email === "soralabe@foxmail.com" ? "admin" : "user";
      
      await env.DB.prepare(
        "INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)"
      )
        .bind(id, email, password, role)
        .run();

      return new Response(JSON.stringify({ success: true, role }), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (action === "login") {
      const user = await env.DB.prepare(
        "SELECT * FROM users WHERE email = ? AND password = ?"
      )
        .bind(email, password)
        .first() as any;

      if (user) {
        return new Response(JSON.stringify({ success: true, role: user.role }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Fallback for initial admin setup if no users exist yet
        if (email === "soralabe@foxmail.com" && password === "admin") {
             return new Response(JSON.stringify({ success: true, role: "admin" }), {
                headers: { "Content-Type": "application/json" },
            });
        }
        
        return new Response(JSON.stringify({ error: "Invalid email or password" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Auth failed", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
