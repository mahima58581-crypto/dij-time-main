import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Session } from '../types';
import { formatDurationDigital } from '../utils/formatters';
import { AlarmClockOff, BadgeCheck, CircleAlert, Lock, ShieldCheck, X } from 'lucide-react';

interface ForceLockModalProps {
  session: Session | null;
  onClose: () => void;
  onConfirm: (sessionId: string) => void;
}

export const ForceLockModal: React.FC<ForceLockModalProps> = ({
  session,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<'confirm' | 'done'>('confirm');

  useEffect(() => {
    setStep('confirm');
  }, [session]);

  const now = Date.now();
  const elapsedSec = session
    ? Math.max(0, Math.floor((now - new Date(session.checkInTime).getTime()) / 1000))
    : 0;

  const handleConfirm = () => {
    if (!session) return;
    onConfirm(session.id);
    setStep('done');
  };

  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  return (
    <AnimatePresence>
      {session && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-500/30 shadow-2xl shadow-rose-500/10 overflow-hidden"
          >
            {step === 'confirm' ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-l from-rose-500/15 via-transparent to-orange-500/10 border-b border-rose-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/15 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <AlarmClockOff className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        قفل إجباري للنظام
                      </h3>
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                        انتهى الوقت المحدد
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3">
                    <CircleAlert className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 font-bold leading-relaxed">
                      اللاعب لا يزال يلعب بعد انتهاء الوقت. بتأكيد القفل الإجباري سيتوقف النظام وتُنهى الجلسة فوراً.
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-bold">المحطة:</span>
                      <span className="font-black text-slate-900 dark:text-white">{session.stationName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-bold">اللاعب:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{session.customerName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-bold">الوقت المنقضي:</span>
                      <span className="font-mono font-black text-rose-600 dark:text-rose-400 font-mono-digits">
                        {formatDurationDigital(elapsedSec)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 h-10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
                  >
                    تراجع
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="flex-1 h-10 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 shadow-md shadow-rose-500/30 transition flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-4 h-4" />
                    تأكيد وقفل النظام
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Success / stopped */}
                <div className="px-5 py-8 flex flex-col items-center text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"
                  >
                    <ShieldCheck className="w-9 h-9" />
                  </motion.div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      هذا النظام توقف
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">
                      تم قفل {session.stationName} وإيقاف الجلسة نهائياً
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>النظام الآن مقفل وآمن</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full h-10 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/25 transition"
                  >
                    حسناً
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
