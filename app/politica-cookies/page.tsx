import React from "react";
import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="text-emerald-500 hover:text-emerald-400 font-medium mb-8 inline-block">
          &larr; Înapoi la prima pagină
        </Link>
        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
          Politica de Utilizare Cookie-uri
        </h1>
        <p className="text-zinc-400">Ultima actualizare: Septembrie 2024</p>
        
        <div className="prose prose-invert max-w-none text-zinc-300 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white">1. Introducere</h2>
            <p>
              Această Politică privind fișierele cookies se aplică tuturor utilizatorilor acestui website. Informațiile de mai jos au ca scop informarea utilizatorilor cu privire la plasarea, utilizarea și administrarea cookie-urilor în contextul navigării pe această pagină web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">2. Ce sunt cookie-urile?</h2>
            <p>
              Un "Internet Cookie" (cunoscut și ca "browser cookie" sau "HTTP cookie") este un fișier de mici dimensiuni, format din litere și numere, care va fi stocat pe computerul, terminalul mobil sau alte echipamente ale unui utilizator de pe care se accesează internetul.
            </p>
            <p>
              Cookie-ul este instalat prin solicitarea emisă de către un web server unui browser (ex: Internet Explorer, Chrome, Safari, Firefox) și este complet "pasiv" (nu conține programe software, viruși sau spyware și nu poate accesa informațiile de pe hard drive-ul utilizatorului).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">3. La ce sunt folosite cookie-urile?</h2>
            <p>
              Aceste fișiere fac posibilă recunoașterea terminalului utilizatorului și prezentarea conținutului într-un mod relevant, adaptat preferințelor utilizatorului. Cookie-urile asigură utilizatorilor o experiență plăcută de navigare și susțin eforturile noastre pentru a oferi servicii confortabile utilizatorilor (ex: preferințele în materie de confidențialitate online, coșul de cumpărături sau publicitate relevantă).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">4. Ce categorii de cookie-uri folosim?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cookie-uri strict necesare:</strong> Esențiale pentru funcționarea site-ului web și navigarea în siguranță. Nu necesită consimțământ din partea utilizatorului, conform reglementărilor legale (ex: cookie-uri de sesiune, preferințele de consimțământ).
              </li>
              <li>
                <strong>Cookie-uri de performanță și analiză:</strong> (ex. Google Analytics) Ne ajută să înțelegem modul în care vizitatorii interacționează cu website-ul prin colectarea și raportarea informațiilor în mod anonim. Acestea permit măsurarea traficului, identificând paginile cele mai populare. Pentru aceste cookie-uri, cerem în mod explicit consimțământul tău.
              </li>
              <li>
                <strong>Cookie-uri de marketing/publicitate:</strong> Sunt folosite pentru a urmări utilizatorii de la un site la altul. Scopul lor este de a afișa reclame relevante și antrenante (la acest moment, nu utilizăm astfel de cookie-uri pentru remarketing, dar dacă o vom face, ele vor fi activate doar cu consimțământul tău explicit).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">5. Controlul cookie-urilor și modalități de respingere</h2>
            <p>
              Vă puteți retrage consimțământul privind cookie-urile facultative (statistice/analitice) oricând prin intermediul setărilor disponibile pe site. Alternativ, poți bloca sau șterge cookie-urile direct din setările browser-ului tău de internet. Menționăm totuși că unele funcționalități ale site-ului pot fi afectate dacă blochezi cookie-urile strict necesare.
            </p>
            <p className="mt-2 text-sm italic">
              Majoritatea browserelor permit gestionarea fișierelor cookies (Safari, Chrome, Firefox, Safari). Pentru pași exacți, vizitați secțiunile "Setări" sau "Preferințe" / "Confidențialitate" din browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">6. Securitate și confidențialitate</h2>
            <p>
              Cookie-urile nu sunt viruși. Ele folosesc formate de tip plain text și nu sunt alcătuite din bucăți de cod, deci nu pot fi executate și nu pot auto-rula. În general, browserele au integrate setări de confidențialitate care furnizează diferite nivele de acceptare a cookie-urilor, perioada de valabilitate și ștergere automată.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
