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
  ShieldAlert
} from 'lucide-react';
import { ClubSettings, StaffOperator } from '../types';
import { unlockAudioContext } from '../utils/audioAlerts';

interface AppEntryLockScreenProps {
  onUnlock: () => void;
  clubSettings: ClubSettings;
  currentOperator: StaffOperator;
}

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
        }, 600);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050811] text-slate-100 overflow-hidden select-none font-sans" dir="rtl">
      
      {/* Background Cyber Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-right emerald glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px]" />
        {/* Bottom-left cyan glow */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px]" />
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[140px]" />
        
        {/* Subtle Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
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
        className={`relative w-full max-w-md mx-4 p-6 sm:p-8 rounded-3xl bg-[#0c1220]/90 backdrop-blur-2xl border ${
          error
            ? 'border-rose-500/80 shadow-[0_0_40px_rgba(244,63,94,0.25)]'
            : isSuccess
            ? 'border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.35)]'
            : 'border-emerald-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)]'
        } transition-all duration-300 z-10 flex flex-col items-center text-center`}
      >
        
        {/* Top Live Clock & Branch Header */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-4 mb-4 border-b border-slate-800/80 font-mono">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{clubSettings.branchName}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300 font-mono-digits font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Club Logo / Emblem */}
        <div className="relative mb-3">
          <motion.div
            animate={{
              scale: isSuccess ? [1, 1.15, 1.05] : [1, 1.02, 1],
              rotate: isSuccess ? 360 : 0
            }}
            transition={{ duration: isSuccess ? 0.6 : 3, repeat: isSuccess ? 0 : Infinity, ease: 'easeInOut' }}
            className={`w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr ${
              isSuccess 
                ? 'from-emerald-400 to-teal-300 shadow-[0_0_30px_rgba(16,185,129,0.7)]' 
                : error 
                ? 'from-rose-500 to-amber-500 shadow-[0_0_25px_rgba(244,63,94,0.5)]' 
                : 'from-emerald-500 via-teal-400 to-cyan-500 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
            }`}
          >
            <div className="w-full h-full rounded-[14px] bg-[#070b14] flex items-center justify-center">
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
          سامانه هوشمند مدیریت سالن بازی • قفل امنیتی ورود به سامانه
        </p>

        {/* Active Shift Operator Badge */}
        <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-xs">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
            {currentOperator.name.slice(0, 1)}
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block leading-none">اپراتور فعال:</span>
            <span className="text-slate-200 font-bold">{currentOperator.name} ({currentOperator.role})</span>
          </div>
        </div>

        {/* PIN Dots Display */}
        <div className="my-5 w-full flex flex-col items-center">
          <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>رمز عبور ۴ رقمی سیستم را وارد کنید:</span>
          </div>

          <motion.div 
            animate={error ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-3.5"
            dir="ltr"
          >
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-12 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 ${
                    error
                      ? 'border-rose-500 bg-rose-950/30 text-rose-400'
                      : isSuccess
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : isFilled
                      ? 'border-emerald-500/80 bg-emerald-950/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'border-slate-800 bg-slate-900/50 text-slate-600'
                  }`}
                >
                  {isFilled ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-scale" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700/60" />
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Feedback Text */}
          <div className="h-6 mt-2 flex items-center justify-center">
            {error ? (
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                رمز ورود نادرست است! دوباره تلاش کنید.
              </span>
            ) : isSuccess ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                هویت تأیید شد. در حال ورود به برنامه...
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                می‌توانید با کیبورد فیزیکی یا دکمه‌های زیر تایپ کنید
              </span>
            )}
          </div>
        </div>

        {/* Touch Keypad */}
        <div className="w-full grid grid-cols-3 gap-2.5 max-w-[280px]" dir="ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <motion.button
              key={digit}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:bg-emerald-900/40 border border-slate-800 hover:border-slate-700 text-lg font-mono font-bold text-slate-100 shadow-sm transition flex items-center justify-center cursor-pointer"
            >
              {digit}
            </motion.button>
          ))}

          {/* Clear Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-400 hover:text-slate-200 transition flex items-center justify-center cursor-pointer"
          >
            پاک کردن
          </motion.button>

          {/* Zero Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:bg-emerald-900/40 border border-slate-800 hover:border-slate-700 text-lg font-mono font-bold text-slate-100 shadow-sm transition flex items-center justify-center cursor-pointer"
          >
            0
          </motion.button>

          {/* Backspace Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition flex items-center justify-center cursor-pointer"
            title="حذف آخرین رقم"
          >
            <Delete className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Default Passwords Info Card */}
        <div className="mt-5 w-full pt-4 border-t border-slate-800/80 text-right space-y-1.5 text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-2xl border">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300">رمز ورود پیش‌فرض به سامانه:</span>
            <span className="font-mono font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
              {targetPin}
            </span>
          </div>
          <div className="flex items-start gap-1 text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              نکته: دو بخش <strong>«تقارير النفقات»</strong> و <strong>«إعدادات النظام»</strong> دارای رمز مجزا (<strong>۵۸۵۸</strong>) بوده و پس از ورود همچنان قفل خواهند ماند.
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
