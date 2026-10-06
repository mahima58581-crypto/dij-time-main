import React from 'react';
import { StationType } from '../types';
import { XboxIcon } from './XboxIcon';
import { PlaystationIcon } from './PlaystationIcon';
import { GamingPcIcon } from './GamingPcIcon';
import { VipSimulatorIcon } from './VipSimulatorIcon';

// ─── هویت بصری هر پلتفرم: رنگ، لوگو و گرادینت اختصاصی (هم‌خوانی در کل اپ) ───
export const PLATFORM_META: Record<
  StationType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    badge: string;
    accent: string;
    chip: string;
    ring: string;
    softBg: string;
    tabActive: string;
  }
> = {
  PC: {
    label: 'حاسوب ألعاب PC',
    icon: GamingPcIcon,
    text: 'text-cyan-600 dark:text-cyan-400',
    badge:
      'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-500/40 shadow-cyan-500/25',
    accent: 'from-cyan-500 to-blue-600',
    chip:
      'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    ring: 'ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10',
    softBg:
      'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-100 dark:border-cyan-900/60',
    tabActive:
      'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/50',
  },
  PS5: {
    label: 'منصة بلايستيشن 5',
    icon: PlaystationIcon,
    text: 'text-blue-600 dark:text-blue-400',
    badge:
      'bg-blue-50 dark:bg-indigo-950/70 border-blue-200 dark:border-blue-500/40 shadow-blue-500/25',
    accent: 'from-blue-500 via-indigo-600 to-purple-600',
    chip:
      'bg-blue-50 dark:bg-indigo-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    ring: 'ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/10',
    softBg:
      'bg-blue-50/70 dark:bg-indigo-950/40 border-blue-100 dark:border-indigo-900/60',
    tabActive:
      'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/50',
  },
  XBOX: {
    label: 'إكس بوكس سيريز',
    icon: XboxIcon,
    text: 'text-emerald-600 dark:text-emerald-400',
    badge:
      'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-500/40 shadow-emerald-500/25',
    accent: 'from-emerald-400 via-green-500 to-teal-500',
    chip:
      'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    ring: 'ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10',
    softBg:
      'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/60',
    tabActive:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/50',
  },
  VIP_SIM: {
    label: 'محاكي قيادة VIP',
    icon: VipSimulatorIcon,
    text: 'text-amber-600 dark:text-amber-400',
    badge:
      'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-500/40 shadow-amber-500/25',
    accent: 'from-amber-500 to-orange-600',
    chip:
      'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    ring: 'ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10',
    softBg:
      'bg-amber-50/70 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/60',
    tabActive:
      'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/50',
  },
};
