import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Session } from '../types';
import { formatCurrency, calculatePlayCost, formatDurationDigital } from '../utils/formatters';
import { PLATFORM_META } from './platformMeta';
import { CalendarClock, Clock, Plus, X, Sparkles, Timer } from 'lucide-react';

interface AddTimeModalProps {
  session: Session | null;
  onClose: () => void;
  onConfirm: (sessionId: string, extraMinutes: number) => void;
}

const PRESETS = [15, 30, 60, 90, 120];

export const AddTimeModal: React.FC<AddTimeModalProps> = ({
  session,
  onClose,
  onConfirm,
}) => {
  const [custom, setCustom] = useState('');
  const [selected, setSelected] = useState<number>(60);

  const now = Date.now();

  // هویت بصری پلتفرم مربوطه — هم‌رنگ اسلاید خودش (PC آبی، XBOX سبز، ...)
  const meta = PLATFORM_META[session?.stationType ?? 'PC'] ?? PLATFORM_META.PC;
  const PlatformIcon = meta.icon;

  const elapsedMinutes = useMemo(() => {
    if (!session) return 0;
    const startMs = new Date(session.checkInTime).getTime();
    return Math.max(0, (now - startMs) / (1000 * 60));
  }, [session, now]);

  const allocated = session?.sessionType === 'fixed' ? session.allocatedMinutes ?? 0 : 0;
  const remaining = Math.max(0, allocated - elapsedMinutes);

  const extraMinutes = custom.trim() !== '' ? Math.max(1, parseInt(custom, 10) || 0) : selected;
  const extraCost = calculatePlayCost(extraMinutes, session?.hourlyRate ?? 0);

  const handleConfirm = () => {
    if (!session || extraMinutes <= 0) return;
    onConfirm(session.id, extraMinutes);
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
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${meta.ring} shadow-2xl overflow-hidden`}
          >
            {/* خط الألوان المميز للمنصة */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${meta.accent}`} />

            {/* Header */}
            <div className={`flex items-center justify-between gap-3 px-5 py-4 border-b ${meta.softBg}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${meta.chip}`}>
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      إضافة وقت إضافي
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-black ${meta.chip}`}>
                      <PlatformIcon className="w-3 h-3" />
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    تمديد جلسة اللعب للاعب
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                title="إغلاق"
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition hover:brightness-95 active:scale-95 ${meta.chip}`}
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Session summary */}
            <div className="px-5 py-4 space-y-3">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">المحطة:</span>
                  <span className={`font-black ${meta.text}`}>{session.stationName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">اللاعب:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{session.customerName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                    <Timer className={`w-3.5 h-3.5 ${meta.text}`} />
                    الوقت المنقضي:</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white font-mono-digits">
                    {formatDurationDigital(Math.floor(elapsedMinutes * 60))}
                  </span>
                </div>
                {session.sessionType === 'fixed' && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                      <Clock className={`w-3.5 h-3.5 ${meta.text}`} />
                      المتبقي من الوقت:</span>
                    <span className={`font-mono font-black font-mono-digits ${remaining <= 0 ? 'text-rose-500' : meta.text}`}>
                      {formatDurationDigital(Math.floor(remaining * 60))}
                    </span>
                  </div>
                )}
                {session.sessionType === 'open' && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                    هذه جلسة وقت مفتوح — سيتم تحويلها إلى وقت محدد بعد الإضافة
                  </p>
                )}
              </div>

              {/* Preset buttons */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Plus className={`w-3.5 h-3.5 ${meta.text}`} />
                  اختر مدة الإضافة:
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setSelected(m); setCustom(''); }}
                      className={`py-2 rounded-xl text-xs font-black transition-all border ${
                        custom === '' && selected === m
                          ? `bg-gradient-to-b ${meta.accent} text-white border-transparent shadow-md scale-[1.03]`
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      +{m}
                      <span className="block text-[9px] font-bold opacity-80">دقيقة</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom input */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  أو مدة مخصصة (بالدقائق):
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="مثال: 45"
                    className={`no-spinner w-full px-3.5 py-2.5 text-sm font-mono font-bold border rounded-xl focus:ring-2 focus:outline-none transition font-mono-digits ${meta.chip} ${meta.focusRing}`}
                  />
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold ${meta.text}`}>
                    دقيقة
                  </span>
                </div>
              </div>

              {/* Cost preview */}
              <div className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 ${meta.softBg}`}>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${meta.text}`}>
                  <Sparkles className="w-4 h-4" />
                  تكلفة الوقت الإضافي:
                </span>
                <span className={`text-lg font-black font-mono font-mono-digits ${meta.text}`}>
                  {formatCurrency(extraCost)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 h-10 rounded-xl text-xs font-bold border transition hover:brightness-95 ${meta.softBg} ${meta.text}`}
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={extraMinutes <= 0}
                className={`flex-1 h-10 rounded-xl text-xs font-black text-white bg-gradient-to-r ${meta.accent} hover:brightness-110 shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Plus className="w-4 h-4" />
                تأكيد وإضافة الوقت
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
