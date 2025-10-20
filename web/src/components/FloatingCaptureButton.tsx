import { motion } from 'framer-motion';
import { openQuickCapture } from '../hooks/useQuickCapture';
import { useHotkeys } from '../hooks/useHotkeys';

const FloatingCaptureButton = () => {
  useHotkeys('shift+c', (event) => {
    event.preventDefault();
    openQuickCapture();
  });

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => openQuickCapture()}
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-black shadow-glow"
      aria-label="Quick Capture"
    >
      ✦
    </motion.button>
  );
};

export default FloatingCaptureButton;
