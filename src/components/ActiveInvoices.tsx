import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ReceiptText,
  PlusCircle,
  Search,
  Coffee,
  CreditCard,
  Gamepad2,
  AlertTriangle,
  Eye,
  EyeOff,
  Timer,
  Wallet,
} from 'lucide-react';
import { Session, Station, StationType } from '../types';
import { formatCurrency, formatDurationDigital } from '../utils/formatters';
import { CyberSectionIcon } from './CyberSectionIcon';
import { PLATFORM_META } from './platformMeta';

interface ActiveInvoicesProps {
  sessions: Session[];
  stations: Station[];
  onOpenAddSnack: (session: Session) => void;
  onOpenCheckout: (session: Session) => void;
  onOpenEditGames: (session: Session) => void;
  onStartNewSession: () => void;
}

type PlatformFilter = 'all' | StationType;

// متای تب «الكل» — همان ساختار PLATFORM_META با هویت سبز امرالد
const ALL_META = {
  label: 'الكل',
  icon: Gamepad2,
  accent: 'from-emerald-500 to-teal-600',
  softBg:
    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/60',
  text: 'text-emerald-600 dark:text-emerald-400',
  ring: 'ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10',
};

export const ActiveInvoices: React.FC<ActiveInvoicesProps> = ({
  sessions,
  stations,
  onOpenAddSnack,
  onOpenCheckout,
  onOpenEditGames,
  onStartNewSession,
}) => {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all');
  const [now, setNow] = useState(Date.now());
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePin = (sessionId: string) => {
    setRevealedPins((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const activeSessions = sessions.filter((s) => s.status === 'active');

  const filteredSessions = activeSessions.filter((s) => {
    if (platformFilter !== 'all' && s.stationType !== platformFilter) return false;
    return (
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.stationName.toLowerCase().includes(search.toLowerCase()) ||
      s.customerPhone.includes(search)
    );
  });

  // Live totals
  const totalActiveRevenue = activeSessions.reduce((sum, s) => {
    const elapsedMinutes = Math.max(
      1,
      Math.floor((now - new Date(s.checkInTime).getTime()) / (1000 * 60))
    );
    const liveTimeCost = Math.round((elapsedMinutes / 60) * s.hourlyRate);
    const snacksCost = s.snacks?.reduce((acc, snk) => acc + snk.totalPrice, 0) || 0;
    return sum + (liveTimeCost + snacksCost - (s.discount || 0));
  }, 0);

  const platformCounts = (['PC', 'PS5', 'XBOX', 'VIP_SIM'] as StationType[]).reduce(
    (acc, t) => {
      acc[t] = activeSessions.filter((s) => s.stationType === t).length;
      return acc;
    },
    {} as Record<StationType, number>
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-emerald-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <CyberSectionIcon icon={ReceiptText} size="lg" variant="teal" />
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              الفواتير النشطة والحسابات الجارية
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              متابعة فورية لوقت اللعب، طلبات البوفيه، احتساب التكلفة بدقة وتسوية الحساب النهائي للاعبين
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left bg-white dark:bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
              إجمالي المبالغ الجارية:
            </div>
            <div className="text-base font-black font-mono text-emerald-800 dark:text-emerald-400 font-mono-digits">
              {formatCurrency(totalActiveRevenue)}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartNewSession}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition font-gaming"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>بدء جلسة جديدة</span>
          </motion.button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-slate-200 dark:border-slate-800/80 shadow-xs overflow-hidden">
        {/* نوار گرادینت رنگ‌های پلتفرم‌ها */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-l from-cyan-500 via-blue-500 via-emerald-500 to-amber-500" />

        <div className="relative flex-1 min-w-0 sm:flex-none sm:w-56">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم اللاعب أو المحطة..."
            className="w-full pl-3 pr-10 py-2.5 text-xs font-medium bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition"
          />
        </div>

        {/* Platform Filter Tabs — کنترل بخش‌بندی‌شده یک‌خطی */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/50">
          {(['all', 'PC', 'PS5', 'XBOX', 'VIP_SIM'] as const).map((type) => {
            const meta = type === 'all' ? ALL_META : PLATFORM_META[type];
            const Icon = meta.icon;
            const active = platformFilter === type;
            const count =
              type === 'all' ? activeSessions.length : platformCounts[type];
            return (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={type}
                onClick={() => setPlatformFilter(type)}
                title={meta.label}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? `bg-gradient-to-r ${meta.accent} text-white shadow-sm`
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700/60 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">{meta.label}</span>
                <span
                  className={`font-mono font-mono-digits text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    active
                      ? 'bg-white/25 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ─── Invoices Stacked (زیر هم) ─── */}
      {activeSessions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 dark-card border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3 shadow-xs">
          <ReceiptText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            لا توجد فواتير نشطة حالياً
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            لبدء اللعب وإصدار الفواتير اضغط على زر «بدء جلسة جديدة»
          </p>
          <button
            onClick={onStartNewSession}
            className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 hover:brightness-105 transition font-gaming"
          >
            + تسجيل وبدء جلسة جديدة
          </button>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 dark-card border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3 shadow-xs">
          <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            لا توجد فواتير مطابقة للبحث أو التصفية الحالية
          </p>
          <button
            onClick={() => {
              setSearch('');
              setPlatformFilter('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
          >
            إظهار جميع الفواتير النشطة
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session, index) => {
            const elapsedMs = now - new Date(session.checkInTime).getTime();
            const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
            const elapsedMinutes = Math.max(1, Math.floor(elapsedMs / (1000 * 60)));
            const liveTimeCost = Math.round((elapsedMinutes / 60) * session.hourlyRate);
            const liveSnacksCost =
              session.snacks?.reduce((acc, snk) => acc + snk.totalPrice, 0) || 0;
            const liveFinalAmount = Math.max(
              0,
              liveTimeCost + liveSnacksCost - (session.discount || 0)
            );

            const isFixed = session.sessionType === 'fixed';
            const allocated = session.allocatedMinutes || 60;
            const remainingMins = allocated - elapsedMinutes;
            const isNearEnd = isFixed && remainingMins <= 10 && remainingMins > 0;
            const isOvertime = isFixed && remainingMins <= 0;
            const consumedPct = isFixed
              ? Math.min(100, Math.round((elapsedMinutes / allocated) * 100))
              : 0;

            const meta = PLATFORM_META[session.stationType] || PLATFORM_META.PC;
            const PlatformIcon = meta.icon;
            const isRevealed = !!revealedPins[session.id];
            const barClass = isOvertime
              ? 'bg-rose-500'
              : isNearEnd
              ? 'bg-amber-500'
              : `bg-gradient-to-r ${meta.accent}`;

            return (
              <motion.div
                key={session.id}
                dir="rtl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                whileHover={{ y: -3 }}
                className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 overflow-hidden ${meta.ring}`}
              >
                {/* خط الألوان المميز للمنصة */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${meta.accent}`} />

                <div className="p-5 space-y-4">
                  {/* الصف الأول: لوغو المنصة + بيانات اللاعب + حالة الجلسة */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div
                        className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-md ${meta.badge}`}
                      >
                        <PlatformIcon className="w-10 h-10" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-black text-slate-900 dark:text-white">
                            {session.customerName}
                          </h3>
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-mono-digits font-bold shadow-2xs">
                            {session.stationName}
                          </span>
                          <span className={`text-[11px] font-bold ${meta.text}`}>
                            {meta.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                          <span>
                            الهاتف:{' '}
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 font-mono-digits">
                              {session.customerPhone}
                            </span>
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="flex items-center gap-1.5">
                            الرمز السري:{' '}
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 font-mono-digits tracking-widest">
                              {isRevealed ? session.customerPin : '••••'}
                            </span>
                            <button
                              onClick={() => togglePin(session.id)}
                              className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                              title={isRevealed ? 'إخفاء الرمز' : 'إظهار الرمز'}
                            >
                              {isRevealed ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* حالة الجلسة */}
                    <div className="text-left shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border shadow-xs ${meta.chip}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full animate-ping ${
                            isOvertime ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        ></span>
                        {isFixed ? `جلسة محددة (${allocated} دقيقة)` : 'وقت مفتوح'}
                      </span>
                      {isOvertime && (
                        <div className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-1.5 flex items-center gap-1 justify-end">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>انتهى وقت الحجز — وقت إضافي!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* الصف الثاني: عداد الوقت الرقمي الحي + التكاليف */}
                  <div
                    className={`grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-3.5 rounded-xl border ${meta.softBg}`}
                  >
                    <div className="col-span-2 lg:col-span-1 flex items-center justify-between lg:justify-center gap-3 border-b lg:border-b-0 lg:border-l border-slate-200/60 dark:border-slate-700/60 pb-2.5 lg:pb-0 lg:pr-3">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Timer className={`w-4 h-4 ${meta.text}`} />
                        الوقت المنقضي
                      </span>
                      <span className="text-xl font-black font-mono tracking-wider text-slate-900 dark:text-white font-mono-digits">
                        {formatDurationDigital(elapsedSeconds)}
                      </span>
                    </div>
                    <div className="text-center lg:border-l border-slate-200/60 dark:border-slate-700/60 lg:px-3">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                        تكلفة اللعب
                      </div>
                      <div className={`text-sm font-black mt-1 font-mono font-mono-digits ${meta.text}`}>
                        {formatCurrency(liveTimeCost)}
                      </div>
                    </div>
                    <div className="text-center lg:border-l border-slate-200/60 dark:border-slate-700/60 lg:px-3">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                        البوفيه ({session.snacks?.length || 0})
                      </div>
                      <div className="text-sm font-black mt-1 font-mono font-mono-digits text-amber-600 dark:text-amber-400">
                        {formatCurrency(liveSnacksCost)}
                      </div>
                    </div>
                    <div className="text-center lg:border-l border-slate-200/60 dark:border-slate-700/60 lg:px-3">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                        الألعاب ({session.gamesPlayed?.length || 0})
                      </div>
                      <div className="text-sm font-black mt-1 font-mono font-mono-digits text-slate-900 dark:text-white">
                        {session.gamesPlayed?.length || 0} لعبة
                      </div>
                    </div>
                  </div>

                  {/* شريط استهلاك الوقت للجلسات المحددة */}
                  {isFixed && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500 dark:text-slate-400">
                          استهلاك وقت الحجز
                        </span>
                        <span
                          className={
                            isOvertime
                              ? 'text-rose-600 dark:text-rose-400'
                              : isNearEnd
                              ? 'text-amber-600 dark:text-amber-400'
                              : meta.text
                          }
                        >
                          {isOvertime
                            ? 'تجاوز الوقت!'
                            : `${Math.max(0, remainingMins)} دقيقة متبقية • ${consumedPct}%`}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${barClass}`}
                          style={{ width: `${consumedPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Snacks List Mini Preview */}
                  {session.snacks && session.snacks.length > 0 && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs space-y-2">
                      <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                        <Coffee className={`w-3.5 h-3.5 ${meta.text}`} />
                        <span>طلبات البوفيه المسجلة:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {session.snacks.map((snk, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] flex items-center gap-1.5 shadow-xs"
                          >
                            <span className="text-slate-900 dark:text-white font-bold">
                              {snk.name}
                            </span>
                            <span
                              className={`font-black font-mono font-mono-digits px-1.5 rounded border ${meta.chip}`}
                            >
                              ×{snk.quantity}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* الإجمالي وأزرار الإجراءات */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5" />
                        المبلغ النهائي للفاتورة:
                      </div>
                      <div className="text-2xl font-black font-mono font-mono-digits text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(liveFinalAmount)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenAddSnack(session)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition shadow-xs ${meta.chip} hover:brightness-95 dark:hover:brightness-125`}
                      >
                        <Coffee className="w-4 h-4" />
                        <span>+ بوفيه</span>
                      </button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onOpenCheckout(session)}
                        className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/20 flex items-center gap-2 transition font-gaming"
                      >
                        <CreditCard className="w-4 h-4 stroke-[2.5]" />
                        <span>تسوية وطباعة الفاتورة</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
