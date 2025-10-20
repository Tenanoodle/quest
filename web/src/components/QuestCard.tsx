import { motion } from 'framer-motion';
import Card from './ui/Card';
import PriorityBadge from './ui/PriorityBadge';
import ProgressBar from './ui/ProgressBar';
import { Quest } from '../types';
import { Link } from 'react-router-dom';

interface QuestCardProps {
  quest: Quest & { progress?: { done: number; total: number } };
}

const QuestCard = ({ quest }: QuestCardProps) => {
  const progress = quest.progress ?? { done: 0, total: 0 };
  const dueDate = quest.dueDate ? new Date(quest.dueDate).toLocaleDateString() : 'No due date';
  const summary = `${progress.done}/${progress.total} tasks`;

  return (
    <motion.div whileHover={{ translateY: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
      <Link to={`/quest/${quest.id}`}>
        <Card className="h-full cursor-pointer bg-white/5 backdrop-blur">
          <div className="flex items-center justify-between">
            <PriorityBadge priority={quest.priority} />
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Due {dueDate}</span>
          </div>
          <h3 className="mt-4 font-display text-2xl text-white">{quest.title}</h3>
          {quest.description && <p className="mt-2 text-sm text-slate-300">{quest.description}</p>}
          <div className="mt-6">
            <ProgressBar value={progress.done} max={progress.total || 1} />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{summary}</span>
              <span>Open Quest →</span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default QuestCard;
