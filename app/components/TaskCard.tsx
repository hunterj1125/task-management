import { Task } from '../types/task';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const priorityGlow = {
  low: 'shadow-blue-500/20',
  medium: 'shadow-yellow-500/20',
  high: 'shadow-red-500/20',
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-xl transition-shadow group relative cursor-grab active:cursor-grabbing ${priorityGlow[task.priority]}`}
    >
      {/* Animated gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        initial={false}
      />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-2 mb-2">
          <motion.h3 
            className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm"
            whileHover={{ x: 2 }}
          >
            {task.title}
          </motion.h3>
          <motion.span
            className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
            animate={{ 
              scale: task.priority === 'high' ? [1, 1.05, 1] : 1 
            }}
            transition={{ 
              duration: 2, 
              repeat: task.priority === 'high' ? Infinity : 0,
              repeatType: "reverse" 
            }}
          >
            {task.priority}
          </motion.span>
        </div>
      
      {task.description && (
        <motion.p 
          className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {task.description}
        </motion.p>
      )}
      
      {task.dueDate && (
        <motion.div 
          className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-500"
          whileHover={{ x: 2 }}
        >
          <motion.svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </motion.svg>
          <span>Due {format(task.dueDate, 'MMM d, yyyy')}</span>
        </motion.div>
      )}
      
      <motion.div 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1"
        initial={false}
        whileHover={{ scale: 1.05 }}
      >
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          title="Edit task"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </motion.button>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          title="Delete task"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </motion.button>
      </motion.div>
      </div>
    </motion.div>
  );
}
