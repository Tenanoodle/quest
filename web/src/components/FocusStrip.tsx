import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

interface FocusStripProps {
  task: Task | null;
  onExit: () => void;
  onToggle: (taskId: string) => void;
}

const FocusStrip = ({ task, onExit, onToggle }: FocusStripProps) => {
  return (
    <AnimatePresence>
      {task && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-4xl items-center justify-between rounded-t-3xl border border-white/10 bg-black/80 px-6 py-4 shadow-2xl"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Focus Mode</p>
            <h3 className="mt-1 font-display text-2xl text-white">{task.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onExit}>
              Exit
            </Button>
            <Button onClick={() => onToggle(task.id)}>{task.done ? 'Reset' : 'Complete'}</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusStrip;
