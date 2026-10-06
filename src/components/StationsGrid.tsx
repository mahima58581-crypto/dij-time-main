import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Station, Session, StationType } from '../types';
import { 
  formatCurrency, 
  calculatePlayCost,
  formatDurationDigital
} from '../utils/formatters';
import { useLiveTimer } from '../hooks/useLiveTimer';
import { CyberSectionIcon } from './CyberSectionIcon';
import { GamingPcIcon } from './GamingPcIcon';
import { XboxIcon } from './XboxIcon';
import { PlaystationIcon } from './PlaystationIcon';
import { Badge, Box, Clock, Coffee, Cpu, Eye, EyeOff, Gamepad2, Icon, Monitor, Play, Receipt, Tv, User } from 'lucide-react';
import { VipSimulatorIcon } from './VipSimulatorIcon';

interface StationsGridProps {
  stations: Station[];
  sessions: Session[];
  onStartSession: (stationId: string) => void;
  onAddSnack: (session: Session) => void;
  onEditGames: (session: Session) => void;
  onCheckoutSession: (session: Session) => void;
}

// Ultra-badass Esports Gaming BattleStation Controller Icon
const CyberBattleStationIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Upper Trigger Bumpers with Cyber Glow */}
    <path d="M7 4.5C8.5 4 10 4 12 4C14 4 15.5 4 17 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M6 7L7.5 4M18 7L16.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Ergonomic Cyber Controller Body */}
    <path 
      d="M7 8H17C19.5 8 21.5 9.8 21.5 12.3C21.5 14.5 20.3 18.5 18.5 20.5C17.7 21.4 16.2 21.4 15.3 20.4L13.8 18.8C13.3 18.3 12.7 18 12 18C11.3 18 10.7 18.3 10.2 18.8L8.7 20.4C7.8 21.4 6.3 21.4 5.5 20.5C3.7 18.5 2.5 14.5 2.5 12.3C2.5 9.8 4.5 8 7 8Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinejoin="round" 
    />
    
    {/* Precision D-Pad (Left) */}
    <path d="M7 11.5V14.5M5.5 13H8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Esports Action Buttons (Right) */}
    <circle cx="16.5" cy="11.5" r="1" fill="currentColor" />
    <circle cx="15" cy="13" r="1" fill="currentColor" />
    <circle cx="18" cy="13" r="1" fill="currentColor" />
    <circle cx="16.5" cy="14.5" r="1" fill="currentColor" />
    
    {/* Dual Analog Thumbsticks */}
    <circle cx="9.5" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="14.5" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Central Glowing Cyber V-Core */}
    <path d="M12 9.5L12 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="13.5" r="0.75" fill="currentColor" />
  </svg>
);

