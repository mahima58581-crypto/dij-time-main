import { GamingPcIcon } from './GamingPcIcon';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Station, Session } from '../types';
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock, Grid, Navigation, ShieldCheck, Sparkles, Tag, Text, Wrench, X } from 'lucide-react';

interface CyberMarqueeTickerProps {
  clubName?: string;
  activeSessionsCount?: number;
  stations?: Station[];
  sessions?: Session[];
  embedded?: boolean;
}

interface TickerItem {
  id: string;
  icon: React.ReactNode;
  tag: string;
  tagColor: string;
  text: string;
  priority?: 'high' | 'medium' | 'normal';
}

export const CyberMarqueeTicker: React.FC<CyberMarqueeTickerProps> = ({
  clubName = 'DIJ-TIEM',
  activeSessionsCount = 0,
  stations = [],
  sessions = [],
  embedded = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [tickerTime, setTickerTime] = useState<number>(Date.now());

  // تحديث عداد الثواني للتنبيهات الحية كل 5 ثوانٍ
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerTime(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // توليد بطاقات الشريط الديناميكية بناءً على حالة الصالة الحقيقية
  const tickerItems: TickerItem[] = useMemo(() => {
    const items: TickerItem[] = [];

    // ۱. الأجهزة قيد التنظيف والتعقيم (Cleaning Stations)
    const cleaningStations = stations.filter((s) => s.status === 'cleaning');
    if (cleaningStations.length > 0) {
      items.push({
        id: 'cleaning-alert',
        icon: <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse shrink-0" />,
        tag: `🧹 تنظيف (${cleaningStations.length})`,
        tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        text: `يوجد ${cleaningStations.length} جهاز قيد التنظيف والتعقيم حالياً: [${cleaningStations.map(s => s.name).join(' ، ')}] وستتاح فور الانتهاء.`,
        priority: 'medium',
      });
    } else {
      items.push({
        id: 'cleaning-clean',
        icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
        tag: 'نظافة الأجهزة',
        tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        text: 'جاهزية النظافة: جميع محطات الأجهزة نظيفة ومعقمة 100% ولا توجد أجهزة قيد التنظيف.',
        priority: 'normal',
      });
    }

    // ۲. الأجهزة المعطلة أو تحت الصيانة (Maintenance / Broken Stations)
    const maintenanceStations = stations.filter((s) => s.status === 'maintenance');
    if (maintenanceStations.length > 0) {
      items.push({
        id: 'maintenance-alert',
        icon: <Wrench className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0 animate-bounce" />,
        tag: `🔧 صيانة وعطل (${maintenanceStations.length})`,
        tagColor: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/50 shadow-xs shadow-rose-500/25',
        text: `تنبيه الأجهزة: يوجد ${maintenanceStations.length} جهاز قيد الصيانة أو معطل حالياً: [${maintenanceStations.map(s => s.name).join(' ، ')}] قيد المعالجة.`,
        priority: 'high',
      });
    } else {
      items.push({
        id: 'maintenance-clean',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
        tag: 'سلامة العتاد',
        tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        text: 'كفاءة العتاد 100%: لا توجد أي أجهزة معطلة أو خارج الخدمة حالياً، جميع المنصات تعمل بكفاءة تامة.',
        priority: 'normal',
      });
    }

    // ۳. الأجهزة التي أوشكت على انتهاء وقتها (مثلاً 5 دقائق متبقية أو أقل)
    const activeTimedSessions = sessions.filter(
      (s) => s.status === 'active' && s.sessionType === 'fixed' && s.allocatedMinutes
    );

    const endingSoonList = activeTimedSessions.map((s) => {
      const startMs = new Date(s.checkInTime).getTime();
      const elapsedMinutes = (tickerTime - startMs) / (1000 * 60);
      const remainingMinutes = Math.round((s.allocatedMinutes || 60) - elapsedMinutes);
      return { session: s, remainingMinutes };
    });

    // فرز الأجهزة التي متبقي لها 5 دقائق أو أقل (بين 1 و 5 دقائق)
    const fiveMinSessions = endingSoonList.filter(
      (item) => item.remainingMinutes > 0 && item.remainingMinutes <= 5
    );

    // فرز الأجهزة التي تجاوزت الوقت المحدد (Overtime)
    const overtimeSessions = endingSoonList.filter((item) => item.remainingMinutes <= 0);

    if (fiveMinSessions.length > 0) {
      fiveMinSessions.forEach((item, idx) => {
        items.push({
          id: `ending-soon-${item.session.id}-${idx}`,
          icon: <Clock className="w-3.5 h-3.5 text-rose-400 animate-spin shrink-0" />,
          tag: `⚠️ متبقي ${item.remainingMinutes} دقائق`,
          tagColor: 'bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse',
          text: `تنبيه عاجل: الجهاز [${item.session.stationName}] للاعب (${item.session.customerName}) متبقي له ${item.remainingMinutes} دقائق فقط على نهاية الوقت!`,
          priority: 'high',
        });
      });
    } else if (overtimeSessions.length > 0) {
      overtimeSessions.forEach((item, idx) => {
        items.push({
          id: `overtime-${item.session.id}-${idx}`,
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
          tag: '⏰ وقت إضافي',
          tagColor: 'bg-rose-600/25 text-rose-300 border-rose-500/50',
          text: `الجهاز [${item.session.stationName}] للاعب (${item.session.customerName}) انتهى وقته المحدد منذ ${Math.abs(item.remainingMinutes)} دقيقة وبدأ الوقت الإضافي.`,
          priority: 'high',
        });
      });
    } else if (endingSoonList.length > 0) {
      // أقرب جهاز سينتهي وقته
      const nearest = [...endingSoonList].sort((a, b) => a.remainingMinutes - b.remainingMinutes)[0];
      if (nearest && nearest.remainingMinutes > 5) {
        items.push({
          id: 'nearest-ending',
          icon: <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
          tag: `⏱️ أقرب انتهاء`,
          tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          text: `أقرب جهاز سينتهي وقته: [${nearest.session.stationName}] للاعب (${nearest.session.customerName}) - متبقي ${nearest.remainingMinutes} دقيقة.`,
          priority: 'medium',
        });
      }
    } else {
      items.push({
        id: 'no-timed-alerts',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
        tag: 'حالة التوقيت',
        tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        text: 'حالة الوقت: لا توجد أجهزة قاربت على الانتهاء خلال الـ 5 دقائق الحالية (جميع الجلسات تعمل بانتظام).',
        priority: 'normal',
      });
    }

    // ٤. السعة والجاهزية العامة للأجهزة (Available vs In-Use)
    const inUseStations = stations.filter((s) => s.status === 'in-use').length;
    const availableStations = stations.filter((s) => s.status === 'available').length;

    items.push({
      id: 'general-capacity',
      icon: <GamingPcIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
      tag: 'سعة الصالة',
      tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      text: `إشغال الصالة: ${inUseStations} جهاز قيد اللعب • ${availableStations} جهاز شاغر وجاهز للاستقبال الفوري للاعبين.`,
      priority: 'normal',
    });

    return items;
  }, [stations, sessions, tickerTime]);

  // تدوير التنبيهات تلقائياً كل 5 ثوانٍ ما لم يتم التمرير بالماوس
  useEffect(() => {
    if (isPaused || tickerItems.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tickerItems.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, tickerItems.length]);

  // حماية من تجاوز الفهرس عند تحديث العناصر
  useEffect(() => {
    if (activeIndex >= tickerItems.length) {
      setActiveIndex(0);
    }
  }, [tickerItems.length, activeIndex]);

  if (!isVisible || tickerItems.length === 0) return null;

  const currentItem = tickerItems[activeIndex] || tickerItems[0];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative overflow-hidden bg-gradient-to-r from-emerald-50/95 via-slate-50 to-teal-50/95 dark:from-[#080d19] dark:via-[#0c1324] dark:to-[#080d19] border-b border-emerald-200/90 dark:border-emerald-500/25 text-slate-800 dark:text-slate-200 z-20 flex items-center transition-colors ${
        embedded 
          ? 'h-10 sm:h-11 px-3 sm:px-4' 
          : 'h-11 sm:h-12 px-3 sm:px-6 shadow-xs dark:shadow-md dark:shadow-black/40'
      }`}
      dir="rtl"
    >
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className={`${embedded ? 'w-full' : 'max-w-7xl w-full mx-auto'} flex items-center justify-between gap-3 text-xs`}>

        {/* عرض التنبيه المتحرك المتغير (Animated Ticker Message) */}
        <div className="flex-1 overflow-hidden relative min-h-[24px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs truncate w-full"
            >
              <span className="shrink-0">{currentItem.icon}</span>

              {/* Tag / شارة التصنيف مع اللون المخصص لكل نوع */}
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-black border shrink-0 font-mono-digits ${currentItem.tagColor}`}
              >
                {currentItem.tag}
              </span>

              {/* Text content / النص التوضيحي */}
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate text-[11px] sm:text-xs">
                {currentItem.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* أزرار التنقل والتحكم والعدّاد (Controls & Navigation) */}
        <div className="flex items-center gap-1 shrink-0 text-slate-500 dark:text-slate-400">
          {/* السابق */}
          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) => (prev - 1 + tickerItems.length) % tickerItems.length)
            }
            className="p-1 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="التنبيه السابق"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* ترقيم التنبيهات */}
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1 font-mono-digits">
            {activeIndex + 1}/{tickerItems.length}
          </span>

          {/* التالي */}
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % tickerItems.length)}
            className="p-1 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="التنبيه التالي"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* إغلاق الشريط */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition mr-1"
            title="إخفاء شريط التنبيهات"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
