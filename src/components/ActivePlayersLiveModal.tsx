import { GamingPcIcon } from './GamingPcIcon';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Session, Station, Customer } from '../types';
import { formatCurrency, formatDuration, formatArabicTimeOnly } from '../utils/formatters';
import { Activity, AlertCircle, Badge, CheckCircle2, Clock, Coffee, Filter, Gamepad2, Grid, History, Navigation, Plus, Radio, Receipt, Search, ShieldCheck, User, X } from 'lucide-react';

interface ActivePlayersLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  stations: Station[];
  customers: Customer[];
  onOpenNewSession: (stationId?: string, customerId?: string) => void;
  onAddSnack: (session: Session) => void;
  onOpenInvoice: (session: Session) => void;
  recentLogs?: { id: string; type: string; message: string; timestamp: string }[];
}

export const ActivePlayersLiveModal: React.FC<ActivePlayersLiveModalProps> = ({
  isOpen,
  onClose,
  sessions,
  stations,
  customers,
  onOpenNewSession,
  onAddSnack,
  onOpenInvoice,
  recentLogs = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'active_players' | 'all_stations' | 'recent_starts'>('active_players');

  if (!isOpen) return null;

  // Active sessions only
  const activeSessions = sessions.filter((s) => s.status === 'active');
  const occupiedStationIds = new Set(activeSessions.map((s) => s.stationId));
  const freeStations = stations.filter((st) => st.status === 'available' && !occupiedStationIds.has(st.id));

  // Filter active sessions
  const filteredActiveSessions = activeSessions.filter((sess) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sess.customerName.toLowerCase().includes(q) ||
      sess.stationName.toLowerCase().includes(q) ||
      sess.stationId.toLowerCase().includes(q) ||
      sess.id.toLowerCase().includes(q)
    );
  });

  // Calculate live elapsed minutes for a session
  const getElapsedMinutes = (checkInIso: string) => {
    const start = new Date(checkInIso).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((now - start) / (1000 * 60)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-white dark:bg-[#0c121e] border border-emerald-300/80 dark:border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="dark:text-white text-base sm:text-lg font-black font-gaming tracking-wide">
                  پنجره نظارت بر آغاز بازی و بازیکنان آنلاین
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-[11px] font-mono font-bold text-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                  {activeSessions.length} در حال بازی
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                بررسی لحظه‌ای بازیکنان حاضر، ساعت شروع و تأییدیه وضعیت ثبت سیستم
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={() => {
                onClose();
                onOpenNewSession();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ثبت بازی جدید</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* System Verification Banner */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-800/40 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>وضعیت پایگاه سیستم:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ثبت شده و پایدار (متصل)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
            <span>کل دستگاه‌ها: <strong className="text-slate-900 dark:text-white font-mono">{stations.length}</strong></span>
            <span>مشغول و دارای ثبت: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{activeSessions.length}</strong></span>
            <span>آماده پذیرش: <strong className="text-teal-600 dark:text-teal-400 font-mono">{freeStations.length}</strong></span>
          </div>
        </div>

        {/* Navigation Sub-Tabs & Search */}
        <div className="p-4 sm:px-6 bg-slate-50/80 dark:bg-[#0a0e18] border-b border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('active_players')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'active_players'
                  ? 'bg-white dark:bg-emerald-600 text-emerald-800 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>بازیکنان در حال بازی ({activeSessions.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('all_stations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'all_stations'
                  ? 'bg-white dark:bg-emerald-600 text-emerald-800 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GamingPcIcon className="w-3.5 h-3.5" />
              <span>وضعیت کلی دستگاه‌ها ({stations.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('recent_starts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'recent_starts'
                  ? 'bg-white dark:bg-emerald-600 text-emerald-800 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>ثبت‌های اخیر آغاز بازی</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام، دستگاه، یا شناسه..."
              className="w-full pl-3 pr-9 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: ACTIVE PLAYERS & REGISTRATION VERIFICATION */}
          {activeSubTab === 'active_players' && (
            <div className="space-y-3">
              {filteredActiveSessions.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                  <Gamepad2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-white">
                    {searchQuery ? 'هیچ بازیکنی با این مشخصات یافت نشد' : 'در حال حاضر هیچ بازیکنی در حال بازی نیست'}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                    {searchQuery ? 'لطفاً عبارت دیگری را جستجو کنید.' : 'تمامی دستگاه‌ها آزاد هستند. با فشردن دکمه زیر می‌توانید بازی جدید ثبت کنید.'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenNewSession();
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ثبت و آغاز بازی جدید</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredActiveSessions.map((session) => {
                    const elapsedMins = getElapsedMinutes(session.checkInTime);
                    const isFixed = session.sessionType === 'fixed';
                    const allocatedMins = session.allocatedMinutes || 60;
                    const remainingMins = Math.max(0, allocatedMins - elapsedMins);
                    const snacksCount = session.snacks.reduce((acc, s) => acc + s.quantity, 0);

                    return (
                      <div
                        key={session.id}
                        className="bg-white dark:bg-[#0f172a] rounded-2xl border border-emerald-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                      >
                        {/* Status ribbon */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                  {session.customerName}
                                </h3>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold">
                                  {session.stationId}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {session.stationName}
                              </p>
                            </div>
                          </div>

                          {/* Verification Badge */}
                          <div className="flex flex-col items-end">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-black text-[11px] shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              ثبت شده در سیستم ✓
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 font-mono-digits">
                              کد جلسه: {session.id}
                            </span>
                          </div>
                        </div>

                        {/* Session Details Grid */}
                        <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-center">
                          <div>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500">زمان شروع</span>
                            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                              {formatArabicTimeOnly(session.checkInTime)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500">مدت بازی شده</span>
                            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {elapsedMins} دقیقه
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500">نوع جلسه</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {isFixed ? `محدود (${allocatedMins}د)` : 'زمان آزاد'}
                            </span>
                          </div>
                        </div>

                        {/* Cost & Snacks summary */}
                        <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <span>هزینه جاری: <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{formatCurrency(session.timeCost + session.snacksCost)}</strong></span>
                            {snacksCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                                {snacksCount} قلم بوفه
                              </span>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                onClose();
                                onAddSnack(session);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                              title="افزودن خوراکی به فاکتور این بازیکن"
                            >
                              <Coffee className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                onClose();
                                onOpenInvoice(session);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Receipt className="w-3 h-3" />
                              <span>فاکتور و تسویه</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL STATIONS AUDIT (Is anyone playing without system register?) */}
          {activeSubTab === 'all_stations' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>بررسی انطباق فیزیکی دستگاه‌ها:</strong> تمامی دستگاه‌های دارای بازی باید دارای وضعیت <span className="font-bold text-emerald-600 dark:text-emerald-400">«ثبت شده در سیستم»</span> باشند. اگر بازیکنی پشت دستگاه آزاد نشسته است، فوراً روی «ثبت و آغاز بازی» کلیک کنید.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {stations.map((st) => {
                  const currentSession = activeSessions.find((s) => s.stationId === st.id);
                  const isOccupied = !!currentSession;

                  return (
                    <div
                      key={st.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isOccupied
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-black text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {st.id}
                        </span>
                        {isOccupied ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            در حال بازی (ثبت شده)
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                            دستگاه آزاد
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate" title={st.name}>
                        {st.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        نرخ: {formatCurrency(st.hourlyRate)} / ساعت
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        {isOccupied ? (
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[150px]">
                            بازیکن: <strong>{currentSession.customerName}</strong>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenNewSession(st.id);
                            }}
                            className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ثبت آغاز بازی این دستگاه</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RECENT GAME START AUDIT LOGS */}
          {activeSubTab === 'recent_starts' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                رویدادها و هشدارهای ثبت شده توسط موتور صوتی و اعلانات آغاز بازی:
              </div>

              {recentLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  هنوز هیچ رویداد اخیری ثبت نشده است.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentLogs.map((log) => {
                    const isStartGame = log.type.includes('آغاز بازی');
                    return (
                      <div
                        key={log.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                          isStartGame
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isStartGame
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            {isStartGame ? <Gamepad2 className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 dark:text-white">
                                {log.type}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
                                ثبت تأیید شد ✓
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400">
                              {log.message}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0 font-mono-digits">
                          {log.timestamp}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 dark:bg-[#0a0e18] border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>تمام جلسات بازی مستقیماً در دیتابیس ثبت و با تعرفه رسمی محاسبه می‌شوند.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenNewSession();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ آغاز بازی جدید</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
