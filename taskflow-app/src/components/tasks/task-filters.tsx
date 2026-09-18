'use client';

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  order: 'asc' | 'desc';
  onOrderToggle: () => void;
  counts?: {
    all: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  order,
  onOrderToggle,
  counts,
}: TaskFiltersProps) {
  const statusTabs = [
    { key: '', label: 'All', count: counts?.all },
    { key: 'TODO', label: 'To Do', count: counts?.todo },
    { key: 'IN_PROGRESS', label: 'In Progress', count: counts?.inProgress },
    { key: 'DONE', label: 'Done', count: counts?.done },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0f172a]/60 border border-slate-800/80 p-3.5 rounded-2xl">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter tasks by title or keyword..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#0c1222] border border-slate-800 text-slate-100 rounded-xl pl-10 pr-4 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Status Tabs */}
        <div className="flex items-center bg-[#0c1222] p-1 rounded-xl border border-slate-800">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onStatusChange(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                status === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    status === tab.key
                      ? 'bg-indigo-700/80 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-[#0c1222] border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 appearance-none pr-8 cursor-pointer"
            >
              <option value="createdAt">Date Created</option>
              <option value="updatedAt">Date Updated</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onOrderToggle}
            title={order === 'desc' ? 'Descending' : 'Ascending'}
            className="p-2 bg-[#0c1222] border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="uppercase text-[10px]">{order}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
