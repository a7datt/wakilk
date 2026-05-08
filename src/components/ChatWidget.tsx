import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { generateResponse } from "../services/geminiService";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWidgetProps {
  instanceId?: string;
  systemPrompt?: string;
  initialMessage?: string;
}

export function ChatWidget({ instanceId, systemPrompt: initialSystemPrompt, initialMessage }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessage ? [{ role: "assistant", content: initialMessage }] : []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<{ systemInstruction: string; model?: string; apiKey?: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (instanceId) {
      fetch(`/api/chat/context/${instanceId}`)
        .then(res => res.json())
        .then(data => {
          if (data.systemInstruction) {
            setContext(data);
          }
        })
        .catch(err => console.error("Failed to load chat context:", err));
    } else if (initialSystemPrompt) {
      setContext({ systemInstruction: initialSystemPrompt });
    }
  }, [instanceId, initialSystemPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !context) return;

    const userMsg: Message = { role: "user", content: input };
    const currentHistory = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await generateResponse({
        message: input,
        history: currentHistory,
        systemInstruction: context.systemInstruction,
        model: context.model,
        apiKey: context.apiKey
      });

      if (responseText) {
        setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "عذراً، لم أستطع الحصول على رد." }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "عذراً، واجهت مشكلة في الاتصال بالذكاء الاصطناعي." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 lg:gap-4 ${msg.role === "user" ? "flex-row" : "flex-row-reverse"}`}>
            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-slate-900 text-white"}`}>
              {msg.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={`max-w-[85%] lg:max-w-[75%] p-4 rounded-2xl shadow-sm ${msg.role === "assistant" ? "bg-white text-slate-800 rounded-tl-none border border-slate-100" : "bg-brand text-white rounded-tr-none"}`}>
              <p className="text-xs lg:text-sm leading-relaxed whitespace-pre-wrap font-bold">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
              <Bot size={16} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tr-none shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-brand" />
              <span className="text-xs font-bold text-slate-400">يفكر الوكيل...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 px-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="w-10 h-10 bg-brand text-white rounded-lg flex items-center justify-center hover:bg-brand-dark transition-all disabled:opacity-50"
          >
            <Send size={18} className="translate-x-0.5 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
