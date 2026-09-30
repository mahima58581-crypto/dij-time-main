import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Crown, 
  Swords, 
  Flame, 
  Joystick, 
  Zap, 
  Clock,
  ChevronDown,
  Activity,
  Sparkles,
  BarChart3,
  Layers
} from 'lucide-react';
import { formatCurrency, formatDuration } from '../utils/formatters';
import { Session, Station, ActiveSidebarTab } from '../types';
import { unlockAudioContext } from '../utils/audioAlerts';

interface StatsBarProps {
  sessions: Session[];
  stations: Station[];
  activeTab?: ActiveSidebarTab;
  embedded?: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ 
  sessions, 
  stations, 
  activeTab = 'station_management',
  embedded = false,
}) => {
  // Only permanent/fixed on 'station_management'. In all other pages, it becomes a collapsible cyber window/drawer
  const isFixed = activeTab === 'station_management';
  const [isOpenInOtherPages, setIsOpenInOtherPages] = useState(false);

  // احتساب إجمالي الإيرادات (المكتملة + النشطة الحالية)
  const totalRevenue = sessions.reduce((acc, s) => acc + s.finalAmount, 0);
  const playtimeRevenue = sessions.reduce((acc, s) => acc + s.timeCost, 0);
  const snacksRevenue = sessions.reduce((acc, s) => acc + s.snacksCost, 0);
  
  // مجموع دقائق وساعات اللعب
  const totalMinutesPlayed = sessions.reduce((acc, s) => {
    const start = new Date(s.checkInTime).getTime();
    const end = s.checkOutTime ? new Date(s.checkOutTime).getTime() : Date.now();
    const mins = Math.max(0, (end - start) / (1000 * 60));
    return acc + mins;
  }, 0);

  const occupiedStations = stations.filter((s) => s.status === 'in-use').length;
  const totalStations = stations.length;

  const cardVariants = {
    hover: { y: -4, transition: { type: 'spring' as const, stiffness: 350, damping: 20 } }
  };

  // The 6 Full Cards Grid - Standardized, Professional, Compact Esports Telemetry
  const renderCardsGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 items-stretch">
      
      {/* 1. إجمالي إيرادات اليوم */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0b101c] border-2 border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500 dark:hover:border-emerald-400 hover:ring-2 hover:ring-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/20 rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 relative overflow-hidden group cursor-pointer flex flex-col justify-between h-full min-h-[108px]"
      >
        <div className="flex items-center justify-between gap-1 min-w-0">
          <span className="text-[10px] sm:text-[10.5px] font-black text-slate-900 dark:text-white leading-tight">
            إجمالي الإيرادات
          </span>
          <div className="w-6 h-6 shrink-0 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs group-hover:scale-110 transition-transform">
            <Crown className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
        </div>
        <div className="my-1 text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 font-mono-digits tracking-tight truncate">
          {formatCurrency(totalRevenue)}
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium truncate">
          <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
          <span className="truncate">اللعب + البوفيه</span>
        </div>
      </motion.div>

      {/* 2. دخل ساعات اللعب */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0b101c] border-2 border-slate-200/90 dark:border-slate-800/90 hover:border-red-500 dark:hover:border-red-400 hover:ring-2 hover:ring-red-500/40 hover:shadow-lg hover:shadow-red-500/20 rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 relative overflow-hidden group cursor-pointer flex flex-col justify-between h-full min-h-[108px]"
      >
        <div className="flex items-center justify-between gap-1 min-w-0">
          <span className="text-[10px] sm:text-[10.5px] font-black text-slate-900 dark:text-white leading-tight">
            إيراد ساعات اللعب
          </span>
          <div className="w-6 h-6 shrink-0 rounded-md bg-red-500/10 dark:bg-red-400/10 border border-red-500/25 flex items-center justify-center text-red-600 dark:text-red-400 shadow-xs group-hover:scale-110 transition-transform">
            <Swords className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
        </div>
        <div className="my-1 text-base sm:text-lg font-black font-mono text-red-600 dark:text-red-400 font-mono-digits tracking-tight truncate">
          {formatCurrency(playtimeRevenue)}
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span className="truncate">حساب دقيق بالدقيقة</span>
        </div>
      </motion.div>

      {/* 3. دخل بوفيه التسالي */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0b101c] border-2 border-slate-200/90 dark:border-slate-800/90 hover:border-orange-500 dark:hover:border-orange-400 hover:ring-2 hover:ring-orange-500/40 hover:shadow-lg hover:shadow-orange-500/20 rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 relative overflow-hidden group cursor-pointer flex flex-col justify-between h-full min-h-[108px]"
      >
        <div className="flex items-center justify-between gap-1 min-w-0">
          <span className="text-[10px] sm:text-[10.5px] font-black text-slate-900 dark:text-white leading-tight">
            مبيعات البوفيه
          </span>
          <div className="w-6 h-6 shrink-0 rounded-md bg-orange-500/10 dark:bg-orange-400/10 border border-orange-500/25 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-xs group-hover:scale-110 transition-transform">
            <Flame className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
        </div>
        <div className="my-1 text-base sm:text-lg font-black font-mono text-orange-600 dark:text-orange-400 font-mono-digits tracking-tight truncate">
          {formatCurrency(snacksRevenue)}
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
          <span className="truncate">المشروبات والوجبات</span>
        </div>
      </motion.div>

      {/* 4. الأجهزة المشغولة */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0b101c] border-2 border-slate-200/90 dark:border-slate-800/90 hover:border-purple-500 dark:hover:border-purple-400 hover:ring-2 hover:ring-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 relative overflow-hidden group cursor-pointer flex flex-col justify-between h-full min-h-[108px]"
      >
        <div className="flex items-center justify-between gap-1 min-w-0">
          <span className="text-[10px] sm:text-[10.5px] font-black text-slate-900 dark:text-white leading-tight">
            الأجهزة النشطة
          </span>
          <div className="w-6 h-6 shrink-0 rounded-md bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs group-hover:scale-110 transition-transform">
            <Joystick className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
        </div>
        <div className="my-1 text-base sm:text-lg font-black font-mono text-purple-600 dark:text-purple-400 font-mono-digits tracking-tight flex items-baseline gap-1">
          <span>{occupiedStations}</span>
          <span className="text-xs font-semibold text-slate-400">/ {totalStations}</span>
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium font-mono-digits truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
          <span>إشغال {totalStations > 0 ? Math.round((occupiedStations / totalStations) * 100) : 0}%</span>
        </div>
      </motion.div>

      {/* 5. سرعة الإنترنت */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0b101c] border-2 border-slate-200/90 dark:border-slate-800/90 hover:border-sky-500 dark:hover:border-sky-400 hover:ring-2 hover:ring-sky-500/40 hover:shadow-lg hover:shadow-sky-500/20 rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 relative overflow-hidden group cursor-pointer flex flex-col justify-between h-full min-h-[108px]"
      >
        <div className="flex items-center justify-between gap-1 min-w-0">
          <span className="text-[10px] sm:text-[10.5px] font-black text-slate-900 dark:text-white leading-tight">
            الشبكة (فايبر)
          </span>
          <div className="w-6 h-6 shrink-0 rounded-md bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/25 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs group-hover:scale-110 transition-transform">
            <Zap className="w-3.5 h-3.5 stroke-[2.2] fill-sky-500/20" />
          </div>
        </div>
        <div className="my-1 text-base sm:text-lg font-black font-mono text-sky-600 dark:text-sky-400 font-mono-digits tracking-tight flex items-baseline gap-1 truncate">
          <span>950</span>
          <span className="text-xs font-bold text-slate-400 font-sans">Mbps</span>
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
          <span>بينغ 8ms • ألياف بصرية</span>
        </div>
      </motion.div>

      {/* 6. ساعات اللعب اليوم */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0b101c] border-2 border-slate-200/90 dark:border-slate-800/90 hover:border-amber-500 dark:hover:border-amber-400 hover:ring-2 hover:ring-amber-500/40 hover:shadow-lg hover:shadow-amber-500/20 rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 relative overflow-hidden group cursor-pointer flex flex-col justify-between h-full min-h-[108px]"
      >
        <div className="flex items-center justify-between gap-1 min-w-0">
          <span className="text-[10px] sm:text-[10.5px] font-black text-slate-900 dark:text-white leading-tight">
            ساعات اللعب
          </span>
          <div className="w-6 h-6 shrink-0 rounded-md bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs group-hover:scale-110 transition-transform">
            <Clock className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
        </div>
        <div className="my-1 text-base sm:text-lg font-black font-mono text-amber-600 dark:text-amber-400 font-mono-digits tracking-tight flex items-baseline gap-1 truncate">
          <span>{(totalMinutesPlayed / 60).toFixed(1)}</span>
          <span className="text-xs font-semibold text-amber-600/70 dark:text-amber-400/70 font-sans">ساعة</span>
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span className="truncate">{formatDuration(totalMinutesPlayed)}</span>
        </div>
      </motion.div>

    </div>
  );

  // 1. FIXED VIEW: ONLY ON 'station_management' (ثابت فقط في إدارة المحطات)
  if (isFixed) {
    return (
      <div className={embedded ? "" : "my-5"}>
        {renderCardsGrid()}
      </div>
    );
  }

  // 2. WINDOWED / ACCORDION VIEW: IN ALL OTHER PAGES WITH BADASS CYBER ARROW
  return (
    <div className={embedded ? "" : "my-4"}>
      {/* High-Tech Cyber Pill / Trigger Bar with Arrow */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/40 dark:from-[#0a1120] dark:via-[#0c1424] dark:to-[#08131e] border border-emerald-500/30 dark:border-emerald-500/35 shadow-lg shadow-emerald-950/20 backdrop-blur-xl p-3 sm:px-4 transition-all duration-300">
        
        {/* Ambient Neon Backlight */}
        <div className="absolute top-0 right-1/4 w-72 h-12 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-10">
          
          {/* Right Side (RTL): Title & Quick Glance Chips */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-sm shadow-emerald-500/30 shrink-0">
              <div className="w-full h-full rounded-[10px] bg-[#070c16] flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-white font-gaming tracking-wide">
                  لوحة الإحصائيات والمؤشرات الحية
                </h3>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  نافذة ذكية
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                انقر على السهم لعرض بطاقات الإيرادات والإشغال وساعات اللعب
              </p>
            </div>

            {/* Quick Live Preview Chips (Visible even when collapsed) */}
            <div className="flex items-center gap-2 mr-auto sm:mr-3 text-xs font-mono">
              <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="hidden md:flex px-2.5 py-1 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-cyan-400 items-center gap-1.5 shadow-xs">
                <Joystick className="w-3.5 h-3.5 text-cyan-400" />
                <span>{occupiedStations}/{totalStations} جهاز</span>
              </div>
            </div>
          </div>

          {/* Left Side (RTL): Super Cool Cyber Arrow Button (السهم الخفن) */}
          <div className="flex items-center justify-end">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => {
                unlockAudioContext();
                setIsOpenInOtherPages(!isOpenInOtherPages);
              }}
              className={`h-9 px-3.5 rounded-xl border text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                isOpenInOtherPages
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/30'
                  : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/40 hover:border-emerald-400 shadow-emerald-950/40'
              }`}
            >
              <span className="text-[11px] font-bold">
                {isOpenInOtherPages ? 'إخفاء الإحصائيات' : 'عرض الإحصائيات'}
              </span>

              {/* High-Tech Animated Rotating Arrow Icon */}
              <motion.div
                animate={{ rotate: isOpenInOtherPages ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="w-5 h-5 rounded-lg bg-black/20 flex items-center justify-center shrink-0"
              >
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              </motion.div>
            </motion.button>
          </div>

        </div>

        {/* Expandable Section with Framer Motion Spring */}
        <AnimatePresence>
          {isOpenInOtherPages && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden pt-3 border-t border-emerald-500/20"
            >
              {renderCardsGrid()}

              {/* Bottom Quick-Collapse Strip */}
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>يتم تحديث جميع القيم تلقائياً وبشکل لحظي.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpenInOtherPages(false)}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <span>▲ طي وإغلاق النافذة</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
