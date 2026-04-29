"use client"
import { motion } from "motion/react";
import { Users, TrendingDown, Layers, Timer } from "lucide-react";
import { useEffect, useState } from "react";

export function BatchSystem() {
  const [timeLeft, setTimeLeft] = useState(4 * 24 * 60 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
  const seconds = timeLeft % 60;

  return (
    <section className="py-24 relative overflow-hidden bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-md bg-zinc-200/50 border border-zinc-300 text-zinc-700 text-xs font-bold uppercase tracking-widest">
              Sistem Optimizat
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mb-6">De ce operăm prin sistem de loturi?</h2>
            <p className="text-zinc-600 text-lg mb-8 leading-relaxed">
              Transportul și procesarea actelor la bucată aduc costuri enorme. Grupând 3 până la 10 mașini într-un singur transport, împărțim cheltuielile logistice, iar tu primești cel mai bun preț de pe piață.
            </p>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 mt-1">
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-zinc-900 font-bold mb-1">Reducere masivă de costuri</h4>
                  <p className="text-sm text-zinc-600">Împarți taxa de platformă cu alți clienți.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 mt-1">
                  <Layers className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-zinc-900 font-bold mb-1">Procesare simultană la autorități</h4>
                  <p className="text-sm text-zinc-600">Depunem dosarele grupat pentru actele în BG, reducând timpul de așteptare la ITP.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 mt-1">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-zinc-900 font-bold mb-1">Dedicat persoanelor fizice & flotelor</h4>
                  <p className="text-sm text-zinc-600">Indiferent dacă ai o mașină sau trei, prinzi loc în următorul lot.</p>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl border border-zinc-200 bg-white overflow-hidden relative shadow-xl shadow-zinc-200/50"
          >
            <div className="p-8 pb-10 text-center relative z-10 border-b border-zinc-100">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Următorul Lot (Batch)</h3>
              <p className="text-emerald-700 font-medium mb-6">Maxim 10 locuri disponibile per lot</p>
              
              {/* Countdown */}
              <div className="flex justify-center gap-2 sm:gap-4">
                {[
                  { label: "Zile", value: days },
                  { label: "Ore", value: hours },
                  { label: "Min", value: minutes },
                  { label: "Sec", value: seconds },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-2xl font-black text-zinc-900 tracking-widest tabular-nums shadow-sm">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-[10px] sm:text-xs text-zinc-500 mt-2 uppercase font-bold tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-zinc-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-zinc-600 text-sm font-semibold uppercase tracking-wider">Locuri ocupate</span>
                <span className="text-zinc-900 font-bold">7 / 10</span>
              </div>
              
              <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden mb-8">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "70%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-emerald-500 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>

              <button 
                onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white font-bold rounded-lg hover:bg-zinc-800 transition-colors shadow-md"
              >
                <Timer className="w-5 h-5" />
                Rezervă cu avans acum
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
