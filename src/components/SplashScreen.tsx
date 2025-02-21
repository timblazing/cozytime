import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onVisibilityChange?: (visible: boolean) => void;
}

export function SplashScreen({ onVisibilityChange }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide navbar when splash screen mounts
    onVisibilityChange?.(false);

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Show navbar when splash screen disappears
      onVisibilityChange?.(true);
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, [onVisibilityChange]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <span className="text-7xl mb-4">🏕️</span>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl font-semibold text-white"
            >
              Cozytime
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
