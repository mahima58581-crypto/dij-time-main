import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';

interface QuranicWelcomeScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const QuranicWelcomeScreen: React.FC<QuranicWelcomeScreenProps> = ({
  onComplete,
  durationMs = 4000
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(Math.ceil(durationMs / 1000));
  const [progress, setProgress] = useState<number>(0);
  
  // Prevent re-render loop by capturing onComplete in a ref
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const startTime = Date.now();

    // 1. Guaranteed timeout to fire onComplete exactly after durationMs
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, durationMs);

    // 2. Interval for smooth progress bar and countdown display
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(currentProgress);

      const remainingSeconds = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
      setTimeLeft(remainingSeconds);
    }, 40);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [durationMs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden bg-[#020a07] text-white selection:bg-emerald-500 selection:text-black select-none"
    >
      {/* 1. Deep Cyber Emerald Ambient Lighting Effects (Matching Website Theme) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/60 via-[#03130d]/95 to-[#010604] pointer-events-none" />
      
      {/* Radiant Emerald & Mint Auras */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-teal-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Cyber Emerald Grid Dots Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

      {/* 2. Rotating Islamic Sacred Star Octagram in Brilliant Emerald */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] pointer-events-none opacity-25"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-emerald-400 fill-none" strokeWidth="0.6">
          <circle cx="100" cy="100" r="92" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="78" strokeWidth="0.8" />
          <rect x="36" y="36" width="128" height="128" rx="8" transform="rotate(45 100 100)" />
          <rect x="36" y="36" width="128" height="128" rx="8" />
        </svg>
      </motion.div>

      {/* 3. Central Calligraphy Shrine Card in Green & Gold Accents */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-5 sm:px-6 py-8 flex flex-col items-center text-center">
        
        {/* Top Sacred Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-4 sm:mb-6 flex flex-col items-center"
        >
          {/* Emerald Glow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.35)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-bold">بَرَكَةُ الرِّزْقِ وَالتَّوْفِيق</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>

          <h2 className="mt-4 text-base sm:text-xl font-['Amiri',serif] text-emerald-200/90 tracking-wider font-bold">
            بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
          </h2>
        </motion.div>

        {/* Central Quranic Verse Card in Emerald Cyber Theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          className="relative my-3 sm:my-5 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-[#041a12]/80 to-[#020d09]/90 border border-emerald-500/35 backdrop-blur-xl shadow-[0_0_60px_rgba(16,185,129,0.25)] max-w-3xl w-full"
        >
          {/* Ornamental Emerald Corner Accents */}
          <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-emerald-400/80 rounded-tr-lg shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-emerald-400/80 rounded-tl-lg shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-emerald-400/80 rounded-br-lg shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-emerald-400/80 rounded-bl-lg shadow-[0_0_8px_rgba(16,185,129,0.5)]" />

          {/* Ornamental Opening Bracket */}
          <span className="text-3xl sm:text-4xl text-emerald-400/80 font-['Amiri',serif] block mb-1">
            ﴿
          </span>

          {/* The Holy Quranic Verse in Glorious Emerald Calligraphy */}
          <h1 
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-['Amiri_Quran','Amiri','Aref_Ruqaa',serif] font-bold leading-relaxed sm:leading-[1.7] md:leading-[1.8] bg-gradient-to-r from-emerald-100 via-emerald-300 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(16,185,129,0.7)] px-2"
            dir="rtl"
          >
            إِنَّ اللَّهَ يَرْزُقُ مَن يَشَاءُ بِغَيْرِ حِسَابٍ
          </h1>

          {/* Ornamental Closing Bracket */}
          <span className="text-3xl sm:text-4xl text-emerald-400/80 font-['Amiri',serif] block mt-1">
            ﴾
          </span>

          {/* Surah Reference in Emerald Font */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-['Amiri',serif] text-emerald-300 font-bold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span>سُورَةُ آلِ عِمْرَانَ : الآية ٣٧</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          </motion.div>
        </motion.div>

        {/* 4. Bottom Controls & 4-Second Emerald Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 sm:mt-6 w-full max-w-md flex flex-col items-center gap-3"
        >
          {/* Glowing Emerald Progress Bar (Fills to 100% in 4000ms) */}
          <div className="w-full h-2 bg-emerald-950/80 rounded-full overflow-hidden p-[1.5px] border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full shadow-[0_0_14px_rgba(16,185,129,0.9)] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Counter info and Instant Entrance button */}
          <div className="w-full flex items-center justify-between text-xs text-slate-300">
            <span className="font-mono text-emerald-300 flex items-center gap-1.5 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              الانتقال لقفل الأمان ({timeLeft}ث)
            </span>

            <button
              type="button"
              onClick={() => onCompleteRef.current()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-bold transition shadow-sm cursor-pointer"
            >
              <span>دخول فوري</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
