'use client';

import { useState, useEffect } from 'react';
import { Task, TaskPriority } from './types/task';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';
import FilterSort from './components/FilterSort';
import { DndContext, DragEndEvent, DragOverEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { motion } from 'framer-motion';

// Sample data for initial display
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design landing page',
    description: 'Create wireframes and mockups for the new landing page',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2026-01-15'),
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: '2',
    title: 'Setup database',
    description: 'Configure PostgreSQL and create initial schema',
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2026-01-10'),
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: '3',
    title: 'Write documentation',
    description: 'Document the API endpoints and usage examples',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date('2026-01-06'),
    updatedAt: new Date('2026-01-06'),
  },
  {
    id: '4',
    title: 'Code review',
    description: 'Review pull requests from team members',
    status: 'done',
    priority: 'low',
    createdAt: new Date('2026-01-04'),
    updatedAt: new Date('2026-01-06'),
  },
];

const STORAGE_KEY = 'task-management-tasks';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const tasksWithDates = parsed.map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
      setTasks(tasksWithDates);
    } else {
      // Use sample tasks if no saved tasks
      setTasks(sampleTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setIsFormOpen(false);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    
    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id
        ? { ...taskData, id: task.id, createdAt: task.createdAt, updatedAt: new Date() }
        : task
    );
    setTasks(updatedTasks);
    setEditingTask(undefined);
    setIsFormOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task
      )
    );
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter((task) =>
    selectedPriority === 'all' ? true : task.priority === selectedPriority
  );

  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  };

  const todoTasks = sortTasks(filteredTasks.filter((task) => task.status === 'todo'));
  const inProgressTasks = sortTasks(filteredTasks.filter((task) => task.status === 'in-progress'));
  const doneTasks = sortTasks(filteredTasks.filter((task) => task.status === 'done'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-zinc-950 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl"
          animate={{
            x: [-50, 50, -50],
            y: [-50, 50, -50],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.header 
          className="mb-8 flex items-start justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h1 
              className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              Task Management
            </motion.h1>
            <motion.p 
              className="text-lg text-zinc-600 dark:text-zinc-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ✨ Organize your tasks and boost productivity
            </motion.p>
          </div>
          <motion.button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </motion.button>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FilterSort
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </motion.div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <motion.div 
            className="flex gap-6 overflow-x-auto pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, staggerChildren: 0.1 }}
          >
            <TaskColumn 
              title="To Do" 
              status="todo" 
              tasks={todoTasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn 
              title="In Progress" 
              status="in-progress" 
              tasks={inProgressTasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn 
              title="Done" 
              status="done" 
              tasks={doneTasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          </motion.div>
        </DndContext>
      </div>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
