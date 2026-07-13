"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export function AssistantWidget({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const next: Msg[] = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, messages: next })
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "تعذر الاتصال بالمساعد حاليًا." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 end-5 z-50">
      {open && (
        <div className="mb-3 w-80 h-96 bg-white rounded-2xl shadow-diplomatic border border-diplomatic-slate/10 flex flex-col overflow-hidden">
          <div className="bg-diplomatic-navy text-white px-4 py-3 flex items-center justify-between">
            <span className="font-bold text-sm">VietConnect AI</span>
            <button onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.length === 0 && (
              <p className="text-diplomatic-navy/50">اسألني عن الطلاب، المواعيد، أو جواز السفر.</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`rounded-lg px-3 py-2 max-w-[85%] ${m.role === "user" ? "bg-diplomatic-navy text-white ms-auto" : "bg-diplomatic-fog text-diplomatic-navy"}`}>
                {m.content}
              </div>
            ))}
            {loading && <p className="text-xs text-diplomatic-navy/40">...</p>}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 rounded-full border border-diplomatic-slate/30 px-3 py-2 text-sm"
              placeholder="اكتب رسالتك..."
              aria-label="Chat message"
            />
            <button onClick={send} className="rounded-full bg-vn-red text-white p-2" aria-label="Send">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-vn-red text-white shadow-diplomatic flex items-center justify-center"
        aria-label="Open assistant"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
