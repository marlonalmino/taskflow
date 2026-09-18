'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { TaskFilters } from '@/components/tasks/task-filters';
import { TaskCard, TaskItem } from '@/components/tasks/task-card';
import { TaskForm } from '@/components/tasks/task-form';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast';
import { Plus, ListTodo, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TasksPage() {
  const { success, error } = useToast();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters and pagination state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '8',
        sortBy,
        order,
      });

      if (status) params.set('status', status);
      if (search.trim()) params.set('search', search.trim());

      const res = await api.get<TaskItem[]>(`/tasks?${params.toString()}`);
      setTasks(res.data);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalCount(res.meta.total || 0);
      }
    } catch {
      error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [page, status, search, sortBy, order, error]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFormSubmit = async (data: {
    title: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  }) => {
    if (editingTask) {
      await api.patch(`/tasks/${editingTask.id}`, data);
      success('Task updated successfully');
    } else {
      await api.post('/tasks', data);
      success('Task created successfully');
    }
    fetchTasks();
  };

  const handleStatusChange = async (
    id: string,
    newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE',
  ) => {
    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
      success('Status updated');
      fetchTasks();
    } catch {
      error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      success('Task deleted successfully');
      fetchTasks();
    } catch {
      error('Failed to delete task');
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Tasks"
        description="Organize, filter, and track all your workflow items in real-time."
        actions={
          <Button onClick={openCreateModal} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Task
          </Button>
        }
      />

      <div className="p-8 flex flex-col gap-6 max-w-7xl w-full mx-auto">
        {/* Filters and Controls */}
        <TaskFilters
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          status={status}
          onStatusChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          order={order}
          onOrderToggle={() =>
            setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          }
        />

        {/* Task Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <Card className="text-center py-16 border-dashed border-slate-800 bg-transparent">
            <ListTodo className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <CardTitle className="text-lg">No tasks found</CardTitle>
            <CardDescription className="max-w-md mx-auto mt-1">
              {search || status
                ? 'Try adjusting your search query or status filter to find what you need.'
                : 'Get started by creating your first task in this workspace.'}
            </CardDescription>
            <Button onClick={openCreateModal} size="sm" className="mt-5">
              <Plus className="w-4 h-4 mr-1.5" /> Create Task
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Pagination bar */}
        {!isLoading && tasks.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Showing page <span className="text-white font-medium">{page}</span>{' '}
              of <span className="text-white font-medium">{totalPages}</span> (
              {totalCount} tasks total)
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={editingTask}
      />
    </div>
  );
}
