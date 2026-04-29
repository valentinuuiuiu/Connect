"use client"
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Car } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md border-b border-zinc-200 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-extrabold tracking-tight transition-colors ${isScrolled ? 'text-zinc-900' : 'text-zinc-900'}`}>
              AutoConnect<span className="text-emerald-600">.</span>
            </span>
          </div>

          {/* CTA */}
          <button 
            onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}
            className={`hidden sm:flex items-center justify-center px-6 py-2.5 outline outline-1 outline-offset-[-1px] rounded-full transition-all text-sm font-bold ${
              isScrolled 
                ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            Rezervă Loc
          </button>
        </div>
      </div>
    </motion.header>
  );
}
