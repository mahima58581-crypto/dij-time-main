import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface CyberSectionIconProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'emerald' | 'teal' | 'cyan' | 'amber' | 'violet' | 'rose';
  className?: string;
  interactive?: boolean;
}

export const CyberSectionIcon: React.FC<CyberSectionIconProps> = ({
  icon: Icon,
  size = 'md',
  variant = 'emerald',
  className = '',
  interactive = true,
}) => {
  const sizeMap = {
    sm: {
      box: 'w-7 h-7 rounded-lg',
      icon: 'w-3.5 h-3.5',
      glow: 'w-8 h-8',
    },
    md: {
      box: 'w-10 h-10 rounded-xl',
      icon: 'w-5 h-5',
      glow: 'w-12 h-12',
    },
    lg: {
      box: 'w-12 h-12 rounded-2xl',
      icon: 'w-6 h-6',
      glow: 'w-16 h-16',
    },
    xl: {
      box: 'w-14 h-14 rounded-2xl',
      icon: 'w-7 h-7',
      glow: 'w-20 h-20',
    },
  };

  const variantStyles = {
    emerald: {
      border: 'from-emerald-400 via-teal-300 to-emerald-600',
      innerBorder: 'border-emerald-500/50 dark:border-emerald-400/60',
      coreBg: 'bg-gradient-to-br from-[#081326] via-[#050b16] to-[#02050c]',
      accentBg: 'bg-emerald-500/15',
      text: 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]',
      shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_35px_rgba(16,185,129,0.65)]',
      glow: 'bg-emerald-500/30 dark:bg-emerald-400/40',
      bracket: 'border-emerald-400',
      reticle: 'text-emerald-400/30 group-hover:text-emerald-400/60',
      dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
      scan: 'via-emerald-400/30',
    },
    teal: {
      border: 'from-teal-400 via-cyan-300 to-teal-600',
      innerBorder: 'border-teal-500/50 dark:border-teal-400/60',
      coreBg: 'bg-gradient-to-br from-[#061521] via-[#040c14] to-[#02060b]',
      accentBg: 'bg-teal-500/15',
      text: 'text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.9)]',
      shadow: 'shadow-[0_0_20px_rgba(20,184,166,0.35)] group-hover:shadow-[0_0_35px_rgba(20,184,166,0.65)]',
      glow: 'bg-teal-500/30 dark:bg-teal-400/40',
      bracket: 'border-teal-400',
      reticle: 'text-teal-400/30 group-hover:text-teal-400/60',
      dot: 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]',
      scan: 'via-teal-400/30',
    },
    cyan: {
      border: 'from-cyan-400 via-sky-300 to-cyan-600',
      innerBorder: 'border-cyan-500/50 dark:border-cyan-400/60',
      coreBg: 'bg-gradient-to-br from-[#051624] via-[#030d17] to-[#01060d]',
      accentBg: 'bg-cyan-500/15',
      text: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.9)]',
      shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_35px_rgba(6,182,212,0.65)]',
      glow: 'bg-cyan-500/30 dark:bg-cyan-400/40',
      bracket: 'border-cyan-400',
      reticle: 'text-cyan-400/30 group-hover:text-cyan-400/60',
      dot: 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]',
      scan: 'via-cyan-400/30',
    },
    amber: {
      border: 'from-amber-400 via-orange-300 to-amber-600',
      innerBorder: 'border-amber-500/50 dark:border-amber-400/60',
      coreBg: 'bg-gradient-to-br from-[#1a0f03] via-[#0f0902] to-[#080401]',
      accentBg: 'bg-amber-500/15',
      text: 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]',
      shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.65)]',
      glow: 'bg-amber-500/30 dark:bg-amber-400/40',
      bracket: 'border-amber-400',
      reticle: 'text-amber-400/30 group-hover:text-amber-400/60',
      dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
      scan: 'via-amber-400/30',
    },
    violet: {
      border: 'from-violet-400 via-fuchsia-300 to-violet-600',
      innerBorder: 'border-violet-500/50 dark:border-violet-400/60',
      coreBg: 'bg-gradient-to-br from-[#150a24] via-[#0d0517] to-[#06020c]',
      accentBg: 'bg-violet-500/15',
      text: 'text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.9)]',
      shadow: 'shadow-[0_0_20px_rgba(139,92,246,0.35)] group-hover:shadow-[0_0_35px_rgba(139,92,246,0.65)]',
      glow: 'bg-violet-500/30 dark:bg-violet-400/40',
      bracket: 'border-violet-400',
      reticle: 'text-violet-400/30 group-hover:text-violet-400/60',
      dot: 'bg-violet-400 shadow-[0_0_8px_#a78bfa]',
      scan: 'via-violet-400/30',
    },
    rose: {
      border: 'from-rose-400 via-pink-300 to-rose-600',
      innerBorder: 'border-rose-500/50 dark:border-rose-400/60',
      coreBg: 'bg-gradient-to-br from-[#1d060e] via-[#100308] to-[#070104]',
      accentBg: 'bg-rose-500/15',
      text: 'text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.9)]',
      shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.35)] group-hover:shadow-[0_0_35px_rgba(244,63,94,0.65)]',
      glow: 'bg-rose-500/30 dark:bg-rose-400/40',
      bracket: 'border-rose-400',
      reticle: 'text-rose-400/30 group-hover:text-rose-400/60',
      dot: 'bg-rose-400 shadow-[0_0_8px_#fb7185]',
      scan: 'via-rose-400/30',
    },
  };

  const currentSize = sizeMap[size];
  const currentVariant = variantStyles[variant];

  return (
    <div className={`relative inline-flex items-center justify-center group ${className}`}>
      {/* Dynamic Ambient Breathing Aura / Reactor Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute ${currentSize.glow} rounded-full ${currentVariant.glow} blur-xl pointer-events-none`}
      />

      {/* Outer Holographic Cyber Chassis */}
      <motion.div
        whileHover={
          interactive
            ? {
                scale: 1.1,
                rotate: 2,
                transition: { type: 'spring', stiffness: 400, damping: 14 },
              }
            : undefined
        }
        className={`relative p-[1.5px] rounded-xl sm:rounded-2xl bg-gradient-to-tr ${currentVariant.border} ${currentVariant.shadow} transition-all duration-300`}
      >
        {/* Inner Cockpit Glass Reactor Core */}
        <div
          className={`${currentSize.box} ${currentVariant.coreBg} border ${currentVariant.innerBorder} backdrop-blur-xl flex items-center justify-center ${currentVariant.text} relative overflow-hidden ring-1 ring-white/10`}
        >
          {/* Subtle Tech Cyber Grid Pattern in Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.75px,transparent_0.75px)] [background-size:6px_6px] opacity-15 pointer-events-none" />

          {/* Futuristic Rotating Cyber Reticle Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'linear',
            }}
            className={`absolute inset-1 rounded-full border border-dashed ${currentVariant.reticle} pointer-events-none`}
          />

          {/* Precision Corner HUD Targeting Brackets */}
          <span className={`absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 ${currentVariant.bracket} pointer-events-none drop-shadow-[0_0_4px_currentColor]`} />
          <span className={`absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 ${currentVariant.bracket} pointer-events-none drop-shadow-[0_0_4px_currentColor]`} />
          <span className={`absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 ${currentVariant.bracket} pointer-events-none drop-shadow-[0_0_4px_currentColor]`} />
          <span className={`absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 ${currentVariant.bracket} pointer-events-none drop-shadow-[0_0_4px_currentColor]`} />

          {/* Fast Scanning Laser Sweep Beam */}
          <motion.div
            animate={{
              x: ['-140%', '240%'],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: 'easeInOut',
            }}
            className={`absolute inset-0 w-1/2 bg-gradient-to-r from-transparent ${currentVariant.scan} to-transparent skew-x-12 pointer-events-none`}
          />

          {/* Icon with interactive spring physics and 3D depth */}
          <motion.div
            whileHover={
              interactive
                ? {
                    scale: 1.18,
                    rotate: -6,
                    transition: { type: 'spring', stiffness: 450, damping: 12 },
                  }
                : undefined
            }
            className="relative z-10 flex items-center justify-center filter"
          >
            <Icon className={`${currentSize.icon} stroke-[2.4] transition-transform duration-200 group-hover:scale-115`} />
          </motion.div>

          {/* Micro Cyber Status LED Beacon */}
          <span
            className={`absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full ${currentVariant.dot} animate-pulse pointer-events-none`}
          />
        </div>
      </motion.div>
    </div>
  );
};
