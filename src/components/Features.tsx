import { motion } from "motion/react";
import { Bot, Library, UserCheck, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface FeaturesProps {
  isDarkMode: boolean;
}

export function Features({ isDarkMode }: FeaturesProps) {
  const features = [
    {
      title: "AI 备课助教",
      description: "利用大语言模型深度解析文本，自动生成教学设计、导学案及课堂互动问题，大幅提升备课效率。",
      icon: Bot,
      color: "text-blue-500",
      bg: "bg-blue-50/50",
      darkBg: "bg-blue-900/10",
      label: "AI Assistant"
    },
    {
      title: "海量教学资源",
      description: "汇聚全国名师优质课件、教案、论文及多媒体素材，涵盖小学至高中全学段，资源持续更新。",
      icon: Library,
      color: "text-emerald-500",
      bg: "bg-emerald-50/50",
      darkBg: "bg-emerald-900/10",
      label: "Massive Resources"
    },
    {
      title: "名师深度点评",
      description: "特邀语文学科带头人对经典课例进行深度剖析，提供多维度的教学建议，助力青年教师专业成长。",
      icon: UserCheck,
      color: "text-amber-500",
      bg: "bg-amber-50/50",
      darkBg: "bg-amber-900/10",
      label: "Expert Comments"
    }
  ];

  return (
    <section id="features" className={cn(
      "py-24 relative overflow-hidden transition-colors duration-500",
      isDarkMode ? "bg-stone-950" : "bg-white/40"
    )}>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 mb-4"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Platform Features</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={cn(
              "text-3xl md:text-4xl font-serif font-bold mb-6 transition-colors duration-500",
              isDarkMode ? "text-stone-100" : "text-stone-900"
            )}
          >
            探索数字化语文教育的<span className="italic font-cursive ml-2 text-stone-400">无限可能</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-lg font-light transition-colors duration-500",
              isDarkMode ? "text-stone-400" : "text-stone-500"
            )}
          >
            我们致力于将最先进的 AI 技术与深厚的语文教学传统相结合，
            为教师提供全方位的智能化支持。
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative p-8 rounded-3xl border transition-all duration-500",
                isDarkMode 
                  ? "bg-stone-900/40 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60" 
                  : "bg-white border-stone-100 hover:border-stone-200 hover:shadow-xl hover:shadow-stone-200/40"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500",
                isDarkMode ? feature.darkBg : feature.bg
              )}>
                <feature.icon className={cn("w-7 h-7", feature.color)} />
              </div>
              
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">
                {feature.label}
              </span>
              
              <h3 className={cn(
                "text-xl font-serif font-bold mb-4 transition-colors duration-500",
                isDarkMode ? "text-stone-100" : "text-stone-900"
              )}>
                {feature.title}
              </h3>
              
              <p className={cn(
                "text-sm leading-relaxed font-light transition-colors duration-500",
                isDarkMode ? "text-stone-400" : "text-stone-500"
              )}>
                {feature.description}
              </p>
              
              <div className={cn(
                "absolute bottom-0 left-8 right-8 h-1 transition-all duration-500 scale-x-0 group-hover:scale-x-100",
                feature.color.replace("text-", "bg-")
              )} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
