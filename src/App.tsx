import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ResourceCard, Resource } from "./components/ResourceCard";
import { AdPlaceholder } from "./components/AdPlaceholder";
import { SubmissionModal } from "./components/SubmissionModal";
import { AuthModal } from "./components/AuthModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { Footer } from "./components/Footer";
import { DailyWisdom } from "./components/DailyWisdom";
import { AIAssistant } from "./components/AIAssistant";
import { ReadingDrawer } from "./components/ReadingDrawer";
import { initialResources } from "./data/mockData";
import { motion, AnimatePresence } from "motion/react";
import { storage } from "./lib/storage";
import { cn } from "./lib/utils";
import { ArrowUp, X } from "lucide-react";

function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [userRole, setUserRole] = useState<"guest" | "user" | "admin">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("userRole") as any) || "guest";
    }
    return "guest";
  });

  useEffect(() => {
    localStorage.setItem("userRole", userRole);
  }, [userRole]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "article" | "resource" | "tool">("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || 
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  const [currentSeason, setCurrentSeason] = useState<"spring" | "summer" | "autumn" | "winter">("spring");

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setCurrentSeason("spring");
    else if (month >= 6 && month <= 8) setCurrentSeason("summer");
    else if (month >= 9 && month <= 11) setCurrentSeason("autumn");
    else setCurrentSeason("winter");
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Load resources on mount and when role changes
  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await storage.getResources();
        setResources(data);
      } catch (err) {
        console.error("Failed to load resources:", err);
      }
    };
    loadResources();
  }, [userRole]);

  // Visitor Tracking
  useEffect(() => {
    const initStats = async () => {
      // Track visit once per session
      const hasTracked = sessionStorage.getItem("tracked_visit");
      if (!hasTracked) {
        await storage.trackVisit();
        sessionStorage.setItem("tracked_visit", "true");
      }
      
      // Fetch current stats
      const stats = await storage.getStats();
      setVisitorCount(stats.visitor_count);
    };
    initStats();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddResource = async (newResource: Omit<Resource, "id" | "date" | "likes">) => {
    try {
      const resource: Resource = {
        ...newResource,
        id: crypto.randomUUID(),
        date: new Date().toISOString().split("T")[0],
        likes: 0,
      };
      const updatedResources = await storage.saveResource(resource);
      setResources(updatedResources);
      setIsModalOpen(false);
    } catch (error) {
      alert("提交失败: " + (error as Error).message);
    }
  };

  const handleLoginSuccess = (role: "admin" | "user") => {
      setUserRole(role);
      setIsAuthOpen(false);
  };

  const handleLogout = () => {
      setUserRole("guest");
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.link && resource.link !== "#") {
      window.open(resource.link, '_blank');
    } else {
      setSelectedResource(resource);
    }
  };

  // If admin is logged in, show dashboard
  if (userRole === "admin") {
      return (
        <AdminDashboard 
          onLogout={handleLogout} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        />
      );
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === "all" || resource.type === activeTab;
    const matchesTag = selectedTag ? resource.tags.includes(selectedTag) : true;

    return matchesSearch && matchesTab && matchesTag;
  });

  const seasonBackgrounds = {
    spring: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=2000",
    summer: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000",
    autumn: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&q=80&w=2000",
    winter: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
  };

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-stone-200 selection:text-stone-900 relative transition-colors duration-500",
      isDarkMode ? "dark" : "",
      `season-${currentSeason}`
    )}>
      {/* Global Background Layer */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        {/* Ink Wash Landscape Image */}
        <motion.img 
          key={currentSeason}
          initial={{ opacity: 0 }}
          animate={{ opacity: isDarkMode ? 0.2 : 0.6 }}
          src={seasonBackgrounds[currentSeason]} 
          alt={`${currentSeason} background`} 
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        
        {/* Dynamic Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 transition-colors duration-1000",
          isDarkMode 
            ? "bg-gradient-to-b from-stone-950/90 via-stone-900/95 to-stone-950" 
            : "bg-gradient-to-b from-white/60 via-stone-50/80 to-[#fcfaf8]"
        )} />
        
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 paper-texture opacity-40 dark:opacity-20" />
        
        {/* Decorative Vertical Text (Watermark style) */}
        <div className="absolute right-12 top-32 hidden lg:block select-none pointer-events-none">
          <span className="vertical-text font-cursive text-8xl text-stone-900/5 dark:text-stone-100/5 tracking-[0.5em]">
            博学而笃志
          </span>
        </div>
        <div className="absolute left-12 bottom-32 hidden lg:block select-none pointer-events-none">
          <span className="vertical-text font-cursive text-8xl text-stone-900/5 dark:text-stone-100/5 tracking-[0.5em]">
            切问而近思
          </span>
        </div>
      </div>

      <Header 
        onOpenModal={() => {
          if (userRole !== "guest") {
            setIsModalOpen(true);
          } else {
            setAuthType("login");
            setIsAuthOpen(true);
          }
        }} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onLoginClick={() => {
            setAuthType("login");
            setIsAuthOpen(true);
        }}
        userRole={userRole}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <main className="flex-1 relative">
        <Hero visitorCount={visitorCount} isDarkMode={isDarkMode} />
        
        <DailyWisdom />

        <section className="container mx-auto px-4 py-16 md:px-6">
          <div className="mb-10 flex flex-col items-center justify-between gap-6 sm:flex-row border-b border-stone-200/60 pb-4">
            <div className="flex space-x-6 overflow-x-auto pb-2 sm:pb-0">
              {(["all", "article", "resource", "tool"] as const).map((tab) => {
                const labels = { all: "全部", article: "深度文章", resource: "教学资源", tool: "AI 工具" };
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative text-sm font-serif font-medium tracking-wide transition-colors hover:text-stone-900 pb-2",
                      isActive ? "text-stone-900" : "text-stone-500/70"
                    )}
                  >
                    {labels[tab]}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-stone-800"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center gap-4 text-xs font-serif text-stone-500 tracking-wider">
                <span>访客统计: {visitorCount.toLocaleString()}</span>
                <span>收录 {filteredResources.length} 篇</span>
            </div>
          </div>

          {/* Active Tag Filter Display */}
          <AnimatePresence>
            {selectedTag && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-center"
              >
                <span className="text-sm text-stone-500 mr-2">正在筛选标签:</span>
                <button 
                  onClick={() => setSelectedTag(null)}
                  className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  #{selectedTag}
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource, index) => (
              <React.Fragment key={resource.id}>
                <ResourceCard 
                  resource={resource} 
                  index={index} 
                  isDarkMode={isDarkMode}
                  onTagClick={(tag) => setSelectedTag(tag)}
                  onClick={() => handleResourceClick(resource)}
                />
                {/* Insert Ad Placeholder after the 3rd item (index 2) */}
                {index === 2 && <AdPlaceholder />}
              </React.Fragment>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="rounded-full bg-white/50 p-6 mb-4 backdrop-blur-sm border border-stone-100">
                <span className="text-4xl opacity-50 grayscale">🍵</span>
              </div>
              <h3 className="text-lg font-serif font-medium text-stone-900">暂无相关内容</h3>
              <p className="text-stone-500 mt-2 font-light">
                未寻得相关篇章，不妨换个词试试？
              </p>
              {selectedTag && (
                <button 
                  onClick={() => setSelectedTag(null)}
                  className="mt-4 text-sm text-stone-600 underline hover:text-stone-900"
                >
                  清除标签筛选
                </button>
              )}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
      
      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddResource}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        type={authType}
        onSwitchType={() => setAuthType(authType === "login" ? "register" : "login")}
        onLoginSuccess={handleLoginSuccess}
      />

      <ReadingDrawer 
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        resource={selectedResource}
        isDarkMode={isDarkMode}
      />

      <AIAssistant />

      {/* Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
