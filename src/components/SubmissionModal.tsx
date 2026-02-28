import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { Resource } from "./ResourceCard";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resource: Omit<Resource, "id" | "date" | "likes">) => void;
}

export function SubmissionModal({ isOpen, onClose, onSubmit }: SubmissionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "article" as Resource["type"],
    author: "",
    link: "",
    tags: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    
    setIsSubmitting(false);
    setFormData({
        title: "",
        description: "",
        type: "article",
        author: "",
        link: "",
        tags: "",
    });
    onClose();
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
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-stone-200 bg-[#fcfaf8] p-6 shadow-xl duration-200 sm:rounded-xl"
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-xl font-serif font-bold leading-none tracking-tight text-stone-900">
                赐稿 / 提交新资源
              </h2>
              <p className="text-sm text-stone-500 font-light">
                分享您的文章、教案或发现的好工具，共建智慧教育社区。
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-stone-100 data-[state=open]:text-stone-500"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium leading-none text-stone-700">
                  标题
                </label>
                <input
                  id="title"
                  required
                  className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 focus-visible:border-stone-400 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="例如：使用 ChatGPT 生成古诗教案"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium leading-none text-stone-700">类型</label>
                    <select
                        id="type"
                        className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as Resource["type"]})}
                    >
                        <option value="article">深度文章</option>
                        <option value="resource">教学资源</option>
                        <option value="tool">AI 工具</option>
                    </select>
                </div>
                <div className="grid gap-2">
                    <label htmlFor="author" className="text-sm font-medium leading-none text-stone-700">作者/推荐人</label>
                    <input
                        id="author"
                        required
                        className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
                        placeholder="您的名字"
                        value={formData.author}
                        onChange={e => setFormData({...formData, author: e.target.value})}
                    />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="link" className="text-sm font-medium leading-none text-stone-700">链接地址</label>
                <input
                  id="link"
                  type="url"
                  required
                  className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium leading-none text-stone-700">简介</label>
                <textarea
                  id="description"
                  required
                  className="flex min-h-[80px] w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
                  placeholder="简要描述这个资源的内容和价值..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="tags" className="text-sm font-medium leading-none text-stone-700">标签 (用逗号分隔)</label>
                <input
                  id="tags"
                  className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
                  placeholder="教案, 写作, 阅读理解"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white border border-stone-200 bg-transparent hover:bg-stone-100 hover:text-stone-900 h-10 py-2 px-4"
                >
                    取消
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white bg-stone-800 text-stone-50 hover:bg-stone-700 h-10 py-2 px-4"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            提交中
                        </>
                    ) : (
                        "提交"
                    )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
