import { motion } from "motion/react";
import { BookOpen, Search, Plus, Feather, User, Moon, Sun } from "lucide-react";
import { cn } from "../lib/utils";

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
    <header className={cn(
      "sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-500 border-b",
      isDarkMode 
        ? "bg-stone-950/90 border-stone-800 text-stone-100" 
        : "bg-[#fcfaf8]/80 border-stone-100 text-stone-900"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl shadow-xl transition-colors duration-500",
            isDarkMode ? "bg-stone-100 text-stone-900" : "bg-stone-900 text-white"
          )}>
            <Feather className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "text-xl font-serif font-bold tracking-wider transition-colors duration-500",
              isDarkMode ? "text-stone-100" : "text-stone-900"
            )}>
              AI 语文智教
            </span>
            <span className={cn(
              "text-[10px] uppercase tracking-[0.3em] font-sans font-medium transition-colors duration-500",
              isDarkMode ? "text-stone-500" : "text-stone-400"
            )}>
              Smart Literature
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center px-8">
          <div className="relative w-full max-w-sm group">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
              isDarkMode ? "text-stone-500 group-focus-within:text-stone-300" : "text-stone-400 group-focus-within:text-stone-600"
            )} />
            <input
              type="search"
              placeholder="搜索资源..."
              className={cn(
                "h-10 w-full rounded-full pl-10 pr-4 text-sm shadow-sm border border-transparent transition-all placeholder:text-stone-400 focus-visible:outline-none focus-visible:shadow-md focus-visible:ring-1",
                isDarkMode 
                  ? "bg-stone-900/60 text-stone-200 focus-visible:bg-stone-900 focus-visible:ring-stone-700 hover:bg-stone-900/80" 
                  : "bg-white/60 text-stone-800 focus-visible:bg-white focus-visible:ring-stone-200 hover:bg-white/80"
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleDarkMode}
            className={cn(
              "p-2 rounded-full transition-colors",
              isDarkMode ? "text-stone-400 hover:bg-stone-800" : "text-stone-500 hover:bg-stone-100"
            )}
            title={isDarkMode ? "切换到明亮模式" : "切换到暗黑模式"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {userRole !== "guest" ? (
              <div className="flex items-center gap-3">
                  <div className={cn(
                    "text-xs font-medium hidden sm:block uppercase tracking-wider transition-colors",
                    isDarkMode ? "text-stone-400" : "text-stone-500"
                  )}>
                      {userRole === "admin" ? "管理员" : "用户"}
                  </div>
                  <button 
                    onClick={onLogout}
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isDarkMode ? "text-stone-500 hover:text-stone-100" : "text-stone-400 hover:text-stone-900"
                    )}
                  >
                      退出
                  </button>
                  <div className={cn(
                    "h-8 w-8 rounded-full border flex items-center justify-center transition-colors",
                    isDarkMode ? "bg-stone-800 border-stone-700 text-stone-300" : "bg-stone-100 border-stone-200 text-stone-600"
                  )}>
                      <User className="h-4 w-4" />
                  </div>
              </div>
          ) : (
            <button 
                onClick={onLoginClick}
                className={cn(
                  "text-xs font-bold uppercase tracking-wider px-3 py-2 transition-colors",
                  isDarkMode ? "text-stone-400 hover:text-stone-100" : "text-stone-500 hover:text-stone-900"
                )}
            >
                登录
            </button>
          )}

          {userRole !== "guest" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenModal}
              className={cn(
                "hidden sm:inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-lg transition-all hover:shadow-xl focus-visible:outline-none",
                isDarkMode ? "bg-stone-100 text-stone-900 hover:bg-white" : "bg-stone-900 text-white hover:bg-stone-800"
              )}
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
