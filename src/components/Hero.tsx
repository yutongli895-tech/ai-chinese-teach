import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden border-b border-stone-200/30">
      {/* Abstract Ink/AI Background - Adjusted for transparency */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Digital accent */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-50/30 to-transparent rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="container relative px-4 md:px-6 mx-auto z-10">
        <div className="flex flex-col items-center space-y-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] font-medium tracking-widest uppercase text-stone-500">
                Next Gen Education
              </span>
            </div>
            
            <h1 className="flex flex-col gap-2 font-serif font-bold text-stone-900">
              <span className="text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.1]">
                AI 赋能 <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-800 to-stone-600">语文教学</span>
              </span>
              <span className="text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.1]">
                重塑<span className="italic font-light text-stone-400 mx-2">教育</span>新境界
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-stone-500 text-lg md:text-xl font-light leading-relaxed">
              Empowering Chinese Education with Artificial Intelligence.
              <br className="hidden sm:block" />
              汇聚前沿智能工具，沉淀经典教学智慧，开启数字化教育新篇章。
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-stone-900 px-8 font-medium text-white shadow-lg transition-all hover:bg-stone-800 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2">
              <span className="mr-2">开始探索</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex h-12 items-center justify-center rounded-full border border-stone-200 bg-white px-8 font-medium text-stone-600 shadow-sm transition-colors hover:bg-stone-50 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:ring-offset-2">
              了解更多
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="pt-8 grid grid-cols-3 gap-8 md:gap-16 border-t border-stone-200/60"
          >
            {[
              { num: "100+", label: "智能教案", sub: "Smart Plans" },
              { num: "50+", label: "AI 工具", sub: "AI Tools" },
              { num: "10k+", label: "师生受益", sub: "Beneficiaries" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold font-serif text-stone-900">{stat.num}</span>
                <span className="text-sm font-medium text-stone-600 mt-1">{stat.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400">{stat.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
