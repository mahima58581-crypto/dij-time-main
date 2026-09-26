import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Tv, 
  Gamepad2, 
  Eye, 
  EyeOff, 
  Coffee, 
  Receipt,
  Play,
  Car
} from 'lucide-react';
import { Station, Session, StationType } from '../types';
import { 
  formatCurrency, 
  calculatePlayCost,
  formatDurationDigital
} from '../utils/formatters';
import { useLiveTimer } from '../hooks/useLiveTimer';
import { CyberSectionIcon } from './CyberSectionIcon';

interface StationsGridProps {
  stations: Station[];
  sessions: Session[];
  onStartSession: (stationId: string) => void;
  onAddSnack: (session: Session) => void;
  onEditGames: (session: Session) => void;
  onCheckoutSession: (session: Session) => void;
}

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
        return <Monitor className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'PS5':
        return <Tv className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'VIP_SIM':
        return <Car className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <section className="space-y-4 pt-2">
      
      {/* عنوان وقسم المحطات والأجهزة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <CyberSectionIcon icon={Monitor} size="lg" variant="emerald" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-gaming">
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

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                key={station.id}
                id={`station-card-${station.id}`}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  activeSession
                    ? isOvertime
                      ? 'bg-white dark:bg-[#13080d] border-rose-500/70 ring-1 ring-rose-500/30'
                      : 'bg-white dark:bg-[#0c121e] border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'bg-white dark:bg-[#0d121f] border-slate-200/90 dark:border-slate-800/80 hover:border-emerald-500/40'
                }`}
              >
                {/* رأس الكارت الموحد */}
                <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/70">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      activeSession
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
                    }`}>
                      {getStationIcon(station.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-gaming">
                          {station.name}
                        </h3>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {station.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                        {formatCurrency(station.hourlyRate)} / ساعة
                      </div>
                    </div>
                  </div>

                  {/* شارة الحالة البسيطة والواضحة */}
                  <div>
                    {activeSession ? (
                      isOvertime ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          وقت إضافي
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          قيد اللعب
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        شاغر
                      </span>
                    )}
                  </div>
                </div>

                {/* منطقة المعلومات المركزية - خالية من التكدس وبارتفاع متناسق تماماً */}
                <div className="p-4 h-[104px] flex flex-col justify-center">
                  {activeSession ? (
                    <div className="space-y-3">
                      {/* التوقيت الرقمي وتكلفة الجلسة الحية */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">
                            الوقت المنقضي:
                          </div>
                          <div className="text-2xl font-black font-mono tracking-wider text-slate-900 dark:text-white font-mono-digits">
                            {formatDurationDigital(elapsedSeconds)}
                          </div>
                        </div>

                        <div className="text-left">
                          <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">
                            الحساب الحالي:
                          </div>
                          <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 font-mono-digits">
                            {formatCurrency(currentTotalCost)}
                          </div>
                        </div>
                      </div>

                      {/* شريط معلومات اللاعب ورمز PIN */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                          <span className="text-slate-400">اللاعب:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {activeSession.customerName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px]">
                          {activeSession.snacks.length > 0 && (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              +{activeSession.snacks.length} تسالي
                            </span>
                          )}
                          <span className="font-mono text-slate-500 dark:text-slate-400">
                            PIN: {isRevealed ? activeSession.customerPin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePin(activeSession.id)}
                            className="text-slate-400 hover:text-emerald-600 transition"
                            title={isRevealed ? 'إخفاء PIN' : 'إظهار PIN'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        المحطة جاهزة للاستقبال
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {station.specs || 'شاشة عالية السرعة • عتاد قيمنق احترافي'}
                      </p>
                    </div>
                  )}
                </div>

                {/* أزرار الإجراءات السفلية الموحدة */}
                <div className="h-[54px] p-2.5 px-4 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                  {activeSession ? (
                    <>
                      <button
                        type="button"
                        id={`btn-snack-action-${station.id}`}
                        onClick={() => onAddSnack(activeSession)}
                        className="h-9 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 shrink-0"
                      >
                        <Coffee className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>تسالي</span>
                      </button>

                      <button
                        type="button"
                        id={`btn-checkout-action-${station.id}`}
                        onClick={() => onCheckoutSession(activeSession)}
                        className="flex-1 h-9 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>إنهاء وحساب الجلسة</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      id={`btn-start-session-${station.id}`}
                      onClick={() => onStartSession(station.id)}
                      className="w-full h-9 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>بدء جلسة جديدة</span>
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
              <Monitor className="w-6 h-6" />
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

