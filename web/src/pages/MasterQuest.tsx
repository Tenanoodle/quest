import { useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { questsApi } from '../api/client';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { pushToast } from '../components/ui/Toast';

const MasterQuest = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: quest, isLoading } = useQuery({
    queryKey: ['quest', id],
    queryFn: () => questsApi.get(id as string),
    enabled: Boolean(id)
  });

  const addMilestoneMutation = useMutation(
    (title: string) => questsApi.addMilestone(id as string, { title }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['quest', id] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
        pushToast({ title: 'Milestone added' });
      },
      onError: () => pushToast({ title: 'Failed to add milestone', variant: 'error' })
    }
  );

  const handleAddMilestone = () => {
    const title = prompt('Name your milestone');
    if (!title) return;
    addMilestoneMutation.mutate(title);
  };

  if (isLoading) {
    return <p className="text-slate-400">Loading master quest…</p>;
  }

  if (!quest) {
    return (
      <Card className="bg-white/5 text-center text-slate-300">
        <p>Master quest not found.</p>
        <Link to="/" className="mt-4 inline-block text-primary">
          Return to Mission Control
        </Link>
      </Card>
    );
  }

  const overallProgress = quest.progress ?? { done: 0, total: 0 };

  return (
    <div className="space-y-12">
      <Card className="space-y-6 bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Master Quest</p>
            <h1 className="font-display text-3xl text-white">{quest.title}</h1>
          </div>
          <Button onClick={handleAddMilestone}>Add Milestone</Button>
        </div>
        <p className="max-w-2xl text-sm text-slate-300">{quest.description || 'Command the overarching mission and watch progress roll in.'}</p>
        <div className="space-y-2">
          <ProgressBar value={overallProgress.done} max={overallProgress.total || 1} />
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {overallProgress.done}/{overallProgress.total} tasks complete
          </p>
        </div>
      </Card>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-white">Milestones</h2>
          <p className="text-sm text-slate-400">{quest.milestones.length} phases engaged</p>
        </div>
        {quest.milestones.length === 0 ? (
          <Card className="bg-white/5 p-8 text-center text-slate-400">
            No milestones yet. Break the master quest into sub-missions.
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {quest.milestones.map((milestone) => {
              const total = milestone.tasks.length;
              const done = milestone.tasks.filter((task) => task.done).length;
              return (
                <Card key={milestone.id} className="space-y-4 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Milestone</p>
                      <h3 className="font-display text-xl text-white">{milestone.title}</h3>
                    </div>
                    <span className="text-xs text-slate-400">{done}/{total}</span>
                  </div>
                  <ProgressBar value={done} max={total || 1} />
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MasterQuest;
