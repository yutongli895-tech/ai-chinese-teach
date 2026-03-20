import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'gemini-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/chat' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const { message } = JSON.parse(body);
                  const apiKey = process.env.GEMINI_API_KEY;
                  if (!apiKey) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: "Missing API Key in dev" }));
                    return;
                  }
                  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
                  });
                  const data = await response.json();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ reply: (data as any).candidates?.[0]?.content?.parts?.[0]?.text || "No response" }));
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: String(e) }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    define: {
      // API Key is now handled securely by the Vite dev middleware above.
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
