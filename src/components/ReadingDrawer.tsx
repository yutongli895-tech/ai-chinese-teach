import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, ChevronLeft, Share2, Heart, Printer, Type, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Resource } from "./ResourceCard";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

interface ReadingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  isDarkMode: boolean;
}

export function ReadingDrawer({ isOpen, onClose, resource, isDarkMode }: ReadingDrawerProps) {
  const [fontSize, setFontSize] = useState(18);

  if (!resource) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed right-0 top-0 z-50 h-full w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col border-l transition-colors duration-500",
              isDarkMode ? "bg-stone-950 border-stone-800" : "bg-[#fcfaf8] border-stone-200/50"
            )}
          >
            {/* Header */}
            <div className={cn(
              "flex h-16 items-center justify-between border-b px-6 backdrop-blur-md sticky top-0 z-10 transition-colors duration-500",
              isDarkMode ? "bg-stone-900/80 border-stone-800" : "bg-white/80 border-stone-200/60"
            )}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-1 text-sm font-medium transition-colors",
                    isDarkMode ? "text-stone-400 hover:text-stone-100" : "text-stone-500 hover:text-stone-900"
                  )}
                >
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  返回
                </button>
                <div className="h-4 w-[1px] bg-stone-300 dark:bg-stone-700"></div>
                <div className="flex items-center gap-2 text-stone-400">
                    <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="hover:text-stone-900 dark:hover:text-stone-100 p-1"><Minus className="h-3 w-3" /></button>
                    <Type className="h-4 w-4" />
                    <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="hover:text-stone-900 dark:hover:text-stone-100 p-1"><Plus className="h-3 w-3" /></button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="rounded-full p-2 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="rounded-full p-2 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="rounded-full p-2 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                  <Printer className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className={cn(
              "flex-1 overflow-y-auto transition-colors duration-500",
              isDarkMode 
                ? "bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-stone-950" 
                : "bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-[#fcfaf8]"
            )}>
              <div className="mx-auto max-w-xl px-8 py-12">
                <div className="mb-12 space-y-6 text-center">
                  <span className="inline-block rounded-full bg-stone-100 dark:bg-stone-800 px-4 py-1 text-[10px] font-bold text-stone-500 dark:text-stone-400 tracking-[0.2em] uppercase">
                    {resource.type === 'article' ? '深度文章' : resource.type === 'resource' ? '教学资源' : 'AI 工具'}
                  </span>
                  <h1 className="font-serif text-4xl font-bold text-stone-900 dark:text-stone-100 leading-tight tracking-tight">
                    {resource.title}
                  </h1>
                  <div className="flex items-center justify-center gap-4 text-sm text-stone-500 dark:text-stone-400 font-light italic">
                    <span>{resource.author}</span>
                    <span className="text-stone-300 dark:text-stone-700">|</span>
                    <span>{resource.date}</span>
                  </div>
                </div>

                <article 
                    className="prose prose-stone dark:prose-invert prose-lg max-w-none font-serif leading-loose text-stone-800 dark:text-stone-200"
                    style={{ fontSize: `${fontSize}px` }}
                >
                  {resource.content ? (
                    <div className="markdown-body">
                      <ReactMarkdown>{resource.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <p className="first-letter:float-left first-letter:mr-4 first-letter:text-6xl first-letter:font-bold first-letter:text-stone-900 dark:first-letter:text-stone-100 first-letter:leading-none">
                        {resource.description}
                      </p>
                      <div className="py-12 flex justify-center">
                        <div className="h-px w-32 bg-stone-200 dark:bg-stone-800"></div>
                      </div>
                      <p className="text-sm text-stone-400 dark:text-stone-500 text-center italic font-sans">
                        该内容暂无详细正文，仅提供简介。
                      </p>
                    </div>
                  )}
                </article>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
