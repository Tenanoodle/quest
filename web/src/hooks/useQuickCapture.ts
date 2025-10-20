import { useCallback, useEffect, useState } from 'react';

type QuickCaptureEvent = 'open' | 'close' | 'toggle';

const target = new EventTarget();

const emit = (type: QuickCaptureEvent) => {
  target.dispatchEvent(new CustomEvent(type));
};

export const openQuickCapture = () => emit('open');
export const closeQuickCapture = () => emit('close');
export const toggleQuickCapture = () => emit('toggle');

export function useQuickCapture() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleToggle = () => setIsOpen((prev) => !prev);

    target.addEventListener('open', handleOpen);
    target.addEventListener('close', handleClose);
    target.addEventListener('toggle', handleToggle);
    return () => {
      target.removeEventListener('open', handleOpen);
      target.removeEventListener('close', handleClose);
      target.removeEventListener('toggle', handleToggle);
    };
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
