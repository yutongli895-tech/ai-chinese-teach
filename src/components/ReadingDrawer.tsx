import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, ChevronLeft, Share2, Heart, Printer, Type, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Resource } from "./ResourceCard";

interface ReadingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
}

export function ReadingDrawer({ isOpen, onClose, resource }: ReadingDrawerProps) {
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
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-[#fcfaf8] shadow-2xl overflow-hidden flex flex-col border-l border-stone-200/50"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-stone-200/60 bg-white/80 px-6 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={onClose}
                  className="group flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  返回
                </button>
                <div className="h-4 w-[1px] bg-stone-300"></div>
                <div className="flex items-center gap-2 text-stone-400">
                    <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="hover:text-stone-900 p-1"><Minus className="h-3 w-3" /></button>
                    <Type className="h-4 w-4" />
                    <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="hover:text-stone-900 p-1"><Plus className="h-3 w-3" /></button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors">
                  <Printer className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
              <div className="mx-auto max-w-xl px-8 py-12">
                <div className="mb-8 space-y-4 text-center">
                  <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500 tracking-wider">
                    {resource.type === 'article' ? '深度文章' : '教学资源'}
                  </span>
                  <h1 className="font-serif text-3xl font-bold text-stone-900 leading-tight">
                    {resource.title}
                  </h1>
                  <div className="flex items-center justify-center gap-4 text-sm text-stone-500 font-light">
                    <span>{resource.author}</span>
                    <span>•</span>
                    <span>{resource.date}</span>
                    <span>•</span>
                    <span>约 5 分钟阅读</span>
                  </div>
                </div>

                {/* Simulated Article Content */}
                <article 
                    className="prose prose-stone prose-lg max-w-none font-serif leading-loose text-stone-800"
                    style={{ fontSize: `${fontSize}px` }}
                >
                  <p className="first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:text-stone-900">
                    {resource.description}
                  </p>
                  <p>
                    （以下为模拟内容）
                  </p>
                  <p>
                    在当今数字化时代，人工智能（AI）正以前所未有的速度渗透进教育领域的各个角落。对于语文教学而言，这既是挑战，更是机遇。传统的语文课堂往往侧重于文本的解读与背诵，而忽视了学生个性化审美体验的构建。
                  </p>
                  <h3>一、AI 如何重塑古诗文教学？</h3>
                  <p>
                    古诗文教学的难点在于“意境”的传达。“大漠孤烟直，长河落日圆”，仅凭语言描述，学生很难在脑海中构建出那种苍凉壮阔的画面。而生成式 AI 工具（如 Midjourney, Stable Diffusion）可以根据诗句生成高质量的图像，甚至动态视频，让学生直观地感受到诗歌的视觉冲击力。
                  </p>
                  <blockquote>
                    “技术不是为了替代教师，而是为了让教师从繁琐的重复劳动中解放出来，去从事更有创造性的育人工作。”
                  </blockquote>
                  <p>
                    此外，AI 还可以扮演“苏格拉底”的角色。通过精心设计的提示词（Prompt），我们可以让 AI 模拟李白、杜甫的语气与学生对话。试想一下，当学生可以直接向“李白”询问《将进酒》的创作背景时，这种跨越时空的对话将带来多么强烈的沉浸感。
                  </p>
                  <h3>二、写作教学的新范式</h3>
                  <p>
                    在写作教学中，AI 不仅仅是一个“纠错工具”，更是一个“灵感伙伴”。学生可以利用 AI 进行头脑风暴，生成大纲，甚至续写故事。教师的重点将从“批改错别字”转移到“指导逻辑思维”和“提升语言审美”上来。
                  </p>
                  <div className="my-8 flex justify-center">
                    <div className="h-1 w-24 rounded-full bg-stone-200"></div>
                  </div>
                  <p className="text-sm text-stone-500 text-center italic">
                    本文由 AI 辅助生成，旨在展示阅读模式效果。
                  </p>
                </article>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
