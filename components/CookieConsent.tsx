"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Cookie } from "lucide-react";
import { GoogleAnalytics } from "@next/third-parties/google";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "all") {
      setAnalyticsConsent(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    setAnalyticsConsent(true);
    setShowBanner(false);
  };

  const declineOptional = () => {
    localStorage.setItem("cookieConsent", "essential");
    setAnalyticsConsent(false);
    setShowBanner(false);
  };

  return (
    <>
      {analyticsConsent && (
        <GoogleAnalytics gaId="G-V771SGM43Y" /> // V771SGM43Y is a substitute, user can change later if needed.
      )}
      
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
          >
            <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="bg-emerald-500/10 p-3 rounded-full shrink-0">
                  <Cookie className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Utilizăm Cookie-uri</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Folosim cookie-uri esențiale pentru a asigura buna funcționare a site-ului. De asemenea, dacă ne oferi consimțământul tău, vom folosi cookie-uri analitice (Google Analytics) pentru a înțelege cum este folosit website-ul și a-i îmbunătăți performanța.
                    Mai multe detalii găsești în{" "}
                    <Link href="/politica-cookies" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                      Politica de Cookies
                    </Link>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 shrink-0">
                <button
                  onClick={declineOptional}
                  className="px-6 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  Doar cele esențiale
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2.5 text-sm font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  Acceptă tot
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
