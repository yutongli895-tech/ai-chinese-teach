import { motion } from "motion/react";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Bell,
  User,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Sun,
  Moon,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SubmissionModal } from "./SubmissionModal";
import { Resource } from "./ResourceCard";
import { storage } from "../lib/storage";
import { cn } from "../lib/utils";

const data = [
  { name: '周一', uv: 4000, pv: 2400, amt: 2400 },
  { name: '周二', uv: 3000, pv: 1398, amt: 2210 },
  { name: '周三', uv: 2000, pv: 9800, amt: 2290 },
  { name: '周四', uv: 2780, pv: 3908, amt: 2000 },
  { name: '周五', uv: 1890, pv: 4800, amt: 2181 },
  { name: '周六', uv: 2390, pv: 3800, amt: 2500 },
  { name: '周日', uv: 3490, pv: 4300, amt: 2100 },
];

interface AdminDashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function AdminDashboard({ onLogout, isDarkMode, toggleDarkMode }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [mockContent, setMockContent] = useState<Resource[]>([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingMock, setIsUsingMock] = useState(false);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const data = await storage.getResources();
      setMockContent(data);
      setIsUsingMock(storage.isMock);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load resources on mount
  useEffect(() => {
    loadResources();
  }, []);

  const handleAddResource = async (newResource: Omit<Resource, "id" | "date" | "likes">) => {
    setIsLoading(true);
    try {
      if (editingResource) {
        const updatedResource: Resource = {
          ...editingResource,
          ...newResource,
        };
        const updatedResources = await storage.updateResource(updatedResource);
        if (updatedResources && updatedResources.length > 0) {
          setMockContent(updatedResources);
        } else {
          // If update returns empty but we know we had data, reload
          await loadResources();
        }
      } else {
        const resource: Resource = {
          ...newResource,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split("T")[0],
          likes: 0,
        };
        const updatedResources = await storage.saveResource(resource);
        setMockContent(updatedResources);
      }
    } catch (error) {
      alert("操作失败: " + (error as Error).message);
    } finally {
      setIsLoading(false);
      setIsSubmissionModalOpen(false);
      setEditingResource(null);
    }
  };

  const filteredContent = mockContent.filter(item => 
    item.title.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("确定要删除这篇文章吗？此操作不可撤销。")) {
      const updatedResources = await storage.deleteResource(id);
      setMockContent(updatedResources);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsSubmissionModalOpen(true);
  };

  const openAddModal = () => {
    setEditingResource(null);
    setIsSubmissionModalOpen(true);
  };

  return (
    <div className={cn(
      "flex min-h-screen transition-colors duration-500", 
      isDarkMode ? "bg-stone-950 dark" : "bg-stone-50"
    )}>
      {/* Sidebar */}
      <aside className={cn("w-64 border-r hidden md:block transition-colors duration-500", isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200")}>
        <div className={cn("flex h-16 items-center border-b px-6", isDarkMode ? "border-stone-800" : "border-stone-200")}>
          <span className={cn("text-lg font-serif font-bold", isDarkMode ? "text-stone-100" : "text-stone-900")}>后台管理</span>
        </div>
        <nav className="p-4 space-y-1">
          {[
            { id: "overview", label: "概览", icon: LayoutDashboard },
            { id: "users", label: "用户管理", icon: Users },
            { id: "content", label: "内容管理", icon: FileText },
            { id: "settings", label: "系统设置", icon: Settings },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                activeTab === item.id 
                  ? (isDarkMode ? "bg-stone-800 text-stone-100" : "bg-stone-100 text-stone-900") 
                  : (isDarkMode ? "text-stone-500 hover:bg-stone-800 hover:text-stone-300" : "text-stone-500 hover:bg-stone-50 hover:text-stone-900")
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-6 left-0 w-full px-4">
            <button 
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
                <LogOut className="h-4 w-4" />
                退出登录
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className={cn("flex h-16 items-center justify-between border-b px-6 sticky top-0 z-10 transition-colors duration-500", isDarkMode ? "bg-stone-900/80 border-stone-800 backdrop-blur-md" : "bg-white/80 border-stone-200 backdrop-blur-md")}>
            <h1 className={cn("text-lg font-medium", isDarkMode ? "text-stone-100" : "text-stone-900")}>
                {activeTab === "overview" && "数据概览"}
                {activeTab === "users" && "用户管理"}
                {activeTab === "content" && "内容管理"}
                {activeTab === "settings" && "系统设置"}
            </h1>
            <div className="flex items-center gap-4">
                <button 
                  onClick={toggleDarkMode}
                  className={cn("p-2 rounded-full transition-colors", isDarkMode ? "text-amber-400 hover:bg-stone-800" : "text-stone-500 hover:bg-stone-100")}
                  title={isDarkMode ? "切换到明亮模式" : "切换到暗黑模式"}
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button className="relative text-stone-400 hover:text-stone-600">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-stone-900" />
                </button>
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-medium", isDarkMode ? "bg-stone-800 text-stone-300" : "bg-stone-200 text-stone-600")}>
                    A
                </div>
            </div>
        </header>

        <div className="p-8">
            {isUsingMock && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-3">
                    <XCircle className="h-5 w-5" />
                    <p>
                        <strong>警告：</strong> 无法连接到数据库 API。当前显示的是本地演示数据，您的修改将不会被保存。
                        请检查 Cloudflare D1 绑定是否正确设置为 <code>DB</code>。
                    </p>
                </div>
            )}
            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                          { label: "总访客数", val: "12,345", icon: Users, trend: "+12%", color: "text-stone-400" },
                          { label: "新增注册", val: "543", icon: User, trend: "+5%", color: "text-stone-400" },
                          { label: "资源总数", val: mockContent.length, icon: FileText, trend: "待审核: 0", color: "text-stone-400" },
                          { label: "今日活跃", val: "892", icon: TrendingUp, trend: "在线: 45", color: "text-stone-400" },
                        ].map((stat, i) => (
                          <div key={i} className={cn("rounded-2xl border p-6 shadow-sm transition-colors duration-500", isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200")}>
                              <div className="flex items-center justify-between">
                                  <span className={cn("text-sm font-medium", isDarkMode ? "text-stone-500" : "text-stone-500")}>{stat.label}</span>
                                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                              </div>
                              <div className={cn("mt-2 text-3xl font-bold", isDarkMode ? "text-stone-100" : "text-stone-900")}>{stat.val}</div>
                              <div className={cn("mt-1 text-xs flex items-center", stat.trend.includes("+") ? "text-green-600" : "text-stone-500")}>
                                  {stat.trend.includes("+") && <TrendingUp className="mr-1 h-3 w-3" />} {stat.trend}
                              </div>
                          </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className={cn("rounded-2xl border p-8 shadow-sm transition-colors duration-500", isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200")}>
                        <h3 className={cn("mb-6 text-base font-medium", isDarkMode ? "text-stone-100" : "text-stone-900")}>访客趋势</h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isDarkMode ? "#a8a29e" : "#57534e"} stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor={isDarkMode ? "#a8a29e" : "#57534e"} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke={isDarkMode ? "#57534e" : "#a8a29e"} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke={isDarkMode ? "#57534e" : "#a8a29e"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#292524" : "#e7e5e4"} />
                                    <Tooltip 
                                        contentStyle={{ 
                                          backgroundColor: isDarkMode ? '#1c1917' : '#fff', 
                                          borderRadius: '12px', 
                                          border: isDarkMode ? '1px solid #292524' : '1px solid #e7e5e4', 
                                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                                        }}
                                        itemStyle={{ color: isDarkMode ? '#e7e5e4' : '#44403c' }}
                                    />
                                    <Area type="monotone" dataKey="uv" stroke={isDarkMode ? "#a8a29e" : "#44403c"} strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === "content" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <input 
                                type="text" 
                                placeholder="搜索文章标题、作者..." 
                                value={adminSearchTerm}
                                onChange={(e) => setAdminSearchTerm(e.target.value)}
                                className={cn("h-11 w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 pl-10 pr-4 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-700 transition-all")}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={loadResources}
                                disabled={isLoading}
                                className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all")}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
                                刷新列表
                            </button>
                            <button 
                                onClick={openAddModal}
                                className={cn("flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all shadow-lg hover:scale-105", isDarkMode ? "bg-stone-100 text-stone-900 hover:bg-white" : "bg-stone-900 text-white hover:bg-stone-800")}
                            >
                                <Plus className="h-4 w-4" />
                                发布文章
                            </button>
                        </div>
                    </div>

                    <div className={cn("rounded-2xl border shadow-sm overflow-hidden transition-colors duration-500", isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200")}>
                        <table className="w-full text-left text-sm">
                            <thead className={cn("text-stone-500", isDarkMode ? "bg-stone-800/50" : "bg-stone-50")}>
                                <tr>
                                    <th className="px-6 py-4 font-medium">标题</th>
                                    <th className="px-6 py-4 font-medium">类型</th>
                                    <th className="px-6 py-4 font-medium">作者</th>
                                    <th className="px-6 py-4 font-medium">日期</th>
                                    <th className="px-6 py-4 font-medium">状态</th>
                                    <th className="px-6 py-4 font-medium text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className={cn("divide-y", isDarkMode ? "divide-stone-800" : "divide-stone-100")}>
                                {filteredContent.length > 0 ? filteredContent.map((item) => (
                                    <tr key={item.id} className={cn("transition-colors", isDarkMode ? "hover:bg-stone-800/30" : "hover:bg-stone-50/50")}>
                                        <td className={cn("px-6 py-4 font-medium", isDarkMode ? "text-stone-100" : "text-stone-900")}>{item.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", 
                                                item.type === 'article' ? (isDarkMode ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-700') :
                                                item.type === 'resource' ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700') :
                                                (isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-700')
                                            )}>
                                                {item.type === 'article' ? '文章' : item.type === 'resource' ? '资源' : '工具'}
                                            </span>
                                        </td>
                                        <td className={cn("px-6 py-4", isDarkMode ? "text-stone-400" : "text-stone-600")}>{item.author}</td>
                                        <td className={cn("px-6 py-4", isDarkMode ? "text-stone-500" : "text-stone-500")}>{item.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full", isDarkMode ? "text-green-400 bg-green-900/20" : "text-green-600 bg-green-50")}>
                                                <CheckCircle className="h-3 w-3" />
                                                已发布
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                  onClick={() => handleEdit(item)}
                                                  className={cn("p-1.5 rounded-full transition-colors", isDarkMode ? "text-stone-500 hover:bg-stone-800 hover:text-stone-300" : "text-stone-400 hover:bg-stone-100 hover:text-stone-600")}
                                                  title="编辑"
                                                >
                                                  <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button 
                                                  onClick={() => handleDelete(item.id)}
                                                  className={cn("p-1.5 rounded-full transition-colors", isDarkMode ? "text-stone-500 hover:bg-red-900/20 hover:text-red-400" : "text-stone-400 hover:bg-red-50 hover:text-red-600")}
                                                  title="删除"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                                            {isLoading ? "正在加载资源..." : "暂无匹配的资源"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {(activeTab === "users" || activeTab === "settings") && (
                <div className={cn("flex h-[400px] items-center justify-center rounded-2xl border border-dashed transition-colors duration-500", isDarkMode ? "bg-stone-900 border-stone-800 text-stone-500" : "bg-stone-50 border-stone-300 text-stone-500")}>
                    <p>功能模块开发中...</p>
                </div>
            )}
        </div>
      </main>

      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => {
          setIsSubmissionModalOpen(false);
          setEditingResource(null);
        }}
        onSubmit={handleAddResource}
        initialData={editingResource}
      />
    </div>
  );
}
