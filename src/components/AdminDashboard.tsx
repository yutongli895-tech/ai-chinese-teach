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
  XCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SubmissionModal } from "./SubmissionModal";
import { Resource } from "./ResourceCard";
import { storage } from "../lib/storage";

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
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [mockContent, setMockContent] = useState<Resource[]>([]);

  // Load resources on mount
  useEffect(() => {
    const loadResources = async () => {
      const data = await storage.getResources();
      setMockContent(data);
    };
    loadResources();
  }, []);

  const handleAddResource = async (newResource: Omit<Resource, "id" | "date" | "likes">) => {
    const resource: Resource = {
      ...newResource,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    };
    const updatedResources = await storage.saveResource(resource);
    setMockContent(updatedResources);
    setIsSubmissionModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-stone-200 bg-white hidden md:block">
        <div className="flex h-16 items-center border-b border-stone-200 px-6">
          <span className="text-lg font-serif font-bold text-stone-900">后台管理</span>
        </div>
        <nav className="p-4 space-y-1">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            概览
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "users" ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"}`}
          >
            <Users className="h-4 w-4" />
            用户管理
          </button>
          <button 
            onClick={() => setActiveTab("content")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "content" ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"}`}
          >
            <FileText className="h-4 w-4" />
            内容管理
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"}`}
          >
            <Settings className="h-4 w-4" />
            系统设置
          </button>
        </nav>
        <div className="absolute bottom-4 left-0 w-full px-4">
            <button 
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
                <LogOut className="h-4 w-4" />
                退出登录
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6 sticky top-0 z-10">
            <h1 className="text-lg font-medium text-stone-900">
                {activeTab === "overview" && "数据概览"}
                {activeTab === "users" && "用户管理"}
                {activeTab === "content" && "内容管理"}
                {activeTab === "settings" && "系统设置"}
            </h1>
            <div className="flex items-center gap-4">
                <button className="relative text-stone-400 hover:text-stone-600">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-medium">
                    A
                </div>
            </div>
        </header>

        <div className="p-6">
            {activeTab === "overview" && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-stone-500">总访客数</span>
                                <Users className="h-4 w-4 text-stone-400" />
                            </div>
                            <div className="mt-2 text-3xl font-bold text-stone-900">12,345</div>
                            <div className="mt-1 text-xs text-green-600 flex items-center">
                                <TrendingUp className="mr-1 h-3 w-3" /> +12% 较上周
                            </div>
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-stone-500">新增注册</span>
                                <User className="h-4 w-4 text-stone-400" />
                            </div>
                            <div className="mt-2 text-3xl font-bold text-stone-900">543</div>
                            <div className="mt-1 text-xs text-green-600 flex items-center">
                                <TrendingUp className="mr-1 h-3 w-3" /> +5% 较上周
                            </div>
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-stone-500">资源总数</span>
                                <FileText className="h-4 w-4 text-stone-400" />
                            </div>
                            <div className="mt-2 text-3xl font-bold text-stone-900">2,109</div>
                            <div className="mt-1 text-xs text-stone-500">
                                待审核: 12
                            </div>
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-stone-500">今日活跃</span>
                                <TrendingUp className="h-4 w-4 text-stone-400" />
                            </div>
                            <div className="mt-2 text-3xl font-bold text-stone-900">892</div>
                            <div className="mt-1 text-xs text-green-600">
                                实时在线: 45
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-base font-medium text-stone-900">访客趋势</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#57534e" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#57534e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#44403c' }}
                                    />
                                    <Area type="monotone" dataKey="uv" stroke="#44403c" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === "content" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <input 
                                type="text" 
                                placeholder="搜索文章..." 
                                className="h-10 w-full rounded-lg border border-stone-200 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                            />
                        </div>
                        <button 
                            onClick={() => setIsSubmissionModalOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            发布文章
                        </button>
                    </div>

                    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-stone-50 text-stone-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">标题</th>
                                    <th className="px-6 py-3 font-medium">类型</th>
                                    <th className="px-6 py-3 font-medium">作者</th>
                                    <th className="px-6 py-3 font-medium">日期</th>
                                    <th className="px-6 py-3 font-medium">状态</th>
                                    <th className="px-6 py-3 font-medium text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {mockContent.map((item) => (
                                    <tr key={item.id} className="hover:bg-stone-50/50">
                                        <td className="px-6 py-4 font-medium text-stone-900">{item.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                item.type === 'article' ? 'bg-stone-100 text-stone-700' :
                                                item.type === 'resource' ? 'bg-emerald-50 text-emerald-700' :
                                                'bg-indigo-50 text-indigo-700'
                                            }`}>
                                                {item.type === 'article' ? '文章' : item.type === 'resource' ? '资源' : '工具'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-stone-600">{item.author}</td>
                                        <td className="px-6 py-4 text-stone-500">{item.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                <CheckCircle className="h-3 w-3" />
                                                已发布
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-stone-400 hover:text-stone-600">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {(activeTab === "users" || activeTab === "settings") && (
                <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50">
                    <p className="text-stone-500">功能模块开发中...</p>
                </div>
            )}
        </div>
      </main>

      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSubmit={handleAddResource}
      />
    </div>
  );
}
