import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'AutoConnect - Înmatriculări Auto Bulgaria',
  description: 'Proces complet de înmatriculare auto România-Bulgaria, transport, acte incluse.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ro" className={`${inter.variable}`}>
      <body className="bg-zinc-50 text-zinc-900 antialiased font-sans selection:bg-emerald-600/20" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
