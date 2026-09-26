import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Gamepad2, 
  Coffee, 
  Clock, 
  Monitor, 
  Coins,
  Wifi
} from 'lucide-react';
import { formatCurrency, formatDuration } from '../utils/formatters';
import { Session, Station } from '../types';

interface StatsBarProps {
  sessions: Session[];
  stations: Station[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ sessions, stations }) => {
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
  const activeSessions = sessions.filter((s) => s.status === 'active').length;

  const cardVariants = {
    hover: { y: -4, transition: { type: 'spring' as const, stiffness: 350, damping: 20 } }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 my-5">
      
      {/* إجمالي إيرادات اليوم */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0c101c] border border-emerald-200/80 dark:border-emerald-800/80 hover:border-emerald-500/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-emerald-500/10 transition-all relative overflow-hidden group cursor-default"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors"></div>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي إيرادات اليوم</span>
          
          {/* Animated Cyber Icon */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.2, rotate: 8 }}
            className="w-9 h-9 rounded-xl p-[1.5px] bg-gradient-to-tr from-amber-500 via-emerald-400 to-teal-500 shadow-sm group-hover:shadow-[0_0_16px_rgba(245,158,11,0.5)] transition-shadow duration-300"
          >
            <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#090f1d] flex items-center justify-center text-amber-500 dark:text-amber-400 relative overflow-hidden">
              <Coins className="w-4 h-4 stroke-[2.2] transition-transform group-hover:scale-110" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-amber-400 group-hover:animate-ping" />
            </div>
          </motion.div>
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 relative z-10 font-mono-digits">
          {formatCurrency(totalRevenue)}
        </div>
        <div className="mt-1 text-[10px] xl:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium relative z-10 whitespace-nowrap overflow-hidden">
          <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="whitespace-nowrap truncate" title="وقت اللعب + مبيعات البوفيه">وقت اللعب + مبيعات البوفيه</span>
        </div>
      </motion.div>

      {/* دخل ساعات اللعب */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0c101c] border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-emerald-500/10 transition-all relative overflow-hidden group cursor-default"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap truncate">إيرادات ساعات اللعب</span>
          
          {/* Animated Cyber Icon */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            whileHover={{ scale: 1.2, rotate: -8 }}
            className="w-9 h-9 rounded-xl p-[1.5px] bg-gradient-to-tr from-teal-500 via-cyan-400 to-emerald-500 shadow-sm group-hover:shadow-[0_0_16px_rgba(20,184,166,0.5)] transition-shadow duration-300"
          >
            <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#090f1d] flex items-center justify-center text-teal-600 dark:text-teal-400 relative overflow-hidden">
              <Clock className="w-4 h-4 stroke-[2.2] transition-transform group-hover:scale-110" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-teal-400 group-hover:animate-ping" />
            </div>
          </motion.div>
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-slate-800 dark:text-slate-100 font-mono-digits">
          {formatCurrency(playtimeRevenue)}
        </div>
        <div className="mt-1 text-[10px] xl:text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap truncate" title="احتساب دقيق بالدقيقة">
          احتساب دقيق بالدقيقة
        </div>
      </motion.div>

      {/* دخل بوفيه التسالي */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0c101c] border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-emerald-500/10 transition-all relative overflow-hidden group cursor-default"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap truncate">مبيعات البوفيه والتسالي</span>
          
          {/* Animated Cyber Icon */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            whileHover={{ scale: 1.2, rotate: 8 }}
            className="w-9 h-9 rounded-xl p-[1.5px] bg-gradient-to-tr from-amber-500 via-orange-400 to-teal-500 shadow-sm group-hover:shadow-[0_0_16px_rgba(249,115,22,0.5)] transition-shadow duration-300"
          >
            <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#090f1d] flex items-center justify-center text-amber-600 dark:text-amber-400 relative overflow-hidden">
              <Coffee className="w-4 h-4 stroke-[2.2] transition-transform group-hover:scale-110" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-orange-400 group-hover:animate-ping" />
            </div>
          </motion.div>
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-slate-800 dark:text-slate-100 font-mono-digits">
          {formatCurrency(snacksRevenue)}
        </div>
        <div className="mt-1 text-[10px] xl:text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap truncate" title="مشروبات طاقة، وجبات ومقرمشات">
          مشروبات طاقة، وجبات ومقرمشات
        </div>
      </motion.div>

      {/* الأجهزة المشغولة */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0c101c] border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-emerald-500/10 transition-all relative overflow-hidden group cursor-default"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap truncate">الأجهزة المشغولة</span>
          
          {/* Animated Cyber Icon */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            whileHover={{ scale: 1.2, rotate: -8 }}
            className="w-9 h-9 rounded-xl p-[1.5px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 shadow-sm group-hover:shadow-[0_0_16px_rgba(16,185,129,0.5)] transition-shadow duration-300"
          >
            <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#090f1d] flex items-center justify-center text-emerald-600 dark:text-emerald-400 relative overflow-hidden">
              <Monitor className="w-4 h-4 stroke-[2.2] transition-transform group-hover:scale-110" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-emerald-400 group-hover:animate-ping" />
            </div>
          </motion.div>
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 font-mono-digits">
          {occupiedStations} <span className="text-xs font-bold text-slate-400 dark:text-slate-500">/ {totalStations}</span>
        </div>
        <div className="mt-1 text-[10px] xl:text-[11px] text-slate-400 dark:text-slate-500 font-medium font-mono-digits whitespace-nowrap truncate">
          نسبة الإشغال {Math.round((occupiedStations / totalStations) * 100)}%
        </div>
      </motion.div>

      {/* سرعة الإنترنت والشبكة (Internet Speed & Ping) */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0c101c] border border-slate-200/80 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-cyan-500/10 transition-all relative overflow-hidden group cursor-default"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap truncate">سرعة الإنترنت (فايبر)</span>
          
          {/* Animated Cyber Icon */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            whileHover={{ scale: 1.2, rotate: 8 }}
            className="w-9 h-9 rounded-xl p-[1.5px] bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-500 shadow-sm group-hover:shadow-[0_0_16px_rgba(6,182,212,0.5)] transition-shadow duration-300"
          >
            <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#090f1d] flex items-center justify-center text-cyan-600 dark:text-cyan-400 relative overflow-hidden">
              <Wifi className="w-4 h-4 stroke-[2.2] transition-transform group-hover:scale-110" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-cyan-400 group-hover:animate-ping" />
            </div>
          </motion.div>
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 font-mono-digits flex items-baseline gap-1">
          <span>950</span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">Mbps</span>
        </div>
        <div className="mt-1 text-[10px] xl:text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap truncate" title="بينغ 8ms • اتصال ألياف ضوئية فايبر">
          بينغ 8ms • اتصال ألياف ضوئية فايبر
        </div>
      </motion.div>

      {/* مجموع ساعات اللعب */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white dark:bg-[#0c101c] border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-emerald-500/10 transition-all relative overflow-hidden group cursor-default"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap truncate">ساعات اللعب اليوم</span>
          
          {/* Animated Cyber Icon */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            whileHover={{ scale: 1.2, rotate: -8 }}
            className="w-9 h-9 rounded-xl p-[1.5px] bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-500 shadow-sm group-hover:shadow-[0_0_16px_rgba(16,185,129,0.5)] transition-shadow duration-300"
          >
            <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#090f1d] flex items-center justify-center text-teal-600 dark:text-teal-400 relative overflow-hidden">
              <Clock className="w-4 h-4 stroke-[2.2] transition-transform group-hover:scale-110" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-emerald-400 group-hover:animate-ping" />
            </div>
          </motion.div>
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 font-mono-digits">
          {(totalMinutesPlayed / 60).toFixed(1)} <span className="text-xs font-bold text-slate-400 dark:text-slate-500">ساعة</span>
        </div>
        <div className="mt-1 text-[10px] xl:text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap truncate" title={formatDuration(totalMinutesPlayed)}>
          {formatDuration(totalMinutesPlayed)}
        </div>
      </motion.div>

    </div>
  );
};

