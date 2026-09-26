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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-emerald-100 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-6"
      >
        
        {/* شريط رأس الفاتورة */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
            <h3 className="font-black text-slate-900 text-sm">
              {isActive ? 'تسجيل الخروج، التسوية وإصدار الفاتورة الرسمية' : 'فاتورة مسواة ومحفوظة بالسجل'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-emerald-700 border border-slate-200 transition shadow-xs"
              title="طباعة الفاتورة"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الفاتورة</span>
            </motion.button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* تفاصيل ورقة الفاتورة الرسمية */}
        <div className="p-6 sm:p-7 space-y-5 text-slate-800 bg-white">
          
          {/* الترويسة والشعار */}
          <div className="text-center pb-4 border-b border-slate-100 space-y-1">
            <div className="text-2xl font-black text-emerald-800 tracking-wider font-['Chakra_Petch']">
              صالة ديج تايم للألعاب • Dij-Tiem Gaming Club
            </div>
            <div className="text-xs font-medium text-slate-500">
              النظام الذكي لإدارة وحساب صالات الألعاب والشبكات
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-0.5 font-mono-digits">
              رقم الفاتورة: #{session.id.slice(0, 8).toUpperCase()} • التاريخ: {new Date(checkOutTime).toLocaleString('ar-IQ')}
            </div>
          </div>

          {/* بيانات اللاعب والمحطة */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <div className="text-slate-500 font-medium">بيانات اللاعب:</div>
              <div className="font-black text-sm text-slate-900">{session.customerName}</div>
              <div className="text-slate-500 flex items-center gap-1 pt-0.5">
                <Phone className="w-3 h-3 text-emerald-600" />
                <span dir="ltr" className="font-mono text-slate-700 font-mono-digits">{session.customerPhone}</span>
              </div>
              <div className="text-slate-500 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-emerald-600" />
                <span>رمز PIN: </span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono-digits">
                  {session.customerPin}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="text-slate-500 font-medium text-right">المحطة والتعرفة:</div>
              <div className="font-black text-sm text-emerald-800 text-right">{session.stationName}</div>
              <div className="text-slate-600 text-right text-[11px] font-mono font-bold font-mono-digits">
                التعرفة: {formatCurrency(session.hourlyRate)} / ساعة
              </div>
              <div className="text-right pt-0.5">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {session.sessionType === 'open' ? 'وقت مفتوح' : 'وقت محدد مسبقاً'}
                </span>
              </div>
            </div>
          </div>

          {/* ملخص الوقت والألعاب */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                وقت الدخول الفعلي:
              </span>
              <strong className="text-slate-900 font-mono font-mono-digits">{new Date(session.checkInTime).toLocaleTimeString('ar-IQ')}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                وقت تسجيل الخروج:
              </span>
              <strong className="text-slate-900 font-mono font-mono-digits">{new Date(checkOutTime).toLocaleTimeString('ar-IQ')}</strong>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-700">إجمالي مدة اللعب:</span>
              <span className="font-black font-mono text-emerald-800 text-sm font-mono-digits">
                {formatDurationDigital(totalElapsedSecs)} ({formatDuration(elapsedMinutes)})
              </span>
            </div>

            {/* الألعاب الجارية */}
            <div className="pt-2 border-t border-slate-200">
              <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center gap-1">
                <Gamepad2 className="w-3 h-3 text-emerald-600" />
                الألعاب المسجلة في هذه الجلسة:
              </div>
              <div className="flex flex-wrap gap-1">
                {session.gamesPlayed.map((g, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {g.gameName} ({g.mode === 'online' ? '🌐 أونلاين' : '🎮 أوفلاين'})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* طلبات البوفيه والتسالي */}
          {session.snacks.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-emerald-600" />
                <span>طلبات البوفيه والمشروبات:</span>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200">
                {session.snacks.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                    <div className="text-slate-800 font-medium">
                      {item.name} <span className="text-slate-500 font-mono-digits">× {item.quantity}</span>
                    </div>
                    <div className="font-mono text-emerald-800 font-bold font-mono-digits">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* جدول الحساب الإجمالي بالدينار */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>تكلفة وقت اللعب:</span>
              <span className="font-mono font-bold text-slate-900 font-mono-digits">{formatCurrency(currentPlayCost)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>تكلفة طلبات البوفيه:</span>
              <span className="font-mono font-bold text-emerald-800 font-mono-digits">{formatCurrency(currentSnacksCost)}</span>
            </div>

            {isActive && (
              <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-emerald-200/60">
                <span className="font-medium">خصم خاص:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded-lg bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 text-left focus:outline-none focus:border-emerald-500 font-mono-digits"
                  />
                  <span>د.ع</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-900 text-sm font-black pt-2 border-t border-emerald-200">
              <span>المبلغ النهائي للدفع:</span>
              <span className="font-mono text-emerald-800 text-xl font-black font-mono-digits">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          {/* اختيار طريقة الدفع */}
          {isActive && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">طريقة تسوية الفاتورة:</label>
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
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition border ${
                      paymentMethod === m.id
                        ? 'bg-emerald-600 text-white font-black border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
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
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 transition"
            >
              إلغاء
            </button>

            {isActive ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleSettle}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 transition shadow-md shadow-emerald-500/20"
              >
                تأكيد التسوية، إنهاء الجلسة وإغلاق الحساب
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
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

