'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/toast';
import { TaskForm } from '@/components/tasks/task-form';
import { TaskCard, TaskItem } from '@/components/tasks/task-card';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  completionRate: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTasks, setRecentTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, tasksRes] = await Promise.all([
        api.get<Stats>('/tasks/stats'),
        api.get<TaskItem[]>('/tasks?limit=4&sortBy=createdAt&order=desc'),
      ]);
      setStats(statsRes.data);
      setRecentTasks(tasksRes.data);
    } catch {
      error('Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  }) => {
    await api.post('/tasks', data);
    success('Task created successfully');
    loadDashboardData();
  };

  const handleStatusChange = async (
    id: string,
    newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE',
  ) => {
    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
      success('Status updated');
      loadDashboardData();
    } catch {
      error('Failed to update task status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      success('Task deleted');
      loadDashboardData();
    } catch {
      error('Failed to delete task');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={`Welcome, ${user?.name?.split(' ')[0] || 'User'}`}
        description="Here is an overview of your project progress and workflow metrics."
        actions={
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Task
          </Button>
        }
      />

      <div className="p-8 flex flex-col gap-8 max-w-7xl w-full mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total */}
          <Card className="border-slate-800/80 bg-[#0f172a]/70 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Tasks
              </span>
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                <ListTodo className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {stats?.total ?? 0}
                </span>
              )}
              <p className="text-[11px] text-slate-500 mt-1">
                Active workflow backlog
              </p>
            </div>
          </Card>

          {/* In Progress */}
          <Card className="border-slate-800/80 bg-[#0f172a]/70 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                In Progress
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-extrabold text-indigo-400 tracking-tight">
                  {stats?.inProgress ?? 0}
                </span>
              )}
              <p className="text-[11px] text-slate-500 mt-1">Currently active</p>
            </div>
          </Card>

          {/* Completed */}
          <Card className="border-slate-800/80 bg-[#0f172a]/70 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Done
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                  {stats?.done ?? 0}
                </span>
              )}
              <p className="text-[11px] text-slate-500 mt-1">Tasks resolved</p>
            </div>
          </Card>

          {/* Completion Rate */}
          <Card className="border-slate-800/80 bg-[#0f172a]/70 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Completion Rate
              </span>
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <span className="text-3xl font-extrabold text-violet-400 tracking-tight">
                  {stats?.completionRate ?? 0}%
                </span>
              )}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats?.completionRate || 0}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Tasks Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              <p className="text-xs text-slate-400">
                Recently updated tasks in your project
              </p>
            </div>

            <Link
              href="/dashboard/tasks"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View All Tasks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <Card className="text-center py-12 border-dashed border-slate-800 bg-transparent">
              <ListTodo className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <CardTitle className="text-base">No tasks created yet</CardTitle>
              <CardDescription className="max-w-xs mx-auto mt-1">
                Create your first task to start tracking progress on this
                dashboard.
              </CardDescription>
              <Button
                onClick={() => setIsCreateOpen(true)}
                size="sm"
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Create First Task
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onEdit={() => {}}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskForm
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
