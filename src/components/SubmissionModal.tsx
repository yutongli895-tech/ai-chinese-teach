import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, Eye, Edit3 } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { Resource } from "./ResourceCard";
import ReactMarkdown from "react-markdown";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resource: Omit<Resource, "id" | "date" | "likes">) => void;
  initialData?: Resource | null;
}

export function SubmissionModal({ isOpen, onClose, onSubmit, initialData }: SubmissionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "article" as Resource["type"],
    author: "",
    link: "",
    tags: "",
    content: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        type: initialData.type,
        author: initialData.author,
        link: initialData.link,
        tags: initialData.tags.join(", "),
        content: initialData.content || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "article",
        author: "",
        link: "",
        tags: "",
        content: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    
    setIsSubmitting(false);
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
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-stone-200 dark:border-stone-800 bg-[#fcfaf8] dark:bg-stone-950 p-8 shadow-2xl duration-200 sm:rounded-2xl max-h-[90vh] overflow-y-auto transition-colors duration-500"
          >
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-2xl font-serif font-bold leading-none tracking-tight text-stone-900 dark:text-stone-100">
                {initialData ? "编辑文章/资源" : "赐稿 / 提交新资源"}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-light">
                {initialData ? "修改已发布的内容信息。" : "分享您的文章、教案或发现的好工具，共建智慧教育社区。"}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-2 opacity-70 transition-all hover:opacity-100 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none disabled:pointer-events-none"
            >
              <X className="h-5 w-5 text-stone-500 dark:text-stone-400" />
              <span className="sr-only">Close</span>
            </button>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium leading-none text-stone-700 dark:text-stone-300">标题</label>
                  <input
                    id="title"
                    required
                    className="flex h-11 w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2 text-sm text-stone-900 dark:text-stone-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-700 transition-all"
                    placeholder="例如：使用 ChatGPT 生成古诗教案"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="author" className="text-sm font-medium leading-none text-stone-700 dark:text-stone-300">作者/推荐人</label>
                    <input
                        id="author"
                        required
                        className="flex h-11 w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2 text-sm text-stone-900 dark:text-stone-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-700 transition-all"
                        placeholder="您的名字"
                        value={formData.author}
                        onChange={e => setFormData({...formData, author: e.target.value})}
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium leading-none text-stone-700 dark:text-stone-300">类型</label>
                    <select
                        id="type"
                        className="flex h-11 w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2 text-sm text-stone-900 dark:text-stone-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-700 transition-all"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as Resource["type"]})}
                    >
                        <option value="article">深度文章</option>
                        <option value="resource">教学资源</option>
                        <option value="tool">AI 工具</option>
                    </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="tags" className="text-sm font-medium leading-none text-stone-700 dark:text-stone-300">标签 (逗号分隔)</label>
                  <input
                    id="tags"
                    className="flex h-11 w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2 text-sm text-stone-900 dark:text-stone-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-700 transition-all"
                    placeholder="教案, 写作, 阅读理解"
                    value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="link" className="text-sm font-medium leading-none text-stone-700 dark:text-stone-300">
                  链接地址 (可选，若填写则点击卡片直接跳转)
                </label>
                <input
                  id="link"
                  type="url"
                  className="flex h-11 w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2 text-sm text-stone-900 dark:text-stone-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-700 transition-all"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium leading-none text-stone-700 dark:text-stone-300">简介</label>
                <textarea
                  id="description"
                  required
                  className="flex min-h-[80px] w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-700 transition-all"
                  placeholder="简要描述内容价值..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="content" className="text-sm font-medium leading-none text-stone-700 dark:text-stone-300">正文内容 (Markdown)</label>
                  <div className="flex items-center gap-1 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className={`flex items-center gap-1 rounded px-3 py-1 text-xs font-medium transition-all ${activeTab === "edit" ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm" : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"}`}
                    >
                      <Edit3 className="h-3 w-3" />
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`flex items-center gap-1 rounded px-3 py-1 text-xs font-medium transition-all ${activeTab === "preview" ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm" : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"}`}
                    >
                      <Eye className="h-3 w-3" />
                      预览
                    </button>
                  </div>
                </div>
                
                <div className="relative min-h-[250px] w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden">
                  {activeTab === "edit" ? (
                    <textarea
                      id="content"
                      className="h-full min-h-[250px] w-full bg-transparent px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none"
                      placeholder="在此输入 Markdown 格式的正文内容..."
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                    />
                  ) : (
                    <div className="prose prose-stone dark:prose-invert prose-sm max-w-none h-full min-h-[250px] p-4 overflow-y-auto font-serif">
                      <ReactMarkdown>{formData.content || "*暂无内容预览*"}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all border border-stone-200 dark:border-stone-800 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 h-12 px-8"
                >
                    取消
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white h-12 px-8 shadow-lg"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            提交中
                        </>
                    ) : (
                        initialData ? "保存修改" : "提交发布"
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
