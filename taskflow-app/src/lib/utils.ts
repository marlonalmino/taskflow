import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getStatusBadge(status: 'TODO' | 'IN_PROGRESS' | 'DONE') {
  switch (status) {
    case 'TODO':
      return {
        label: 'To Do',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        dot: 'bg-amber-400',
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        dot: 'bg-indigo-400',
      };
    case 'DONE':
      return {
        label: 'Done',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-400',
      };
  }
}
