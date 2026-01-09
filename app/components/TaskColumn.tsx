import { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const statusColors = {
  'todo': 'bg-zinc-100 dark:bg-zinc-800',
  'in-progress': 'bg-blue-100 dark:bg-blue-900/20',
  'done': 'bg-green-100 dark:bg-green-900/20',
};

export default function TaskColumn({ title, status, tasks, onEditTask, onDeleteTask }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <motion.div
      ref={setNodeRef}
      className={`flex flex-col gap-4 min-w-[300px] flex-1 transition-all rounded-xl p-5 border-2 ${
        isOver 
          ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 shadow-lg' 
          : 'bg-white/50 dark:bg-zinc-900/50 border-transparent backdrop-blur-sm'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <motion.h2 
          className="font-bold text-zinc-900 dark:text-zinc-100 text-xl"
          whileHover={{ scale: 1.05, x: 5 }}
        >
          {title}
        </motion.h2>
        <motion.span 
          className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[status]} text-zinc-700 dark:text-zinc-300 shadow-sm`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {tasks.length}
        </motion.span>
      </div>
      
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <motion.div 
          className="flex flex-col gap-3"
          layout
        >
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div 
                className="text-center py-12 text-sm text-zinc-400 dark:text-zinc-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
                <p className="mt-2">No tasks yet</p>
              </motion.div>
            ) : (
              tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <TaskCard 
                    task={task} 
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </SortableContext>
    </motion.div>
  );
}
