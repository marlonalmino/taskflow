'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusBadge } from '@/lib/utils';
import { Calendar, MoreVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusInfo = getStatusBadge(task.status);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="group relative bg-[#0f172a]/80 hover:bg-[#0f172a] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg shadow-black/10 hover:shadow-indigo-950/20 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <Badge
            variant={task.status.toLowerCase() as 'todo' | 'in_progress' | 'done'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </Badge>

          {/* Quick menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors opacity-80 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-[#141d33] border border-slate-800 rounded-xl shadow-xl py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Task
                </button>
                <div className="h-px bg-slate-800 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(task.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>

        <h4 className="font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors text-base line-clamp-1">
          {task.title}
        </h4>

        {task.description ? (
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        ) : (
          <p className="text-xs text-slate-600 italic mt-2">No description provided</p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <Calendar className="w-3 h-3" />
          {formatDate(task.createdAt)}
        </span>

        {/* Status transition actions */}
        <div className="flex items-center gap-1">
          {task.status !== 'TODO' && (
            <button
              onClick={() => onStatusChange(task.id, 'TODO')}
              title="Move to To Do"
              className="text-[10px] px-2 py-0.5 rounded text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-colors"
            >
              To Do
            </button>
          )}
          {task.status !== 'IN_PROGRESS' && (
            <button
              onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
              title="Move to In Progress"
              className="text-[10px] px-2 py-0.5 rounded text-indigo-400/80 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-colors"
            >
              Progress
            </button>
          )}
          {task.status !== 'DONE' && (
            <button
              onClick={() => onStatusChange(task.id, 'DONE')}
              title="Mark as Done"
              className="text-[10px] px-2 py-0.5 rounded text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
