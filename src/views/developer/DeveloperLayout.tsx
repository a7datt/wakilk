import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, 
  Code2, 
  PlusCircle, 
  DollarSign, 
  Settings, 
  LogOut,
  Bell,
  Cpu,
  Menu,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { icon: <BarChart3 size={20} />, label: "الرئيسية", path: "/developer" },
    { icon: <Cpu size={20} />, label: "وكلاءك المنشورين", path: "/developer/agents" },
    { icon: <DollarSign size={20} />, label: "الأرباح", path: "/developer/earnings" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-xl">و</div>
          <span className="text-2xl font-black tracking-tighter text-white">وكيل <span className="text-[10px] bg-brand text-white px-2 py-0.5 rounded-full ml-1 font-bold">مطور</span></span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={24} className="text-slate-400" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              location.pathname === item.path 
                ? "bg-white/10 text-brand" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        
        <div className="mt-8 px-4">
          <Link 
            to="/developer/create" 
            onClick={() => setIsSidebarOpen(false)}
            className="w-full bg-brand text-white flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm shadow-xl shadow-brand/20 hover:scale-[1.02] transition-transform"
          >
            <PlusCircle size={18} />
            أنشئ وكيلاً جديداً
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link to="/" className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-red-400 transition-all font-sans">
          <LogOut size={20} />
          خروج من وضع المطور
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-slate-900 flex-col shrink-0">
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-72 bg-slate-900 z-[101] flex flex-col lg:hidden border-l border-white/5 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-2 lg:gap-4 flex-1 truncate">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu size={24} className="text-slate-600" />
            </button>
            <h2 className="text-base lg:text-xl font-black text-slate-900 truncate">لوحة تحكم المطور</h2>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">إجمالي الأرباح</p>
                <p className="text-lg font-black text-green-600">$12,450.00</p>
              </div>
            </div>
            <div className="hidden sm:block h-10 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0"></div>
              <p className="text-sm font-black text-slate-900 truncate max-w-[60px] lg:max-w-none">أحمد الراجحي</p>
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
