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
  Flame,
  User,
  Activity,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Session, Station } from '../types';
import { 
  formatCurrency, 
  calculatePlayCost
} from '../utils/formatters';
import { play10MinWarningSound, speakVoiceAlert, unlockAudioContext } from '../utils/audioAlerts';
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
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-600/10 to-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-xl blur-xs" />
            <Monitor className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] relative z-10 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>
        );
      case 'PS5':
        return (
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-600/10 to-slate-900 border border-blue-500/40 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <div className="absolute inset-0 bg-blue-500/10 rounded-xl blur-xs" />
            <Gamepad2 className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] relative z-10 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-950" />
          </div>
        );
      case 'XBOX':
        return (
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500/20 via-emerald-600/10 to-slate-900 border border-green-500/40 flex items-center justify-center shadow-md shadow-green-500/20 shrink-0">
            <div className="absolute inset-0 bg-green-500/10 rounded-xl blur-xs" />
            <Tv className="w-5 h-5 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] relative z-10 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-slate-950" />
          </div>
        );
      case 'VIP_SIM':
        return (
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-slate-900 border border-amber-500/40 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <div className="absolute inset-0 bg-amber-500/10 rounded-xl blur-xs" />
            <Car className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] relative z-10 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-slate-950" />
          </div>
        );
      default:
        return (
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500/20 via-indigo-600/10 to-slate-900 border border-purple-500/40 flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
            <div className="absolute inset-0 bg-purple-500/10 rounded-xl blur-xs" />
            <Gamepad2 className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] relative z-10 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-slate-950" />
          </div>
        );
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <CyberSectionIcon icon={CyberLiveChronoTimerIcon} size="lg" variant="emerald" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-gaming">
                بطاقات التوقيت والمؤقتات المباشرة للجلسات
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono-digits">
                {activeSessions.length} جلسات نشطة
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                  className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-lg ${
                    isOvertime
                      ? 'station-glow-alert bg-white dark:bg-[#14080e] border-rose-500 ring-2 ring-rose-500/40 shadow-rose-950/20'
                      : 'station-glow-active bg-white dark:bg-[#070b14] border-emerald-400/80 dark:border-emerald-500/50 hover:border-emerald-400 ring-1 ring-emerald-400/30 dark:ring-emerald-500/20 shadow-emerald-950/20'
                  }`}
                >
                  {/* Cyber Accent Top Glow Bar */}
                  <div className={`h-1 w-full bg-gradient-to-r ${
                    isOvertime 
                      ? 'from-rose-500 via-amber-400 to-rose-600' 
                      : 'from-emerald-500 via-teal-400 to-emerald-500'
                  }`} />

                  {/* سربرگ کارت - Cyber Header */}
                  <div className="p-3.5 bg-slate-50/95 dark:bg-[#0c1220] border-b border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {getStationEmblem(session.stationType)}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-black text-slate-950 dark:text-white text-base sm:text-[17px] font-gaming tracking-wide leading-tight drop-shadow-xs">
                            {session.stationName}
                          </h3>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase font-mono tracking-wider bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                            {session.stationType}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono-digits flex items-center gap-1.5 mt-1">
                          <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>
                            {session.sessionType === 'open' ? 'وقت مفتوح' : `حجز ${session.allocatedMinutes} دقيقة`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 self-start mt-0.5">
                      {isOvertime ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-rose-500/15 text-rose-500 border border-rose-500/40 shadow-xs uppercase tracking-wide animate-pulse">
                          <Flame className="w-3.5 h-3.5" />
                          <span>إضافي!</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/35 uppercase tracking-wide shadow-2xs">
                          قيد اللعب
                        </span>
                      )}
                    </div>
                  </div>

                  {/* جعبه تایمر دیجیتالی و محتوای کارت */}
                  <div className="p-3.5 space-y-3">
                    
                    {/* باکس تایمر دیجیتالی Cockpit HUD با زوایای سایبری - در لایت مود کاملاً سفید و روشن */}
                    <div className="relative bg-white dark:bg-slate-950/95 border border-emerald-200/90 dark:border-emerald-500/40 rounded-xl p-3.5 text-center shadow-xs dark:shadow-inner flex flex-col items-center justify-center overflow-hidden transition-colors">
                      {/* Corner HUD Brackets */}
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400 dark:border-emerald-400/60 pointer-events-none" />
                      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400 dark:border-emerald-400/60 pointer-events-none" />
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400 dark:border-emerald-400/60 pointer-events-none" />
                      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400 dark:border-emerald-400/60 pointer-events-none" />

                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400/90 flex items-center gap-1 mb-1 font-mono font-bold tracking-wider uppercase">
                        <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>مؤقت الجلسة المباشر (LIVE HUD)</span>
                      </div>
                      
                      <CyberDigitalTimer
                        seconds={elapsedSeconds}
                        variant={isOvertime ? 'red' : 'emerald'}
                        size="md"
                        isOvertime={isOvertime}
                        showProgressRing={true}
                        progressPercent={isFixed ? Math.min(100, Math.round((elapsedSeconds / totalAllocatedSec) * 100)) : ((elapsedSeconds % 3600) / 3600) * 100}
                      />

                      <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 mt-2 font-mono-digits w-full px-1">
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <span>دخول:</span>
                          <strong className="text-slate-800 dark:text-slate-300 font-mono">{new Date(session.checkInTime).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</strong>
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{formatCurrency(session.hourlyRate)} / س</span>
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
                          : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
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
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-2xs transition cursor-pointer"
                          title="اعلان صوتی هشدار زمان به بازیکن"
                        >
                          <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>نداء صوتي</span>
                        </button>
                      </div>
                    )}

                    {/* اطلاعات بازیکن و کد PIN */}
                    <div className="bg-slate-50 dark:bg-[#0c1222] p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                          <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          اللاعب:
                        </span>
                        <strong className="text-slate-900 dark:text-white font-bold font-gaming text-[12px]">{session.customerName}</strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          رقم الهاتف:
                        </span>
                        <span dir="ltr" className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold font-mono-digits text-[11px]">
                          {session.customerPhone}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/80 dark:border-slate-800/80">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          رمز PIN:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-slate-700 text-xs font-mono-digits tracking-wider">
                            {isPinVisible ? session.customerPin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePin(session.id)}
                            className="text-slate-400 hover:text-emerald-600 p-0.5 transition cursor-pointer"
                            title={isPinVisible ? 'إخفاء الرمز' : 'إظهار رمز PIN'}
                          >
                            {isPinVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* بازی‌های فعال */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-bold">
                          <Gamepad2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          الألعاب الجارية:
                        </span>
                        <button
                          onClick={() => onEditGames(session)}
                          className="text-emerald-600 dark:text-emerald-400 hover:underline text-[10px] font-bold cursor-pointer"
                        >
                          + تعديل الألعاب
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {session.gamesPlayed.map((g, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border flex items-center gap-1 shadow-2xs ${
                              g.mode === 'online'
                                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-300/80 dark:border-teal-700/80'
                                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-700/80'
                            }`}
                          >
                            <span>{g.gameName}</span>
                            <span className="text-[9px] font-black">({g.mode === 'online' ? 'أونلاين' : 'أوفلاين'})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* بخش بوفه و خوراکی */}
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                        <Coffee className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>طلبات البوفيه:</span>
                        <strong className="text-slate-900 dark:text-slate-200 font-mono font-mono-digits font-bold">
                          {session.snacks.length > 0 ? `${session.snacks.length} طلب` : 'لا يوجد'}
                        </strong>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAddSnack(session)}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>+ إضافة بوفيه</span>
                      </motion.button>
                    </div>

                    {/* مبالغ زنده به دینار - Cyber HUD Cost Box - در لایت مود سفید و شیک */}
                    <div className="p-3 bg-white dark:bg-gradient-to-r dark:from-slate-950 dark:via-[#0a1220] dark:to-slate-950 border border-emerald-200/90 dark:border-emerald-500/30 rounded-xl flex items-center justify-between text-slate-900 dark:text-white shadow-xs dark:shadow-md transition-colors">
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">إجمالي الحساب حتى الآن:</div>
                        <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 font-mono-digits drop-shadow-xs dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                          {formatCurrency(totalDue)}
                        </div>
                      </div>
                      {snacksCost > 0 && (
                        <div className="text-left text-[10px] text-orange-600 dark:text-orange-400 font-bold font-mono-digits">
                          البوفيه: {formatCurrency(snacksCost)}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* دکمه تسویه نهایی - Badass Esports Checkout Action */}
                  <div className="p-3 bg-slate-50/90 dark:bg-[#070b14] border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onCheckoutSession(session)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 font-gaming tracking-wide cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-white stroke-[2.5]" />
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

