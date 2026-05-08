import { Search, Filter, Star, Zap, ShoppingCart, Info, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";

export function CatalogPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [previewAgent, setPreviewAgent] = useState<any | null>(null);
  const { user, fetchUser } = useStore();
  const navigate = useNavigate();

  const [testChat, setTestChat] = useState<{msg: string, role: 'user'|'bot'}[]>([]);
  const [testInput, setTestInput] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    fetch("/api/catalog/agents")
      .then(res => res.json())
      .then(data => setAgents(data || []));
  }, []);

  const handleTest = async () => {
    if (!testInput.trim() || !previewAgent) return;
    const userMsg = { msg: testInput, role: 'user' as const };
    const currentHistory = testChat.map(c => ({ role: c.role === 'user' ? 'user' : 'assistant', content: c.msg }));
    setTestChat(prev => [...prev, userMsg]);
    setTestInput("");
    setIsTesting(true);

    try {
      const { generateResponse } = await import("../../services/geminiService");
      const responseText = await generateResponse({
        message: testInput,
        history: currentHistory,
        systemInstruction: `${previewAgent.system_prompt}\n\nKnowledge Base:\n${previewAgent.knowledge_base}`,
        apiKey: previewAgent.api_key,
        model: previewAgent.model
      });

      if (responseText) {
        setTestChat(prev => [...prev, { msg: responseText, role: 'bot' as const }]);
      } else {
        setTestChat(prev => [...prev, { msg: "عذراً، لم أستطع الحصول على رد.", role: 'bot' as const }]);
      }
    } catch (e: any) {
      console.error("Preview Chat Error:", e);
      setTestChat(prev => [...prev, { msg: "عذراً، الوكيل المطور لم يقم بإعداد مفتاح API صالح أو واجهنا مشكلة في الاتصال.", role: 'bot' as const }]);
    } finally {
      setIsTesting(false);
    }
  };

  const handlePurchase = async (agent: any) => {
    if (!user) {
      alert("يرجى تسجيل الدخول أولاً");
      return;
    }
    if (user.balance < agent.price) {
      alert("رصيدك غير كافٍ، يرجى شحن الرصيد");
      return;
    }

    try {
      const res = await fetch("/api/customer/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, templateId: agent.id }),
      });
      if (res.ok) {
        alert("تم شراء الوكيل بنجاح!");
        await fetchUser(user.id);
        navigate("/dashboard");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 lg:pb-0">
      <nav className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-lg lg:text-xl">و</div>
          <span className="text-xl lg:text-2xl font-black tracking-tighter text-slate-900">وكيل</span>
        </Link>
        <div className="flex-1 max-w-xl mx-4 lg:mx-8 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="ابحث عن وكيل..." 
            className="w-full bg-slate-100 border-none rounded-xl lg:rounded-2xl py-2.5 lg:py-3 pr-10 lg:pr-12 pl-4 focus:ring-2 focus:ring-brand outline-none text-[10px] lg:text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-4">
           {user && (
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
               <Zap size={14} className="text-amber-500" />
               <span className="text-xs font-black text-slate-900">${user.balance}</span>
             </div>
           )}
           <button className="flex items-center gap-2 bg-white border border-slate-200 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
             <Filter size={14} />
             <span className="hidden sm:inline">تصفية</span>
           </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12 gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">استكشف الوكلاء</h1>
            <p className="text-slate-500 font-medium text-sm">أفضل الوكلاء الأذكياء المطورين بأحدث تقنيات الـ AI</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 group transition-all cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-brand font-black text-2xl group-hover:bg-brand group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                  {agent.name[0]}
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold mb-2 uppercase tracking-tight">
                    {agent.category}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-black">4.9</span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-brand transition-colors">{agent.name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-3 leading-relaxed">
                {agent.description}
              </p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between px-1">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">السعر</p>
                     <p className="text-xl font-black text-slate-900">${agent.price}<span className="text-[10px] text-slate-400 font-medium font-sans">/شهر</span></p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">النموذج</p>
                     <p className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{agent.model}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      setPreviewAgent(agent);
                      setTestChat([{ msg: `أهلاً بك! أنا ${agent.name}. كيف يمكنني خدمتك في مرحلة التجربة؟`, role: 'bot' }]);
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all"
                  >
                    <Info size={14} /> جرب الآن
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(agent);
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-brand text-white rounded-xl text-xs font-black hover:bg-brand-dark transition-all shadow-lg shadow-blue-100 group-hover:scale-[1.02]"
                  >
                    <ShoppingCart size={14} /> شراء
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Preview Modal */}
      {previewAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 lg:p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl h-[90vh] lg:h-[80vh] rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 lg:p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-xl">
                  {previewAgent.name[0]}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-none">{previewAgent.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">تجربة مباشرة (Live Preview)</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewAgent(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-slate-50/30">
              {testChat.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs lg:text-sm font-bold leading-relaxed ${
                    chat.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-900 border border-slate-100 shadow-sm rounded-tl-none'
                  }`}>
                    {chat.msg}
                  </div>
                </div>
              ))}
              {isTesting && (
                <div className="flex justify-start">
                   <div className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-1">
                     <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-75"></span>
                     <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-150"></span>
                   </div>
                </div>
              )}
            </div>

            <div className="p-4 lg:p-6 border-t border-slate-100 bg-white">
              <div className="flex gap-3 items-center">
                 <input 
                   type="text"
                   value={testInput}
                   onChange={(e) => setTestInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleTest()}
                   placeholder="اسأل الوكيل أي شيء..."
                   className="flex-1 bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-bold outline-none focus:ring-2 focus:ring-brand"
                 />
                 <button 
                   onClick={handleTest}
                   disabled={isTesting}
                   className="w-12 h-12 bg-brand text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all"
                 >
                   <ArrowLeft size={18} />
                 </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-medium">النموذج: <span className="font-black text-slate-600 font-sans uppercase">{previewAgent.model}</span></p>
                <button 
                  onClick={() => {
                    handlePurchase(previewAgent);
                    setPreviewAgent(null);
                  }}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-black hover:bg-slate-800 transition-colors"
                >
                  اشتراك الآن
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
