import { useState } from 'react';
import { Milestone, Task } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import TaskTimeline from './TaskTimeline';

interface MilestoneCardProps {
  milestone: Milestone;
  onAddTask: (milestoneId: string, title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onRemoveMilestone: (milestoneId: string) => void;
  onFocusTask?: (task: Task) => void;
  activeTaskId?: string;
}

const MilestoneCard = ({
  milestone,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onRemoveMilestone,
  onFocusTask,
  activeTaskId
}: MilestoneCardProps) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(milestone.id, title.trim());
    setTitle('');
  };

  return (
    <Card className="space-y-4 bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl text-white">{milestone.title}</h3>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Milestone</p>
        </div>
        <button
          className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 hover:border-rose-500/60 hover:text-rose-300"
          onClick={() => onRemoveMilestone(milestone.id)}
        >
          Remove
        </button>
      </div>

      <TaskTimeline
        tasks={milestone.tasks}
        onToggle={onToggleTask}
        onDelete={onDeleteTask}
        onFocus={onFocusTask}
        activeTaskId={activeTaskId}
      />

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          className="flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          placeholder="Add waypoint"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" size="sm" disabled={!title.trim()}>
          Add
        </Button>
      </form>
    </Card>
  );
};

export default MilestoneCard;
