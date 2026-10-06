import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Receipt,
  Printer,
  CreditCard,
  Banknote,
  Wallet,
  Clock,
  Phone,
  KeyRound,
  Gamepad2,
  Coffee
} from 'lucide-react';
import { Session } from '../types';
import {
  formatCurrency,
  formatDuration,
  formatDurationDigital,
  calculatePlayCost
} from '../utils/formatters';
import { PLATFORM_META } from './platformMeta';

interface CheckoutInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onCompleteCheckout: (sessionId: string, paymentMethod: 'كاش' | 'شبكة / مدى' | 'محفظة العميل', discount: number) => void;
}

export const CheckoutInvoiceModal: React.FC<CheckoutInvoiceModalProps> = ({
  isOpen,
  onClose,
  session,
  onCompleteCheckout,
}) => {
  if (!isOpen || !session) return null;

  const isActive = session.status === 'active';
  const checkOutTime = session.checkOutTime || new Date().toISOString();

  // هویت بصری پلتفرم مربوطه (رنگ و لوگوی اختصاصی)
  const meta = PLATFORM_META[session.stationType] || PLATFORM_META.PC;
  const PlatformIcon = meta.icon;

  // حساب مدة الجلسة بدقة
  const startMs = new Date(session.checkInTime).getTime();
  const endMs = new Date(checkOutTime).getTime();
  const totalElapsedSecs = Math.max(0, Math.floor((endMs - startMs) / 1000));
  const elapsedMinutes = totalElapsedSecs / 60;

  const currentPlayCost = isActive
    ? calculatePlayCost(elapsedMinutes, session.hourlyRate)
    : session.timeCost;

  const currentSnacksCost = session.snacks.reduce((acc, it) => acc + it.totalPrice, 0);

  const [discount, setDiscount] = useState<number>(session.discount || 0);
  const [paymentMethod, setPaymentMethod] = useState<'كاش' | 'شبكة / مدى' | 'محفظة العميل'>(
    (session.paymentMethod as any) || 'كاش'
  );

  const subtotal = currentPlayCost + currentSnacksCost;
  const grandTotal = Math.max(0, subtotal - discount);

  const handleSettle = () => {
    onCompleteCheckout(session.id, paymentMethod, discount);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl ring-1 overflow-hidden my-6 text-right ${meta.text
          .split(' ')
          .map((c) => c.replace('text-', 'ring-'))
          .join(' ')} dark:shadow-[0_0_50px_rgba(16,185,129,0.15)]`}
        dir="rtl"
      >
        {/* خط الألوان المميز للمنصة */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${meta.accent}`} />

        {/* شريط رأس الفاتورة */}
        <div className="p-4 bg-slate-50 dark:bg-[#080d19] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${meta.badge}`}>
              <PlatformIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-slate-900 dark:text-white text-sm font-gaming tracking-wide">
                {isActive ? 'تسجيل الخروج، التسوية وإصدار الفاتورة الرسمية' : 'فاتورة مسواة ومحفوظة بالسجل'}
              </h3>
              <div className={`text-[10px] font-bold ${meta.text}`}>
                {meta.label} • {session.stationName}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition shadow-xs cursor-pointer ${meta.text}`}
              title="طباعة الفاتورة"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الفاتورة</span>
            </motion.button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* تفاصيل ورقة الفاتورة الرسمية */}
        <div className="p-6 sm:p-7 space-y-5 text-slate-800 dark:text-slate-200 bg-white dark:bg-[#0c1220]">

          {/* الترويسة والشعار */}
          <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800 space-y-1">
            <div className={`text-2xl font-black tracking-wider font-['Chakra_Petch'] ${meta.text}`}>
              صالة ديج تايم للألعاب • Dij-Tiem Gaming Club
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              النظام الذكي لإدارة وحساب صالات الألعاب والشبكات
            </div>
            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-0.5 font-mono-digits">
              رقم الفاتورة: #{session.id.slice(0, 8).toUpperCase()} • التاريخ: {new Date(checkOutTime).toLocaleString('ar-IQ')}
            </div>
          </div>

          {/* بيانات اللاعب والمحطة */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#080e1b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-xs">
            <div className="space-y-1">
              <div className="text-slate-500 dark:text-slate-400 font-medium">بيانات اللاعب:</div>
              <div className="font-black text-sm text-slate-900 dark:text-white">{session.customerName}</div>
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-0.5">
                <Phone className={`w-3 h-3 ${meta.text}`} />
                <span dir="ltr" className="font-mono text-slate-700 dark:text-slate-300 font-mono-digits">{session.customerPhone}</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <KeyRound className={`w-3 h-3 ${meta.text}`} />
                <span>رمز PIN: </span>
                <span className={`font-mono font-bold px-1.5 py-0.5 rounded border font-mono-digits ${meta.chip}`}>
                  {session.customerPin}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="text-slate-500 dark:text-slate-400 font-medium text-right">المحطة والتعرفة:</div>
              <div className={`font-black text-sm text-right ${meta.text}`}>{session.stationName}</div>
              <div className="text-slate-600 dark:text-slate-300 text-right text-[11px] font-mono font-bold font-mono-digits">
                التعرفة: {formatCurrency(session.hourlyRate)} / ساعة
              </div>
              <div className="text-right pt-0.5">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${meta.chip}`}>
                  {session.sessionType === 'open' ? 'وقت مفتوح' : 'وقت محدد مسبقاً'}
                </span>
              </div>
            </div>
          </div>

          {/* ملخص الوقت والألعاب */}
          <div className="bg-slate-50 dark:bg-[#080e1b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className={`w-3.5 h-3.5 ${meta.text}`} />
                وقت الدخول الفعلي:
              </span>
              <strong className="text-slate-900 dark:text-white font-mono font-mono-digits">{new Date(session.checkInTime).toLocaleTimeString('ar-IQ')}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className={`w-3.5 h-3.5 ${meta.text}`} />
                وقت تسجيل الخروج:
              </span>
              <strong className="text-slate-900 dark:text-white font-mono font-mono-digits">{new Date(checkOutTime).toLocaleTimeString('ar-IQ')}</strong>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300">إجمالي مدة اللعب:</span>
              <span className={`font-black font-mono text-sm font-mono-digits ${meta.text}`}>
                {formatDurationDigital(totalElapsedSecs)} ({formatDuration(elapsedMinutes)})
              </span>
            </div>

            {/* الألعاب الجارية */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-1 flex items-center gap-1">
                <Gamepad2 className={`w-3 h-3 ${meta.text}`} />
                الألعاب المسجلة في هذه الجلسة:
              </div>
              <div className="flex flex-wrap gap-1">
                {session.gamesPlayed.map((g, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {g.gameName} ({g.mode === 'online' ? '🌐 أونلاين' : '🎮 أوفلاين'})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* طلبات البوفيه والتسالي */}
          {session.snacks.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Coffee className={`w-3.5 h-3.5 ${meta.text}`} />
                <span>طلبات البوفيه والمشروبات:</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#080e1b] rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800">
                {session.snacks.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">
                      {item.name} <span className="text-slate-500 dark:text-slate-400 font-mono-digits">× {item.quantity}</span>
                    </div>
                    <div className={`font-mono font-bold font-mono-digits ${meta.text}`}>
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* جدول الحساب الإجمالي بالدينار */}
          <div className={`p-4 rounded-2xl border space-y-2 text-xs ${meta.softBg}`}>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>تكلفة وقت اللعب:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white font-mono-digits">{formatCurrency(currentPlayCost)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>تكلفة طلبات البوفيه:</span>
              <span className={`font-mono font-bold font-mono-digits ${meta.text}`}>{formatCurrency(currentSnacksCost)}</span>
            </div>

            {isActive && (
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/70 dark:border-slate-800">
                <span className="font-medium">خصم خاص:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white text-left focus:outline-none focus:border-emerald-500 font-mono-digits"
                  />
                  <span>د.ع</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-900 dark:text-white text-sm font-black pt-2 border-t border-slate-200 dark:border-slate-700/70">
              <span>المبلغ النهائي للدفع:</span>
              <span className={`font-mono text-xl font-black font-mono-digits drop-shadow-xs ${meta.text}`}>
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          {/* اختيار طريقة الدفع */}
          {isActive && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">طريقة تسوية الفاتورة:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'كاش' as const, label: 'نقداً (كاش)', icon: <Banknote className="w-3.5 h-3.5" /> },
                  { id: 'شبكة / مدى' as const, label: 'بطاقة / ماستر كارد', icon: <CreditCard className="w-3.5 h-3.5" /> },
                  { id: 'محفظة العميل' as const, label: 'خصم من المحفظة', icon: <Wallet className="w-3.5 h-3.5" /> },
                ].map((m) => (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition border cursor-pointer ${
                      paymentMethod === m.id
                        ? `bg-gradient-to-r ${meta.accent} text-white font-black border-transparent shadow-md`
                        : 'bg-slate-50 dark:bg-[#080e1b] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
            >
              إلغاء
            </button>

            {isActive ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleSettle}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r ${meta.accent} hover:brightness-105 transition shadow-md font-gaming cursor-pointer`}
              >
                تأكيد التسوية، إنهاء الجلسة وإغلاق الحساب
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handlePrint}
                className={`px-5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${meta.chip} hover:brightness-95 dark:hover:brightness-125`}
              >
                إعادة طباعة الفاتورة
              </motion.button>
            )}
          </div>

        </div>

      </motion.div>
    </div>
  );
};
