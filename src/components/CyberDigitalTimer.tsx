import React from 'react';
import { formatDurationDigital } from '../utils/formatters';

interface CyberDigitalTimerProps {
  seconds: number;
  variant?: 'emerald' | 'amber' | 'red' | 'cyber' | 'blue' | 'green';
  size?: 'sm' | 'md' | 'lg';
  isOvertime?: boolean;
  showProgressRing?: boolean;
  progressPercent?: number; // 0 to 100
  label?: string;
}

export const CyberDigitalTimer: React.FC<CyberDigitalTimerProps> = ({
  seconds,
  variant = 'emerald',
  size = 'md',
  isOvertime = false,
  showProgressRing = true,
  progressPercent = 0,
  label,
}) => {
  const timeFormatted = formatDurationDigital(seconds);
  // Ensure formatted string has HH:MM:SS
  const parts = timeFormatted.split(':');
  const hours = parts[0] || '00';
  const minutes = parts[1] || '00';
  const secs = parts[2] || '00';

  // Determine colors based on variant & overtime
  const effectiveVariant = isOvertime ? 'red' : variant;

  const getDigitStyles = () => {
    switch (effectiveVariant) {
      case 'red':
        return {
          text: 'text-rose-600 dark:text-rose-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(251,113,133,0.85)]',
          ghost: 'text-rose-300/40 dark:text-rose-950/40',
          colon: 'text-rose-600 dark:text-rose-500',
          ring: '#f43f5e',
          bg: 'bg-rose-50/90 dark:bg-[#18080c] border-rose-200 dark:border-rose-900/60 shadow-xs dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_12px_rgba(244,63,94,0.25)]',
        };
      case 'amber':
        return {
          text: 'text-amber-600 dark:text-amber-300 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(252,211,77,0.85)]',
          ghost: 'text-amber-300/40 dark:text-amber-950/40',
          colon: 'text-amber-600 dark:text-amber-400',
          ring: '#f59e0b',
          bg: 'bg-amber-50/90 dark:bg-[#170e04] border-amber-200 dark:border-amber-900/60 shadow-xs dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_12px_rgba(245,158,11,0.25)]',
        };
      case 'cyber':
        return {
          text: 'text-cyan-600 dark:text-cyan-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.85)]',
          ghost: 'text-cyan-300/40 dark:text-cyan-950/40',
          colon: 'text-cyan-600 dark:text-cyan-400',
          ring: '#06b6d4',
          bg: 'bg-cyan-50/90 dark:bg-[#041017] border-cyan-200 dark:border-cyan-900/60 shadow-xs dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_12px_rgba(6,182,212,0.25)]',
        };
      case 'blue':
        return {
          text: 'text-blue-600 dark:text-blue-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.85)]',
          ghost: 'text-blue-300/40 dark:text-blue-950/40',
          colon: 'text-blue-600 dark:text-blue-400',
          ring: '#3b82f6',
          bg: 'bg-blue-50/90 dark:bg-[#050b18] border-blue-200 dark:border-blue-900/60 shadow-xs dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_12px_rgba(59,130,246,0.25)]',
        };
      case 'green':
        return {
          text: 'text-green-600 dark:text-green-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(74,222,128,0.85)]',
          ghost: 'text-green-300/40 dark:text-green-950/40',
          colon: 'text-green-600 dark:text-green-400',
          ring: '#22c55e',
          bg: 'bg-green-50/90 dark:bg-[#041407] border-green-200 dark:border-green-900/60 shadow-xs dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_12px_rgba(34,197,94,0.25)]',
        };
      default: // emerald
        return {
          text: 'text-emerald-700 dark:text-emerald-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.85)]',
          ghost: 'text-emerald-300/40 dark:text-emerald-950/40',
          colon: 'text-emerald-600 dark:text-emerald-400',
          ring: '#10b981',
          bg: 'bg-emerald-50/90 dark:bg-[#04120e] border-emerald-200 dark:border-emerald-900/60 shadow-xs dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_12px_rgba(16,185,129,0.25)]',
        };
    }
  };

  const style = getDigitStyles();

  // Progress Ring Math (SVG Circle)
  const radius = size === 'lg' ? 24 : size === 'sm' ? 14 : 18;
  const circumference = 2 * Math.PI * radius;
  // If no percentage given, compute cyclic loop for lively animation
  const activePercent = progressPercent > 0 ? progressPercent : ((seconds % 60) / 60) * 100;
  const strokeDashoffset = circumference - (activePercent / 100) * circumference;

  return (
    <div className="flex items-center gap-2.5">
      {/* Optional Progress Ring */}
      {showProgressRing && (
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            className={`transform -rotate-90 ${
              size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11'
            }`}
          >
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth={size === 'lg' ? '3.5' : '2.5'}
              fill="transparent"
            />
            {/* Active Glowing Progress */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={style.ring}
              strokeWidth={size === 'lg' ? '3.5' : '2.5'}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
              style={{
                filter: `drop-shadow(0 0 4px ${style.ring})`,
              }}
            />
          </svg>
          
          {/* Pulsing Center Dot */}
          <span
            className={`absolute w-1.5 h-1.5 rounded-full ${
              isOvertime ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'
            }`}
          />
        </div>
      )}

      {/* LED 7-Segment Scoreboard Display Box - Strictly LTR (Hours : Minutes : Seconds) */}
      <div
        dir="ltr"
        className={`relative px-3 py-1.5 rounded-xl border font-mono font-black select-none overflow-hidden [direction:ltr] ${
          style.bg
        } ${size === 'lg' ? 'text-2xl sm:text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'}`}
      >
        {/* Ghost background digits (88:88:88) */}
        <div
          dir="ltr"
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center font-['Chakra_Petch',monospace] tracking-widest font-black pointer-events-none opacity-20 [direction:ltr] ${style.ghost}`}
        >
          88:88:88
        </div>

        {/* Live Active LED Glowing Digits: Exactly [Hours] : [Minutes] : [Seconds] */}
        <div 
          dir="ltr" 
          className="relative z-10 flex items-center justify-center gap-0.5 font-['Chakra_Petch',monospace] tracking-widest [direction:ltr]"
        >
          {/* Hours (ساعت) */}
          <span className={style.text} title="الساعات (ساعت)">
            {hours}
          </span>
          <span className={`animate-pulse ${style.colon}`}>:</span>
          {/* Minutes (دقیقه) */}
          <span className={style.text} title="الدقائق (دقیقه)">
            {minutes}
          </span>
          <span className={`animate-pulse ${style.colon}`}>:</span>
          {/* Seconds (ثانیه) */}
          <span className={style.text} title="الثواني (ثانیه)">
            {secs}
          </span>
        </div>

        {/* Subtle Micro-Labels: س (Hour) | د (Min) | ث (Sec) */}
        <div 
          dir="ltr"
          className="relative z-10 flex items-center justify-around text-[8px] text-slate-400/80 dark:text-slate-500 font-bold uppercase tracking-wider pt-0.5 [direction:ltr]"
        >
          <span className="w-5 text-center">ساعة</span>
          <span className="w-2 text-center text-transparent">:</span>
          <span className="w-5 text-center">دقيقة</span>
          <span className="w-2 text-center text-transparent">:</span>
          <span className="w-5 text-center">ثانية</span>
        </div>

        {/* Subtle LED Scanline / Glare Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20 pointer-events-none" />
      </div>

      {label && (
        <span className="text-[11px] font-bold text-slate-400 tracking-tight whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};
