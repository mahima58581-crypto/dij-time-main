import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Session, Station } from '../types';
import { 
  formatCurrency, 
  calculatePlayCost
} from '../utils/formatters';
import { play10MinWarningSound, speakVoiceAlert, unlockAudioContext } from '../utils/audioAlerts';
import { CyberDigitalTimer } from './CyberDigitalTimer';
import { GamingPcIcon } from './GamingPcIcon';
import { CyberSectionIcon } from './CyberSectionIcon';
import { PlaystationIcon } from './PlaystationIcon';
import { XboxIcon } from './XboxIcon';
import { Activity, AlertTriangle, Badge, Bell, Brackets, Clock, Coffee, Eye, EyeOff, Flame, Gamepad2, Grid, Icon, Info, Phone, Pill, PlayCircle, Receipt, Timer, Tv, User, Volume2, Zap } from 'lucide-react';
import { VipSimulatorIcon } from './VipSimulatorIcon';

interface LiveTimeCardsProps {
  sessions: Session[];
  stations: Station[];
  onAddSnack: (session: Session) => void;
  onEditGames: (session: Session) => void;
  onCheckoutSession: (session: Session) => void;
  onStartNewSession: (stationId?: string) => void;
}

// Ultra-badass Cyber Esports Live Chrono & Match Timer Icon
const CyberLiveChronoTimerIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Top Chrono Pushers / Tactical Mechanical Trigger Buttons */}
    <path d="M10 2H14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M12 2V4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M19 5.5L17.5 7M5 5.5L6.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

    {/* Outer Precision Telemetry Tachymeter Octagonal / High-tech Ring */}
    <circle cx="12" cy="13.5" r="8.5" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 2" opacity="0.4" />
    <circle cx="12" cy="13.5" r="7.5" stroke="currentColor" strokeWidth="2" />

    {/* Glowing Hour Cardinal Energy Marks */}
    <path d="M12 7V8.5M12 18.5V20M6.5 13.5H8M16 13.5H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* High-speed Esports Chrono Laser Needle Hands (Pointing dynamically) */}
    <path d="M12 13.5L12 9.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M12 13.5L15 15.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />

    {/* Central Glowing Reactor Core Pivot */}
    <circle cx="12" cy="13.5" r="1.8" fill="currentColor" />
    <circle cx="12" cy="13.5" r="0.7" fill="#040a14" />
  </svg>
);

