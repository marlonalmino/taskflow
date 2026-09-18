import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#090d16] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="TaskFlow Logo"
            width={44}
            height={44}
            className="rounded-2xl object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            priority
          />
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </Link>
        <p className="text-xs text-slate-400">
          Scalable Task Architecture & Dashboard
        </p>
      </div>

      {/* Card container */}
      <div className="w-full max-w-md z-10">{children}</div>

      <p className="mt-8 text-xs text-slate-600 text-center">
        Demo Portfolio Piece • NestJS REST API + Next.js App Router
      </p>
    </div>
  );
}
