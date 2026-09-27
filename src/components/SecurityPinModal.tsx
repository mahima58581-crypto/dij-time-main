import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, X, Delete } from 'lucide-react';

interface SecurityPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetSectionName: string;
  correctPin?: string;
}

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
        }, 500);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-white dark:bg-[#0d1322] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl shadow-emerald-950/40 text-center overflow-hidden"
          dir="rtl"
        >
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="إلغاء / بستن"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Shield & Lock Header Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-[2px] shadow-lg shadow-emerald-500/25 mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-[#0c101c] rounded-[14px] flex items-center justify-center">
              {isSuccess ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-500 animate-bounce" />
              ) : error ? (
                <ShieldAlert className="w-7 h-7 text-rose-500 animate-pulse" />
              ) : (
                <Lock className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
          </div>

          {/* Title and Subtitle */}
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-gaming">
            قسم مقفل برمز أمان
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            للوصول إلى <span className="font-bold text-emerald-600 dark:text-emerald-400 font-sans">"{targetSectionName}"</span> يرجى إدخال رمز المرور
          </p>

          {/* PIN Digits Visual Indicators */}
          <motion.div
            animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-3 my-6"
          >
            {[0, 1, 2, 3].map((index) => {
              const filled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold font-mono transition-all duration-200 ${
                    error
                      ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                      : isSuccess
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500'
                      : filled
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 scale-105 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {filled ? '●' : '○'}
                </div>
              );
            })}
          </motion.div>

          {/* Status Message */}
          <div className="h-5 mb-4 text-xs font-semibold">
            {error && (
              <span className="text-rose-500 animate-pulse">
                رمز الأمان غير صحيح، حاول مجدداً
              </span>
            )}
            {isSuccess && (
              <span className="text-emerald-500 font-bold">
                تم التحقق بنجاح! جاري الدخول...
              </span>
            )}
            {!error && !isSuccess && (
              <span className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center justify-center gap-1">
                <KeyRound className="w-3 h-3 text-emerald-500" />
                <span>أدخل رمز المرور المكوّن من 4 أرقام</span>
              </span>
            )}
          </div>

          {/* Interactive Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit)}
                className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-black text-base font-mono transition-all active:scale-95 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-center"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 font-bold text-xs transition-all active:scale-95 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center"
            >
              مسح
            </button>

            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-black text-base font-mono transition-all active:scale-95 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-center"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-slate-500 hover:text-amber-600 font-bold text-xs transition-all active:scale-95 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center"
              title="حذف آخر رقم"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
          >
            رجوع للقائمة
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
