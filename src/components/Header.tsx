import { motion } from "motion/react";
import { BookOpen, Search, Plus, Feather, User, Moon, Sun } from "lucide-react";

interface HeaderProps {
  onOpenModal: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onLoginClick: () => void;
  userRole: "guest" | "user" | "admin";
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function Header({ 
  onOpenModal, 
  searchTerm, 
  setSearchTerm, 
  onLoginClick, 
  userRole, 
  onLogout,
  isDarkMode,
  toggleDarkMode
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#fcfaf8]/80 dark:bg-stone-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#fcfaf8]/60 dark:supports-[backdrop-filter]:bg-stone-950/60 border-b border-stone-100 dark:border-stone-800 transition-colors duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xl">
            <Feather className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-wider text-stone-900 dark:text-stone-100">
              AI 语文智教
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500 font-sans font-medium">
              Smart Literature
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center px-8">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-stone-600 dark:group-focus-within:text-stone-300 transition-colors" />
            <input
              type="search"
              placeholder="搜索资源..."
              className="h-10 w-full rounded-full bg-white/60 dark:bg-stone-900/60 pl-10 pr-4 text-sm text-stone-800 dark:text-stone-200 shadow-sm border border-transparent transition-all placeholder:text-stone-400 focus-visible:outline-none focus-visible:bg-white dark:focus-visible:bg-stone-900 focus-visible:shadow-md focus-visible:ring-1 focus-visible:ring-stone-200 dark:focus-visible:ring-stone-700 hover:bg-white/80 dark:hover:bg-stone-900/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isDarkMode ? "切换到明亮模式" : "切换到暗黑模式"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {userRole !== "guest" ? (
              <div className="flex items-center gap-3">
                  <div className="text-xs font-medium text-stone-500 dark:text-stone-400 hidden sm:block uppercase tracking-wider">
                      {userRole === "admin" ? "管理员" : "用户"}
                  </div>
                  <button 
                    onClick={onLogout}
                    className="text-xs font-medium text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                      退出
                  </button>
                  <div className="h-8 w-8 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300">
                      <User className="h-4 w-4" />
                  </div>
              </div>
          ) : (
            <button 
                onClick={onLoginClick}
                className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 px-3 py-2 transition-colors"
            >
                登录
            </button>
          )}

          {userRole !== "guest" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenModal}
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-stone-900 dark:bg-stone-100 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white dark:text-stone-900 shadow-lg transition-all hover:bg-stone-800 dark:hover:bg-white hover:shadow-xl focus-visible:outline-none"
            >
              <Plus className="mr-2 h-3 w-3" />
              <span>发布</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
