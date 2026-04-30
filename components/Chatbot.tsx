"use client"
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User, ChevronDown } from "lucide-react";

type Message = { role: "user" | "model"; text: string };

const QUICK_REPLIES = [
  "Cât costă pachetul Standard?",
  "Cât durează procesul?",
  "Ce include transportul?",
  "Cum rezerv un loc?",
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Salut! Sunt asistentul AutoConnect. Te pot ajuta cu informații despre înmatricularea auto în Bulgaria. Ce dorești să știi?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setShowQuickReplies(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) throw new Error("API responded with an error");

      const data = await response.json();
      // Handle both { content: "..." } and raw string responses
      const botText = typeof data === "string" 
        ? data 
        : (data.content || data.message || data.text || "Scuze, am întâmpinat o problemă.");
      
      // Final client-side cleanup: strip any leftover JSON or analysis leakage
      let cleaned = botText;
      try {
        // If the model returned raw JSON string, parse it
        if (cleaned.startsWith("{") && cleaned.includes('"content"')) {
          const parsed = JSON.parse(cleaned);
          cleaned = parsed.content || cleaned;
        }
      } catch { /* not JSON, keep as-is */ }
      
      // Strip reasoning/analysis prefixes
      cleaned = cleaned
        .replace(/^\{[^}]*"content"\s*:\s*"/, "")
        .replace(/"\s*\}$/, "")
        .replace(/^Assistant:\s*/i, "")
        .split('\n')
        .filter(line => !/^(Analyze|Identify|Intent|Context|User (said|says|input)|Reasoning|Thinking|Step \d)/i.test(line.trim()))
        .join('\n')
        .trim();

      setMessages((prev) => [...prev, { role: "model", text: cleaned || "Scuze, nu am putut genera un răspuns. Te rog încearcă din nou." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", text: "A apărut o eroare la conectare. Te rog încearcă din nou sau folosește formularul de contact." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center shadow-2xl hover:bg-zinc-800 z-50 text-white transition-colors"
        aria-label="Deschide chat"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-[calc(100vw-3rem)] sm:w-[400px] h-[500px] max-h-[80vh] bg-white border border-zinc-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-zinc-900 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Asistent AutoConnect</h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 block animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Închide chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[90%] ${m.role === "model" ? 'flex-row' : 'flex-row-reverse'}`}>
                    {m.role === "model" && (
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                      m.role === "user" 
                        ? 'bg-zinc-900 text-white rounded-tr-sm' 
                        : 'bg-white text-zinc-800 rounded-tl-sm border border-zinc-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-zinc-200 shadow-sm">
                      <div className="flex gap-1.5 justify-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && messages.length <= 2 && (
              <div className="px-4 pb-2 bg-zinc-50 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => sendMessage(qr)}
                    className="text-xs bg-white border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-zinc-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Scrie un mesaj..."
                  className="flex-1 bg-zinc-50 text-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-zinc-400 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Trimite mesaj"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
