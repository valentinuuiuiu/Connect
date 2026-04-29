import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-zinc-200 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 mb-4">Plată Efectuată!</h1>
        <p className="text-zinc-600 mb-8 leading-relaxed">
          Avansul a fost achitat. Vei primi factura prin Stripe pe adresa ta de email. Vom reveni noi sau ne poți scrie direct pe WhatsApp pentru pașii următori.
        </p>
        <Link 
          href="/"
          className="inline-flex justify-center items-center py-3 px-6 bg-zinc-900 text-white font-bold rounded-lg hover:bg-zinc-800 transition-colors w-full"
        >
          Înapoi la website
        </Link>
      </div>
    </div>
  );
}
