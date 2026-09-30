import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ReceiptText, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  Gamepad2, 
  Search, 
  Coffee, 
  Percent, 
  CreditCard,
  Tv,
  Monitor,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { Session, Station } from '../types';
import { formatCurrency, formatDuration } from '../utils/formatters';
import { CyberSectionIcon } from './CyberSectionIcon';

interface ActiveInvoicesProps {
  sessions: Session[];
  stations: Station[];
  onOpenAddSnack: (session: Session) => void;
  onOpenCheckout: (session: Session) => void;
  onOpenEditGames: (session: Session) => void;
  onStartNewSession: () => void;
}

export const ActiveInvoices: React.FC<ActiveInvoicesProps> = ({
  sessions,
  stations,
  onOpenAddSnack,
  onOpenCheckout,
  onOpenEditGames,
  onStartNewSession,
}) => {
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeSessions = sessions.filter((s) => s.status === 'active');

  const filteredSessions = activeSessions.filter(
    (s) =>
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.stationName.toLowerCase().includes(search.toLowerCase()) ||
      s.customerPhone.includes(search)
  );

  // Live totals
  const totalActiveRevenue = activeSessions.reduce((sum, s) => {
    const elapsedMinutes = Math.max(1, Math.floor((now - new Date(s.checkInTime).getTime()) / (1000 * 60)));
    const liveTimeCost = Math.round((elapsedMinutes / 60) * s.hourlyRate);
    const snacksCost = s.snacks?.reduce((acc, snk) => acc + snk.totalPrice, 0) || 0;
    return sum + (liveTimeCost + snacksCost - (s.discount || 0));
  }, 0);

  return (
    <div className="space-y-6">
      
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
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">إجمالي المبالغ الجارية:</div>
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

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 dark-card rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم اللاعب أو المحطة..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span>عدد الفواتير النشطة:</span>
          <span className="font-black text-emerald-800 dark:text-emerald-400 font-mono text-sm px-2.5 py-0.5 rounded-full bg-white dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 font-mono-digits shadow-xs">
            {activeSessions.length} فاتورة
          </span>
        </div>
      </div>

      {/* Invoices List */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 dark-card border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3 shadow-xs">
          <ReceiptText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">لا توجد فواتير نشطة حالياً</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">لبدء اللعب وإصدار الفواتير اضغط على زر «بدء جلسة جديدة»</p>
          <button
            onClick={onStartNewSession}
            className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 hover:brightness-105 transition font-gaming"
          >
            + تسجيل وبدء جلسة جديدة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSessions.map((session) => {
            const elapsedMs = now - new Date(session.checkInTime).getTime();
            const elapsedMinutes = Math.max(1, Math.floor(elapsedMs / (1000 * 60)));
            const liveTimeCost = Math.round((elapsedMinutes / 60) * session.hourlyRate);
            const liveSnacksCost = session.snacks?.reduce((acc, snk) => acc + snk.totalPrice, 0) || 0;
            const liveFinalAmount = Math.max(0, liveTimeCost + liveSnacksCost - (session.discount || 0));

            const isFixed = session.sessionType === 'fixed';
            const allocated = session.allocatedMinutes || 60;
            const remainingMins = allocated - elapsedMinutes;
            const isNearEnd = isFixed && remainingMins <= 10;
            const isOvertime = isFixed && remainingMins <= 0;

            return (
              <motion.div
                key={session.id}
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-slate-200/90 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all shadow-sm space-y-4 relative overflow-hidden"
              >
                {/* Green Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

                {/* Session Header */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black shadow-xs shrink-0">
                      {session.stationType === 'PC' ? <Monitor className="w-6 h-6" /> : <Tv className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">{session.customerName}</h3>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-mono-digits font-bold shadow-2xs">
                          {session.stationName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-white mt-0.5 flex items-center gap-2">
                        <span className="text-slate-800 dark:text-white font-medium">الهاتف: <span className="font-mono-digits text-slate-900 dark:text-white font-bold">{session.customerPhone}</span></span>
                        <span className="text-slate-400 dark:text-white">•</span>
                        <span className="text-slate-800 dark:text-white font-medium">رمز: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 font-mono-digits">****</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Session Type */}
                  <div className="text-left">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-emerald-950/80 text-emerald-800 dark:text-white border border-emerald-300 dark:border-emerald-700 shadow-xs transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-emerald-900 dark:text-white font-bold">{isFixed ? `محدد (${allocated} دقيقة)` : 'وقت مفتوح'}</span>
                    </span>
                    {isOvertime && (
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>انتهى وقت الحجز!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timing & Breakdown Box */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-white dark:bg-[#0c101c] rounded-xl border border-slate-200 dark:border-slate-800 text-center font-mono shadow-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">الوقت المنقضي</div>
                    <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5 font-mono-digits">
                      {formatDuration(elapsedMinutes)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">تكلفة اللعب</div>
                    <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono-digits">
                      {formatCurrency(liveTimeCost)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">البوفيه ({session.snacks?.length || 0})</div>
                    <div className="text-xs font-black text-teal-700 dark:text-teal-400 mt-0.5 font-mono-digits">
                      {formatCurrency(liveSnacksCost)}
                    </div>
                  </div>
                </div>

                {/* Snacks List Mini Preview */}
                {session.snacks && session.snacks.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-xs">
                    <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                      <Coffee className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>طلبات البوفيه المسجلة:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {session.snacks.map((snk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] flex items-center gap-1.5 shadow-xs">
                          <span className="text-slate-900 dark:text-white font-bold">{snk.name}</span>
                          <span className="text-emerald-700 dark:text-emerald-300 font-black font-mono font-mono-digits bg-emerald-50 dark:bg-emerald-950/80 px-1 rounded border border-emerald-200 dark:border-emerald-800">×{snk.quantity}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total & Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">المبلغ النهائي للفاتورة:</div>
                    <div className="text-base font-black font-mono text-emerald-700 dark:text-emerald-400 font-mono-digits">
                      {formatCurrency(liveFinalAmount)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenAddSnack(session)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1 transition shadow-xs"
                    >
                      <Coffee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>+ بوفيه</span>
                    </button>

                    <button
                      onClick={() => onOpenCheckout(session)}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition font-gaming"
                    >
                      <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>تسوية وطباعة الفاتورة</span>
                    </button>
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
