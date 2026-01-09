'use client';

import { useState, FormEvent } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div 
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <motion.h2 
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {task ? '✏️ Edit Task' : '✨ Create New Task'}
          </motion.h2>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter task title"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Enter task description"
              />
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-4 py-2.5 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="todo">📋 To Do</option>
                  <option value="in-progress">⚡ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full px-4 py-2.5 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="dueDate"
                className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
              >
                📅 Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </motion.div>
          </div>

          <motion.div 
            className="flex gap-3 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all font-semibold shadow-lg"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              {task ? '💾 Update' : '🚀 Create'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
