"use client"
import { motion } from "motion/react";
import { FileText, CreditCard, Truck, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "1. Trimiți datele",
      desc: "Completezi formularul online cu datele mașinii tale pentru a primi o ofertă detaliată."
    },
    {
      icon: CreditCard,
      title: "2. Confirmare & Avans",
      desc: "Blochezi locul în următorul lot de transport prin plata unui avans de rezervare."
    },
    {
      icon: Truck,
      title: "3. Transport Colectiv",
      desc: "Ridicăm mașina și o transportăm legal pe platformă către autoritățile din Bulgaria."
    },
    {
      icon: CheckCircle2,
      title: "4. Procesare & Livrare",
      desc: "Finalizăm ITP, RCA și acte. Îți returnăm mașina acasă în 5-10 zile, gata de drum."
    }
  ];

  return (
    <section className="py-24 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-zinc-900 mb-4">Cum funcționează?</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            Am simplificat procesul la maxim. Ne ocupăm de birocrație și logistică, tu doar ne predai mașina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-zinc-50 p-6 rounded-2xl border border-zinc-200 hover:border-emerald-500/30 transition-colors shadow-sm"
              >
                {/* Decorative connecting line for desktop */}
                {index !== steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 right-0 w-full h-[2px] bg-gradient-to-r from-emerald-600/30 to-transparent translate-x-1/2 z-0" />
                )}
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">{step.title}</h3>
                  <p className="text-zinc-600 leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
