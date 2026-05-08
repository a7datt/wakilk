import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Save, 
  Play, 
  Globe, 
  Shield, 
  Cpu, 
  FileText, 
  DollarSign, 
  ChevronRight,
  ArrowRight,
  Bot,
  MessageCircle,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";

const MODELS = [
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (سريع)", brand: "Google", color: "bg-blue-500" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (ذكي للغاية)", brand: "Google", color: "bg-purple-600" },
  { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (تجريبي)", brand: "Google", color: "bg-indigo-500" },
];

export function AgentCreator() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "خدمة عملاء",
    model: MODELS[0].id,
    api_key: "",
    system_prompt: "",
    knowledge_base: "",
    price: 49,
    requirements: ["اسم الشركة", "وصف النشاط"],
  });

  const [testChat, setTestChat] = useState<{msg: string, role: 'user'|'bot'}[]>([]);
  const [testInput, setTestInput] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);

  const handleTest = async () => {
    if (!testInput.trim()) return;
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
        systemInstruction: `${formData.system_prompt}\n\nKnowledge Base:\n${formData.knowledge_base}`,
        apiKey: formData.api_key,
        model: formData.model
      });
      
      if (responseText) {
        setTestChat(prev => [...prev, { msg: responseText, role: 'bot' as const }]);
      } else {
        setTestChat(prev => [...prev, { msg: "عذراً، لم أستطع الحصول على رد من الوكيل.", role: 'bot' as const }]);
      }
    } catch (e: any) {
      console.error("Test Chat Error:", e);
      setTestChat(prev => [...prev, { msg: `خطأ: ${e.message || "فشل الاتصال بالذكاء الاصطناعي"}`, role: 'bot' as const }]);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    const agentId = `agent_${Math.random().toString(36).substr(2, 9)}`;
    try {
      const res = await fetch("/api/developer/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: agentId,
          developer_id: user?.id || "dev_1",
          image_url: "https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=400&h=400&fit=crop",
          customer_requirements: formData.requirements
        }),
      });
      if (res.ok) {
        navigate("/developer");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/developer")} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
          <ArrowRight size={20} />
          رجوع للوحة التحكم
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 w-12 rounded-full transition-all ${step >= s ? "bg-brand" : "bg-slate-200"}`} />
          ))}
        </div>
      </div>

      <header className="px-4 lg:px-0">
        <h1 className="text-2xl lg:text-4xl font-black text-slate-900 mb-2">تصميم وكيل ذكي جديد</h1>
        <p className="text-sm lg:text-base text-slate-500 font-medium">قم ببناء وتدريب وكيلك الرقمي ليقوم بمهام محددة للمستخدمين.</p>
      </header>

      <div className="bg-white rounded-2xl lg:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 lg:p-10 space-y-8">
            <section className="space-y-4">
              <label className="text-xl font-black text-slate-900 block">الهوية والوصف</label>
              <div className="grid gap-6">
                <input 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand outline-none" 
                  placeholder="اسم الوكيل (مثلاً: مساعد المبيعات الذكي)"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <textarea 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand outline-none h-32" 
                  placeholder="اشرح ماذا يفعل هذا الوكيل ولماذا يجب على العميل شراؤه..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-lg lg:text-xl font-black text-slate-900 block">اختر العقل المدبر (النموذج)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                {MODELS.map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setFormData({...formData, model: m.id})}
                    className={`p-4 lg:p-6 rounded-2xl lg:rounded-[2rem] border-2 transition-all text-right group ${
                      formData.model === m.id ? "border-brand bg-blue-50" : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 ${m.color} rounded-xl mb-3 lg:mb-4 flex items-center justify-center text-white`}>
                      <Cpu size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mb-1">{m.brand}</p>
                    <p className="text-xs lg:text-sm font-black text-slate-900">{m.name}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg lg:text-xl font-black text-slate-900">مفتاح الـ API الخاص بك</label>
                <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-tighter">اختياري</div>
              </div>
              <div className="relative">
                <input 
                  type="password"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pr-12 text-xs lg:text-sm font-bold focus:ring-2 focus:ring-brand outline-none" 
                  placeholder="أدخل API Key (اختياري)"
                  value={formData.api_key}
                  onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                />
                <Shield size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">سيتم استخدام هذا المفتاح لتشغيل وكيلك. إذا لم تضعه، سنستخدم مفتاح منصة "وكيل" التجريبي.</p>
            </section>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 lg:p-10 space-y-8">
            <section className="space-y-4">
              <label className="text-lg lg:text-xl font-black text-slate-900 block">التوجيهات وملفات التعلم</label>
              <div className="space-y-6">
                <div>
                  <p className="text-xs lg:text-sm font-bold text-slate-600 mb-2">تعليمات النظام (System Prompt)</p>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs lg:text-sm font-bold focus:ring-2 focus:ring-brand outline-none h-32 lg:h-48 font-mono" 
                    placeholder="أنت خبير في المبيعات، هدفك هو إتمام الصفقة بلباقة مع مراعاة ثقافة العميل..."
                    value={formData.system_prompt}
                    onChange={(e) => setFormData({...formData, system_prompt: e.target.value})}
                  />
                  <p className="text-[10px] text-slate-400 mt-2">هنا تضع شخصية الوكيل وقواعد سلوكه العامة.</p>
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-bold text-slate-600 mb-2">قاعدة المعرفة (Knowledge Base)</p>
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 lg:p-12 text-center group cursor-pointer hover:bg-slate-100 transition-colors">
                    <FileText size={32} className="mx-auto text-slate-300 mb-3 lg:mb-4 group-hover:text-brand transition-colors" />
                    <p className="text-xs lg:text-sm font-bold text-slate-600">اسحب ملفات التعليمات هنا</p>
                    <p className="text-[10px] text-slate-400 mt-1 lg:mt-2">سيقوم الوكيل بدراسة هذه الملفات ليفهم تخصصه بعمق.</p>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 lg:p-10 space-y-8">
            <section className="space-y-6">
              <label className="text-lg lg:text-xl font-black text-slate-900 block">التسعير ومتطلبات العميل</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <div className="bg-slate-50 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-100">
                  <p className="text-[10px] lg:text-sm font-bold text-slate-600 mb-2 lg:mb-4">سعر الاشتراك الشهري</p>
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="p-2 lg:p-3 bg-white rounded-lg shadow-sm"><DollarSign className="text-brand" size={18} /></div>
                    <input 
                      type="number"
                      className="text-2xl lg:text-4xl font-black text-slate-900 bg-transparent w-full outline-none"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] lg:text-sm font-bold text-slate-600">ماذا تطلب من العميل لتشغيل الوكيل؟</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.requirements.map((req, i) => (
                      <span key={i} className="px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-50 text-brand text-[10px] font-bold rounded-full border border-blue-100 flex items-center gap-2">
                        {req}
                        <button onClick={() => setFormData({...formData, requirements: formData.requirements.filter((_, idx) => idx !== i)})} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                    <button 
                      onClick={() => {
                        const r = prompt("أدخل مسمى الحقل المطلوب (مثلاً: رابط الموقع)");
                        if(r) setFormData({...formData, requirements: [...formData.requirements, r]});
                      }}
                      className="px-3 py-1.5 lg:px-4 lg:py-2 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center gap-2"
                    >
                      <Plus size={12} /> إضافة حقل
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">سيقوم العميل بتعبئة هذه البيانات بعد شراء الوكيل ليعمل ضمن نطاق عمله.</p>
                </div>
              </div>
            </section>

            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
              <h4 className="flex items-center gap-2 text-amber-900 font-bold mb-2">
                <Globe size={18} /> جاهز للنشر؟
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                بمجرد النشر، سيظهر وكيلك في الكتالوج العام لمنصة "وكيل". تأكد من اختبار الوكيل ومراجعة التعليمات بدقة لضمان أفضل تجربة للمشتركين.
              </p>
            </div>
          </motion.div>
        )}

        <div className="p-6 lg:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-400 w-full sm:w-auto flex justify-center sm:justify-start">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="text-sm font-bold hover:text-slate-900 transition-colors">السابق</button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowTestPanel(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all text-xs lg:text-base"
            >
              <Play size={18} /> تجربة الوكيل
            </button>
            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)} 
                className="flex items-center justify-center gap-4 px-10 py-3 lg:px-12 lg:py-4 bg-brand text-white font-black rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all text-xs lg:text-base"
              >
                المتابعة
                <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                disabled={loading}
                onClick={handleCreate}
                className="flex items-center justify-center gap-4 px-10 py-3 lg:px-12 lg:py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all text-xs lg:text-base"
              >
                {loading ? "جاري النشر..." : "نشر الوكيل في الكتالوج"}
                <Globe size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Test Panel Modal */}
      {showTestPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl h-[80vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-none">بيئة تجربة الوكيل</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">نماذج سريعة (Fast Sandbox)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTestPanel(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              {testChat.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                    <MessageCircle size={28} className="text-slate-200" />
                  </div>
                  <p className="font-black text-slate-900 mb-2">اختبر ذكاء وكيلك هنا</p>
                  <p className="text-xs text-slate-400 font-medium max-w-[200px]">أرسل أول رسالة لترى كيف يتصرف الوكيل بناءً على تعليماتك.</p>
                </div>
              ) : (
                testChat.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold leading-relaxed ${
                      chat.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white text-slate-900 border border-slate-100 shadow-sm rounded-tl-none'
                    }`}>
                      {chat.msg}
                    </div>
                  </div>
                ))
              )}
              {isTesting && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 animate-pulse flex gap-2">
                    <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                    <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                    <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="flex gap-4 relative">
                <input 
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTest()}
                  placeholder="اكتب رسالة للاختبار..."
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand pr-12"
                />
                <button 
                  onClick={handleTest}
                  disabled={isTesting}
                  className="w-12 h-12 bg-brand text-white rounded-xl flex items-center justify-center absolute right-1.5 top-1.5 shadow-lg shadow-brand/20 hover:scale-105 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center">
                ملاحظة: هذا الاختبار يستخدم إعدادات الوكيل الحالية (المسودة).
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
