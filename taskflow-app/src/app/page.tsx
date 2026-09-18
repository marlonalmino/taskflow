'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Database,
  Layers,
  BookOpen,
} from 'lucide-react';

export default function LandingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-violet-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Navigation */}
      <header className="h-20 border-b border-slate-800/60 px-8 flex items-center justify-between z-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3001/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/40 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            API Docs
          </a>

          {!isLoading && isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="sm">
                Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 z-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Production-Ready Architecture Portfolio Piece
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl">
          Scalable Task Architecture with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            NestJS & Next.js
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Full-stack task management showcasing secure JWT authentication with
          HttpOnly refresh token rotation, Prisma ORM with NeonDB PostgreSQL, and
          an interactive Next.js dashboard.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href={isAuthenticated ? '/dashboard' : '/register'}>
            <Button size="lg" className="px-8 font-semibold text-base">
              {isAuthenticated ? 'Open Dashboard' : 'Launch Demo Workspace'}{' '}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a
            href="http://localhost:3001/api/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="lg" className="text-base">
              <BookOpen className="w-4 h-4 mr-2" /> Explore Swagger Docs
            </Button>
          </a>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl bg-[#0f172a]/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Secure Auth Flow</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dual-token auth pattern: short-lived access JWT in-memory +
              HttpOnly cookie refresh token rotation with family revocation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f172a]/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">NeonDB PostgreSQL</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Cloud serverless database driven by Prisma ORM, migrations, and
              relational models for Users, Tasks, and RefreshTokens.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f172a]/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Next.js App Router</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              High-performance dashboard consuming clean REST endpoints with
              loading skeletons, toast alerts, and real-time metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f172a]/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">OpenAPI 3.0 Specs</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Automated Swagger documentation with interactive try-it-out
              capabilities and schema contract validation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 px-8 text-center text-xs text-slate-500 z-10">
        TaskFlow • Portfolio Piece built with NestJS, Next.js, Prisma & PostgreSQL
      </footer>
    </div>
  );
}
