import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Clock, 
  Phone, 
  KeyRound, 
  Receipt, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';
import { Session, GameMode } from '../types';
import { 
  formatCurrency, 
  formatDuration,
  formatDurationDigital,
  calculateElapsedSeconds
} from '../utils/formatters';
import { useLiveTimer } from '../hooks/useLiveTimer';

interface SessionsLogProps {
  sessions: Session[];
  onViewInvoice: (session: Session) => void;
  onAddSnack: (session: Session) => void;
}

export const SessionsLog: React.FC<SessionsLogProps> = ({
  sessions,
  onViewInvoice,
  onAddSnack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | GameMode>('all');
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});

  const now = useLiveTimer(1000);

  const togglePin = (sessionId: string) => {
    setRevealedPins((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const filteredSessions = sessions.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      s.customerName.toLowerCase().includes(q) ||
      s.customerPhone.includes(q) ||
      s.customerPin.includes(q) ||
      s.stationName.toLowerCase().includes(q);

    if (!matchSearch) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (modeFilter !== 'all') {
      const hasMode = s.gamesPlayed.some((g) => g.mode === modeFilter);
      if (!hasMode) return false;
    }

    return true;
  });

  return (
    <div className="space-y-5">
      
      {/* رأس وفلاتر البحث والفرز */}
      <div className="bg-[#10121b]/95 rounded-2xl p-5 border border-amber-500/25 shadow-xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-zinc-100 flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20"
              >
                <Receipt className="w-5 h-5 stroke-[2.5]" />
              </motion.div>
              <span>سیاهه ورود و خروج بازیکنان و تسویه حساب‌های مالی (دخل و خرج)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              ثبت دقیق ساعات بازی، دسته‌بندی آنلاین و آفلاین، رمز PIN، شماره تماس، و صدور فاکتور رسمی به دینار
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-amber-500/30 text-xs font-bold text-amber-400">
              تعداد کل سوابق: <span className="font-mono text-sm font-black">{filteredSessions.length}</span>
            </span>
          </div>
        </div>

        {/* صف عناصر التحكم بالفلاتر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          
          {/* صندوق البحث */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
            <input
              id="search-sessions-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو با نام، تلفن، پین یا سیستم..."
              className="w-full pl-3 pr-9 py-2 rounded-xl text-xs bg-zinc-900 border border-amber-500/20 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* فلتر الحالة */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <span className="text-zinc-400 px-1 font-bold text-[11px]">وضعیت:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                statusFilter === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                statusFilter === 'active' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              در حال بازی
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                statusFilter === 'completed' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              تسویه‌شده
            </button>
          </div>

          {/* فلتر أونلاين / أوفلاين */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <span className="text-zinc-400 px-1 font-bold text-[11px]">حالت:</span>
            <button
              onClick={() => setModeFilter('all')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                modeFilter === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setModeFilter('online')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                modeFilter === 'online' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🌐 آنلاین
            </button>
            <button
              onClick={() => setModeFilter('offline')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                modeFilter === 'offline' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🎮 آفلاین
            </button>
          </div>

          {/* إعادة ضبط الفلاتر */}
          <div className="flex items-center justify-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setModeFilter('all');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-amber-300 bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 transition"
            >
              تنظیم مجدد فیلترها
            </motion.button>
          </div>

        </div>
      </div>

      {/* جدول عصري باللونين الأسود والذهبي لسجلات الجلسات */}
      <div className="bg-[#10121b]/95 rounded-2xl border border-amber-500/25 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-zinc-950 border-b border-amber-500/20 text-amber-300 text-xs font-black">
                <th className="p-3.5">ایستگاه و دستگاه</th>
                <th className="p-3.5">مشخصات بازیکن (نام، تلفن، PIN)</th>
                <th className="p-3.5">زمان شروع (ورود)</th>
                <th className="p-3.5">زمان پایان (خروج)</th>
                <th className="p-3.5">مدت بازی مؤثر</th>
                <th className="p-3.5">بازی‌های اجراشده</th>
                <th className="p-3.5">بوفه و سفارشات</th>
                <th className="p-3.5">مبلغ نهایی (دینار)</th>
                <th className="p-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs sm:text-sm text-zinc-200">
              <AnimatePresence>
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => {
                    const isActive = session.status === 'active';
                    const elapsedSecs = calculateElapsedSeconds(session.checkInTime, session.checkOutTime);
                    const isPinRevealed = !!revealedPins[session.id];

                    return (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={session.id}
                        className={`hover:bg-amber-500/5 transition-colors ${
                          isActive ? 'bg-amber-500/10' : ''
                        }`}
                      >
                        {/* المحطة والجهاز */}
                        <td className="p-3.5">
                          <div className="font-bold text-zinc-100 flex items-center gap-1.5">
                            <span>{session.stationName}</span>
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                            )}
                          </div>
                          <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">
                            تعرفه: {formatCurrency(session.hourlyRate)} / ساعت
                          </div>
                        </td>

                        {/* بيانات اللاعب */}
                        <td className="p-3.5">
                          <div className="font-bold text-zinc-100">
                            {session.customerName}
                          </div>
                          <div className="flex items-center gap-1 text-zinc-400 text-xs mt-0.5">
                            <Phone className="w-3 h-3 text-amber-400" />
                            <span dir="ltr" className="font-mono">{session.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[11px] text-zinc-500 flex items-center gap-0.5">
                              <KeyRound className="w-3 h-3 text-amber-400" /> پین‌کد:
                            </span>
                            <span className="font-mono font-bold text-amber-300 bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30 text-xs">
                              {isPinRevealed ? session.customerPin : '••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePin(session.id)}
                              className="text-zinc-400 hover:text-amber-400 p-0.5 transition"
                            >
                              {isPinRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-amber-400" />}
                            </button>
                          </div>
                        </td>

                        {/* وقت الدخول */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-semibold text-zinc-200 font-mono text-xs">
                            {new Date(session.checkInTime).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {new Date(session.checkInTime).toLocaleDateString('ar-IQ', { month: 'numeric', day: 'numeric' })}
                          </div>
                        </td>

                        {/* وقت الخروج */}
                        <td className="p-3.5 whitespace-nowrap">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                              در حال بازی هم‌اکنون
                            </span>
                          ) : (
                            <div>
                              <div className="font-semibold text-zinc-200 font-mono text-xs">
                                {new Date(session.checkOutTime!).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="text-[11px] text-zinc-500">
                                {new Date(session.checkOutTime!).toLocaleDateString('ar-IQ', { month: 'numeric', day: 'numeric' })}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* مدة اللعب */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-black font-mono text-amber-400 text-sm tracking-wider">
                            {formatDurationDigital(elapsedSecs)}
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            {formatDuration(elapsedSecs / 60)}
                          </div>
                        </td>

                        {/* الألعاب */}
                        <td className="p-3.5 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {session.gamesPlayed.length > 0 ? (
                              session.gamesPlayed.map((game, i) => (
                                <div
                                  key={i}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[11px]"
                                >
                                  <span className="text-zinc-200 font-medium">{game.gameName}</span>
                                  {game.mode === 'online' ? (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                                      آنلاین
                                    </span>
                                  ) : (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                      آفلاین
                                    </span>
                                  )}
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-zinc-500 italic">نامشخص</span>
                            )}
                          </div>
                        </td>

                        {/* البوفيه والتسالي */}
                        <td className="p-3.5">
                          {session.snacks.length > 0 ? (
                            <div className="space-y-0.5 max-w-[180px]">
                              {session.snacks.map((snk, i) => (
                                <div key={i} className="text-xs text-zinc-300 flex items-center justify-between">
                                  <span className="truncate">{snk.name} ×{snk.quantity}</span>
                                  <span className="font-mono text-amber-400 font-bold ml-1">{formatCurrency(snk.totalPrice)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-500 italic">بدون سفارش</span>
                          )}
                          {isActive && (
                            <button
                              onClick={() => onAddSnack(session)}
                              className="mt-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5"
                            >
                              <Plus className="w-3 h-3" /> + ثبت سفارش
                            </button>
                          )}
                        </td>

                        {/* التكلفة والحساب بالدينار */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-black font-mono text-base text-zinc-100">
                            {formatCurrency(session.finalAmount)}
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <span>بازی: {formatCurrency(session.timeCost)}</span>
                            <span>•</span>
                            <span>بوفه: {formatCurrency(session.snacksCost)}</span>
                          </div>
                          <div className="mt-1">
                            {session.paymentStatus === 'paid' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                                <CheckCircle className="w-2.5 h-2.5" /> پرداخت شد ({session.paymentMethod || 'نقدی'})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                                <AlertCircle className="w-2.5 h-2.5" /> فعال هم‌اکنون
                              </span>
                            )}
                          </div>
                        </td>

                        {/* الإجراء */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            id={`btn-view-invoice-${session.id}`}
                            onClick={() => onViewInvoice(session)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 shadow-md shadow-amber-500/20 transition"
                          >
                            <Receipt className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>فاکتور و تسویه</span>
                          </motion.button>
                        </td>

                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-zinc-500">
                      هیچ سابقه‌ای مطابق با شرایط جستجو و فیلتر یافت نشد
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

