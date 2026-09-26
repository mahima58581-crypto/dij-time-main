import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Gamepad2, 
  Coffee, 
  Receipt, 
  KeyRound, 
  Phone, 
  Eye, 
  EyeOff, 
  Plus, 
  Monitor, 
  Tv, 
  Car, 
  PlayCircle,
  Sparkles,
  Volume2,
  Bell,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { Session, Station } from '../types';
import { 
  formatCurrency, 
  calculatePlayCost
} from '../utils/formatters';
import { play10MinWarningSound, speakVoiceAlert, unlockAudioContext } from '../utils/audioAlerts';
import { CyberHardwareBadge } from './CyberHardwareBadge';
import { CyberDigitalTimer } from './CyberDigitalTimer';
import { CyberSectionIcon } from './CyberSectionIcon';

interface LiveTimeCardsProps {
  sessions: Session[];
  stations: Station[];
  onAddSnack: (session: Session) => void;
  onEditGames: (session: Session) => void;
  onCheckoutSession: (session: Session) => void;
  onStartNewSession: (stationId?: string) => void;
}

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

  const getStationIcon = (type: string) => {
    switch (type) {
      case 'PC':
        return <Monitor className="w-4 h-4 text-emerald-600" />;
      case 'PS5':
        return <Tv className="w-4 h-4 text-emerald-600" />;
      case 'VIP_SIM':
        return <Car className="w-4 h-4 text-teal-600" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <section className="space-y-4">
      
      {/* عنوان وقسم التوقیت المباشر */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 15 }}
            className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20"
          >
            <Clock className="w-5 h-5 stroke-[2.5]" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-gaming">
                بطاقات التوقيت والمؤقتات المباشرة للجلسات
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono-digits">
                {activeSessions.length} جلسات نشطة
              </span>
            </div>
            <p className="text-xs text-slate-500">
              احتساب دقيق بالثواني، تمييز الألعاب أونلاين وأوفلاين وحساب التكلفة بالدينار العراقي
            </p>
          </div>
        </div>

        {/* مؤشر الحساب الآلی */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            احتساب تلقائي فوري بالدقائق والثواني
          </span>
        </div>
      </div>

      {/* در صورت عدم وجود نشست فعال */}
      {activeSessions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0c101c] border-2 border-dashed border-emerald-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-sm"
        >
          <CyberSectionIcon icon={Clock} size="xl" variant="emerald" />
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
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

              return (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                    isOvertime
                      ? 'station-glow-alert bg-white dark:bg-[#150a0f] border-rose-500 ring-2 ring-rose-500/50'
                      : 'station-glow-active bg-white dark:bg-[#0c121e] border-emerald-400 dark:border-emerald-500/80 ring-1 ring-emerald-400/40'
                  }`}
                >
                  {/* سربرگ کارت */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0e1320] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CyberHardwareBadge
                        type={session.stationType as any}
                        size="sm"
                        isActive={true}
                      />
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm font-gaming">
                          {session.stationName}
                        </h3>
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 font-mono-digits">
                          {session.sessionType === 'open' ? 'وقت مفتوح' : `حجز ${session.allocatedMinutes} دقيقة`}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isOvertime ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse">
                          <Flame className="w-3.5 h-3.5" />
                          إضافي!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          قيد اللعب
                        </span>
                      )}
                    </div>
                  </div>

                  {/* جعبه تایمر دیجیتالی سبز */}
                  <div className="p-4 space-y-3">
                    
                    {/* باکس تایمر دیجیتالی LED با حلقه پیشرفت */}
                    <div className="bg-slate-950 border border-emerald-500/30 dark:border-emerald-500/40 rounded-2xl p-3 text-center shadow-inner flex flex-col items-center justify-center">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>العداد الرقمي المباشر (LED):</span>
                      </div>
                      
                      <CyberDigitalTimer
                        seconds={elapsedSeconds}
                        variant={isOvertime ? 'red' : 'emerald'}
                        size="md"
                        isOvertime={isOvertime}
                        showProgressRing={true}
                        progressPercent={isFixed ? Math.min(100, Math.round((elapsedSeconds / totalAllocatedSec) * 100)) : ((elapsedSeconds % 3600) / 3600) * 100}
                      />

                      <div className="text-[10px] text-slate-400 pt-1.5 flex items-center justify-center gap-2 border-t border-slate-800/80 mt-2 font-mono-digits w-full">
                        <span>دخول: {new Date(session.checkInTime).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono font-bold">{formatCurrency(session.hourlyRate)} / ساعة</span>
                      </div>
                    </div>

                    {/* تنبیه زمان باقی مانده و اعلان صوتی سریع */}
                    {isFixed && (
                      <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isOvertime
                          ? 'bg-rose-950/40 border-rose-800 text-rose-300 animate-pulse'
                          : isUnder5Min
                          ? 'bg-amber-950/40 border-amber-800 text-amber-300 animate-pulse'
                          : isUnder10Min
                          ? 'bg-amber-950/20 border-amber-900/60 text-amber-300'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        <div className="flex items-center gap-1.5 font-mono-digits">
                          {isOvertime ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : (
                            <Bell className={`w-3.5 h-3.5 shrink-0 ${isUnder5Min ? 'text-amber-400' : 'text-slate-400'}`} />
                          )}
                          <span className="font-bold">
                            {isOvertime 
                              ? `وقت إضافي: +${Math.floor((elapsedSeconds - totalAllocatedSec) / 60)} دقيقة`
                              : `الوقت المتبقي: ${Math.ceil(remainingSec / 60)} دقيقة`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            unlockAudioContext();
                            play10MinWarningSound();
                            speakVoiceAlert(`تنبيه: متبقي ${Math.ceil(remainingSec / 60)} دقيقة لجهاز ${session.stationName}`);
                          }}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-2xs transition"
                          title="اعلان صوتی هشدار زمان به بازیکن"
                        >
                          <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>نداء صوتي</span>
                        </button>
                      </div>
                    )}

                    {/* اطلاعات بازیکن و کد PIN */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">اسم اللاعب:</span>
                        <strong className="text-slate-900 dark:text-slate-100 font-bold">{session.customerName}</strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          رقم الهاتف:
                        </span>
                        <span dir="ltr" className="font-mono text-emerald-600 dark:text-emerald-400 font-medium font-mono-digits">
                          {session.customerPhone}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          رمز PIN:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-emerald-200 dark:border-slate-700 text-xs font-mono-digits">
                            {isPinVisible ? session.customerPin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePin(session.id)}
                            className="text-slate-400 hover:text-emerald-600 p-0.5 transition"
                            title={isPinVisible ? 'إخفاء الرمز' : 'إظهار رمز PIN'}
                          >
                            {isPinVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* بازی‌های فعال */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Gamepad2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          الألعاب الجارية:
                        </span>
                        <button
                          onClick={() => onEditGames(session)}
                          className="text-emerald-600 dark:text-emerald-400 hover:underline text-[10px] font-semibold"
                        >
                          + تعديل الألعاب
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {session.gamesPlayed.map((g, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                              g.mode === 'online'
                                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            }`}
                          >
                            <span>{g.gameName}</span>
                            <span className="text-[9px] font-bold">({g.mode === 'online' ? 'أونلاين' : 'أوفلاين'})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* بخش بوفه و خوراکی */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                        <Coffee className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>طلبات البوفيه:</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-mono font-mono-digits">
                          {session.snacks.length > 0 ? `${session.snacks.length} طلب` : 'لا يوجد'}
                        </strong>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAddSnack(session)}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 flex items-center gap-0.5 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-slate-700 transition shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ إضافة بوفيه</span>
                      </motion.button>
                    </div>

                    {/* مبالغ زنده به دینار */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-white">
                      <div>
                        <div className="text-[10px] text-slate-400">إجمالي الحساب حتى الآن:</div>
                        <div className="text-base font-black font-mono text-emerald-400 font-mono-digits drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                          {formatCurrency(totalDue)}
                        </div>
                      </div>
                      <div className="text-left text-[10px] text-slate-400 font-mono-digits">
                        <div>الوقت: {formatCurrency(currentPlayCost)}</div>
                        {snacksCost > 0 && <div className="text-amber-400">البوفيه: {formatCurrency(snacksCost)}</div>}
                      </div>
                    </div>

                  </div>

                  {/* دکمه تسویه نهایی */}
                  <div className="p-3 bg-slate-50 dark:bg-[#0a0e18] border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onCheckoutSession(session)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-105 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 font-gaming"
                    >
                      <Receipt className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      <span>تسوية الحساب وإصدار الفاتورة</span>
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

