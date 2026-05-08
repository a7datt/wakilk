import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Bot, 
  ArrowRight, 
  Save, 
  Cpu, 
  Globe, 
  FileText, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { useStore } from "../../store/useStore";

export function AgentCustomize() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  const [instance, setInstance] = useState<any>(null);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetch(`/api/customer/instances/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const inst = data.find((i: any) => i.id === id);
          if (inst) {
            setInstance(inst);
            const savedConfig = JSON.parse(inst.config_values || "{}");
            setConfig(savedConfig);
          }
        });
    }
  }, [user, id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customer/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceId: id, configValues: config }),
      });
      if (res.ok) {
        alert("تم حفظ الإعدادات بنجاح! وكيلك جاهز الآن.");
        navigate("/dashboard");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!instance) return <div className="p-20 text-center font-bold text-slate-400">جاري التحميل...</div>;

  const requirements = JSON.parse(instance.customer_requirements || "[]");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate("/dashboard")} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
      >
        <ArrowRight size={20} /> رجوع للرئيسية
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-brand/20">
            {instance.name[0]}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{instance.name}</h1>
            <p className="text-slate-400 font-medium">تخصيص الوكيل وتدشينه لعملك</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
             <Cpu size={16} className="text-slate-400" />
             <span className="text-xs font-black text-slate-600 uppercase">{instance.model}</span>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-10">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <SettingsIcon classes="w-18" /> بيانات تخصيص الوكيل
            </h2>

            <div className="space-y-6">
              {requirements.map((req: string) => (
                <div key={req} className="space-y-2">
                  <label className="text-sm font-black text-slate-700 block">{req}</label>
                  <input 
                    type="text"
                    value={config[req] || ""}
                    onChange={(e) => setConfig({...config, [req]: e.target.value})}
                    placeholder={`أدخل ${req}...`}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand outline-none transition-all"
                  />
                </div>
              ))}
              
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 block">ملفات إضافية للوكيل (اختياري)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-all cursor-pointer group">
                  <FileText className="mx-auto text-slate-300 mb-2 group-hover:text-brand transition-colors" />
                  <p className="text-xs font-bold text-slate-400">ارفع ملفات شركتك ليفهم الوكيل بنيتكم</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-3 px-10 py-4 bg-brand text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand/20"
              >
                {loading ? "جاري الحفظ..." : "حفظ وتشغيل الوكيل"}
                <Save size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-black">حالة الوكيل</h3>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${instance.status === 'configured' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-amber-500'}`}></div>
                <span className="text-xs font-bold">{instance.status === 'configured' ? 'نشط ويعمل' : 'قيد الإعداد'}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                هذا الوكيل مبرمج من قبل المطور <span className="text-white font-bold">أحمد الراجحي</span> ليعمل كـ <span className="text-white font-bold">{instance.category}</span>.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 space-y-4">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-slate-400" /> مساعدة
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              تأكد من تعبئة كافة الحقول المطلوبة لضمان دقة الوكيل في التعامل مع عملائك. يمكنك العودة وتعديل هذه البيانات في أي وقت.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsIcon({ classes }: { classes: string }) {
  return <Bot size={24} className="text-brand" />;
}
