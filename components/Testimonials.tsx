"use client"
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Andrei M.",
      role: "Client Persoană Fizică",
      text: "Am trimis mașina pe platformă marți, iar sâmbătă era înapoi acasă cu numere de BG, ITP pe 1 an și procură. Fără a sta la cozi la RAR-ul lor. Excelent serviciu!",
      rating: 5,
    },
    {
      name: "Sorin D.",
      role: "Proprietar Flotă",
      text: "Folosesc sistemul lor de loturi pentru 3-4 mașini pe lună. Ies mult mai ieftin decât dacă aș trimite șoferi separat. Totul e legal, transparent, și cel mai important: la timp.",
      rating: 5,
    },
    {
      name: "Marius V.",
      role: "Client Persoană Fizică",
      text: "Inițial am fost sceptic cu avansul, dar a meritat toți banii. Mi-au ridicat mașina din fața blocului și m-au ținut la curent cu poze pe WhatsApp pe tot parcursul procesului.",
      rating: 5,
    }
  ];

  return (
    <section className="py-24 bg-white border-y border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mb-4">Peste 500 de mașini înmatriculate cu succes</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            Sistemul nostru de loturi funcționează perfect. Iată ce spun clienții care ne-au încredințat deja mașinile lor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-zinc-50 border border-zinc-200 p-8 rounded-2xl relative shadow-sm"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-zinc-200" />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                ))}
              </div>
              <p className="text-zinc-700 italic mb-6 text-sm leading-relaxed">
                &quot;{t.text}&quot;
              </p>
              <div>
                <p className="font-bold text-zinc-900">{t.name}</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wide mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
