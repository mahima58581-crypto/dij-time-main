import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gamepad2, Shield, Activity, Crown, Zap } from 'lucide-react';

interface QuranicWelcomeScreenProps {
  onComplete: () => void;
  durationMs?: number;
  isPinned?: boolean;
}

/**
 * Authentic Islamic Tazhib Corner Ornament (لچک تذهیب اصیل قرآنی)
 * Handcrafted vector arabesque (اسلیمی، ختایی، ترنج و قلم‌گیری مذهّب زرین و زمردی)
 */
const IslamicTazhibCorner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 120"
    className={`w-14 h-14 sm:w-20 sm:h-20 pointer-events-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldTazhibGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#fde047" />
      </linearGradient>
      <linearGradient id="emeraldTazhibGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="50%" stopColor="#047857" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#fbbf24" floodOpacity="0.7" />
      </filter>
    </defs>

    {/* Outer Gilded Border Bands */}
    <path
      d="M2,2 L88,2 C104,2 118,16 118,32 L118,118"
      stroke="url(#goldTazhibGrad)"
      strokeWidth="2"
      fill="none"
      filter="url(#goldGlow)"
    />
    <path
      d="M8,8 L82,8 C96,8 112,22 112,36 L112,112"
      stroke="#10b981"
      strokeWidth="1.2"
      strokeOpacity="0.85"
      fill="none"
    />
    {/* Fine Beaded Chain (زنجیره مرواریددوزی تذهیب) */}
    <path
      d="M14,14 L76,14 C88,14 106,28 106,42 L106,106"
      stroke="url(#goldTazhibGrad)"
      strokeWidth="1.5"
      strokeDasharray="2.5 4"
      fill="none"
    />

    {/* Major Arabesque Palmette (گل ختایی و لچک اسلیمی مرکزی) */}
    <path
      d="M26,26 C42,20 60,30 68,44 C76,58 90,62 100,58 C94,74 76,82 62,74 C50,66 38,72 32,88 C30,70 18,58 24,26 Z"
      fill="url(#emeraldTazhibGrad)"
      stroke="url(#goldTazhibGrad)"
      strokeWidth="1.6"
      filter="url(#goldGlow)"
    />

    {/* Internal Curving Golden Spiral Tendril (پیچک اسلیمی زرین) */}
    <path
      d="M32,32 C48,26 62,40 54,56 C48,68 34,60 38,48 C42,40 50,44 48,50"
      stroke="url(#goldTazhibGrad)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Central Inlaid Jewel (شمسه فیروزه در ترنج زرین) */}
    <circle cx="46" cy="46" r="7" fill="#03251c" stroke="url(#goldTazhibGrad)" strokeWidth="1.8" />
    <circle cx="46" cy="46" r="4" fill="#06b6d4" />
    <circle cx="46" cy="46" r="1.5" fill="#fef08a" />

    {/* Radiant Filigree Leaves (برگ‌های کنگره‌ای و ختایی) */}
    <path d="M16,4 C18,12 22,14 30,14" stroke="url(#goldTazhibGrad)" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M4,16 C12,18 14,22 14,30" stroke="url(#goldTazhibGrad)" strokeWidth="1.4" strokeLinecap="round" />
    
    <circle cx="36" cy="8" r="2" fill="#fde047" />
    <circle cx="8" cy="36" r="2" fill="#fde047" />
    <circle cx="56" cy="8" r="2" fill="#fde047" />
    <circle cx="8" cy="56" r="2" fill="#fde047" />
    <circle cx="76" cy="8" r="2" fill="#fde047" />
    <circle cx="8" cy="76" r="2" fill="#fde047" />
  </svg>
);

/**
 * Top Central Illuminated Shamseh Medallion (شمسه مذهب بالای کتیبه)
 */
const IslamicShamsehMedallion: React.FC = () => (
  <svg
    viewBox="0 0 140 40"
    className="w-28 sm:w-36 h-8 sm:h-10 mx-auto pointer-events-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Left decorative wing */}
    <path
      d="M10,20 Q40,10 60,20"
      stroke="url(#goldTazhibGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="30" cy="16" r="2" fill="#fde047" />
    <circle cx="45" cy="18" r="1.5" fill="#10b981" />

    {/* Center 8-pointed golden Islamic star */}
    <g transform="translate(70, 20)">
      <circle cx="0" cy="0" r="14" fill="#04271e" stroke="url(#goldTazhibGrad)" strokeWidth="1.6" />
      <polygon
        points="0,-11 3,-4 10,-4 5,1 7,8 0,4 -7,8 -5,1 -10,-4 -3,-4"
        fill="url(#goldTazhibGrad)"
      />
      <circle cx="0" cy="0" r="3" fill="#06b6d4" />
    </g>

    {/* Right decorative wing */}
    <path
      d="M130,20 Q100,10 80,20"
      stroke="url(#goldTazhibGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="110" cy="16" r="2" fill="#fde047" />
    <circle cx="95" cy="18" r="1.5" fill="#10b981" />
  </svg>
);

export const QuranicWelcomeScreen: React.FC<QuranicWelcomeScreenProps> = ({
  onComplete,
  durationMs = 4200,
  isPinned = false
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(Math.ceil(durationMs / 1000));
  const [progress, setProgress] = useState<number>(0);
  
  // Prevent re-render loop by capturing onComplete in a ref
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Stardust stars
  const stars = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      x: (i * 31) % 100,
      y: (i * 43) % 100,
      size: (i % 3) + 1.2,
      delay: (i % 6) * 0.4,
      duration: 2.8 + (i % 4) * 0.7,
      color: i % 4 === 0 ? '#34d399' : i % 4 === 1 ? '#10b981' : i % 4 === 2 ? '#fbbf24' : '#6ee7b7'
    }));
  }, []);

  useEffect(() => {
    // If pinned for inspection, do not auto-dismiss!
    if (isPinned) {
      setProgress(100);
      setTimeLeft(0);
      return;
    }

    const startTime = Date.now();

    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, durationMs);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(currentProgress);

      const remainingSeconds = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
      setTimeLeft(remainingSeconds);
    }, 30);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [durationMs, isPinned]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(16px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden bg-[#020906] text-white selection:bg-emerald-500 selection:text-black select-none font-['Alexandria','Cairo',sans-serif]"
    >
      {/* 1. Deep Cosmic Cyber Nebula & Rich Emerald Atmospheric Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#041c14]/85 via-[#02100b]/95 to-[#010604] pointer-events-none" />
      
      {/* Ambient Glow Nebulae */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-1/4 w-[600px] h-[450px] bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Laser Floor Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

      {/* Floating Animated Stardust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0.2, scale: 0.7 }}
            animate={{
              opacity: [0.2, 0.9, 0.2],
              scale: [0.7, 1.3, 0.7],
              y: ['0px', '-18px', '0px']
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${star.color}`
            }}
          />
        ))}
      </div>

      {/* 2. Soft Ambient Islamic Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] sm:w-[750px] sm:h-[750px] pointer-events-none opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full rounded-full border border-emerald-500/30 border-dashed"
        />
      </div>

      {/* 3. Central Monument Container */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-8 py-4 flex flex-col items-center text-center">
        
        {/* Top Elite Gaming Club Cyber Crest */}
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="flex flex-col items-center mb-3 sm:mb-5"
        >
          {/* Cyberpunk Hologram Emblem */}
          <div className="relative mb-3 flex items-center justify-center">
            <div className="absolute inset-0 -m-2 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-teal-400/20 to-emerald-500/30 blur-md animate-pulse" />
            
            <div className="relative px-4 py-2 rounded-2xl bg-gradient-to-br from-[#052119] via-[#031510] to-[#010907] border border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <Crown className="w-4 h-4 fill-slate-950 stroke-[2.2]" />
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black font-mono tracking-widest text-emerald-300 uppercase drop-shadow-sm flex items-center gap-1.5 font-mono-digits">
                  <span>DIJ-TIEM</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                  <span className="text-teal-300">GAMING SYSTEM</span>
                </div>
                <div className="text-[9px] font-bold text-slate-400 -mt-0.5">
                  منظومة إدارة وحسابات صالات الألعاب والإنترنت
                </div>
              </div>
              <div className="h-4 w-px bg-emerald-500/30 mx-0.5" />
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Gamepad2 className="w-3.5 h-3.5" />
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Noble Bismillah Badge with Gold & Emerald Illumination (سرلوحه مذهب بسم الله) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#032219]/95 via-[#053a2b] to-[#032219]/95 border-2 border-amber-400/50 text-amber-200 text-xs shadow-[0_0_30px_rgba(251,191,36,0.3)] backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-['Amiri',serif] font-bold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 tracking-wider drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]">
              بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          </motion.div>
        </motion.div>

        {/* Central Masterpiece: The Authentic Islamic Illuminated Tazhib Plaque (کتیبه مذهب اصیل قرآن کریم) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative my-2 sm:my-3 p-8 sm:p-12 md:p-14 rounded-[36px] bg-gradient-to-b from-[#03261e]/90 via-[#021813]/95 to-[#010c09]/98 border-2 border-amber-400/50 backdrop-blur-2xl shadow-[0_0_100px_rgba(16,185,129,0.4),0_0_30px_rgba(251,191,36,0.25)] max-w-3xl w-full overflow-hidden group"
        >
          {/* Subtle Islamic Girih / Arabesque Watermark Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-amber-500/5 pointer-events-none" />

          {/* Inner Golden Hairline Frame with Beaded Border (قلم‌گیری زرین داخلی) */}
          <div className="absolute inset-2 sm:inset-3 rounded-[28px] border border-amber-400/35 pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 rounded-[24px] border border-emerald-500/30 border-dashed pointer-events-none opacity-60" />

          {/* Authentic Islamic Tazhib Corner Ornaments (لچک‌های تذهیب در چهار گوشه کتیبه) */}
          {/* Top-Right Corner */}
          <div className="absolute top-1 right-1 z-10">
            <IslamicTazhibCorner />
          </div>

          {/* Top-Left Corner (Flipped Horizontally) */}
          <div className="absolute top-1 left-1 z-10 transform -scale-x-100">
            <IslamicTazhibCorner />
          </div>

          {/* Bottom-Right Corner (Flipped Vertically) */}
          <div className="absolute bottom-1 right-1 z-10 transform -scale-y-100">
            <IslamicTazhibCorner />
          </div>

          {/* Bottom-Left Corner (Flipped Both) */}
          <div className="absolute bottom-1 left-1 z-10 transform -scale-x-100 -scale-y-100">
            <IslamicTazhibCorner />
          </div>

          {/* Top Center Illuminated Shamseh Medallion (شمسه مذهب زرین) */}
          <div className="relative z-10 mb-2">
            <IslamicShamsehMedallion />
          </div>

          {/* The Holy Quranic Verse in Breathtaking Traditional Calligraphy */}
          <div className="relative z-10 py-2 sm:py-3 flex items-center justify-center">
            <h1 
              className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-['Amiri_Quran','Amiri','Aref_Ruqaa',serif] font-bold leading-normal whitespace-nowrap flex items-center justify-center gap-2.5 sm:gap-4 drop-shadow-[0_4px_35px_rgba(251,191,36,0.6)] px-2 tracking-normal"
              dir="rtl"
            >
              {/* Traditional Quranic Ayah Gilded End Bracket ﴿ */}
              <span className="text-amber-400 font-['Amiri',serif] text-3xl sm:text-5xl opacity-95 select-none drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                ﴿
              </span>

              {/* Quranic Verse in Radiant Gold & Emerald Foil */}
              <span className="bg-gradient-to-r from-amber-100 via-white to-emerald-100 bg-clip-text text-transparent whitespace-nowrap drop-shadow-[0_2px_15px_rgba(255,255,255,0.7)] font-bold">
                إِنَّ اللَّهَ يَرْزُقُ مَن يَشَاءُ بِغَيْرِ حِسَابٍ
              </span>

              {/* Traditional Quranic Ayah Gilded End Bracket ﴾ */}
              <span className="text-amber-400 font-['Amiri',serif] text-3xl sm:text-5xl opacity-95 select-none drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                ﴾
              </span>
            </h1>
          </div>

          {/* Surah Reference in Traditional Illuminated Cartouche (نشان زرین تذهیب سوره مبارکه) */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="relative z-10 mt-5 sm:mt-6 inline-flex items-center justify-center gap-2.5 px-5 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/90 via-[#063326] to-emerald-950/90 border border-amber-400/60 text-xs sm:text-sm font-['Amiri',serif] text-amber-200 font-bold shadow-[0_0_20px_rgba(251,191,36,0.25)]"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
            <span className="tracking-wide">سُورَةُ آلِ عِمْرَانَ : الآيَةُ ٣٧</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
          </motion.div>
        </motion.div>

        {/* 4. Telemetry Status Bar & Energy Loader */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-4 sm:mt-5 w-full max-w-lg flex flex-col items-center gap-3.5"
        >
          {/* Energy Bar in Emerald & Gold */}
          <div className="relative w-full h-2.5 bg-[#011710]/90 rounded-full overflow-hidden p-[2px] border border-amber-400/40 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-300 rounded-full shadow-[0_0_18px_rgba(251,191,36,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
            <div 
              className="absolute top-0 bottom-0 w-3 bg-white blur-[2px] rounded-full pointer-events-none"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>

          {/* Telemetry HUD Line */}
          <div className="w-full flex items-center justify-between text-xs text-slate-300 px-1 font-mono">
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              </span>
              <span className="tracking-wide">
                {isPinned ? 'صفحه خوش‌آمدگویی جهت بررسی شما ثابت نگه داشته شده است' : 'جاري تجهيز النظام وتشغيل وحدات التحكم...'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/70 border border-amber-400/40 text-amber-300 text-[11px] font-black font-mono font-mono-digits shadow-inner">
              <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>{isPinned ? 'ثابت (در حال بررسی)' : `${Math.round(progress)}% • ${timeLeft} ث`}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
