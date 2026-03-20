export interface Env {
  GEMINI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const { message } = await request.json() as { message: string };

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (message.length > 1000) {
      return new Response(JSON.stringify({ error: "Message too long (max 1000 chars)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing API Key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 解析多个 API Key（支持逗号分隔）
    const apiKeys = env.GEMINI_API_KEY.split(',').map(k => k.trim()).filter(Boolean);
    const getApiKey = () => apiKeys[Math.floor(Math.random() * apiKeys.length)];

    // 1. 优先尝试 Gemini 3.1 Pro Preview
    const proModel = "gemini-3.1-pro-preview";
    const proUrl = `https://generativelanguage.googleapis.com/v1beta/models/${proModel}:generateContent?key=${getApiKey()}`;

    try {
      const response = await fetch(proUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        }),
      });

      if (response.ok) {
        const data = await response.json() as any;
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return new Response(JSON.stringify({ reply: text }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      
      console.warn(`Gemini Pro failed with status ${response.status}, falling back to Flash...`);
    } catch (e) {
      console.error("Gemini Pro request failed:", e);
    }

    // 2. 回退到最稳定的 Gemini 1.5 Flash
    const flashModel = "gemini-1.5-flash";
    const flashUrl = `https://generativelanguage.googleapis.com/v1/models/${flashModel}:generateContent?key=${getApiKey()}`;
    
    const flashResponse = await fetch(flashUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      }),
    });

    if (!flashResponse.ok) {
      const errorText = await flashResponse.text();
      return new Response(JSON.stringify({ 
        error: "AI 服务暂时不可用", 
        details: errorText 
      }), {
        status: flashResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await flashResponse.json() as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我暂时无法回答。";

    return new Response(JSON.stringify({ reply: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
