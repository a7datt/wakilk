import { useEffect, useState } from "react";
import { Search, ChevronRight, Bot } from "lucide-react";
import { ChatWidget } from "@/src/components/ChatWidget";
import { useStore } from "@/src/store/useStore";

const CHATS = [
  { id: 1, name: "أحمد محمد", lastMsg: "كم سعر التوصيل لجدة؟", time: "10:30 ص", channel: "whatsapp", status: "open", unread: 2 },
  { id: 2, name: "سارة خالد", lastMsg: "شكراً جزيلاً لكم", time: "9:15 ص", channel: "instagram", status: "closed", unread: 0 },
  { id: 3, name: "متجر الورد", lastMsg: "نحتاج لتعديل الطلب #123", time: "الأمس", channel: "web", status: "transferred", unread: 0 },
];

export function Inbox() {
  const { user } = useStore();
  const [instances, setInstances] = useState<any[]>([]);
  const [activeInstance, setActiveInstance] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/customer/instances/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setInstances(data || []);
          if (data.length > 0) setActiveInstance(data[0]);
        });
    }
  }, [user]);

  return (
    <div className="flex h-[calc(100vh-80px)] lg:h-[calc(100vh-160px)] bg-white rounded-none lg:rounded-[2rem] border-0 lg:border border-slate-200 overflow-hidden shadow-none lg:shadow-sm -m-4 lg:m-0">
      {/* Sidebar - Instance List */}
      <div className={`w-full lg:w-96 border-l border-slate-200 flex flex-col ${activeInstance ? "hidden lg:flex" : "flex"}`}>
        <div className="p-6 border-b border-slate-100">
           <h3 className="text-lg font-black text-slate-900 mb-4">الدردشة مع وكلائي</h3>
           <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="ابحث عن وكيل..." 
              className="w-full bg-slate-50 border-none rounded-xl py-3 pr-10 pl-4 text-xs font-medium focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {instances.map(inst => (
            <div 
              key={inst.id}
              onClick={() => setActiveInstance(inst)}
              className={`p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50 ${activeInstance?.id === inst.id ? "bg-blue-50 border-r-4 border-r-brand" : ""}`}
            >
              <div className="w-12 h-12 bg-slate-200 rounded-2xl flex-shrink-0 flex items-center justify-center text-brand font-black text-xl">
                {inst.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-slate-900 truncate">{inst.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{inst.model}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-slate-50/30 ${!activeInstance ? "hidden lg:flex" : "flex"}`}>
        {activeInstance ? (
          <>
            {/* Chat Header */}
            <div className="h-16 lg:h-20 bg-white border-b border-slate-100 px-4 lg:px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 lg:gap-4 truncate">
                <button 
                  onClick={() => setActiveInstance(null)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} className="text-slate-600" />
                </button>
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-brand text-white rounded-xl flex items-center justify-center font-bold shrink-0">
                  {activeInstance.name[0]}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-black text-slate-900 truncate">{activeInstance.name}</h4>
                  <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    متصل الآن
                  </p>
                </div>
              </div>
            </div>

            {/* Message Log */}
            <div key={activeInstance.id} className="flex-1 overflow-hidden relative">
              <ChatWidget 
                instanceId={activeInstance.id}
                initialMessage={`أهلاً بك، أنا ${activeInstance.name}، كيف يمكنني خدمتك اليوم؟`}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white">
            <Bot size={48} className="text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2">اختر وكيلاً للدردشة</h3>
            <p className="text-slate-400 text-sm font-medium">محادثاتك هنا مشفرة ومخصصة تماماً لعملك.</p>
          </div>
        )}
      </div>
    </div>
  );
}
