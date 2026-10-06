import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

/**
 * دکمه سراسری «بازگشت به بالا» — در تمام صفحات نمایش داده می‌شود
 * Global Back-to-top floating button with smooth scroll
 */
export const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 350);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.5, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 24 }}
          transition={{ type: 'spring', damping: 18, stiffness: 320 }}
          onClick={scrollToTop}
          title="بازگشت به بالا (Back to Top)"
          className="fixed bottom-6 left-6 z-50 group w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/40 flex items-center justify-center cursor-pointer hover:brightness-110 ring-2 ring-white/40 dark:ring-slate-700 backdrop-blur-sm animate-gradient-x"
        >
          <ChevronUp className={`w-6 h-6 transition-transform duration-300 group-hover:-translate-y-0.5 text-white dark:text-indigo-900`} strokeWidth={3.5} />
          {/* هاله نبضی */}
          <span className="absolute inset-0 rounded-2xl bg-emerald-400/40 -z-10 animate-ping" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
