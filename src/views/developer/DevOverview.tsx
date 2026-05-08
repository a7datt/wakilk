import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Users, Star, Zap } from "lucide-react";

const EARNINGS_DATA = [
  { month: "يناير", amount: 1200 },
  { month: "فبراير", amount: 1800 },
  { month: "مارس", amount: 1500 },
  { month: "أبريل", amount: 2400 },
  { month: "مايو", amount: 3200 },
];

export function DevOverview() {
  return (
    <div className="space-y-8">
      {/* Earnings Summary Card */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        <div className="md:col-span-2 bg-slate-900 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 text-white flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h1 className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">أرباح هذا الشهر</h1>
            <p className="text-4xl lg:text-6xl font-black text-brand mb-4">$3,200.00</p>
            <div className="flex items-center gap-2 text-green-400 text-xs lg:text-sm font-bold">
              <span>+15% زيادة عن الشهر الماضي</span>
            </div>
          </div>
          <div className="hidden lg:block h-32 w-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EARNINGS_DATA}>
                <Area type="monotone" dataKey="amount" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">نظام تقاسم الأرباح</p>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">حصة المطور</span>
              <span className="text-xl font-black text-slate-900">75%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-brand h-full w-3/4 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">عمولة المنصة</span>
              <span className="text-xl font-black text-slate-400">25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: "إجمالي المشتركين", value: "850", icon: <Users />, color: "text-blue-500" },
          { label: "متوسط التقييم", value: "4.9", icon: <Star />, color: "text-amber-500" },
          { label: "الوكلاء النشطين", value: "5", icon: <Zap />, color: "text-brand" },
          { label: "المعلّق للدفع", value: "$450", icon: <DollarSign />, color: "text-green-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 lg:p-8 rounded-2xl lg:rounded-3xl border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 ${stat.color} rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 lg:mb-6`}>
              {stat.icon}
            </div>
            <p className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">{stat.label}</p>
            <p className="text-lg lg:text-3xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Agent Performance List */}
      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base lg:text-lg font-black text-slate-900">أداء الوكلاء</h3>
          <button className="text-sm font-bold text-brand hover:underline">عرض الكل</button>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { name: "ناطق", subs: 450, rating: 4.9, earnings: 1200 },
            { name: "بياع", subs: 320, rating: 4.8, earnings: 950 },
            { name: "منسق", subs: 80, rating: 5.0, earnings: 450 },
          ].map((agent, i) => (
            <div key={i} className="p-4 lg:p-6 flex items-center justify-between hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3 lg:gap-4 truncate">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-100 rounded-xl lg:rounded-2xl flex items-center justify-center text-brand font-black text-lg lg:text-xl shrink-0">
                  {agent.name[0]}
                </div>
                <div className="truncate">
                  <h4 className="text-sm lg:text-base font-black text-slate-900 truncate">{agent.name}</h4>
                  <p className="text-[10px] lg:text-xs text-slate-400 font-medium">{agent.subs} مشترك</p>
                </div>
              </div>
              <div className="flex items-center gap-4 lg:gap-12 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">التقييم</p>
                  <p className="text-sm font-black text-amber-500 flex items-center gap-1">
                    <Star size={12} fill="currentColor" /> {agent.rating}
                  </p>
                </div>
                <div className="text-right min-w-[60px] lg:min-w-[80px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">أرباح</p>
                  <p className="text-sm font-black text-slate-900">${agent.earnings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
