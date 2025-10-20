import { Task } from '../types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import Button from './ui/Button';

interface TaskTimelineProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onFocus?: (task: Task) => void;
  activeTaskId?: string;
}

const TaskTimeline = ({ tasks, onToggle, onDelete, onFocus, activeTaskId }: TaskTimelineProps) => {
  if (tasks.length === 0) {
    return <p className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-400">No tasks yet. Add a waypoint to get moving.</p>;
  }

  return (
    <ol className="relative space-y-4 border-l border-white/10 pl-6">
      {tasks.map((task, index) => {
        const isActive = task.id === activeTaskId;
        return (
          <li key={task.id} className="group relative">
            <span className={clsx('absolute -left-[13px] top-1.5 h-2.5 w-2.5 rounded-full border border-white/40', task.done ? 'bg-emerald-400 shadow-glow' : 'bg-black')} />
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={clsx(
                'flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 shadow-inner shadow-black/40 transition',
                task.done ? 'opacity-70' : 'opacity-100',
                isActive && 'ring-2 ring-primary/70'
              )}
            >
              <div>
                <p className={clsx('text-sm font-medium', task.done && 'line-through text-slate-400')}>{task.title}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{task.done ? 'Complete' : 'Pending'}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                {onFocus && (
                  <Button variant="ghost" size="sm" onClick={() => onFocus(task)}>
                    Focus
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggle(task.id)}
                  className="border-primary/40 text-xs text-primary"
                >
                  {task.done ? 'Reset' : 'Complete'}
                </Button>
                <button
                  className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-400 hover:border-rose-500/60 hover:text-rose-300"
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
};

export default TaskTimeline;
