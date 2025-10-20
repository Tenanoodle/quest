import clsx from 'clsx';

const priorityColors: Record<number, string> = {
  1: 'bg-rose-500/20 text-rose-200',
  2: 'bg-orange-500/20 text-orange-200',
  3: 'bg-amber-500/20 text-amber-200',
  4: 'bg-emerald-500/20 text-emerald-200',
  5: 'bg-sky-500/20 text-sky-200'
};

interface PriorityBadgeProps {
  priority: number;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => (
  <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', priorityColors[priority] ?? priorityColors[3])}>
    P{priority}
  </span>
);

export default PriorityBadge;
