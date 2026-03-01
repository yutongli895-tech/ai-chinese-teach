import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroProps {
  visitorCount?: number;
}

export function Hero({ visitorCount = 0 }: HeroProps) {
  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden border-b border-stone-200/30 dark:border-stone-800/30">
      {/* Abstract Ink/AI Background - Adjusted for transparency */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Digital accent */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-50/30 dark:from-indigo-900/10 to-transparent rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="container relative px-4 md:px-6 mx-auto z-10">
        <div className="flex flex-col items-center space-y-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">
                Next Generation Chinese Education
              </span>
            </div>
            
            <div className="relative inline-block">
              {/* Decorative Seal */}
              <div className="absolute -right-16 -top-8 hidden md:flex h-12 w-12 items-center justify-center rounded-sm border-2 border-red-600/40 dark:border-red-500/30 p-1 rotate-12 select-none">
                <span className="font-cursive text-red-600/60 dark:text-red-500/50 text-xl leading-none">智教</span>
              </div>

              <h1 className="flex flex-col gap-4 font-serif font-bold text-stone-900 dark:text-stone-100">
                <span className="text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[1.1]">
                  AI 赋能 <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 dark:from-stone-100 dark:via-stone-400 dark:to-stone-100">语文教学</span>
                </span>
                <span className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] font-light">
                  重塑<span className="italic font-cursive text-stone-400 dark:text-stone-500 mx-4">教育</span>新境界
                </span>
              </h1>
            </div>
            
            <p className="mx-auto max-w-2xl text-stone-500 dark:text-stone-400 text-lg md:text-xl font-light leading-relaxed">
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
            <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-stone-900 dark:bg-stone-100 px-10 font-medium text-white dark:text-stone-900 shadow-lg transition-all hover:bg-stone-800 dark:hover:bg-white hover:scale-105 hover:shadow-xl focus:outline-none">
              <span className="mr-2">开始探索</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex h-14 items-center justify-center rounded-full border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm px-10 font-medium text-stone-600 dark:text-stone-400 shadow-sm transition-all hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100">
              了解更多
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="pt-12 grid grid-cols-3 gap-12 md:gap-24 border-t border-stone-200/60 dark:border-stone-800/60"
          >
            {[
              { num: "100+", label: "智能教案", sub: "Smart Plans" },
              { num: "50+", label: "AI 工具", sub: "AI Tools" },
              { num: visitorCount > 1000 ? `${(visitorCount / 1000).toFixed(1)}k+` : visitorCount.toString(), label: "访客见证", sub: "Visitors" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold font-serif text-stone-900 dark:text-stone-100">{stat.num}</span>
                <span className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-2">{stat.label}</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-600 mt-1">{stat.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
