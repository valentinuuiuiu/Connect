"use client"
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

type Message = { role: "user" | "model"; text: string };

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Salut! Ai nevoie de detalii despre înmatricularea în Bulgaria sau vrei să rezervi un loc în următorul lot?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) throw new Error("API responded with an error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      setMessages((prev) => [...prev, { role: "model", text: "" }]);

      if (reader) {
        let text = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: "model", text };
            return newMessages;
          });
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", text: "A apărut o eroare la conectare. Te rog încearcă din nou sau folosește formularul de contact." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center shadow-2xl hover:bg-zinc-800 z-50 text-white transition-colors"
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
            <div className="bg-zinc-50 p-4 border-b border-zinc-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">Asistent AutoConnect</h3>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    m.role === "user" 
                      ? 'bg-zinc-900 text-white rounded-br-sm' 
                      : 'bg-zinc-50 text-zinc-800 rounded-bl-sm border border-zinc-100'
                  }`}>
                    {m.role === "model" && <Bot className="w-4 h-4 mb-2 text-emerald-600" />}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-50 rounded-2xl p-4 rounded-bl-sm border border-zinc-100 shadow-sm">
                    <div className="flex gap-1.5 justify-center">
                      <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-zinc-50 border-t border-zinc-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Scrie un mesaj..."
                  className="flex-1 bg-white text-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-zinc-400 text-sm shadow-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
