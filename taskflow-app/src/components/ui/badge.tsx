import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'todo' | 'in_progress' | 'done' | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700/60',
    todo: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    in_progress: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    done: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    outline: 'bg-transparent text-slate-400 border-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
