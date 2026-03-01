export function Footer() {
    return (
      <footer className="border-t border-stone-200/50 dark:border-stone-800/50 bg-white/40 dark:bg-stone-950/40 backdrop-blur-md py-12 md:py-16 mt-auto transition-colors duration-500">
        <div className="container flex flex-col items-center justify-between gap-8 md:flex-row px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-8 md:px-0">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-wider">AI 语文智教</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500 mt-1">Smart Literature</span>
            </div>
            <div className="hidden md:block h-8 w-px bg-stone-200 dark:bg-stone-800"></div>
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-sm text-stone-600 dark:text-stone-400 font-light">
                设计作者：<span className="font-medium text-stone-800 dark:text-stone-200">AI赋能语文教学资源建设课题组</span>
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-600 font-light">
                Project Team for AI-Empowered Chinese Teaching Resources
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3 md:items-end">
            <a 
              href="mailto:soralabe@foxmail.com" 
              className="group flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <span className="font-mono text-[10px] text-stone-400 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors tracking-widest">CONTACT:</span>
              soralabe@foxmail.com
            </a>
            <p className="text-center text-[10px] text-stone-300 dark:text-stone-700 md:text-left font-mono uppercase tracking-[0.2em]">
               © 2026 AI Chinese Teach. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
  }
