import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowManager } from '../../hooks/useWindowManager';
import Window from './Window';

export default function WindowManager() {
  const { windows } = useWindowManager();

  // We filter out minimized windows here or handle them in the animation logic 
  // since Rnd manages its own wrapper. 
  // Actually, Window.jsx handles isMinimized by returning null. 
  // AnimatePresence will trigger exit animations when unmounted.
  const activeWindows = windows.filter(w => !w.isMinimized);

  return (
    <>
      <AnimatePresence>
        {activeWindows.map(w => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 150, transition: { duration: 0.25, ease: 'easeIn' } }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
              <Window windowData={w} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