export const LiveTimeCards: React.FC<LiveTimeCardsProps> = ({
  sessions,
  stations,
  onAddSnack,
  onEditGames,
  onCheckoutSession,
  onStartNewSession,
}) => {
  const [nowSec, setNowSec] = useState<number>(Date.now());
  const [showPins, setShowPins] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setNowSec(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePin = (sessionId: string) => {
    setShowPins((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const activeSessions = sessions.filter((s) => s.status === 'active');

  const getStationEmblem = (type: string) => {
    switch (type) {
      case 'PC':
        return (
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500/25 via-blue-600/15 to-slate-900 border border-cyan-400/50 flex items-center justify-center shadow-md shadow-cyan-500/25 shrink-0">
            <div className="absolute inset-0 bg-cyan-500/15 rounded-xl blur-xs" />
            <GamingPcIcon className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)] relative z-10 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
          </div>
        );
      case 'PS5':
        return (
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/25 via-indigo-600/15 to-slate-900 border border-blue-400/50 flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
            <div className="absolute inset-0 bg-blue-500/15 rounded-xl blur-xs" />
            <PlaystationIcon className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.9)] relative z-10" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-950 animate-pulse" />
          </div>
        );
      case 'XBOX':
        return (
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500/25 via-emerald-600/15 to-slate-900 border border-green-400/50 flex items-center justify-center shadow-md shadow-green-500/25 shrink-0">
            <div className="absolute inset-0 bg-green-500/15 rounded-xl blur-xs" />
            <XboxIcon className="w-5 h-5 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.9)] relative z-10" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-slate-950 animate-pulse" />
          </div>
        );
      case 'VIP_SIM':
        return (
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500/25 via-red-600/15 to-slate-900 border border-orange-400/50 flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
            <div className="absolute inset-0 bg-orange-500/15 rounded-xl blur-xs" />
            <Zap className="w-5 h-5 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.9)] relative z-10 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-orange-400 ring-2 ring-slate-950 animate-pulse" />
          </div>
        );
      default:
        return (
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500/25 via-indigo-600/15 to-slate-900 border border-purple-400/50 flex items-center justify-center shadow-md shadow-purple-500/25 shrink-0">
            <div className="absolute inset-0 bg-purple-500/15 rounded-xl blur-xs" />
            <Gamepad2 className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.9)] relative z-10 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-slate-950" />
          </div>
        );
    }
  };

  const getSessionTheme = (type: string, isOvertime: boolean) => {
    if (isOvertime) {
      return {
        cardBorder: 'border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-950/25',
        cardBg: 'bg-white dark:bg-[#15070c]',
        topBar: 'from-rose-500 via-amber-400 to-rose-600',
        badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/40',
        hudBorder: 'border-rose-200 dark:border-rose-900/60',
        hudBrackets: 'border-rose-400 dark:border-rose-400/60',
        hudText: 'text-rose-700 dark:text-rose-400',
        timerVariant: 'red' as const,
        costText: 'text-rose-600 dark:text-rose-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]',
        costBox: 'border-rose-200 dark:border-rose-900/60',
        checkoutBtn: 'from-rose-600 via-red-500 to-rose-600 shadow-rose-500/25',
        accentText: 'text-rose-600 dark:text-rose-400',
        pinBadge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        snackBtn: 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20',
        indicatorLight: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]',
      };
    }

    switch (type) {
      case 'XBOX':
        return {
          cardBorder: 'border-green-400/80 dark:border-green-500/50 hover:border-green-400 ring-1 ring-green-400/30 dark:ring-green-500/20 shadow-lg shadow-green-950/25',
          cardBg: 'bg-white dark:bg-[#040e06]',
          topBar: 'from-green-500 via-emerald-400 to-green-600',
          badge: 'bg-green-500/15 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/40',
          hudBorder: 'border-green-200/90 dark:border-green-500/40',
          hudBrackets: 'border-green-400 dark:border-green-400/60',
          hudText: 'text-green-700 dark:text-green-400/90',
          timerVariant: 'green' as const,
          costText: 'text-green-600 dark:text-green-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]',
          costBox: 'border-green-200/90 dark:border-green-500/30',
          checkoutBtn: 'from-green-600 via-emerald-500 to-green-600 shadow-green-500/25',
          accentText: 'text-green-600 dark:text-green-400',
          pinBadge: 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200/80 dark:border-green-800',
          snackBtn: 'text-green-700 dark:text-green-300 bg-green-500/10 border-green-500/30 hover:bg-green-500/20',
          indicatorLight: 'bg-green-500 shadow-[0_0_8px_#22c55e]',
        };
      case 'VIP_SIM':
        return {
          cardBorder: 'border-orange-400/80 dark:border-orange-500/50 hover:border-orange-400 ring-1 ring-orange-400/30 dark:ring-orange-500/20 shadow-lg shadow-orange-950/25',
          cardBg: 'bg-white dark:bg-[#120803]',
          topBar: 'from-orange-500 via-amber-400 to-red-500',
          badge: 'bg-orange-500/15 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/40',
          hudBorder: 'border-orange-200/90 dark:border-orange-500/40',
          hudBrackets: 'border-orange-400 dark:border-orange-400/60',
          hudText: 'text-orange-700 dark:text-orange-400/90',
          timerVariant: 'amber' as const,
          costText: 'text-orange-600 dark:text-orange-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]',
          costBox: 'border-orange-200/90 dark:border-orange-500/30',
          checkoutBtn: 'from-orange-600 via-amber-500 to-orange-600 shadow-orange-500/25',
          accentText: 'text-orange-600 dark:text-orange-400',
          pinBadge: 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200/80 dark:border-orange-800',
          snackBtn: 'text-orange-700 dark:text-orange-300 bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20',
          indicatorLight: 'bg-orange-500 shadow-[0_0_8px_#f97316]',
        };
      case 'PS5':
        return {
          cardBorder: 'border-blue-400/80 dark:border-blue-500/50 hover:border-blue-400 ring-1 ring-blue-400/30 dark:ring-blue-500/20 shadow-lg shadow-blue-950/25',
          cardBg: 'bg-white dark:bg-[#040816]',
          topBar: 'from-blue-500 via-indigo-400 to-violet-500',
          badge: 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/40',
          hudBorder: 'border-blue-200/90 dark:border-blue-500/40',
          hudBrackets: 'border-blue-400 dark:border-blue-400/60',
          hudText: 'text-blue-700 dark:text-blue-400/90',
          timerVariant: 'blue' as const,
          costText: 'text-blue-600 dark:text-blue-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]',
          costBox: 'border-blue-200/90 dark:border-blue-500/30',
          checkoutBtn: 'from-blue-600 via-indigo-600 to-blue-700 shadow-blue-500/25',
          accentText: 'text-blue-600 dark:text-blue-400',
          pinBadge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800',
          snackBtn: 'text-blue-700 dark:text-blue-300 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20',
          indicatorLight: 'bg-blue-500 shadow-[0_0_8px_#3b82f6]',
        };
      case 'PC':
      default:
        return {
          cardBorder: 'border-cyan-400/80 dark:border-cyan-500/50 hover:border-cyan-400 ring-1 ring-cyan-400/30 dark:ring-cyan-500/20 shadow-lg shadow-cyan-950/25',
          cardBg: 'bg-white dark:bg-[#030d14]',
          topBar: 'from-cyan-500 via-teal-400 to-blue-500',
          badge: 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40',
          hudBorder: 'border-cyan-200/90 dark:border-cyan-500/40',
          hudBrackets: 'border-cyan-400 dark:border-cyan-400/60',
          hudText: 'text-cyan-700 dark:text-cyan-400/90',
          timerVariant: 'cyber' as const,
          costText: 'text-cyan-600 dark:text-cyan-400 drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]',
          costBox: 'border-cyan-200/90 dark:border-cyan-500/30',
          checkoutBtn: 'from-cyan-600 via-teal-600 to-cyan-700 shadow-cyan-500/25',
          accentText: 'text-cyan-600 dark:text-cyan-400',
          pinBadge: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800',
          snackBtn: 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20',
          indicatorLight: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]',
        };
    }
  };

  const getStationIcon = (type: string) => {
    switch (type) {
      case 'PC':
        return <GamingPcIcon className="w-4 h-4 text-emerald-600" />;
      case 'PS5':
        return <Tv className="w-4 h-4 text-emerald-600" />;
      case 'VIP_SIM':
        return <VipSimulatorIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <section className="space-y-4 pt-1">
      {/* در صورت عدم وجود نشست فعال */}
      {activeSessions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0c101c] border-2 border-dashed border-emerald-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-sm"
        >
          <CyberSectionIcon icon={Clock} size="xl" variant="emerald" />
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              لا توجد جلسات نشطة حالياً
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              جميع المحطات والأجهزة متاحة الآن. لبدء جلسة جديدة وتشغيل المؤقت اضغط على الزر أدناه.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onStartNewSession()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition"
          >
            <PlayCircle className="w-4 h-4 text-white stroke-[2.5]" />
            <span>بدء جلسة جديدة (تسجيل دخول اللاعب)</span>
          </motion.button>
        </motion.div>
      ) : (
        /* شبكة بطاقات التوقيت الأبيض والأخضر */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {activeSessions.map((session) => {
              const startMs = new Date(session.checkInTime).getTime();
              const elapsedSeconds = Math.max(0, Math.floor((nowSec - startMs) / 1000));
              const elapsedMinutes = elapsedSeconds / 60;
              const currentPlayCost = calculatePlayCost(elapsedMinutes, session.hourlyRate);
              const snacksCost = session.snacks.reduce((acc, it) => acc + it.totalPrice, 0);
              const totalDue = Math.max(0, currentPlayCost + snacksCost - (session.discount || 0));

              const isPinVisible = !!showPins[session.id];

              const isFixed = session.sessionType === 'fixed' && !!session.allocatedMinutes;
              const totalAllocatedSec = (session.allocatedMinutes || 60) * 60;
              const remainingSec = Math.max(0, totalAllocatedSec - elapsedSeconds);
              const isOvertime = isFixed && elapsedSeconds > totalAllocatedSec;
              const isUnder10Min = isFixed && !isOvertime && remainingSec <= 600;
              const isUnder5Min = isFixed && !isOvertime && remainingSec <= 300;
              const theme = getSessionTheme(session.stationType, isOvertime);

              return (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -3 }}
                  className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-md hover:shadow-lg ${theme.cardBorder} ${theme.cardBg}`}
                >
                  {/* Cyber Accent Top Glow Line */}
                  <div className={`h-1 w-full bg-gradient-to-r ${theme.topBar}`} />

                  {/* 1. Header: Compact, Sharp & Balanced */}
                  <div className="p-3 bg-slate-50/90 dark:bg-[#0b101c] border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Compact Icon */}
                      <div className="shrink-0">
                        {getStationEmblem(session.stationType)}
                      </div>
                      
                      {/* Station Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm font-gaming tracking-wide truncate">
                            {session.stationName}
                          </h3>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase font-mono tracking-wider border shrink-0 ${theme.badge}`}>
                            {session.stationType === 'VIP_SIM' ? 'VIP' : session.stationType}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono-digits flex items-center gap-1 mt-0.5 truncate">
                          <Activity className={`w-3 h-3 ${theme.accentText} shrink-0`} />
                          <span>
                            {session.sessionType === 'open' ? 'وقت مفتوح' : `حجز ${session.allocatedMinutes} د`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0">
                      {isOvertime ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black bg-rose-500/15 text-rose-500 border border-rose-500/40 uppercase tracking-wide animate-pulse">
                          <Flame className="w-3 h-3" />
                          <span>إضافي!</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.indicatorLight} animate-pulse`} />
                          <span>نشط</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2. Card Interior: Compact & Professional */}
                  <div className="p-3 space-y-2.5">
                    
                    {/* Compact Cockpit HUD Timer */}
                    <div className={`relative bg-white dark:bg-slate-950/95 border ${theme.hudBorder} rounded-xl p-2.5 text-center shadow-xs dark:shadow-inner flex flex-col items-center justify-center overflow-hidden transition-colors`}>
                      {/* Micro Corner Brackets */}
                      <div className={`absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 ${theme.hudBrackets} pointer-events-none`} />
                      <div className={`absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 ${theme.hudBrackets} pointer-events-none`} />
                      <div className={`absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 ${theme.hudBrackets} pointer-events-none`} />
                      <div className={`absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 ${theme.hudBrackets} pointer-events-none`} />

                      <div className={`text-[9px] ${theme.hudText} flex items-center gap-1 mb-1 font-mono font-bold tracking-wider uppercase`}>
                        <Clock className="w-2.5 h-2.5" />
                        <span>مؤقت الجلسة (مباشر)</span>
                      </div>
                      
                      <CyberDigitalTimer
                        seconds={elapsedSeconds}
                        variant={theme.timerVariant}
                        size="sm"
                        isOvertime={isOvertime}
                        showProgressRing={true}
                        progressPercent={isFixed ? Math.min(100, Math.round((elapsedSeconds / totalAllocatedSec) * 100)) : ((elapsedSeconds % 3600) / 3600) * 100}
                      />

                      <div className="text-[9px] text-slate-500 dark:text-slate-400 pt-1.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-1.5 font-mono-digits w-full px-1">
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <span>دخول:</span>
                          <strong className="text-slate-800 dark:text-slate-300 font-mono">{new Date(session.checkInTime).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</strong>
                        </span>
                        <span className={`${theme.accentText} font-mono font-bold`}>{formatCurrency(session.hourlyRate)} / س</span>
                      </div>
                    </div>

                    {/* Fixed Session Countdown Alert */}
                    {isFixed && (
                      <div className={`px-2 py-1.5 rounded-lg border flex items-center justify-between text-[10px] transition-all ${
                        isOvertime
                          ? 'bg-rose-950/40 border-rose-800 text-rose-300 animate-pulse'
                          : isUnder5Min
                          ? 'bg-amber-950/40 border-amber-800 text-amber-300 animate-pulse'
                          : isUnder10Min
                          ? 'bg-amber-950/20 border-amber-900/60 text-amber-300'
                          : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        <div className="flex items-center gap-1.5 font-mono-digits truncate">
                          {isOvertime ? (
                            <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                          ) : (
                            <Bell className={`w-3 h-3 shrink-0 ${isUnder5Min ? 'text-amber-400' : 'text-slate-400'}`} />
                          )}
                          <span className="font-bold truncate">
                            {isOvertime 
                              ? `+${Math.floor((elapsedSeconds - totalAllocatedSec) / 60)} د إضافي`
                              : `متبقي: ${Math.ceil(remainingSec / 60)} دقيقة`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            unlockAudioContext();
                            play10MinWarningSound();
                            const mins = Math.ceil(remainingSec / 60);
                            const minsLabel =
                              mins === 1
                                ? 'دقيقة واحدة'
                                : mins === 2
                                ? 'دقيقتان'
                                : mins <= 10
                                ? `${mins} دقائق`
                                : `${mins} دقيقة`;
                            speakVoiceAlert(`باقي ${minsLabel} من وقتك على ${session.stationName}`);
                          }}
                          className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-2xs transition cursor-pointer shrink-0"
                          title="اعلان صوتی هشدار زمان به بازیکن"
                        >
                          <Volume2 className={`w-2.5 h-2.5 ${theme.accentText}`} />
                          <span>نداء</span>
                        </button>
                      </div>
                    )}

                    {/* Compact Player & PIN Information Grid */}
                    <div className="bg-slate-50 dark:bg-[#0c1222] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 text-xs">
                      {/* Line 1: Player Name & PIN Badge */}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <User className={`w-3 h-3 ${theme.accentText} shrink-0`} />
                          <strong className="text-slate-900 dark:text-white font-bold font-gaming text-xs truncate">
                            {session.customerName}
                          </strong>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono">رمز:</span>
                          <span className={`font-mono font-black ${theme.pinBadge} px-1.5 py-0.2 rounded text-[10px] font-mono-digits tracking-wider`}>
                            {isPinVisible ? session.customerPin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePin(session.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 transition cursor-pointer"
                            title={isPinVisible ? 'إخفاء الرمز' : 'إظهار الرمز'}
                          >
                            {isPinVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-slate-400" />}
                          </button>
                        </div>
                      </div>

                      {/* Line 2: Phone & Games / Buffet Quick Summary */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center gap-1">
                          <Phone className={`w-2.5 h-2.5 ${theme.accentText}`} />
                          <span dir="ltr" className={`font-mono ${theme.accentText} font-bold font-mono-digits`}>
                            {session.customerPhone}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Quick Snacks Pill */}
                          <button
                            onClick={() => onAddSnack(session)}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${theme.snackBtn} text-[9px] font-bold cursor-pointer transition`}
                            title="إضافة طلب بوفيه"
                          >
                            <Coffee className="w-2.5 h-2.5" />
                            <span>{session.snacks.length > 0 ? `${session.snacks.length} بوفيه` : '+ بوفيه'}</span>
                          </button>

                          {/* Quick Games Pill */}
                          <button
                            onClick={() => onEditGames(session)}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[9px] font-bold cursor-pointer hover:border-slate-400 transition"
                            title="تعديل الألعاب الجارية"
                          >
                            <Gamepad2 className="w-2.5 h-2.5" />
                            <span>{session.gamesPlayed.length} ألعاب</span>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* 3. Integrated Live Cost & Checkout Footer */}
                  <div className="p-2.5 bg-slate-50/95 dark:bg-[#080d19] border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    {/* Live Due Amount */}
                    <div className="min-w-0">
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">إجمالي الحساب:</div>
                      <div className={`text-sm sm:text-base font-black font-mono ${theme.costText} font-mono-digits leading-tight`}>
                        {formatCurrency(totalDue)}
                      </div>
                    </div>

                    {/* Compact Checkout Button */}
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onCheckoutSession(session)}
                      className={`py-2 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r ${theme.checkoutBtn} hover:brightness-110 shadow-sm transition-all flex items-center gap-1.5 font-gaming cursor-pointer shrink-0`}
                    >
                      <Receipt className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      <span>تسوية الفاتورة</span>
                    </motion.button>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

    </section>
  );
};
