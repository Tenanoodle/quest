import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { milestonesApi, questsApi, tasksApi } from '../api/client';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import TaskTimeline from '../components/TaskTimeline';
import MilestoneCard from '../components/MilestoneCard';
import FocusStrip from '../components/FocusStrip';
import { Task } from '../types';
import { pushToast } from '../components/ui/Toast';
import { useHotkeys } from '../hooks/useHotkeys';

const QuestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const questQuery = useQuery({
    queryKey: ['quest', id],
    queryFn: () => questsApi.get(id as string),
    enabled: Boolean(id)
  });
  const [taskTitle, setTaskTitle] = useState('');
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  const quest = questQuery.data;

  const toggleTaskMutation = useMutation(tasksApi.toggle, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest', id] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    }
  });

  const deleteTaskMutation = useMutation(tasksApi.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest', id] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      pushToast({ title: 'Task removed' });
    }
  });

  const addQuestTaskMutation = useMutation(
    (title: string) => questsApi.addTask(id as string, { title }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['quest', id] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
        setTaskTitle('');
        pushToast({ title: 'Waypoint added' });
      },
      onError: () => pushToast({ title: 'Failed to add task', variant: 'error' })
    }
  );

  const addMilestoneMutation = useMutation(
    (title: string) => questsApi.addMilestone(id as string, { title }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['quest', id] });
        pushToast({ title: 'Milestone added' });
      },
      onError: () => pushToast({ title: 'Failed to add milestone', variant: 'error' })
    }
  );

  const addMilestoneTaskMutation = useMutation(
    ({ milestoneId, title }: { milestoneId: string; title: string }) =>
      milestonesApi.addTask(milestoneId, { title }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['quest', id] });
        pushToast({ title: 'Waypoint added' });
      }
    }
  );

  const removeMilestoneMutation = useMutation(milestonesApi.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest', id] });
      pushToast({ title: 'Milestone removed' });
    }
  });

  useHotkeys('f', (event) => {
    event.preventDefault();
    if (focusTask) {
      setFocusTask(null);
    } else if (quest) {
      const incomplete = [...quest.tasks, ...quest.milestones.flatMap((m) => m.tasks)].find((t) => !t.done);
      if (incomplete) {
        setFocusTask(incomplete);
      }
    }
  }, [focusTask, quest]);

  const combinedTasks = useMemo(() => {
    if (!quest) return [] as Task[];
    return [...quest.tasks, ...quest.milestones.flatMap((m) => m.tasks)];
  }, [quest]);

  const handleToggleTask = (taskId: string) => {
    toggleTaskMutation.mutate(taskId);
    if (focusTask?.id === taskId) {
      setFocusTask((current) => (current ? { ...current, done: !current.done } : current));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
    if (focusTask?.id === taskId) {
      setFocusTask(null);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addQuestTaskMutation.mutate(taskTitle.trim());
  };

  const handleAddMilestone = () => {
    const title = prompt('Name your milestone');
    if (!title) return;
    addMilestoneMutation.mutate(title);
  };

  if (questQuery.isLoading) {
    return <p className="text-slate-400">Loading quest data…</p>;
  }

  if (!quest) {
    return (
      <Card className="bg-white/5 text-center text-slate-300">
        <p>Quest not found.</p>
        <Link to="/" className="mt-4 inline-block text-primary">
          Return to Mission Control
        </Link>
      </Card>
    );
  }

  const progress = quest.progress ?? { done: 0, total: 0 };

  return (
    <div className="space-y-10 pb-20">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-4 bg-white/5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl text-white">{quest.title}</h2>
            <Button variant="ghost" onClick={handleAddMilestone}>
              Add Milestone
            </Button>
          </div>
          <p className="max-w-2xl text-sm text-slate-300">{quest.description || 'Chart your path to success.'}</p>
          <div className="space-y-2">
            <ProgressBar value={progress.done} max={progress.total || 1} />
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {progress.done}/{progress.total} objectives completed
            </p>
          </div>
          <form onSubmit={handleAddTask} className="flex gap-3">
            <input
              className="flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
              placeholder="Add waypoint"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <Button type="submit" disabled={!taskTitle.trim()}>
              Add
            </Button>
          </form>
        </Card>
        <Card className="bg-white/5">
          <h3 className="font-display text-xl text-white">Mission Stats</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Total tasks: {combinedTasks.length}</li>
            <li>Completed: {combinedTasks.filter((t) => t.done).length}</li>
            <li>Milestones: {quest.milestones.length}</li>
            <li>Priority Level: P{quest.priority}</li>
          </ul>
        </Card>
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-white">Mission Timeline</h3>
          <p className="text-sm text-slate-400">Track every waypoint until launch.</p>
        </div>
        <TaskTimeline
          tasks={quest.tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onFocus={(task) => setFocusTask(task)}
          activeTaskId={focusTask?.id}
        />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-white">Milestones</h3>
          <Button variant="ghost" onClick={handleAddMilestone}>
            Add Milestone
          </Button>
        </div>
        {quest.milestones.length === 0 ? (
          <Card className="bg-white/5 p-8 text-center text-slate-400">
            No milestones yet. Break your quest into major beats to stay on course.
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {quest.milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onAddTask={(milestoneId, title) =>
                  addMilestoneTaskMutation.mutate({ milestoneId, title })
                }
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onRemoveMilestone={(milestoneId) => removeMilestoneMutation.mutate(milestoneId)}
                onFocusTask={(task) => setFocusTask(task)}
                activeTaskId={focusTask?.id}
              />
            ))}
          </div>
        )}
      </section>

      <FocusStrip
        task={focusTask}
        onExit={() => setFocusTask(null)}
        onToggle={handleToggleTask}
      />
    </div>
  );
};

export default QuestDetail;