export const StationsGrid: React.FC<StationsGridProps> = ({
  stations,
  sessions,
  onStartSession,
  onAddSnack,
  onCheckoutSession,
}) => {
  const [filterType, setFilterType] = useState<'all' | StationType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'in-use'>('all');
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});

  // مؤقت التحديث بالثواني الحية
  const now = useLiveTimer(1000);

  const togglePin = (sessionId: string) => {
    setRevealedPins((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const filteredStations = stations.filter((st) => {
    if (filterType !== 'all' && st.type !== filterType) return false;
    if (filterStatus !== 'all' && st.status !== filterStatus) return false;
    return true;
  });

  const getStationIcon = (type: StationType) => {
    switch (type) {
      case 'PC':
        return <GamingPcIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'PS5':
        return <Tv className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'VIP_SIM':
        return <VipSimulatorIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <section className="space-y-4 pt-2">
      
      {/* عنوان وقسم المحطات والأجهزة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <CyberSectionIcon icon={CyberBattleStationIcon} size="lg" variant="emerald" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="dark:text-white text-lg font-black text-emerald-600 dark:text-emerald-400 font-gaming">
                محطات وأجهزة الألعاب النشطة
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {stations.length} منصة
              </span>
            </div>
            <p className="text-xs text-slate-500">
              متابعة حالة العتاد، التوقيت المباشر، رمز الدخول، وتفاصيل الحساب بالدينار
            </p>
          </div>
        </div>

        {/* أزرار تصفية الحالة */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'in-use', 'available'] as const).map((st) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={st}
              id={`filter-status-${st}`}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 font-black'
                  : 'bg-white dark:bg-[#0c101c] text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {st === 'all' && 'جميع الحالات'}
              {st === 'in-use' && 'مشغولة حالياً (نشطة)'}
              {st === 'available' && 'شاغرة وجاهزة'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* تصفية نوع المنصة */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-white dark:bg-[#0c101c] border border-emerald-100/80 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-2">نوع الجهاز:</span>
        {(['all', 'PC', 'PS5', 'VIP_SIM'] as const).map((type) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={type}
            id={`filter-type-${type}`}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterType === type
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/80'
            }`}
          >
            {type === 'all' && 'جميع المحطات'}
            {type === 'PC' && 'حواسيب قيمنق PC'}
            {type === 'PS5' && 'منصات بلايستيشن PS5'}
            {type === 'VIP_SIM' && 'محاكي السباق VIP Sim'}
          </motion.button>
        ))}
      </div>

      {/* شبكة كروت المحطات المرتبة، الخفيفة والمتناسقة */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
        <AnimatePresence>
          {filteredStations.map((station) => {
            const activeSession = sessions.find(
              (s) => s.stationId === station.id && s.status === 'active'
            );

            let elapsedSeconds = 0;
            let currentPlayCost = 0;
            let currentSnacksCost = 0;
            let currentTotalCost = 0;
            let isOvertime = false;

            if (activeSession) {
              const startMs = new Date(activeSession.checkInTime).getTime();
              elapsedSeconds = Math.max(0, Math.floor((now - startMs) / 1000));
              const elapsedMins = elapsedSeconds / 60;
              currentPlayCost = calculatePlayCost(elapsedMins, activeSession.hourlyRate);
              currentSnacksCost = activeSession.snacks.reduce((sum, item) => sum + item.totalPrice, 0);
              currentTotalCost = Math.max(0, currentPlayCost + currentSnacksCost - (activeSession.discount || 0));

              const isFixed = activeSession.sessionType === 'fixed' && !!activeSession.allocatedMinutes;
              if (isFixed && activeSession.allocatedMinutes) {
                const totalAllocSec = activeSession.allocatedMinutes * 60;
                isOvertime = elapsedSeconds > totalAllocSec;
              } else {
                isOvertime = false;
              }
            }

            const isRevealed = activeSession ? !!revealedPins[activeSession.id] : false;

            const platformMeta = {
              PC: {
                label: 'حاسوب ألعاب PC',
                icon: Monitor,
                color: 'text-cyan-400',
                bg: 'bg-slate-950 dark:bg-black',
                border: 'border-cyan-500/40 dark:border-cyan-500/50 shadow-md shadow-cyan-500/20',
                accent: 'from-cyan-500 to-blue-600',
              },
              PS5: {
                label: 'منصة بلايستيشن 5',
                icon: PlaystationIcon,
                color: 'text-blue-500',
                bg: 'bg-[#030612] dark:bg-black',
                border: 'border-blue-500/50 dark:border-blue-500/60 shadow-lg shadow-blue-500/25',
                accent: 'from-blue-500 via-indigo-600 to-purple-600',
              },
              XBOX: {
                label: 'إكس بوكس سيريز',
                icon: XboxIcon,
                color: 'text-emerald-400',
                bg: 'bg-[#020a04] dark:bg-black',
                border: 'border-emerald-500/60 dark:border-emerald-500/70 shadow-lg shadow-emerald-500/25',
                accent: 'from-emerald-400 via-green-500 to-teal-500',
              },
              VIP_SIM: {
                label: 'محاكي قيادة VIP',
                icon: VipSimulatorIcon,
                color: 'text-amber-400',
                bg: 'bg-slate-950 dark:bg-black',
                border: 'border-amber-500/50 dark:border-amber-500/60 shadow-md shadow-amber-500/20',
                accent: 'from-amber-500 to-orange-600',
              },
            }[station.type] || {
              label: station.type,
              icon: Monitor,
              color: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-50 dark:bg-emerald-950/60',
              border: 'border-emerald-200 dark:border-emerald-800/80',
              accent: 'from-emerald-500 to-teal-600',
            };

            const PlatformIcon = platformMeta.icon;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                transition={{ duration: 0.2 }}
                key={station.id}
                id={`station-card-${station.id}`}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                  activeSession
                    ? isOvertime
                      ? 'bg-white dark:bg-slate-900 border-rose-500/70 ring-1 ring-rose-500/30'
                      : 'bg-white dark:bg-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/50'
                }`}
              >
                {/* Top Accent Strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${platformMeta.accent}`} />

                <div className="p-5 space-y-4">
                  {/* 1. Header: Platform Icon + Name & Platform Details + Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={`w-16 h-16 rounded-2xl ${platformMeta.bg} border-2 ${platformMeta.border} flex items-center justify-center shrink-0 shadow-md`}>
                        <PlatformIcon className="w-11 h-11" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                          {station.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-white">
                          <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-300 dark:border-slate-700 shadow-2xs">
                            #{station.id}
                          </span>
                          <span className="text-slate-400 dark:text-white">•</span>
                          <span className="font-bold text-slate-800 dark:text-white">{platformMeta.label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {activeSession ? (
                        isOvertime ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[10px] sm:text-[11px] font-black bg-rose-500/15 dark:bg-rose-950/90 text-rose-700 dark:text-rose-300 border border-rose-500/70 shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-[1px] bg-rose-500 rotate-45 shadow-[0_0_8px_#f43f5e]"></span>
                            <span className="tracking-wide">وقت إضافي</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[10px] sm:text-[11px] font-black bg-cyan-500/15 dark:bg-cyan-950/90 text-cyan-700 dark:text-cyan-300 border border-cyan-500/70 shadow-[0_0_10px_rgba(6,182,212,0.3)] whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-[1px] bg-cyan-400 rotate-45 shadow-[0_0_8px_#06b6d4] animate-ping"></span>
                            <span className="tracking-wide">جلسة نشطة</span>
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[10px] sm:text-[11px] font-black bg-emerald-500/15 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 border border-emerald-500/70 shadow-[0_0_10px_rgba(16,185,129,0.3)] whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-400 rotate-45 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                          <span className="tracking-wide">شاغر ومتاح</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2. Middle Body: Active Session Telemetry OR Specs & Rate */}
                  {activeSession ? (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-3">
                      {/* Time elapsed & current cost */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>الوقت المنقضي:</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-black font-mono tracking-wider text-slate-900 dark:text-white font-mono-digits">
                            {formatDurationDigital(elapsedSeconds)}
                          </div>
                        </div>

                        <div className="text-left">
                          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                            الحساب الإجمالي:
                          </div>
                          <div className="text-lg sm:text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 font-mono-digits">
                            {formatCurrency(currentTotalCost)}
                          </div>
                        </div>
                      </div>

                      {/* Player & PIN info strip */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {activeSession.customerName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs shrink-0">
                          {activeSession.snacks.length > 0 && (
                            <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded text-[11px]">
                              +{activeSession.snacks.length} طلبات
                            </span>
                          )}
                          <span className="font-mono text-slate-700 dark:text-white font-bold">
                            PIN: {isRevealed ? activeSession.customerPin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePin(activeSession.id)}
                            className="text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                            title={isRevealed ? 'إخفاء PIN' : 'إظهار PIN'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Specs Box */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                          <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>المواصفات والعتاد:</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed font-sans line-clamp-2">
                          {station.specs || 'شاشة عالية التردد • عتاد قيمنق احترافي متكامل'}
                        </p>
                      </div>

                      {/* Rate Display */}
                      <div className="flex items-center justify-between py-1 px-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-white font-bold">
                          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>سعر الساعة الأساسي:</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-mono font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400 font-mono-digits">
                            {formatCurrency(station.hourlyRate)}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">
                            / ساعة
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 3. Bottom Action Buttons */}
                <div className="p-5 pt-0">
                  {activeSession ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id={`btn-snack-action-${station.id}`}
                        onClick={() => onAddSnack(activeSession)}
                        className="h-10 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Coffee className="w-4 h-4 text-amber-500" />
                        <span>طلب تسالي</span>
                      </button>

                      <button
                        type="button"
                        id={`btn-checkout-action-${station.id}`}
                        onClick={() => onCheckoutSession(activeSession)}
                        className="flex-1 h-10 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>إنهاء وحساب الجلسة</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id={`btn-start-session-${station.id}`}
                      onClick={() => onStartSession(station.id)}
                      className="w-full h-10 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer font-gaming"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>بدء جلسة لعب جديدة الآن</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* حالة عدم وجود محطات مطابقة للفلاتر */}
        {filteredStations.length === 0 && (
          <div className="col-span-full p-8 text-center rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <GamingPcIcon className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              لا توجد محطات مطابقة لخيارات التصفية الحالية
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              جرّب تغيير نوع المنصة أو عرض جميع الحالات لإظهار الأجهزة
            </p>
            <button
              onClick={() => { setFilterType('all'); setFilterStatus('all'); }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </div>

    </section>
  );
};
