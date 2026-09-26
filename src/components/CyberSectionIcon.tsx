import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface CyberSectionIconProps {
  icon: LucideIcon;
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
      border: 'from-emerald-500 via-teal-400 to-emerald-600',
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.45)]',
      glow: 'bg-emerald-500/20 dark:bg-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    teal: {
      border: 'from-teal-500 via-cyan-400 to-teal-600',
      bg: 'bg-teal-50/80 dark:bg-teal-950/50',
      text: 'text-teal-600 dark:text-teal-400',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(20,184,166,0.45)]',
      glow: 'bg-teal-500/20 dark:bg-teal-500/30',
      dot: 'bg-teal-400',
    },
    cyan: {
      border: 'from-cyan-500 via-sky-400 to-cyan-600',
      bg: 'bg-cyan-50/80 dark:bg-cyan-950/50',
      text: 'text-cyan-600 dark:text-cyan-400',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.45)]',
      glow: 'bg-cyan-500/20 dark:bg-cyan-500/30',
      dot: 'bg-cyan-400',
    },
    amber: {
      border: 'from-amber-500 via-yellow-400 to-amber-600',
      bg: 'bg-amber-50/80 dark:bg-amber-950/50',
      text: 'text-amber-600 dark:text-amber-400',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.45)]',
      glow: 'bg-amber-500/20 dark:bg-amber-500/30',
      dot: 'bg-amber-400',
    },
    violet: {
      border: 'from-violet-500 via-purple-400 to-violet-600',
      bg: 'bg-violet-50/80 dark:bg-violet-950/50',
      text: 'text-violet-600 dark:text-violet-400',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.45)]',
      glow: 'bg-violet-500/20 dark:bg-violet-500/30',
      dot: 'bg-violet-400',
    },
    rose: {
      border: 'from-rose-500 via-pink-400 to-rose-600',
      bg: 'bg-rose-50/80 dark:bg-rose-950/50',
      text: 'text-rose-600 dark:text-rose-400',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.45)]',
      glow: 'bg-rose-500/20 dark:bg-rose-500/30',
      dot: 'bg-rose-400',
    },
  };

  const currentSize = sizeMap[size];
  const currentVariant = variantStyles[variant];

  return (
    <div className={`relative inline-flex items-center justify-center group ${className}`}>
      {/* Ambient Breathing Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute ${currentSize.glow} rounded-full ${currentVariant.glow} blur-xl pointer-events-none`}
      />

      {/* Outer Hologram Border Frame */}
      <motion.div
        whileHover={
          interactive
            ? {
                scale: 1.08,
                rotate: 4,
                transition: { type: 'spring', stiffness: 350, damping: 15 },
              }
            : undefined
        }
        className={`relative p-[1.5px] rounded-xl sm:rounded-2xl bg-gradient-to-tr ${currentVariant.border} ${currentVariant.shadow} shadow-md transition-shadow duration-300`}
      >
        {/* Inner Glass Container */}
        <div
          className={`${currentSize.box} ${currentVariant.bg} backdrop-blur-md flex items-center justify-center ${currentVariant.text} relative overflow-hidden`}
        >
          {/* Subtle Cyber Scanning Beam */}
          <motion.div
            animate={{
              x: ['-120%', '220%'],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 dark:via-white/15 to-transparent skew-x-12 pointer-events-none"
          />

          {/* Icon with interactive micro-spring */}
          <motion.div
            whileHover={
              interactive
                ? {
                    scale: 1.15,
                    rotate: -6,
                    transition: { type: 'spring', stiffness: 350, damping: 15 },
                  }
                : undefined
            }
          >
            <Icon className={`${currentSize.icon} stroke-[2.2] transition-transform group-hover:scale-110`} />
          </motion.div>

          {/* Micro cyber corner accent */}
          <span
            className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${currentVariant.dot} opacity-70 group-hover:opacity-100 group-hover:animate-ping`}
          />
        </div>
      </motion.div>
    </div>
  );
};
