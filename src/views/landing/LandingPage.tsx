import { motion } from "motion/react";
import { ArrowLeft, Bot, Zap, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-lg lg:text-xl">و</div>
          <span className="text-xl lg:text-2xl font-black tracking-tighter text-slate-900">وكيل</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/catalog" className="hover:text-brand transition-colors">تصفح الوكلاء</Link>
          <a href="#how" className="hover:text-brand transition-colors">كيف نعمل</a>
          <a href="#pricing" className="hover:text-brand transition-colors">الأسعار</a>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <Link to="/dashboard" className="text-xs lg:text-sm font-bold text-slate-900 px-2 lg:px-0">دخول</Link>
          <Link to="/developer" className="bg-slate-900 text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-full text-[10px] lg:text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">وضع المطور</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 lg:px-6 py-12 lg:py-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-right"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand px-4 py-2 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-wider mb-6">
            <Zap size={14} fill="currentColor" />
            سوق الوكلاء الأذكى في العالم العربي
          </div>
          <h1 className="text-5xl lg:text-8xl font-black leading-[1] lg:leading-[0.9] tracking-tighter text-slate-900 mb-8">
            وكّل الذكاء <br className="hidden lg:block" />
            <span className="text-brand">الاصطناعي</span> <br className="hidden lg:block" />
            يشتغل عنك
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 mb-10 mx-auto lg:mx-0 max-w-md leading-relaxed">
            منصة "وكيل" تربط بين الشركات وأذكى الوكلاء الرقميين لأتمتة خدمة العملاء، المبيعات، والدعم الفني باللغة العربية.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link to="/catalog" className="bg-brand text-white px-8 lg:px-10 py-4 lg:py-5 rounded-2xl text-base lg:text-lg font-black hover:bg-brand-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 group">
              تصفح كتالوج الوكلاء
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <button className="bg-slate-50 text-slate-900 px-8 lg:px-10 py-4 lg:py-5 rounded-2xl text-base lg:text-lg font-black hover:bg-slate-100 transition-all">
              جرب مجاناً
            </button>
          </div>
          
          <div className="mt-12 flex items-center gap-8">
            <div className="flex -space-x-3 space-x-reverse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200" />
              ))}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">1200+ شركة تثق بنا</p>
              <div className="flex text-amber-400 gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map(i => <Zap key={i} size={12} fill="currentColor" />)}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden relative border border-slate-200">
            {/* Mock Chat Interface */}
            <div className="absolute inset-0 p-8 flex flex-col gap-4">
              <div className="bg-white p-4 rounded-3xl rounded-tr-none shadow-sm max-w-[80%] self-end">
                <p className="text-sm font-medium">أهلاً بك، كيف يمكنني مساعدتك اليوم؟</p>
              </div>
              <div className="bg-brand/10 p-4 rounded-3xl rounded-tl-none shadow-sm max-w-[80%] self-start">
                <p className="text-sm font-medium text-brand">أريد حجز موعد لصيانة المكيف غداً الساعة 4 عصراً</p>
              </div>
              <div className="bg-white p-4 rounded-3xl rounded-tr-none shadow-sm max-w-[80%] self-end">
                <p className="text-sm font-medium">تم الحجز بنجاح! سيتواصل معك فريقنا لتأكيد العنوان.</p>
              </div>
            </div>
          </div>
          {/* Floating Badges */}
          <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
              <Bot size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">معدل الرد</p>
              <p className="text-xl font-black text-slate-900">أقل من ثانية</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            { icon: <Zap />, value: "47+", label: "وكيل ذكي متاح" },
            { icon: <Users />, value: "1200+", label: "شركة مسجلة" },
            { icon: <ShieldCheck />, value: "94%", label: "نسبة رضا العملاء" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-brand mx-auto mb-6">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
              <p className="text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
