import { GamingPcIcon } from './GamingPcIcon';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingReservation, Station } from '../types';
import { playReservationAlertSound, speakVoiceAlert, unlockAudioContext } from '../utils/audioAlerts';
import { Ban, Bell, Calendar, CalendarCheck, CalendarClock, CheckCircle2, Clock, LogIn, Monitor, Phone, Play, Plus, Search, Sparkles, UserCheck, Volume2, X, XCircle } from 'lucide-react';

interface QueueBookingManagerProps {
  reservations: BookingReservation[];
  stations: Station[];
  onAddReservation: (reservation: Omit<BookingReservation, 'id' | 'createdAt'>) => void;
  onSeatReservation: (reservation: BookingReservation) => void;
  onCancelReservation: (reservationId: string) => void;
  onStartSessionForStation: (stationId: string, customerName?: string, customerPhone?: string) => void;
}

// ─── لوحة موحدة خضراء وفيروزية للصفحة بأكملها ───
const THEME = {
  hero: 'from-emerald-600 via-teal-500 to-cyan-500',
  heroShadow: 'shadow-emerald-500/30',
  strip: 'from-emerald-400 via-teal-500 to-cyan-500',
  gradient: 'from-emerald-500 to-teal-600',
  soft: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
  softTeal: 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-100 dark:border-teal-900/50',
  text: 'text-emerald-700 dark:text-emerald-400',
  textTeal: 'text-teal-700 dark:text-teal-400',
  chip: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  chipTeal: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  glow: 'hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60',
  tabActive: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-md shadow-emerald-500/30',
  blob1: 'bg-emerald-400/15',
  blob2: 'bg-teal-400/15',
  blob3: 'bg-cyan-400/10',
};

