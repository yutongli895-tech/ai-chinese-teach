import { motion } from "motion/react";
import { Quote } from "lucide-react";

const quotes = [
  { text: "学而不思则罔，思而不学则殆。", author: "孔子", source: "《论语·为政》" },
  { text: "博学之，审问之，慎思之，明辨之，笃行之。", author: "子思", source: "《中庸》" },
  { text: "师者，所以传道受业解惑也。", author: "韩愈", source: "《师说》" },
  { text: "问渠那得清如许？为有源头活水来。", author: "朱熹", source: "《观书有感》" },
  { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原", source: "《离骚》" },
];

export function DailyWisdom() {
  // Simple random selection for demo purposes
  const todayQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  // We need to know if it's dark mode to apply conditional classes
  // However, this component doesn't have isDarkMode prop.
  // Since it's a small component, I'll just rely on the CSS variables I set in index.css
  // which are already working for the body.
  
  // Wait, I see text-stone-800 dark:text-stone-200.
  // If dark: is not working, it will stay text-stone-800.
  
  // Let's check if I can pass isDarkMode to it or use a hook.
  // For now, I'll just leave it or use the CSS variables defined in index.css.
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative mx-auto max-w-4xl px-6 py-16 text-center"
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 text-stone-200/30 dark:text-stone-800/30">
        <Quote className="h-32 w-32 rotate-180 opacity-20" />
      </div>
      
      <div className="relative z-10 space-y-8">
        <h2 className="font-serif text-3xl font-bold tracking-wider text-[var(--text-ink)] md:text-4xl leading-relaxed">
          「{todayQuote.text}」
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-stone-500 font-light tracking-[0.3em] uppercase">
            <span className="w-12 h-[1px] bg-stone-200 dark:bg-stone-800"></span>
            <span>{todayQuote.author} · {todayQuote.source}</span>
            <span className="w-12 h-[1px] bg-stone-200 dark:bg-stone-800"></span>
        </div>
      </div>
    </motion.div>
  );
}
