"use client"
import { motion } from "motion/react";
import { ArrowRight, Clock, ShieldCheck, MapPin } from "lucide-react";

export function Hero() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] bg-zinc-50 pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 flex items-center">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-md bg-zinc-200/50 border border-zinc-300 text-zinc-700 text-xs font-bold uppercase tracking-widest">
            Serviciu B2B & Persoane Fizice
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
            Înmatriculare auto în Bulgaria <br className="hidden sm:block" />
            <span className="text-emerald-700">rapid și 100% legal</span>
          </h1>
          
          <p className="mt-4 text-lg sm:text-xl text-zinc-600 mb-10 max-w-lg leading-relaxed">
            Proces complet cu transport pe platformă, inspecție ITP și acte incluse. Operăm eficient pe loturi de mașini. Fără bătăi de cap, zero stres.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <button 
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Rezervă loc în lotul următor
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-200 pt-8">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-zinc-900 text-sm">5-10 Zile</p>
                <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Procesare</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-zinc-900 text-sm">100% Legal</p>
                <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Acte + ITP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-zinc-900 text-sm">Logistică</p>
                <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Transport auto</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl flex flex-col items-center justify-center p-8 border border-zinc-800 group"
        >
          {/* Abstract background elements */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]"></div>

          <div className="relative z-10 w-full max-w-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl transform transition-transform group-hover:scale-[1.02] duration-500">
              <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-zinc-100 font-bold">Inspecție TPD</h3>
                    <p className="text-zinc-500 text-xs">Aprobat oficial</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  ACTIV
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Verificare Acte</span>
                  <span className="text-zinc-100 font-medium">100% Complet</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                </div>

                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-zinc-400">Platformă Transport</span>
                  <span className="text-zinc-100 font-medium">Confirmat</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-400 rounded-full w-full"></div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Actualizat acum</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  Ruse, BG
                </div>
              </div>
            </div>
            
            {/* Secondary floating card */}
            <div className="absolute -bottom-6 -right-6 bg-zinc-800 border border-zinc-700 rounded-xl p-4 shadow-xl flex items-center gap-4 transform transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2 duration-500">
              <div className="relative">
                <div className="px-3 py-2 bg-emerald-500 text-zinc-950 font-black text-xl rounded-lg">
                  BG
                </div>
              </div>
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-wider mb-0.5">Numere Noi</p>
                <p className="text-zinc-100 font-mono font-bold">CB 1234 A</p>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}
