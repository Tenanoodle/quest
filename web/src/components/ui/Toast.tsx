import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant?: 'success' | 'error';
}

let idCounter = 0;
const toastTarget = new EventTarget();

export const pushToast = (message: Omit<ToastMessage, 'id'>) => {
  toastTarget.dispatchEvent(new CustomEvent('toast', { detail: { ...message, id: ++idCounter } }));
};

const Toast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<ToastMessage>;
      const toast = custom.detail;
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    toastTarget.addEventListener('toast', handler);
    return () => toastTarget.removeEventListener('toast', handler);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card pointer-events-auto w-72 rounded-2xl border border-white/10 p-4 shadow-lg shadow-black/30"
          >
            <p className="text-sm font-semibold text-white">{toast.title}</p>
            {toast.description && <p className="text-xs text-slate-300">{toast.description}</p>}
            <div
              className={`mt-2 h-1 w-full rounded-full ${
                toast.variant === 'error' ? 'bg-rose-500/60' : 'bg-emerald-400/60'
              }`}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
