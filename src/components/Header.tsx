import { motion } from "motion/react";
import { BookOpen, Search, Plus, Feather, User } from "lucide-react";

interface HeaderProps {
  onOpenModal: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onLoginClick: () => void;
  userRole: "guest" | "user" | "admin";
  onLogout: () => void;
}

export function Header({ onOpenModal, searchTerm, setSearchTerm, onLoginClick, userRole, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#fcfaf8]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#fcfaf8]/60 border-b border-stone-100">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-white shadow-lg">
            <Feather className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-serif font-bold tracking-wide text-stone-900">
              AI 语文智教
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-sans">
              Smart Edu
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center px-8">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-stone-600 transition-colors" />
            <input
              type="search"
              placeholder="Search resources..."
              className="h-10 w-full rounded-full bg-white/60 pl-10 pr-4 text-sm text-stone-800 shadow-sm border border-transparent transition-all placeholder:text-stone-400 focus-visible:outline-none focus-visible:bg-white focus-visible:shadow-md focus-visible:ring-1 focus-visible:ring-stone-200 hover:bg-white/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userRole !== "guest" ? (
              <div className="flex items-center gap-3">
                  <div className="text-xs font-medium text-stone-500 hidden sm:block uppercase tracking-wider">
                      {userRole === "admin" ? "Admin" : "User"}
                  </div>
                  <button 
                    onClick={onLogout}
                    className="text-xs font-medium text-stone-400 hover:text-stone-900 transition-colors"
                  >
                      LOGOUT
                  </button>
                  <div className="h-8 w-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600">
                      <User className="h-4 w-4" />
                  </div>
              </div>
          ) : (
            <button 
                onClick={onLoginClick}
                className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 px-3 py-2 transition-colors"
            >
                Login
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenModal}
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-stone-800 hover:shadow-xl focus-visible:outline-none"
          >
            <Plus className="mr-2 h-3 w-3" />
            <span>Submit</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
