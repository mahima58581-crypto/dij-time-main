import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  KeyRound, 
  Wallet, 
  Clock, 
  Coins, 
  Eye, 
  EyeOff, 
  Play, 
  Plus, 
  Award,
  Sparkles
} from 'lucide-react';
import { Customer } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CyberSectionIcon } from './CyberSectionIcon';

interface CustomersManagerProps {
  customers: Customer[];
  onOpenNewCustomer: () => void;
  onStartSessionForCustomer: (customer: Customer) => void;
  onRechargeBalance: (customerId: string, amount: number) => void;
}

export const CustomersManager: React.FC<CustomersManagerProps> = ({
  customers,
  onOpenNewCustomer,
  onStartSessionForCustomer,
  onRechargeBalance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [rechargeModalCustomer, setRechargeModalCustomer] = useState<Customer | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState<number>(10000);

  const togglePin = (customerId: string) => {
    setRevealedPins((prev) => ({ ...prev, [customerId]: !prev[customerId] }));
  };

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.pin.includes(q) ||
      c.vipLevel.toLowerCase().includes(q)
    );
  });

  const handleConfirmRecharge = () => {
    if (rechargeModalCustomer && rechargeAmount > 0) {
      onRechargeBalance(rechargeModalCustomer.id, rechargeAmount);
      setRechargeModalCustomer(null);
    }
  };

  const getVipBadge = (level: Customer['vipLevel']) => {
    switch (level) {
      case 'VIP فاخر':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            عضو VIP فاخر
          </span>
        );
      case 'ذهبي':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
            <Award className="w-3 h-3 text-teal-600" />
            عضو ذهبي
          </span>
        );
      case 'فضي':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            عضو فضي
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
            عضو برونزي
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center gap-3.5">
          <CyberSectionIcon icon={Users} size="lg" variant="emerald" />
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              إدارة حسابات وبيانات زبائن النادي
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              عرض الأسماء، رمز الدخول السري (PIN)، أرقام الهواتف، رصيد المحفظة بالدينار وساعات اللعب المسجلة
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="btn-add-customer-main"
          onClick={onOpenNewCustomer}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition font-gaming"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ إضافة زبون جديد</span>
        </motion.button>
      </motion.div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
        <input
          id="search-customers-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث بالاسم، رقم الهاتف أو رمز PIN..."
          className="w-full pl-3 pr-9 py-2.5 rounded-xl text-xs bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs transition"
        />
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredCustomers.map((cust, idx) => {
            const isPinRevealed = !!revealedPins[cust.id];

            return (
              <motion.div
                key={cust.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                whileHover={{ y: -2 }}
                id={`customer-card-${cust.id}`}
                className="bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 rounded-2xl p-4 shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 transition-all group"
              >
                {/* Header of customer card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-base shadow-sm">
                      {cust.name.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {cust.name}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span dir="ltr" className="font-mono font-mono-digits text-slate-700 dark:text-slate-300">{cust.phone}</span>
                      </div>
                    </div>
                  </div>

                  {getVipBadge(cust.vipLevel)}
                </div>

                {/* PIN & Wallet */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-[#080d19] p-3 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  
                  {/* PIN */}
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>رمز الدخول (PIN):</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-mono font-mono-digits font-bold text-xs tracking-widest text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {isPinRevealed ? cust.pin : '••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePin(cust.id)}
                        className="text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 p-0.5 transition cursor-pointer"
                        title={isPinRevealed ? 'إخفاء الرمز' : 'إظهار الرمز'}
                      >
                        {isPinRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    </div>
                  </div>

                  {/* Wallet */}
                  <div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-teal-600" />
                      <span>رصيد المحفظة:</span>
                    </div>
                    <div className="font-mono font-mono-digits font-black text-sm text-emerald-700 mt-1">
                      {formatCurrency(cust.balance)}
                    </div>
                  </div>

                </div>

                {/* Play Stats & Total spend */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>وقت اللعب: <strong className="text-slate-800 font-mono font-mono-digits">{(cust.totalPlayMinutes / 60).toFixed(1)} س</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-teal-600" />
                    <span>إجمالي المشتريات: <strong className="text-emerald-700 font-mono font-mono-digits">{formatCurrency(cust.totalSpent)}</strong></span>
                  </div>
                </div>

                {cust.notes && (
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    {cust.notes}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setRechargeModalCustomer(cust)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition text-center shadow-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-emerald-600" />
                    <span>شحن المحفظة</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onStartSessionForCustomer(cust)}
                    className="flex-1 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 transition shadow-sm shadow-emerald-500/20 text-center flex items-center justify-center gap-1 font-gaming"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>بدء الجلسة</span>
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Recharge Wallet Modal */}
      {rechargeModalCustomer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-[#0c101c] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-emerald-100 dark:border-slate-800 space-y-4"
          >
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>شحن محفظة الزبون: {rechargeModalCustomer.name}</span>
            </h3>

            <p className="text-xs text-slate-500">
              الرصيد الحالي: <strong className="text-emerald-700 font-mono font-mono-digits">{formatCurrency(rechargeModalCustomer.balance)}</strong>
            </p>

            <div className="space-y-2">
              <label className="text-xs text-slate-700 font-bold">مبلغ الشحن (د.ع):</label>
              <div className="grid grid-cols-3 gap-2">
                {[5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRechargeAmount(amt)}
                    className={`py-1.5 rounded-lg text-xs font-bold font-mono font-mono-digits transition border ${
                      rechargeAmount === amt
                        ? 'bg-emerald-600 text-white font-black border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="500"
                step="500"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl text-sm font-mono font-mono-digits font-bold bg-slate-50 border border-slate-200 text-emerald-700 focus:outline-none focus:border-emerald-500 text-left"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRechargeModalCustomer(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 transition"
              >
                إلغاء
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleConfirmRecharge}
                className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 font-gaming"
              >
                تأكيد شحن الرصيد
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

