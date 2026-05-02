"use client"
import { motion } from "motion/react";
import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    marca: "",
    an: "",
    oras: "",
    telefon: "",
    email: "",
    urgency: "normal"
  });
  const [emailError, setEmailError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    setStatus("loading");
    
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section id="lead-form" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Send className="w-48 h-48 text-emerald-500" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Rezervă Loc în Următorul Lot</h2>
            <p className="text-zinc-400 mb-10 text-lg">
              Deplasările spre Bulgaria se fac o dată la 2 săptămâni! Completează datele mașinii pentru a rezerva un loc în următorul lot. Costurile exacte și avansul necesar variază și vor fi calculate individual, urmând să te contactăm telefonic pentru stabilire.
            </p>

            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Cerere primită!</h3>
                <p className="text-zinc-300">Te vom contacta în scurt timp pentru a-ți oferi estimarea finală.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Marca și Model</label>
                    <input 
                      required
                      name="marca"
                      value={formData.marca}
                      onChange={handleChange}
                      type="text" 
                      placeholder="ex. BMW M3"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-wider">An fabricație</label>
                    <input 
                      required
                      name="an"
                      value={formData.an}
                      onChange={handleChange}
                      type="text" 
                      placeholder="ex. 2018"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Orașul tău / Județ</label>
                    <input 
                      required
                      name="oras"
                      value={formData.oras}
                      onChange={handleChange}
                      type="text" 
                      placeholder="ex. București"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Telefon contact (WhatsApp)</label>
                    <input 
                      required
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      type="tel" 
                      placeholder="ex. 07xx xxx xxx"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Adresă de Email</label>
                  <input 
                    required
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ex. nume@exemplu.ro"
                    className={`w-full bg-zinc-950 border ${emailError ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors`}
                  />
                  {emailError && (
                    <p className="text-sm text-red-500 mt-1">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Urgență Procesare</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="cursor-pointer relative">
                      <input onChange={handleChange} type="radio" name="urgency" value="normal" className="peer sr-only" checked={formData.urgency === 'normal'} />
                      <div className="w-full text-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400 peer-checked:bg-emerald-600/10 peer-checked:border-emerald-500 peer-checked:text-white transition-all shadow-sm font-medium">
                        Normal (Lot standard)
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input onChange={handleChange} type="radio" name="urgency" value="rapid" className="peer sr-only" checked={formData.urgency === 'rapid'} />
                      <div className="w-full text-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400 peer-checked:bg-orange-500/10 peer-checked:border-orange-500 peer-checked:text-white transition-all shadow-sm flex items-center justify-center gap-2 font-medium">
                        Super Rapid <AlertCircle className="w-4 h-4 peer-checked:text-orange-400" />
                      </div>
                    </label>
                  </div>
                </div>

                <button 
                  disabled={status === "loading"}
                  type="submit"
                  className="w-full py-4 mt-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors flex justify-center items-center gap-2 group"
                >
                  {status === "loading" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Trimite Cererea pentru Calcul
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