export const QueueBookingManager: React.FC<QueueBookingManagerProps> = ({
  reservations,
  stations,
  onAddReservation,
  onSeatReservation,
  onCancelReservation,
  onStartSessionForStation,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'seated' | 'cancelled'>('pending');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New reservation form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [stationId, setStationId] = useState(stations[0]?.id || 'PC-01');
  const [reservedDate, setReservedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('19:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [notes, setNotes] = useState('');

  const filteredReservations = reservations.filter((r) => {
    const matchSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerPhone.includes(search) ||
      r.stationName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const seatedCount = reservations.filter((r) => r.status === 'seated').length;
  const cancelledCount = reservations.filter((r) => r.status === 'cancelled').length;
  const freeStations = stations.filter((s) => s.status === 'available').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    const selectedStation = stations.find((s) => s.id === stationId);

    onAddReservation({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || '07700000000',
      stationId,
      stationName: selectedStation ? selectedStation.name : stationId,
      reservedDate,
      startTime,
      durationMinutes,
      status: 'pending',
      notes: notes.trim(),
    });

    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleSeatClick = (res: BookingReservation) => {
    onSeatReservation(res);
    onStartSessionForStation(res.stationId, res.customerName, res.customerPhone);
  };

  const kpiStats = [
    { label: 'در انتظار ورود', value: pendingCount, icon: Bell, gradient: 'from-emerald-500 to-teal-500', bg: THEME.soft },
    { label: 'دخل و بازی فعال', value: seatedCount, icon: LogIn, gradient: 'from-teal-500 to-cyan-500', bg: THEME.softTeal },
    { label: 'حجوزات ملغی', value: cancelledCount, icon: Ban, gradient: 'from-emerald-400 to-emerald-500', bg: THEME.soft },
    { label: 'أجهزة شاغرة', value: freeStations, icon: Monitor, gradient: 'from-teal-400 to-cyan-600', bg: THEME.softTeal },
  ];

  const statusPills: { key: typeof statusFilter; label: string }[] = [
    { key: 'pending', label: `في انتظار الدخول (${pendingCount})` },
    { key: 'seated', label: 'تم الدخول واللعب' },
    { key: 'all', label: ' كافة سجلات الحجوزات' },
  ];

  return (
    <div className="space-y-5 relative">

      {/* أقسام مضيئة عائمة في الخلفية — فقط خضراء وفيروزية */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 left-1/4 w-96 h-96 ${THEME.blob1} rounded-full blur-3xl float-slow`} />
        <div className={`absolute top-1/2 -right-24 w-80 h-80 ${THEME.blob2} rounded-full blur-3xl float-slower`} />
        <div className={`absolute bottom-0 left-1/3 w-96 h-96 ${THEME.blob3} rounded-full blur-3xl float-slow`} />
      </div>

      {/* ─── لافتة رئيسية ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r ${THEME.hero} text-white shadow-xl ${THEME.heroShadow} animate-gradient-x`}
      >
        {/* دوائر زخرفية */}
        <div className="absolute -left-12 -top-20 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-6 -bottom-24 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        {/* أيقونات عائمة */}
        <CalendarClock className="absolute left-10 top-5 w-5 h-5 text-white/40 float-slow pointer-events-none" />
        <UserCheck className="absolute left-48 bottom-7 w-4 h-4 text-white/30 float-slower pointer-events-none" />
        <Bell className="absolute right-1/3 top-3 w-4 h-4 text-white/35 float-slow pointer-events-none" />
        <Sparkles className="absolute right-1/4 bottom-4 w-4 h-4 text-white/30 float-slower pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
              <CalendarClock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-sm">
                الحجوزات وقوائم الانتظار
              </h2>
              <p className="text-xs text-emerald-50/90 mt-1">
                تسجيل الحجوزات الهاتفية والحضورية، التوزيع السريع على الأجهزة الشاغرة ومتابعة جدول اليوم
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-emerald-900 bg-white hover:bg-emerald-50 shadow-lg shadow-emerald-900/20 transition font-gaming"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ تسجيل حجز جديد</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ─── شريط الإحصاءات الحية ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`p-4 rounded-2xl border shadow-xs ${s.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {s.label}
              </span>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className={`text-xl font-black font-mono font-mono-digits mt-1.5 bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── حالة الأجهزة المتاحة للحجز السريع ─── */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-black text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
            <GamingPcIcon className={`w-4 h-4 ${THEME.text}`} />
            حالة الأجهزة المتاحة للحجز السريع:
          </span>
          <span className={`text-sm font-mono font-mono-digits font-black bg-gradient-to-r ${THEME.strip} bg-clip-text text-transparent`}>
            {freeStations} أجهزة شاغرة
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {stations.map((st) => (
            <span
              key={st.id}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                st.status === 'available'
                  ? `${THEME.chip} ${st.status === 'available' ? 'shadow-sm' : ''}`
                  : 'bg-slate-50 dark:bg-slate-800/70 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${st.status === 'available' ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/60' : 'bg-slate-400'}`}></span>
              <span>{st.id} ({st.type})</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── البحث + تصفية الحالة ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-[#0c101c] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم اللاعب، رقم الهاتف أو الجهاز..."
            className="w-full pl-3 pr-9 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono-digits">
          {statusPills.map(p => (
            <motion.button
              whileTap={{ scale: 0.96 }}
              key={p.key}
              onClick={() => setStatusFilter(p.key)}
              className={`flex-1 sm:flex-none px-3 py-1.5 font-bold rounded-lg transition-all ${
                statusFilter === p.key ? THEME.tabActive : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── قائمة الحجوزات ─── */}
      {filteredReservations.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${THEME.strip} text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30`}>
            <CalendarCheck className="w-7 h-7" />
          </div>
          <div className="text-base font-black text-slate-800 dark:text-slate-100">لا توجد حجوزات في هذا التصنيف</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            سجل حجزاً جديداً من الزر أعلاه، أو سيظهر الحجز فور اتصال اللاعب بهاتف النادي.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredReservations.map((res, idx) => {
              const isPending = res.status === 'pending';
              const isSeated = res.status === 'seated';
              const isCancelled = res.status === 'cancelled';
              const targetStation = stations.find((s) => s.id === res.stationId);
              const isStationFree = targetStation?.status === 'available';

              const strip = isPending
                ? THEME.strip
                : isSeated
                ? 'from-teal-400 to-cyan-500'
                : 'from-slate-300 to-slate-400';

              const badge = isPending
                ? THEME.chip
                : isSeated
                ? THEME.chipTeal
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700';

              return (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl bg-white dark:bg-[#0c101c] border transition-all duration-300 flex flex-col overflow-hidden ${
                    isPending
                      ? `border-emerald-200 dark:border-emerald-500/40 ring-2 ring-emerald-500/25 shadow-lg shadow-emerald-500/10 ${THEME.glow}`
                      : isSeated
                      ? 'border-teal-200 dark:border-teal-800/60 shadow-md shadow-teal-500/10'
                      : 'border-slate-200 dark:border-slate-800 opacity-70'
                  }`}
                >
                  {/* شريط علوي بلون الحالة */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${strip} ${isPending ? 'animate-gradient-x shimmer' : ''}`} />

                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    {/* رأس الكارت */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isCancelled ? 'from-slate-400 to-slate-500' : THEME.strip} flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-white dark:ring-slate-800 shrink-0`}>
                          {res.customerName.trim().slice(0, 1) || '؟'}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {res.customerName}
                          </h3>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-mono-digits flex items-center gap-1 mt-0.5" dir="ltr">
                            <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            {res.customerPhone}
                          </div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 shrink-0 ${badge} ${isPending ? 'animate-pulse' : ''}`}>
                        {isPending && <Bell className="w-3 h-3" />}
                        {isSeated && <CheckCircle2 className="w-3 h-3" />}
                        {isCancelled && <XCircle className="w-3 h-3" />}
                        {isPending ? 'في الانتظار' : isSeated ? 'بدأ اللعب' : 'ملغي'}
                      </span>
                    </div>

                    {/* تفاصيل الحجز */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080d19] border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-bold text-[11px]">
                          <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${THEME.gradient} flex items-center justify-center shadow-sm shrink-0`}>
                            <GamingPcIcon className="w-3.5 h-3.5 text-white" />
                          </span>
                          الجهاز المحجوز:
                        </span>
                        <span className="text-slate-900 dark:text-white font-black">{res.stationName}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-bold text-[11px]">
                          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-sm shrink-0">
                            <Clock className="w-3.5 h-3.5 text-white" />
                          </span>
                          الوقت والمدة:
                        </span>
                        <span className={`font-black font-mono font-mono-digits ${THEME.text}`}>{res.startTime} • {res.durationMinutes} دقيقة</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                        <span className="flex items-center gap-1.5 font-bold text-[11px]">
                          <Calendar className={`w-3.5 h-3.5 ${THEME.textTeal} shrink-0`} />
                          تاريخ الحجز:
                        </span>
                        <span className="font-mono font-mono-digits font-bold text-slate-800 dark:text-slate-200">{res.reservedDate}</span>
                      </div>
                    </div>

                    {/* ملاحظات */}
                    {res.notes && (
                      <div className={`text-xs text-slate-600 dark:text-slate-300 p-2.5 rounded-xl border ${THEME.soft} flex items-start gap-1.5`}>
                        <Sparkles className={`w-3.5 h-3.5 ${THEME.text} shrink-0 mt-0.5`} />
                        <span><span className="font-bold text-slate-800 dark:text-white">ملاحظات: </span>{res.notes}</span>
                      </div>
                    )}

                    {/* أزرار الإجراءات */}
                    {isPending && (
                      <div className="flex items-center gap-2 pt-2 mt-auto border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            unlockAudioContext();
                            playReservationAlertSound();
                            setTimeout(() => {
                              speakVoiceAlert(`حان موعد حجز اللاعب ${res.customerName} للجهاز ${res.stationName}`);
                            }, 350);
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${THEME.chipTeal} hover:brightness-95 dark:hover:brightness-125`}
                          title="فراخوانی و اعلام نوبت صوتی در سالن"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${THEME.textTeal}`} />
                          <span>نداء صوتی</span>
                        </button>

                        <button
                          onClick={() => handleSeatClick(res)}
                          disabled={!isStationFree}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r ${THEME.gradient} hover:brightness-110 shadow-md shadow-emerald-500/30 flex items-center justify-center gap-1.5 transition font-gaming cursor-pointer animate-gradient-x ${!isStationFree ? 'opacity-50 pointer-events-none' : ''}`}
                          title={isStationFree ? 'دخول وبدء الجلسة' : 'الجهاز مشغول حالياً'}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>دخول وبدء الجلسة</span>
                        </button>

                        <button
                          onClick={() => onCancelReservation(res.id)}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer active:scale-95"
                          title="إلغاء الحجز"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ─── نافذة تسجيل حجز جديد ─── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* شريط علوي أخضر فيروزي */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${THEME.strip} animate-gradient-x`} />

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${THEME.gradient} flex items-center justify-center shadow-md`}>
                      <CalendarClock className="w-4 h-4 text-white" />
                    </div>
                    <span>تسجيل حجز موعد جديد</span>
                  </h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم اللاعب:</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: أحمد علي"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف:</label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="07701234567"
                      className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اختيار الجهاز أو المنصة:</label>
                    <select
                      value={stationId}
                      onChange={(e) => setStationId(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none cursor-pointer transition"
                    >
                      {stations.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.type}) - {st.status === 'available' ? 'شاغر' : 'مشغول حالياً'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ساعة البدء:</label>
                      <input
                        type="time"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">مدة الحجز (دقيقة):</label>
                      <input
                        type="number"
                        step="30"
                        min="30"
                        required
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ملاحظات أو الألعاب المطلوبة:</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="لعبة FC 24 مع 4 أجهزة تحكم، حجز مناسبة خاصة..."
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r ${THEME.gradient} rounded-xl hover:brightness-110 shadow-md shadow-emerald-500/30 flex items-center gap-1.5 font-gaming cursor-pointer animate-gradient-x`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تثبيت الحجز</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
