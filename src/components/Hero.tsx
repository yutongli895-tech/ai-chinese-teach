import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

interface HeroProps {
  visitorCount?: number;
  isDarkMode: boolean;
}

export function Hero({ visitorCount = 0, isDarkMode }: HeroProps) {
  return (
    <section className={cn(
      "relative w-full min-h-[600px] flex items-center justify-center overflow-hidden border-b transition-colors duration-500",
      isDarkMode ? "border-stone-800 bg-stone-950" : "border-stone-200/30 bg-transparent"
    )}>
      {/* Abstract Ink/AI Background - Adjusted for transparency */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Digital accent */}
        <div className={cn(
          "absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-40 transition-colors duration-500",
          isDarkMode ? "bg-gradient-to-tr from-indigo-900/10 to-transparent" : "bg-gradient-to-tr from-indigo-50/30 to-transparent"
        )} />
      </div>

      <div className="container relative px-4 md:px-6 mx-auto z-10">
        <div className="flex flex-col items-center space-y-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className={cn(
              "inline-flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm backdrop-blur-sm transition-colors duration-500",
              isDarkMode ? "bg-stone-900/80 border-stone-800" : "bg-white/80 border-stone-200"
            )}>
              <Sparkles className={cn("w-3.5 h-3.5", isDarkMode ? "text-amber-500" : "text-amber-600")} />
              <span className={cn(
                "text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-500",
                isDarkMode ? "text-stone-400" : "text-stone-500"
              )}>
                Next Generation Chinese Education
              </span>
            </div>
            
            <div className="relative inline-block">
              {/* Decorative Seal */}
              <div className={cn(
                "absolute -right-16 -top-8 hidden md:flex h-12 w-12 items-center justify-center rounded-sm border-2 p-1 rotate-12 select-none transition-colors duration-500",
                isDarkMode ? "border-red-500/30" : "border-red-600/40"
              )}>
                <span className={cn(
                  "font-cursive text-xl leading-none transition-colors duration-500",
                  isDarkMode ? "text-red-500/50" : "text-red-600/60"
                )}>智教</span>
              </div>

              <h1 className={cn(
                "flex flex-col gap-4 font-serif font-bold transition-colors duration-500",
                isDarkMode ? "text-stone-100" : "text-stone-900"
              )}>
                <span className="text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[1.1]">
                  AI 赋能 <span className={cn(
                    "text-transparent bg-clip-text bg-gradient-to-r transition-all duration-500",
                    isDarkMode ? "from-stone-100 via-stone-400 to-stone-100" : "from-stone-900 via-stone-700 to-stone-900"
                  )}>语文教学</span>
                </span>
                <span className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] font-light">
                  重塑<span className={cn(
                    "italic font-cursive mx-4 transition-colors duration-500",
                    isDarkMode ? "text-stone-500" : "text-stone-400"
                  )}>教育</span>新境界
                </span>
              </h1>
            </div>
            
            <p className={cn(
              "mx-auto max-w-2xl text-lg md:text-xl font-light leading-relaxed transition-colors duration-500",
              isDarkMode ? "text-stone-400" : "text-stone-500"
            )}>
              汇聚前沿智能工具，沉淀经典教学智慧。
              <br className="hidden sm:block" />
              让科技回归人文，开启数字化语文教育新篇章。
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <button className={cn(
              "group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full px-10 font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none",
              isDarkMode ? "bg-stone-100 text-stone-900 hover:bg-white" : "bg-stone-900 text-white hover:bg-stone-800"
            )}>
              <span className="mr-2">开始探索</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className={cn(
              "inline-flex h-14 items-center justify-center rounded-full border backdrop-blur-sm px-10 font-medium shadow-sm transition-all",
              isDarkMode 
                ? "border-stone-800 bg-stone-900/50 text-stone-400 hover:bg-stone-800 hover:text-stone-100" 
                : "border-stone-200 bg-white/50 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            )}>
              了解更多
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className={cn(
              "pt-12 grid grid-cols-3 gap-12 md:gap-24 border-t transition-colors duration-500",
              isDarkMode ? "border-stone-800/60" : "border-stone-200/60"
            )}
          >
            {[
              { num: "100+", label: "智能教案", sub: "Smart Plans" },
              { num: "50+", label: "AI 工具", sub: "AI Tools" },
              { num: visitorCount > 1000 ? `${(visitorCount / 1000).toFixed(1)}k+` : visitorCount.toString(), label: "访客见证", sub: "Visitors" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={cn(
                  "text-3xl md:text-4xl font-bold font-serif transition-colors duration-500",
                  isDarkMode ? "text-stone-100" : "text-stone-900"
                )}>{stat.num}</span>
                <span className={cn(
                  "text-sm font-medium mt-2 transition-colors duration-500",
                  isDarkMode ? "text-stone-400" : "text-stone-600"
                )}>{stat.label}</span>
                <span className={cn(
                  "text-[10px] uppercase tracking-widest mt-1 transition-colors duration-500",
                  isDarkMode ? "text-stone-600" : "text-stone-400"
                )}>{stat.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
