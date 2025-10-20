import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inboxApi } from '../api/client';
import Button from './ui/Button';
import { useQuickCapture, openQuickCapture, closeQuickCapture } from '../hooks/useQuickCapture';
import { useHotkeys } from '../hooks/useHotkeys';
import { pushToast } from './ui/Toast';

const QuickCapture = () => {
  const { isOpen, close } = useQuickCapture();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');

  useHotkeys(['meta+k', 'ctrl+k'], (event) => {
    event.preventDefault();
    setText('');
    openQuickCapture();
  }, []);

  useHotkeys('esc', () => closeQuickCapture(), [close]);

  useEffect(() => {
    if (!isOpen) {
      setText('');
    }
  }, [isOpen]);

  const mutation = useMutation(inboxApi.create, {
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
      if (context?.previous) {
        queryClient.setQueryData(['inbox'], context.previous);
      }
      pushToast({ title: 'Capture failed', variant: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      pushToast({ title: 'Captured to Inbox' });
    },
    onSettled: () => {
      closeQuickCapture();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    mutation.mutate({ text: text.trim() });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="glass-card w-full max-w-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                <Dialog.Title className="mb-4 text-lg font-semibold text-white">Quick Capture</Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    className="h-32 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                    placeholder="Use Quick Capture to send thoughts here…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => closeQuickCapture()}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!text.trim()}>
                      Beam to Inbox
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default QuickCapture;
