import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TaskFlow — Modern Task & Workflow Management',
  description:
    'A production-ready task management dashboard with real-time stats, JWT auth, and intuitive CRUD controls.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

import { Providers } from '@/components/providers';
import { ServerStatusBanner } from '@/components/layout/server-status-banner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen flex flex-col">
        <ServerStatusBanner />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
