import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Forja do Criterioso',
  description: 'Treine comando quando o impulso pedir alívio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#0d0d0d] text-[#f0f0f0] antialiased`}>
        <div className="min-h-screen pb-[72px]">
          <div className="max-w-[480px] mx-auto">
            {children}
          </div>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
