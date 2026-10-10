import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Delete, 
  RotateCcw, 
  Check, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface SecurityPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetSectionName: string;
  correctPin?: string;
}

const KEYPAD_KEYS = [
  { digit: '1', sub: 'ثانية' },
  { digit: '2', sub: 'ABC' },
  { digit: '3', sub: 'DEF' },
  { digit: '4', sub: 'GHI' },
  { digit: '5', sub: 'JKL' },
  { digit: '6', sub: 'MNO' },
  { digit: '7', sub: 'PQRS' },
  { digit: '8', sub: 'TUV' },
  { digit: '9', sub: 'WXYZ' },
];

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetSectionName,
  correctPin = '5858',
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'c' || e.key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin]);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4 || isSuccess) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      if (newPin === correctPin) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 550);
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 700);
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative w-full max-w-[390px] bg-[#090f1c]/95 border-2 ${
            error 
              ? 'border-rose-500/90 shadow-[0_0_50px_rgba(244,63,94,0.35)]'
              : isSuccess
              ? 'border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.45)]'
              : 'border-emerald-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)]'
          } rounded-[32px] p-6 sm:p-7 text-center overflow-hidden transition-all duration-300`}
          dir="rtl"
        >
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
            title="إلغاء / بستن"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Shield & Lock Header Icon with Neon Ring */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/30 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-[#070d18] rounded-[14px] flex items-center justify-center">
              {isSuccess ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-bounce" />
              ) : error ? (
                <ShieldAlert className="w-7 h-7 text-rose-400 animate-pulse" />
              ) : (
                <Lock className="w-7 h-7 text-emerald-400" />
              )}
            </div>
          </div>

          {/* Title and Subtitle */}
          <h3 className="text-lg font-black text-white font-gaming tracking-wide">
            قسم مقفل برمز أمان المدير
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            للوصول إلى <span className="font-bold text-emerald-400 font-sans">"{targetSectionName}"</span> رمز المرور مطلوب
          </p>

          {/* ======================================================== */}
          {/* ULTRA-COOL CYBER VAULT PIN DISPLAY SLOTS (خانه‌های پین کد خفن) */}
          {/* ======================================================== */}
          <div className="my-5 w-full flex flex-col items-center">
            <motion.div 
              animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-3"
              dir="ltr"
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index;
                const isCurrent = pin.length === index && !isSuccess && !error;

                return (
                  <div
                    key={index}
                    className={`relative w-12 h-15 sm:w-13 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${
                      error
                        ? 'border-2 border-rose-500 bg-gradient-to-b from-rose-950/50 via-slate-950 to-rose-950/30 shadow-[0_0_22px_rgba(244,63,94,0.6)]'
                        : isSuccess
                        ? 'border-2 border-emerald-400 bg-gradient-to-b from-emerald-950/60 via-slate-950 to-emerald-950/40 shadow-[0_0_25px_rgba(16,185,129,0.7)] scale-105'
                        : isFilled
                        ? 'border-2 border-emerald-400/90 bg-gradient-to-b from-emerald-950/40 via-[#07131b] to-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.45),inset_0_0_12px_rgba(16,185,129,0.2)]'
                        : isCurrent
                        ? 'border-2 border-cyan-400/70 bg-gradient-to-b from-cyan-950/30 via-slate-950 to-slate-900/60 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
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
                        <Check className="w-5 h-5 stroke-[3]" />
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
                        <span className="absolute w-6 h-6 rounded-full bg-emerald-400/20 blur-[5px] animate-pulse" />
                        <div className="w-3.5 h-3.5 rounded-md rotate-45 bg-gradient-to-br from-emerald-300 via-teal-400 to-emerald-600 shadow-[0_0_12px_#34d399] border border-emerald-200/90 flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-white -rotate-45" />
                        </div>
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-2.5 h-2.5 rounded-full border border-cyan-400 bg-cyan-400/30 shadow-[0_0_8px_#22d3ee]"
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700/60" />
                    )}

                    {/* Slot Number Sub-label */}
                    <span className="absolute bottom-1 font-mono text-[7px] font-bold text-slate-600">
                      0{index + 1}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* Status Message */}
            <div className="h-5 mt-2.5 text-xs font-semibold">
              {error && (
                <span className="text-rose-400 font-bold flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  رمز الأمان غير صحيح، حاول مجدداً!
                </span>
              )}
              {isSuccess && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  تم التحقق بنجاح! جاري الدخول...
                </span>
              )}
              {!error && !isSuccess && (
                <span className="text-slate-400 text-[11px] font-mono flex items-center justify-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-emerald-400" />
                  <span>رمز الدخول المكوّن من 4 أرقام</span>
                </span>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* ULTRA-COOL CYBERPUNK MECHANICAL TOUCH KEYPAD (کیپد لمسی خفن) */}
          {/* ======================================================== */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[290px] mx-auto mb-4" dir="ltr">
            {KEYPAD_KEYS.map(({ digit, sub }) => (
              <motion.button
                key={digit}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.90, y: 1 }}
                type="button"
                onClick={() => handleDigit(digit)}
                className="relative h-13 rounded-2xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#070b16] border border-slate-700/60 hover:border-emerald-400/80 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] active:bg-emerald-950/60 active:border-emerald-400 text-slate-100 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-all duration-150 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
              >
                <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                <span className="text-xl font-black font-mono-digits tracking-wider text-slate-100 group-hover:text-emerald-300 group-active:text-white transition-colors leading-none drop-shadow-sm">
                  {digit}
                </span>
                <span className="text-[8px] font-black font-mono tracking-widest text-slate-500 group-hover:text-teal-400 transition-colors mt-0.5">
                  {sub}
                </span>
                <div className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-slate-700 group-hover:bg-emerald-400 group-hover:shadow-[0_0_6px_#34d399] transition-all" />
              </motion.button>
            ))}

            {/* Clear Button */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.90, y: 1 }}
              type="button"
              onClick={handleClear}
              className="relative h-13 rounded-2xl bg-gradient-to-b from-rose-950/40 via-[#180e14] to-[#0d070b] border border-rose-500/40 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] active:bg-rose-900/40 text-rose-300 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-all duration-150 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
              title="پاک کردن کل ارقام"
            >
              <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-rose-300/25 to-transparent pointer-events-none" />
              <RotateCcw className="w-4 h-4 text-rose-400 group-hover:rotate-180 transition-transform duration-300" />
              <span className="text-[8px] font-black text-rose-300 mt-0.5 tracking-wider">
                مسح
              </span>
            </motion.button>

            {/* Zero Button */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.90, y: 1 }}
              type="button"
              onClick={() => handleDigit('0')}
              className="relative h-13 rounded-2xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#070b16] border border-slate-700/60 hover:border-emerald-400/80 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] active:bg-emerald-950/60 active:border-emerald-400 text-slate-100 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-all duration-150 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
            >
              <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <span className="text-xl font-black font-mono-digits tracking-wider text-slate-100 group-hover:text-emerald-300 group-active:text-white transition-colors leading-none drop-shadow-sm">
                0
              </span>
              <span className="text-[8px] font-black font-mono tracking-widest text-slate-500 group-hover:text-teal-400 transition-colors mt-0.5">
                نظام
              </span>
              <div className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-slate-700 group-hover:bg-emerald-400 group-hover:shadow-[0_0_6px_#34d399] transition-all" />
            </motion.button>

            {/* Backspace Button */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.90, y: 1 }}
              type="button"
              onClick={handleDelete}
              className="relative h-13 rounded-2xl bg-gradient-to-b from-amber-950/40 via-[#18130e] to-[#0d0907] border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] active:bg-amber-900/40 text-amber-300 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-all duration-150 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
              title="حذف آخر رقم"
            >
              <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent pointer-events-none" />
              <Delete className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[8px] font-black font-mono tracking-wider text-amber-400 mt-0.5">
                حذف
              </span>
            </motion.button>
          </div>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer shadow-inner active:scale-98"
          >
            إلغاء والعودة للقائمة
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
