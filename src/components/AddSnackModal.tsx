import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coffee, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Session, SnackItem, SnackOrder } from '../types';
import { formatCurrency } from '../utils/formatters';
import { SnackVisual } from './SnackVisual';

interface AddSnackModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  snacks: SnackItem[];
  onConfirmAddSnacks: (sessionId: string, orders: SnackOrder[]) => void;
}

export const AddSnackModal: React.FC<AddSnackModalProps> = ({
  isOpen,
  onClose,
  session,
  snacks,
  onConfirmAddSnacks,
}) => {
  if (!isOpen || !session) return null;

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleUpdateQty = (snackId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[snackId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: next };
    });
  };

  const selectedItemsCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const selectedTotalCost = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const item = snacks.find((s) => s.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleConfirm = () => {
    const orders: SnackOrder[] = Object.entries(quantities).map(([id, qty]) => {
      const item = snacks.find((s) => s.id === id)!;
      return {
        snackId: item.id,
        name: item.name,
        quantity: qty,
        unitPrice: item.price,
        totalPrice: item.price * qty,
        orderedAt: new Date().toISOString(),
      };
    });

    onConfirmAddSnacks(session.id, orders);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white border border-emerald-100 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
      >
        
        {/* رأس النافذة المنبثقة */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                إضافة طلبات بوفيه إلى الجلسة: {session.stationName}
              </h3>
              <p className="text-xs text-slate-500">
                اللاعب: <strong className="text-emerald-700 font-bold">{session.customerName}</strong> (رمز PIN: {session.customerPin})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* قائمة التسالي المتاحة بالبوفيه مع أيقونات جذابة */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto p-1 custom-scrollbar">
          {snacks.map((snack) => {
            const qty = quantities[snack.id] || 0;
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                key={snack.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  qty > 0 ? 'bg-emerald-50 border-emerald-300 shadow-xs' : 'bg-slate-50 border-slate-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <SnackVisual 
                    name={snack.name} 
                    category={snack.category} 
                    emoji={snack.imageIcon}
                    size="md" 
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {snack.name}
                    </h4>
                    <span className="font-mono text-emerald-700 text-xs font-bold font-mono-digits">
                      {formatCurrency(snack.price)}
                    </span>
                  </div>
                </div>

                {/* التحكم بالكمية */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => handleUpdateQty(snack.id, -1)}
                    disabled={qty === 0}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-30 flex items-center justify-center transition hover:border-emerald-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </motion.button>
                  <span className="w-6 text-center font-mono font-bold text-sm text-emerald-800 font-mono-digits">
                    {qty}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => handleUpdateQty(snack.id, 1)}
                    className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center transition shadow-xs font-bold hover:bg-emerald-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ملخص تكلفة التسالي بالدينار */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
          <div className="text-xs text-slate-600 font-medium">
            عدد الأصناف المختارة: <strong className="text-emerald-800 font-mono font-bold font-mono-digits">{selectedItemsCount}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-600">إجمالي البوفيه:</span>
            <span className="font-mono font-black text-base text-emerald-800 font-mono-digits">
              {formatCurrency(selectedTotalCost)}
            </span>
          </div>
        </div>

        {/* أزرار التأكيد والإلغاء */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 transition"
          >
            إلغاء
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleConfirm}
            disabled={selectedItemsCount === 0}
            className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 transition shadow-md shadow-emerald-500/20 disabled:opacity-40"
          >
            تأكيد الإضافة إلى فاتورة الجلسة
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};

