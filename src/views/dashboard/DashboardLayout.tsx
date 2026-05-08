import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Bot, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Wallet,
  Menu,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/src/store/useStore";
import { useEffect } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, fetchUser } = useStore();

  useEffect(() => {
    if (!user) fetchUser("user_1");
  }, [user, fetchUser]);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "الرئيسية", path: "/dashboard" },
    { icon: <Bot size={20} />, label: "تصفح الوكلاء", path: "/catalog" },
    { icon: <MessageSquare size={20} />, label: "الصندوق الموحد", path: "/dashboard/inbox" },
    { icon: <BarChart3 size={20} />, label: "التقارير", path: "/dashboard" },
    { icon: <CreditCard size={20} />, label: "الفواتير", path: "/dashboard" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-xl">و</div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">وكيل</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={24} className="text-slate-500" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link 
            key={item.label}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              location.pathname === item.path 
                ? "bg-blue-50 text-blue-700 shadow-sm" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto">
        <div className="bg-slate-900 text-white rounded-xl p-4 mb-4">
          <p className="text-[10px] opacity-60 mb-1 uppercase tracking-wider font-bold">الرصيد المتاح</p>
          <p className="text-xl font-bold mb-3">${user?.balance?.toFixed(2) || "0.00"}</p>
          <button 
            onClick={async () => {
              if(!user) return;
              const res = await fetch(`/api/user/${user.id}/recharge`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 100 })
              });
              if(res.ok) fetchUser(user.id);
            }}
            className="w-full py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors"
          >
            شحن رصيد ($100)
          </button>
        </div>
        <Link 
          to="/" 
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-sans"
        >
          <LogOut size={20} />
          تسجيل الخروج
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-l border-slate-200 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-72 bg-white z-[101] flex flex-col lg:hidden border-l border-slate-200"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-sm shadow-slate-100 shrink-0">
          <div className="flex items-center gap-2 lg:gap-4 flex-1 truncate">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu size={24} className="text-slate-600" />
            </button>
            <h2 className="text-base lg:text-2xl font-bold text-slate-900 truncate">
              {menuItems.find(i => i.path === location.pathname)?.label || "لوحة التحكم"}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
            <button className="relative text-slate-400 hover:text-slate-900 transition-colors hidden sm:block">
              <Bell size={24} />
              <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="hidden sm:block h-10 w-[1px] bg-slate-100"></div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="text-left hidden lg:block">
                <p className="text-sm font-bold leading-none text-slate-900">{user?.name || "تحميل..."}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">{user?.email}</p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-100 rounded-full border border-slate-200 flex-shrink-0"></div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
