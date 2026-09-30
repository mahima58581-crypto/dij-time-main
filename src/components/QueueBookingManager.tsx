import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalendarClock, 
  Plus, 
  Search, 
  UserCheck, 
  XCircle, 
  Clock, 
  Phone, 
  Monitor, 
  Calendar, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Play,
  Volume2,
  Bell
} from 'lucide-react';
import { BookingReservation, Station } from '../types';
import { playReservationAlertSound, speakVoiceAlert, unlockAudioContext } from '../utils/audioAlerts';

interface QueueBookingManagerProps {
  reservations: BookingReservation[];
  stations: Station[];
  onAddReservation: (reservation: Omit<BookingReservation, 'id' | 'createdAt'>) => void;
  onSeatReservation: (reservation: BookingReservation) => void;
  onCancelReservation: (reservationId: string) => void;
  onStartSessionForStation: (stationId: string, customerName?: string, customerPhone?: string) => void;
}

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

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>الحجوزات وقوائم الانتظار للاعبين</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تسجيل الحجوزات الهاتفية والحضورية، التوزيع السريع على الأجهزة الشاغرة ومتابعة جدول اليوم
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition font-gaming"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ تسجيل حجز جديد</span>
        </motion.button>
      </div>

      {/* Free Stations Quick Glance */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-slate-900 dark:text-white">حالة الأجهزة المتاحة للحجز السريع:</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-mono font-mono-digits font-bold">
            {stations.filter((s) => s.status === 'available').length} أجهزة شاغرة
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {stations.map((st) => (
            <span
              key={st.id}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                st.status === 'available'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${st.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{st.id} ({st.type})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-[#0c101c] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم اللاعب، رقم الهاتف أو الجهاز..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono-digits">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 font-bold rounded-lg transition ${
              statusFilter === 'pending'
                ? 'bg-emerald-600 text-white font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
            }`}
          >
            في انتظار الدخول ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('seated')}
            className={`px-3 py-1.5 font-bold rounded-lg transition ${
              statusFilter === 'seated'
                ? 'bg-emerald-600 text-white font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
            }`}
          >
            تم الدخول واللعب
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 font-bold rounded-lg transition ${
              statusFilter === 'all'
                ? 'bg-emerald-600 text-white font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
            }`}
          >
            كافة سجلات الحجوزات
          </button>
        </div>
      </div>

      {/* Reservations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReservations.map((res) => {
          const isPending = res.status === 'pending';
          const targetStation = stations.find((s) => s.id === res.stationId);
          const isStationFree = targetStation?.status === 'available';

          return (
            <motion.div
              key={res.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-2xl bg-white dark:bg-[#0c101c] border transition-all shadow-sm space-y-4 flex flex-col justify-between ${
                isPending ? 'border-emerald-200 dark:border-emerald-500/40 hover:border-emerald-400' : 'border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{res.customerName}</span>
                    </h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-mono-digits mt-0.5">
                      {res.customerPhone}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    res.status === 'pending'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : res.status === 'seated'
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  }`}>
                    {res.status === 'pending' ? 'في الانتظار' : res.status === 'seated' ? 'بدأ اللعب' : 'ملغي'}
                  </span>
                </div>

                <div className="mt-3 p-3 bg-slate-50 dark:bg-[#080d19] rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1.5 font-mono font-mono-digits">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-sans">
                      <Monitor className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      الجهاز المحجوز:
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold">{res.stationName}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-sans">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      الوقت والمدة:
                    </span>
                    <span className="text-emerald-800 dark:text-emerald-400 font-bold font-mono-digits">{res.startTime} • {res.durationMinutes} دقيقة</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800 font-sans">
                    <span>تاريخ الحجز:</span>
                    <span className="font-mono-digits text-slate-800 dark:text-slate-200">{res.reservedDate}</span>
                  </div>
                </div>

                {res.notes && (
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-white">ملاحظات: </span>
                    <span>{res.notes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isPending && (
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      unlockAudioContext();
                      playReservationAlertSound();
                      setTimeout(() => {
                        speakVoiceAlert(`حان موعد حجز اللاعب ${res.customerName} للجهاز ${res.stationName}`);
                      }, 350);
                    }}
                    className="py-2 px-3 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 flex items-center justify-center gap-1.5 transition shadow-xs"
                    title="فراخوانی و اعلام نوبت صوتی در سالن"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>نداء صوتی</span>
                  </button>

                  <button
                    onClick={() => handleSeatClick(res)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-sm shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition font-gaming"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>دخول وبدء الجلسة</span>
                  </button>

                  <button
                    onClick={() => onCancelReservation(res.id)}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-rose-600 hover:bg-rose-50 transition"
                    title="إلغاء الحجز"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add Reservation Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>تسجيل حجز موعد جديد</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">اسم اللاعب:</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: أحمد علي"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">رقم الهاتف:</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="07701234567"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">اختيار الجهاز أو المنصة:</label>
                  <select
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
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
                    <label className="text-xs font-bold text-slate-700">ساعة البدء:</label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">مدة الحجز (دقيقة):</label>
                    <input
                      type="number"
                      step="30"
                      min="30"
                      required
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">ملاحظات أو الألعاب المطلوبة:</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="لعبة FC 24 مع 4 أجهزة تحكم، حجز مناسبة خاصة..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-105 shadow-md shadow-emerald-500/25 font-gaming"
                  >
                    تثبيت الحجز
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
