import { motion, AnimatePresence } from "motion/react";
import { X, Send, Bot, Sparkles, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "您好！我是您的 AI 备课助教。有什么可以帮您的吗？比如：「如何设计《静夜思》的导入环节？」" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      let aiResponseText = "";

      // Check if we are in development mode or production
      // In this specific preview environment, we use the client-side SDK for demonstration.
      // In a real production build deployed to Cloudflare, we would use the /api/chat endpoint.
      const isDev = (import.meta as any).env?.DEV; 
      
      // However, for the purpose of this preview to work immediately for the user, 
      // we will default to client-side SDK if the API key is available in the environment.
      // The user asked about Cloudflare deployment, so we will implement the logic to switch.
      
      if (isDev && process.env.GEMINI_API_KEY) {
          // Client-side call for local preview
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userMessage,
          });
          aiResponseText = response.text || "抱歉，我没有理解您的意思。";
      } else {
          // Production call to Cloudflare Functions (or if key is missing locally)
          // Note: This will fail in the preview if /api/chat doesn't exist, 
          // but it's the correct code for the user's Cloudflare deployment request.
          // To make it work in THIS preview, we fallback to the SDK if possible.
          
          try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });
            
            if (response.ok) {
                const data = await response.json() as { reply: string };
                aiResponseText = data.reply;
            } else {
                // Fallback for preview if /api/chat is not set up in the container
                 if (process.env.GEMINI_API_KEY) {
                    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                    const sdkResponse = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: userMessage,
                    });
                    aiResponseText = sdkResponse.text || "抱歉，我没有理解您的意思。";
                 } else {
                    throw new Error("API Error");
                 }
            }
          } catch (e) {
             // Final fallback if everything fails (e.g. no network, no key)
             console.error(e);
             aiResponseText = "抱歉，连接 AI 服务失败，请稍后再试。";
          }
      }

      setMessages(prev => [...prev, { role: "ai", content: aiResponseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: "ai", content: "抱歉，遇到了一些问题，请稍后再试。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl shadow-2xl md:right-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100">AI 备课助教</h3>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    在线中
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-stone-50/30 dark:bg-stone-950/30">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user" 
                        ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded-tr-none" 
                        : "bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 text-stone-700 dark:text-stone-200 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-3">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入问题..."
                  className="w-full rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 py-2.5 pl-4 pr-10 text-sm text-stone-900 dark:text-stone-100 focus:border-stone-400 dark:focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-400 dark:focus:ring-stone-500"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-indigo-100 dark:border-indigo-900/50 transition-all hover:shadow-[0_8px_30px_rgb(79,70,229,0.2)]"
      >
        <Sparkles className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </motion.button>
    </>
  );
}
