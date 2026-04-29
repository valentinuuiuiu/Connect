"use client"
import { motion } from "motion/react";
import { Check } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Basic",
      desc: "Doar procesarea actelor în BG.",
      price: "900 - 1100€",
      popular: false,
      features: [
        "Traduceri & Notar",
        "Taxe Autorități BG",
        "RCA pe 1 lună inclus",
        "ITP BG (valabil RO)",
        "Fără transport (vii personal)"
      ]
    },
    {
      name: "Standard",
      desc: "Logistică completă fără stres.",
      price: "1100 - 1300€",
      popular: true,
      features: [
        "Include pachetul Basic",
        "Transport platformă dus-întors",
        "Asigurare pe durata transportului",
        "Ridicăm mașina de acasă",
        "Returnare cu acte gata"
      ]
    },
    {
      name: "Full Service",
      desc: "Prioritate maximă în lot.",
      price: "1300 - 1500€",
      popular: false,
      features: [
        "Include pachetul Standard",
        "Prioritate loc: Lotul curent garantat",
        "RCA BG pe 3 luni inclus",
        "Serviciu de reprezentare daune valabil",
        "Consultanță VIP"
      ]
    }
  ];

  return (
    <section className="py-24 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-zinc-900 mb-4">Investiție transparentă</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            Oferte clare, fără taxe ascunse la fața locului. Odată confirmată oferta personalizată, prețul se respectă 100%.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 border ${plan.popular ? 'bg-zinc-900 border-zinc-900 shadow-xl shadow-zinc-900/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2">
                  <span className="bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Cel mai ales
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.desc}</p>
                <div className="text-3xl sm:text-4xl font-extrabold">
                  {plan.price}
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span className={`text-sm ${plan.popular ? 'text-zinc-300' : 'text-zinc-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.popular 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                Cere ofertă exactă
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
