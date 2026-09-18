'use client';

import React from 'react';
import { UserMenu } from './user-menu';

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  return (
    <header className="h-20 border-b border-slate-800/80 px-8 flex items-center justify-between bg-[#090d16]/70 backdrop-blur-md sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {actions}
        <div className="h-6 w-px bg-slate-800" />
        <UserMenu />
      </div>
    </header>
  );
}
