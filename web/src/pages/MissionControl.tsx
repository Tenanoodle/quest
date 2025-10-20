import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inboxApi, questsApi } from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import QuestCard from '../components/QuestCard';
import { pushToast } from '../components/ui/Toast';
import { useHotkeys } from '../hooks/useHotkeys';

const MissionControl = () => {
  const queryClient = useQueryClient();
  const { data: quests = [] } = useQuery({ queryKey: ['quests'], queryFn: questsApi.list });
  const { data: inbox = [] } = useQuery({ queryKey: ['inbox'], queryFn: inboxApi.list });
  const [captureText, setCaptureText] = useState('');
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [selectedQuestMap, setSelectedQuestMap] = useState<Record<string, string>>({});
  const [questForm, setQuestForm] = useState({
    title: '',
    description: '',
    priority: 3,
    dueDate: ''
  });

  useHotkeys('n', (event) => {
    event.preventDefault();
    setShowQuestForm(true);
  }, []);

  const captureMutation = useMutation(inboxApi.create, {
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['inbox'] });
      const previous = queryClient.getQueryData(['inbox']);
      queryClient.setQueryData(['inbox'], (old: any) => [
        { id: `temp-${Date.now()}`, text: payload.text, createdAt: new Date().toISOString() },
        ...(old ?? [])
      ]);
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(['inbox'], context.previous);
      pushToast({ title: 'Capture failed', variant: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      pushToast({ title: 'Added to Inbox' });
    }
  });

  const createQuestMutation = useMutation(questsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      setQuestForm({ title: '', description: '', priority: 3, dueDate: '' });
      setShowQuestForm(false);
      pushToast({ title: 'Quest Created' });
    },
    onError: () => {
      pushToast({ title: 'Failed to create quest', variant: 'error' });
    }
  });

  const deleteInboxMutation = useMutation(inboxApi.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      pushToast({ title: 'Inbox item cleared' });
    }
  });

  const promoteMutation = useMutation(
    ({ id, questId }: { id: string; questId?: string }) => inboxApi.promote(id, questId ? { questId } : {}),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inbox'] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
        pushToast({ title: 'Promoted to task' });
      },
      onError: () => pushToast({ title: 'Promotion failed', variant: 'error' })
    }
  );

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureText.trim()) return;
    captureMutation.mutate({ text: captureText.trim() });
    setCaptureText('');
  };

  const handleQuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questForm.title.trim()) return;
    createQuestMutation.mutate({
      title: questForm.title.trim(),
      description: questForm.description || undefined,
      priority: questForm.priority,
      dueDate: questForm.dueDate ? new Date(questForm.dueDate).toISOString() : undefined
    });
  };

  const emptyState = quests.length === 0;

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-4 bg-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-white">Quick Capture</h2>
              <p className="text-sm text-slate-400">Use Quick Capture to send thoughts here…</p>
            </div>
          </div>
          <form onSubmit={handleCaptureSubmit} className="flex gap-3">
            <input
              className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
              placeholder="Use Quick Capture to send thoughts here…"
              value={captureText}
              onChange={(e) => setCaptureText(e.target.value)}
            />
            <Button type="submit" disabled={!captureText.trim()}>
              Capture
            </Button>
          </form>
          <div className="space-y-3">
            {inbox.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
                Nothing in the inbox. Beam in ideas with Quick Capture.
              </p>
            ) : (
              inbox.map((item) => (
                <div key={item.id} className="flex flex-col rounded-2xl border border-white/5 bg-black/30 p-4 text-sm text-slate-200 md:flex-row md:items-center md:justify-between">
                  <p>{item.text}</p>
                  <div className="mt-3 flex items-center gap-2 md:mt-0">
                    <select
                      className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-slate-200"
                      value={selectedQuestMap[item.id] ?? ''}
                      onChange={(e) =>
                        setSelectedQuestMap((prev) => ({
                          ...prev,
                          [item.id]: e.target.value
                        }))
                      }
                    >
                      <option value="">New Quest</option>
                      {quests.map((quest) => (
                        <option key={quest.id} value={quest.id}>
                          {quest.title}
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      onClick={() =>
                        promoteMutation.mutate({ id: item.id, questId: selectedQuestMap[item.id] || undefined })
                      }
                    >
                      Promote
                    </Button>
                    <button
                      onClick={() => deleteInboxMutation.mutate(item.id)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 hover:border-rose-500/60 hover:text-rose-300"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
        <Card className="space-y-4 bg-white/5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl text-white">Launch New Quest</h2>
              <p className="text-sm text-slate-400">Set a priority and due date to keep momentum.</p>
            </div>
            <Button variant="ghost" onClick={() => setShowQuestForm((prev) => !prev)}>
              {showQuestForm ? 'Close' : 'New'}
            </Button>
          </div>
          {showQuestForm && (
            <form onSubmit={handleQuestSubmit} className="space-y-3">
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                placeholder="Quest title"
                value={questForm.title}
                onChange={(e) => setQuestForm((form) => ({ ...form, title: e.target.value }))}
              />
              <textarea
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                placeholder="Description"
                value={questForm.description}
                onChange={(e) => setQuestForm((form) => ({ ...form, description: e.target.value }))}
              />
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Priority</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="mt-1 w-full rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                    value={questForm.priority}
                    onChange={(e) => setQuestForm((form) => ({ ...form, priority: Number(e.target.value) }))}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Due</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                    value={questForm.dueDate}
                    onChange={(e) => setQuestForm((form) => ({ ...form, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!questForm.title.trim()}>
                Launch Quest
              </Button>
            </form>
          )}
        </Card>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-white">Active Quests</h2>
          <p className="text-sm text-slate-400">{quests.length} quests in motion</p>
        </div>
        {emptyState ? (
          <Card className="flex flex-col items-center justify-center gap-3 bg-white/5 py-12 text-center text-slate-400">
            <p>No quests yet. Launch your first mission to begin.</p>
            <Button onClick={() => setShowQuestForm(true)}>Launch Quest</Button>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MissionControl;
