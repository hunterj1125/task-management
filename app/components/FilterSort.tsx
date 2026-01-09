'use client';

import { TaskPriority } from '../types/task';
import { motion } from 'framer-motion';

interface FilterSortProps {
  selectedPriority: TaskPriority | 'all';
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  onSortChange: (sortBy: 'dueDate' | 'priority' | 'createdAt') => void;
}

export default function FilterSort({
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
}: FilterSortProps) {
  return (
    <motion.div 
      className="flex flex-wrap gap-4 mb-6 p-5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm rounded-xl border-2 border-zinc-200 dark:border-zinc-800 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.2)' }}
    >
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
      >
        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
          🎯 Filter by Priority:
        </label>
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
          className="px-4 py-2 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold cursor-pointer"
        >
          <option value="all">✨ All</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </motion.div>

      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
      >
        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
          📊 Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'dueDate' | 'priority' | 'createdAt')}
          className="px-4 py-2 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold cursor-pointer"
        >
          <option value="createdAt">📅 Created Date</option>
          <option value="dueDate">⏰ Due Date</option>
          <option value="priority">⚡ Priority</option>
        </select>
      </motion.div>
    </motion.div>
  );
}
