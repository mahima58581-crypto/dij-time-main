import React from 'react';
import { StationType } from '../types';
import { VipSimulatorIcon } from './VipSimulatorIcon';

interface CyberHardwareBadgeProps {
  type: StationType;
  specs?: string;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
}

export const CyberHardwareBadge: React.FC<CyberHardwareBadgeProps> = ({
  type,
  specs,
  size = 'md',
  isActive = false,
}) => {
  if (type === 'PS5') {
    return (
      <div className="relative group flex items-center gap-2">
        {/* 3D-Styled PS5 DualSense Visual */}
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950/80 p-[1.5px] border border-blue-500/40 shadow-md shadow-blue-500/20 flex items-center justify-center overflow-hidden">
          {/* Internal neon glow */}
          <div className="absolute inset-0 bg-blue-500/10 blur-xs" />
          
          <svg viewBox="0 0 48 48" className="w-7 h-7 relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {/* Controller Body Shell */}
            <path
              d="M10 18 C12 12, 36 12, 38 18 C40 23, 42 34, 38 38 C35 41, 31 36, 29 29 C27 27, 21 27, 19 29 C17 36, 13 41, 10 38 C6 34, 8 23, 10 18 Z"
              fill="url(#ps5Grad)"
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
            {/* Center Touchpad */}
            <rect x="18" y="16" width="12" height="7" rx="1.5" fill="#0f172a" stroke="#60a5fa" strokeWidth="0.8" />
            {/* DualSense Blue Lightbar */}
            <path
              d="M17 16 Q24 15 31 16"
              stroke="#38bdf8"
              strokeWidth="1.4"
              strokeLinecap="round"
              className={isActive ? 'animate-pulse' : ''}
            />
            {/* D-Pad on Left */}
            <circle cx="15" cy="22" r="1" fill="#94a3b8" />
            <circle cx="13" cy="24" r="1" fill="#94a3b8" />
            <circle cx="17" cy="24" r="1" fill="#94a3b8" />
            <circle cx="15" cy="26" r="1" fill="#94a3b8" />
            {/* Action Buttons on Right (Triangle, Circle, Cross, Square) */}
            <circle cx="33" cy="22" r="1.1" fill="#60a5fa" />
            <circle cx="35" cy="24" r="1.1" fill="#f87171" />
            <circle cx="31" cy="24" r="1.1" fill="#ec4899" />
            <circle cx="33" cy="26" r="1.1" fill="#34d399" />
            {/* Dual Thumbsticks */}
            <circle cx="19" cy="28" r="3.2" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" />
            <circle cx="29" cy="28" r="3.2" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" />
            <defs>
              <linearGradient id="ps5Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="60%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>
          </svg>

          {/* Active light indicator */}
          {isActive && (
            <span className="absolute bottom-1 w-3 h-0.5 rounded-full bg-blue-400 shadow-[0_0_6px_#38bdf8] animate-pulse" />
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
              SONY PS5
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              DualSense™ 4K
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'PC') {
    return (
      <div className="relative group flex items-center gap-2">
        {/* 3D-Styled Cyber Gaming PC Tower */}
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/80 p-[1.5px] border border-emerald-500/40 shadow-md shadow-emerald-500/20 flex items-center justify-center overflow-hidden">
          {/* Internal ambient RGB glow */}
          <div className="absolute inset-0 bg-emerald-500/10 blur-xs" />

          <svg viewBox="0 0 48 48" className="w-7 h-7 relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {/* PC Chassis */}
            <rect x="12" y="8" width="24" height="32" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
            {/* Tempered Glass Window Panel */}
            <rect x="14" y="10" width="16" height="28" rx="2" fill="#020617" stroke="#10b981" strokeWidth="0.8" fillOpacity="0.85" />
            {/* Internal Graphic Card (GPU) with RGB strip */}
            <rect x="16" y="24" width="12" height="4" rx="1" fill="#1e293b" />
            <line x1="16" y1="26" x2="28" y2="26" stroke="#34d399" strokeWidth="1.2" className={isActive ? 'animate-pulse' : ''} />
            {/* Front Intake Fans (Spinning illusion) */}
            <circle cx="32" cy="16" r="2.5" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 1" />
            <circle cx="32" cy="24" r="2.5" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 1" />
            <circle cx="32" cy="32" r="2.5" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 1" />
            {/* CPU Liquid Cooler Pump */}
            <circle cx="20" cy="17" r="3" fill="#090d16" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="20" cy="17" r="1.2" fill="#38bdf8" />
            {/* Power LED Indicator */}
            <circle cx="32" cy="10" r="0.8" fill="#10b981" />
          </svg>

          {/* Active LED Pulse */}
          {isActive && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-ping" />
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              ESPORTS PC
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              240Hz • RTX
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'VIP_SIM') {
    return (
      <div className="relative group flex items-center gap-2">
        {/* 3D-Styled Racing Steering Wheel */}
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/80 p-[1.5px] border border-amber-500/40 shadow-md shadow-amber-500/20 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/10 blur-xs" />

          <VipSimulatorIcon className="w-7 h-7 relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

          {isActive && (
            <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-ping" />
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
              VIP SIMULATOR
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Force Feedback
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
        🎮
      </div>
      <span className="text-xs font-bold text-slate-300">{type}</span>
    </div>
  );
};
