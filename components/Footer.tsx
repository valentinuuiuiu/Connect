"use client"
import { Car } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AutoConnect<span className="text-emerald-500">.</span></span>
            </div>
            <p className="text-zinc-400 max-w-sm text-sm leading-relaxed">
              Sistem optimizat de înmatriculări auto România-Bulgaria. Lucrăm pe loturi pentru a-ți oferi cel mai bun preț și timp de procesare.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Linkuri Rapide</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-emerald-400 transition">Acasă</button></li>
              <li><button onClick={() => document.getElementById('lead-form')?.scrollIntoView({behavior:'smooth'})} className="hover:text-emerald-400 transition">Rezervă loc în lot</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><span className="font-semibold text-zinc-300">Telefon:</span> <a href="tel:0759389892" className="hover:text-emerald-400 transition">0759 389 892</a></li>
              <li><span className="font-semibold text-zinc-300">Email:</span> <a href="mailto:claude.dev@mail.com" className="hover:text-emerald-400 transition">claude.dev@mail.com</a></li>
              <li className="pt-2">Luni - Vineri: 09:00 - 18:00</li>
              <li>Sâmbătă: 10:00 - 14:00</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} AutoConnect. Toate drepturile rezervate.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-400">Termeni și condiții</a>
            <a href="#" className="hover:text-zinc-400">Politică de confidențialitate</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
