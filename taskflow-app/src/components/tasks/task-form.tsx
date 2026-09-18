'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { TaskItem } from './task-card';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  }) => Promise<void>;
  task?: TaskItem | null;
}

export function TaskForm({ isOpen, onClose, onSubmit, task }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
    }
    setError('');
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      });
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string }).message || 'Failed to save task';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      description={
        task
          ? 'Update the details and current progress of this task.'
          : 'Add a new task to your project workflow queue.'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <Input
          label="Title"
          placeholder="e.g. Implement refresh token rotation"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
          disabled={isLoading}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">
            Description
          </label>
          <textarea
            className="w-full bg-[#0c1222] border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 min-h-[90px] resize-none"
            placeholder="Detailed notes, requirements or acceptance criteria..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">
            Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['TODO', 'IN_PROGRESS', 'DONE'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  status === s
                    ? s === 'TODO'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : s === 'IN_PROGRESS'
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {s === 'TODO'
                  ? 'To Do'
                  : s === 'IN_PROGRESS'
                  ? 'In Progress'
                  : 'Done'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
