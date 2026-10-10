import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Gamepad2, 
  Delete, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  Sparkles,
  KeyRound,
  ShieldAlert,
  RotateCcw,
  Zap,
  Check
} from 'lucide-react';
import { ClubSettings, StaffOperator } from '../types';
import { unlockAudioContext } from '../utils/audioAlerts';

interface AppEntryLockScreenProps {
  onUnlock: () => void;
  clubSettings: ClubSettings;
  currentOperator: StaffOperator;
}

const KEYPAD_KEYS = [
  { digit: '1', sub: 'ـ' },
  { digit: '2', sub: 'أ ب ت' },
  { digit: '3', sub: 'ث ج ح' },
  { digit: '4', sub: 'خ د ذ' },
  { digit: '5', sub: 'ر ز س' },
  { digit: '6', sub: 'ش ص ض' },
  { digit: '7', sub: 'ط ظ ع' },
  { digit: '8', sub: 'غ ف ق' },
  { digit: '9', sub: 'ك ل م' },
];

export const AppEntryLockScreen: React.FC<AppEntryLockScreenProps> = ({
  onUnlock,
  clubSettings,
  currentOperator,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  const targetPin = clubSettings.appEntryPin || '1234';

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSuccess, targetPin]);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4 || isSuccess) return;
    unlockAudioContext();
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      if (newPin === targetPin) {
        setIsSuccess(true);
        setTimeout(() => {
          onUnlock();
        }, 650);
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 750);
      }
    }
  };

  const handleDelete = () => {
    if (isSuccess) return;
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    if (isSuccess) return;
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#040711] text-slate-100 overflow-hidden select-none font-sans" dir="rtl">
      
      {/* Background Cyber Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-right emerald glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[130px]" />
        {/* Bottom-left cyan glow */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[130px]" />
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]" />
        
        {/* Subtle Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #10b981 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Lock Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`relative w-full max-w-[420px] mx-4 p-6 sm:p-8 rounded-[32px] bg-[#0a101d]/90 backdrop-blur-3xl border-2 ${
          error
            ? 'border-rose-500/90 shadow-[0_0_50px_rgba(244,63,94,0.35)]'
            : isSuccess
            ? 'border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.45)]'
            : 'border-emerald-500/30 shadow-[0_15px_60px_rgba(0,0,0,0.8)]'
        } transition-all duration-300 z-10 flex flex-col items-center text-center`}
      >
        
        {/* Top Live Clock & Branch Header */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-3.5 mb-3.5 border-b border-slate-800/80 font-mono">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{clubSettings.branchName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 font-mono-digits font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Club Logo / Emblem with Cyber Energy Ring */}
        <div className="relative mb-3">
          <motion.div
            animate={{
              scale: isSuccess ? [1, 1.15, 1.05] : [1, 1.02, 1],
              rotate: isSuccess ? 360 : 0
            }}
            transition={{ duration: isSuccess ? 0.6 : 3, repeat: isSuccess ? 0 : Infinity, ease: 'easeInOut' }}
            className={`w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr ${
              isSuccess 
                ? 'from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_35px_rgba(16,185,129,0.8)]' 
                : error 
                ? 'from-rose-500 via-red-500 to-amber-500 shadow-[0_0_30px_rgba(244,63,94,0.6)]' 
                : 'from-emerald-500 via-teal-400 to-cyan-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
            }`}
          >
            <div className="w-full h-full rounded-[14px] bg-[#070d18] flex items-center justify-center">
              {isSuccess ? (
                <Unlock className="w-8 h-8 text-emerald-400 animate-bounce" />
              ) : error ? (
                <ShieldAlert className="w-8 h-8 text-rose-400 animate-pulse" />
              ) : (
                <Lock className="w-8 h-8 text-emerald-400" />
              )}
            </div>
          </motion.div>
        </div>

        {/* Title & System Brand */}
        <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
          {clubSettings.clubName}
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          النظام الذكي لإدارة صالات واللعب • قفل أمان الدخول
        </p>

        {/* Active Shift Operator Badge */}
        <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex items-center gap-2 text-xs shadow-inner">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
            {currentOperator.name.slice(0, 1)}
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block leading-none">المشغل النشط للوردية:</span>
            <span className="text-slate-200 font-bold text-xs">{currentOperator.name} ({currentOperator.role})</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ULTRA-COOL CYBER VAULT PIN DISPLAY SLOTS (خانه‌های پین کد خفن) */}
        {/* ======================================================== */}
        <div className="my-5 w-full flex flex-col items-center">
          <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>رمز الأمان المكون من 4 أرقام للدخول إلى النظام:</span>
          </div>

          <motion.div 
            animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-3.5"
            dir="ltr"
          >
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              const isCurrent = pin.length === index && !isSuccess && !error;

              return (
                <div
                  key={index}
                  className={`relative w-13 h-16 sm:w-14 sm:h-17 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${
                    error
                      ? 'border-2 border-rose-500 bg-gradient-to-b from-rose-950/50 via-slate-950 to-rose-950/30 shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                      : isSuccess
                      ? 'border-2 border-emerald-400 bg-gradient-to-b from-emerald-950/60 via-slate-950 to-emerald-950/40 shadow-[0_0_30px_rgba(16,185,129,0.7)] scale-105'
                      : isFilled
                      ? 'border-2 border-emerald-400/90 bg-gradient-to-b from-emerald-950/40 via-[#07131b] to-slate-950 shadow-[0_0_22px_rgba(16,185,129,0.45),inset_0_0_12px_rgba(16,185,129,0.2)]'
                      : isCurrent
                      ? 'border-2 border-cyan-400/70 bg-gradient-to-b from-cyan-950/30 via-slate-950 to-slate-900/60 shadow-[0_0_16px_rgba(6,182,212,0.35)]'
                      : 'border border-slate-800/90 bg-gradient-to-b from-slate-900/70 via-slate-950 to-[#060a14]'
                  }`}
                >
                  {/* Top Glass Highlight Reflector Line */}
                  <div className="absolute top-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                  {/* Corner Optic Micro-Ticks */}
                  <div className={`absolute top-1 right-1 w-1.5 h-1.5 border-t border-r rounded-tr-sm transition-colors ${
                    isFilled ? 'border-emerald-400' : isCurrent ? 'border-cyan-400' : 'border-slate-800'
                  }`} />
                  <div className={`absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l rounded-bl-sm transition-colors ${
                    isFilled ? 'border-emerald-400' : isCurrent ? 'border-cyan-400' : 'border-slate-800'
                  }`} />

                  {/* Internal Core Display */}
                  {isSuccess ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-emerald-400 drop-shadow-[0_0_10px_#10b981]"
                    >
                      <Check className="w-6 h-6 stroke-[3]" />
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e]"
                    />
                  ) : isFilled ? (
                    <motion.div
                      initial={{ scale: 0.3 }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 0.25 }}
                      className="relative flex items-center justify-center"
                    >
                      {/* Outer Neon Glow Ring */}
                      <span className="absolute w-7 h-7 rounded-full bg-emerald-400/20 blur-[6px] animate-pulse" />
                      {/* Faceted Cyber Diamond / Crystal Core */}
                      <div className="w-4 h-4 rounded-md rotate-45 bg-gradient-to-br from-emerald-300 via-teal-400 to-emerald-600 shadow-[0_0_14px_#34d399] border border-emerald-200/90 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white -rotate-45 shadow-sm" />
                      </div>
                    </motion.div>
                  ) : isCurrent ? (
                    /* Active Laser Breathing Cursor */
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-3 h-3 rounded-full border border-cyan-400 bg-cyan-400/30 shadow-[0_0_8px_#22d3ee]"
                    />
                  ) : (
                    /* Inactive Pod Optic Crosshair */
                    <span className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700/60" />
                  )}

                  {/* Slot Number Sub-label */}
                  <span className="absolute bottom-1 font-mono text-[8px] font-bold text-slate-600">
                    0{index + 1}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Feedback Text */}
          <div className="h-6 mt-3 flex items-center justify-center">
            {error ? (
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                رمز الدخول غير صحيح! حاول مرة أخرى.
              </span>
            ) : isSuccess ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                تم التحقق من الهوية بنجاح. جاري الدخول...
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 font-mono">
                الكتابة بلوحة المفاتيح الفعلية أو لوحة المفاتيح البلورية اللمسية
              </span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* ULTRA-COOL CYBERPUNK MECHANICAL TOUCH KEYPAD (کیپد لمسی خفن) */}
        {/* ======================================================== */}
        <div className="w-full grid grid-cols-3 gap-3 max-w-[310px]" dir="ltr">
          {KEYPAD_KEYS.map(({ digit, sub }) => (
            <motion.button
              key={digit}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.90, y: 1 }}
              type="button"
              onClick={() => handleDigit(digit)}
              className="relative h-14 rounded-2xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#070b16] border border-slate-700/60 hover:border-emerald-400/80 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] active:bg-emerald-950/60 active:border-emerald-400 text-slate-100 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-all duration-150 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
            >
              {/* Top Glass Edge Sheen */}
              <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              {/* Number Digit */}
              <span className="text-xl sm:text-2xl font-black font-mono-digits tracking-wider text-slate-100 group-hover:text-emerald-300 group-active:text-white transition-colors leading-none drop-shadow-sm">
                {digit}
              </span>

              {/* Telecom / Cyber Sub-label */}
              <span className="text-[8px] font-black font-mono tracking-widest text-slate-500 group-hover:text-teal-400 transition-colors mt-0.5">
                {sub}
              </span>

              {/* Subtle Corner Notch Indicator */}
              <div className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-slate-700 group-hover:bg-emerald-400 group-hover:shadow-[0_0_6px_#34d399] transition-all" />
            </motion.button>
          ))}

          {/* Clear Button (پاک کردن) - High-tech Amber/Crimson Reset */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.90, y: 1 }}
            type="button"
            onClick={handleClear}
            className="relative h-14 rounded-2xl bg-gradient-to-b from-rose-950/40 via-[#180e14] to-[#0d070b] border border-rose-500/40 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] active:bg-rose-900/40 text-rose-300 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-all duration-150 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
            title="مسح جميع الأرقام"
          >
            <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-rose-300/25 to-transparent pointer-events-none" />
            <RotateCcw className="w-4 h-4 text-rose-400 group-hover:rotate-180 transition-transform duration-300" />
            <span className="text-[9px] font-black text-rose-300 mt-1 tracking-wider">
              مسح
            </span>
          </motion.button>

          {/* Zero Button (۰) */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.90, y: 1 }}
            type="button"
            onClick={() => handleDigit('0')}
            className="relative h-14 rounded-2xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#070b16] border border-slate-700/60 hover:border-emerald-400/80 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] active:bg-emerald-950/60 active:border-emerald-400 text-slate-100 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-all duration-150 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
          >
            <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            <span className="text-xl sm:text-2xl font-black font-mono-digits tracking-wider text-slate-100 group-hover:text-emerald-300 group-active:text-white transition-colors leading-none drop-shadow-sm">
              0
            </span>
            <span className="text-[8px] font-black font-mono tracking-widest text-slate-500 group-hover:text-teal-400 transition-colors mt-0.5">
              نظام
            </span>
            <div className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-slate-700 group-hover:bg-emerald-400 group-hover:shadow-[0_0_6px_#34d399] transition-all" />
          </motion.button>

          {/* Backspace Button (حذف رقم) - Cyber Backspace Key */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.90, y: 1 }}
            type="button"
            onClick={handleDelete}
            className="relative h-14 rounded-2xl bg-gradient-to-b from-amber-950/40 via-[#18130e] to-[#0d0907] border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] active:bg-amber-900/40 text-amber-300 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-all duration-150 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
            title="حذف آخر رقم تم إدخاله"
          >
            <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent pointer-events-none" />
            <Delete className="w-5 h-5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[8px] font-black font-mono tracking-wider text-amber-400 mt-1">
              رجوع
            </span>
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};
