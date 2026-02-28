import React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export const AdPlaceholder: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-stone-200/50 p-6 shadow-sm transition-all hover:bg-white/60"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Ad / 推广
          </span>
        </div>
        
        {/* Mock Ad Content Area */}
        <div className="flex flex-col gap-3 items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-stone-200/50 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl opacity-20">G</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-800">
                Google Ads Space
            </h3>
            <p className="text-xs text-stone-500 max-w-[200px] leading-relaxed">
                此处预留广告位。采用原生卡片样式封装，确保视觉风格与网站整体保持一致，不破坏阅读体验。
            </p>
            <button className="mt-4 text-xs bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-800 transition-colors">
                Learn More
            </button>
        </div>
      </div>
      
      {/* Decorative background pattern to make it look less empty */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
    </motion.div>
  );
};
