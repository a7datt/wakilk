import React, { useEffect, useState } from "react";
import { MessageCircle, Zap, Bot, Users, Settings as SettingsIcon, ChevronLeft } from "lucide-react";
import { useStore } from "../../store/useStore";
import { Link } from "react-router-dom";

export function Overview() {
  const { user } = useStore();
  const [instances, setInstances] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/customer/instances/${user.id}`)
        .then(res => res.json())
        .then(data => setInstances(data || []));
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-slate-900 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-4xl font-black mb-3">أهلاً بك، {user?.name || "تحميل..."} ✨</h1>
          <p className="text-slate-400 font-medium max-w-md text-sm lg:text-base">إليك ملخص أداء وكلاءك الأذكياء لهذا الأسبوع.</p>
        </div>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: "إجمالي المحادثات", value: "3,250", icon: <MessageCircle />, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "نسبة الرضا", value: "98.2%", icon: <Zap />, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "الوكلاء المشترون", value: instances.length.toString(), icon: <Bot />, color: "text-brand", bg: "bg-blue-50" },
          { label: "عملاء جدد", value: "+45", icon: <Users />, color: "text-green-500", bg: "bg-green-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.bg} ${stat.color} rounded-xl lg:rounded-2xl flex items-center justify-center mb-4`}>
              {React.cloneElement(stat.icon as any, { size: 18 })}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">{stat.label}</p>
            <p className="text-lg lg:text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* My Agents Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">وكلاء فريقي</h2>
          <Link to="/catalog" className="text-sm font-bold text-brand hover:underline">إضافة وكيل جديد</Link>
        </div>
        
        {instances.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
            <Bot size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-bold mb-4">ليس لديك أي وكلاء نشطين حالياً</p>
            <Link to="/catalog" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm">تصفح الكتالوج</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {instances.map((inst) => (
              <div key={inst.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col items-start gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-brand font-black text-2xl group-hover:bg-brand group-hover:text-white transition-all">
                    {inst.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-black text-slate-900">{inst.name}</h3>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${inst.status === 'configured' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {inst.status === 'configured' ? 'نشط' : 'بانتظار الإعداد'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">النموذج: <span className="font-bold text-slate-600 uppercase">{inst.model}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full mt-auto pt-4 border-t border-slate-50">
                   <Link 
                     to={`/dashboard/agents/${inst.id}/customize`}
                     className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-200 transition-colors"
                   >
                     <SettingsIcon size={14} /> إعدادات الوكيل
                   </Link>
                   <Link 
                     to="/dashboard/inbox"
                     className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all"
                   >
                     مراقبة <ChevronLeft size={14} />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
