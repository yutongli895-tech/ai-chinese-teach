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
  const [userRole, setUserRole] = useState<"guest" | "user" | "admin">("guest");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "article" | "resource" | "tool">("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Load resources on mount and when role changes (e.g. returning from admin)
  useEffect(() => {
    const loadResources = async () => {
      const data = await storage.getResources();
      setResources(data);
    };
    loadResources();
  }, [userRole]);

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
    const resource: Resource = {
      ...newResource,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    };
    const updatedResources = await storage.saveResource(resource);
    setResources(updatedResources);
  };

  const handleLoginSuccess = (role: "admin" | "user") => {
      setUserRole(role);
      setIsAuthOpen(false);
  };

  const handleLogout = () => {
      setUserRole("guest");
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.type === 'article') {
      setSelectedResource(resource);
    } else {
      window.open(resource.link, '_blank');
    }
  };

  // If admin is logged in, show dashboard
  if (userRole === "admin") {
      return <AdminDashboard onLogout={handleLogout} />;
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

  return (
    <div className="min-h-screen font-sans text-stone-900 selection:bg-stone-200 selection:text-stone-900 relative">
      {/* Global Background Layer */}
      <div className="fixed inset-0 z-[-1]">
        {/* Ink Wash Landscape Image */}
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
          alt="Chinese Landscape Background" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Strong Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-[#fcfaf8]" />
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
      </div>

      <Header 
        onOpenModal={() => setIsModalOpen(true)} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onLoginClick={() => {
            setAuthType("login");
            setIsAuthOpen(true);
        }}
        userRole={userRole}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 relative">
        <Hero />
        
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
                <span>访客统计: 12,345</span>
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
