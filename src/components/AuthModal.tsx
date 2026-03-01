import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, Mail, Lock, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "register";
  onSwitchType: () => void;
  onLoginSuccess: (role: "admin" | "user") => void;
}

export function AuthModal({ isOpen, onClose, type, onSwitchType, onLoginSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: type,
          email,
          password,
        }),
      });

      const data = await response.json() as { success: boolean, role?: "admin" | "user", error?: string };
      
      if (data.success && data.role) {
        onLoginSuccess(data.role);
        onClose();
      } else {
        alert(data.error || "登录/注册失败，请检查邮箱和密码。");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("网络错误，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-stone-200 bg-[#fcfaf8] p-6 shadow-xl duration-200 sm:rounded-xl"
          >
            <div className="flex flex-col space-y-1.5 text-center">
              <h2 className="text-xl font-serif font-bold leading-none tracking-tight text-stone-900">
                {type === "login" ? "登录" : "注册账号"}
              </h2>
              <p className="text-sm text-stone-500 font-light">
                {type === "login" ? "欢迎回到 AI 语文智教" : "加入我们，共建智慧教育社区"}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none text-stone-700">邮箱</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <input
                    type="email"
                    required
                    className="flex h-10 w-full rounded-md border border-stone-200 bg-white pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
                    placeholder="您的邮箱地址"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none text-stone-700">密码</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <input
                    type="password"
                    required
                    className="flex h-10 w-full rounded-md border border-stone-200 bg-white pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white bg-stone-800 text-stone-50 hover:bg-stone-700 h-10 py-2 px-4"
              >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {type === "login" ? "登录中..." : "注册中..."}
                    </>
                ) : (
                    type === "login" ? "登录" : "注册"
                )}
              </button>
            </form>

            <div className="text-center text-sm text-stone-500">
                {type === "login" ? "还没有账号？" : "已有账号？"}
                <button 
                    onClick={onSwitchType}
                    className="ml-1 underline underline-offset-4 hover:text-stone-800"
                >
                    {type === "login" ? "立即注册" : "去登录"}
                </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
