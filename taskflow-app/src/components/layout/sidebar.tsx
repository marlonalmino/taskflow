'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Sparkles,
  Code2,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: 'Tasks',
      href: '/dashboard/tasks',
      icon: CheckSquare,
      active: pathname?.startsWith('/dashboard/tasks'),
    },
  ];

  return (
    <aside className="w-64 bg-[#0c111d] border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
          <span className="block text-[10px] font-medium text-indigo-400 tracking-wider uppercase">
            REST & Dashboard
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 flex flex-col gap-1.5">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                item.active
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  item.active
                    ? 'text-indigo-400'
                    : 'text-slate-500 group-hover:text-slate-300',
                )}
              />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
          Documentation
        </div>

        <a
          href="http://localhost:3001/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-200 group"
        >
          <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
          <span>Swagger Docs</span>
          <span className="ml-auto text-[10px] bg-indigo-950/60 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-800/40">
            OpenAPI
          </span>
        </a>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="bg-[#0f172a] rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            <p className="font-semibold text-slate-200">Production Build</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API Connected
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800"
          >
            <Code2 className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}
