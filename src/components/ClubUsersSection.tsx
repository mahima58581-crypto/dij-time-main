import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  KeyRound, 
  Wallet, 
  Phone, 
  Clock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowUpRight, 
  Search, 
  Award,
  X
} from 'lucide-react';
import { Customer } from '../types';
import { formatCurrency, formatDuration } from '../utils/formatters';

interface ClubUsersSectionProps {
  customers: Customer[];
  onOpenNewCustomer: () => void;
  onStartSessionForCustomer: (customer: Customer) => void;
  onRechargeBalance: (customerId: string, amount: number) => void;
}

export const ClubUsersSection: React.FC<ClubUsersSectionProps> = ({
  customers,
  onOpenNewCustomer,
  onStartSessionForCustomer,
  onRechargeBalance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllPins, setShowAllPins] = useState(false);
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [rechargeModalCustomer, setRechargeModalCustomer] = useState<Customer | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState<number>(10000);

  const togglePin = (customerId: string) => {
    setRevealedPins((prev) => ({ ...prev, [customerId]: !prev[customerId] }));
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.pin.includes(searchQuery)
  );

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rechargeModalCustomer && rechargeAmount > 0) {
      onRechargeBalance(rechargeModalCustomer.id, rechargeAmount);
      setRechargeModalCustomer(null);
    }
  };

  const getVipBadge = (level: Customer['vipLevel']) => {
    switch (level) {
      case 'VIP فاخر':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-400" />
            عضو VIP فاخر
          </span>
        );
      case 'ذهبي':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/35">
            <Award className="w-3 h-3 text-yellow-400" />
            عضو طلایی
          </span>
        );
      case 'فضي':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
            عضو نقره‌ای
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-800/80 text-zinc-400 border border-zinc-700/80">
            عضو برنز
          </span>
        );
    }
  };

  return (
    <section className="space-y-4 pt-4">
      
      {/* رأس قسم اللاعبين والزبائن */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.08 }}
            className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/25"
          >
            <Users className="w-5 h-5 stroke-[2.5]" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-zinc-100">
                کارت‌های بازیکنان و اعضای کلوپ
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/35">
                {customers.length} بازیکن ثبت‌شده
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              مدیریت پین‌کد اختصاصی، موجودی کیف پول به دینار، سطح کاربری و سوابق زمان بازی
            </p>
          </div>
        </div>

        {/* البحث وزر إضافة لاعب جديد */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="جستجو با نام، تلفن یا کد PIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 pl-3 py-2 rounded-xl text-xs bg-zinc-900 border border-amber-500/25 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 w-48 sm:w-60 shadow-xs"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpenNewCustomer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 shadow-md shadow-amber-500/25 transition"
          >
            <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ بازیکن جدید</span>
          </motion.button>
        </div>
      </div>

      {/* شبكة كروت اللاعبين */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredCustomers.map((customer) => {
            const isPinRevealed = showAllPins || !!revealedPins[customer.id];

            return (
              <motion.div
                key={customer.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="bg-[#10121b]/95 rounded-2xl border border-amber-500/25 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all p-4 flex flex-col justify-between space-y-3 group backdrop-blur-md"
              >
                {/* أعلى كارت اللاعب */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 font-black flex items-center justify-center text-base shadow-md shadow-amber-500/20">
                      {customer.name.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100 text-sm group-hover:text-amber-400 transition">
                        {customer.name}
                      </h3>
                      <div className="flex items-center gap-1 text-zinc-400 text-xs pt-0.5">
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span dir="ltr" className="font-mono">{customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  {getVipBadge(customer.vipLevel)}
                </div>

                {/* صندوق بيانات الحساب والـ PIN */}
                <div className="bg-zinc-900/90 rounded-xl p-3 border border-zinc-800 space-y-2 text-xs">
                  
                  {/* رمز الـ PIN المخصص */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      رمز عبور (PIN):
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30 text-xs tracking-wider">
                        {isPinRevealed ? customer.pin : '••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePin(customer.id)}
                        className="text-zinc-400 hover:text-amber-400 p-0.5 transition"
                        title={isPinRevealed ? 'مخفی کردن کد' : 'نمایش کد'}
                      >
                        {isPinRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    </div>
                  </div>

                  {/* رصيد المحفظة بالدينار */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                      موجودی کیف پول:
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(customer.balance)}
                    </span>
                  </div>

                  {/* سجل ساعات اللعب */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      زمان بازی ثبت شده:
                    </span>
                    <span className="font-mono text-zinc-300 font-semibold text-[11px]">
                      {formatDuration(customer.totalPlayMinutes)}
                    </span>
                  </div>

                </div>

                {/* أزرار الإجراءات الخاصة باللاعب */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setRechargeModalCustomer(customer)}
                    className="py-2 px-2.5 rounded-xl text-xs font-bold text-amber-300 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 transition text-center shadow-xs"
                  >
                    + شارژ کیف پول
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => onStartSessionForCustomer(customer)}
                    className="py-2 px-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>ورود به بازی</span>
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* نافذة شحن رصيد المحفظة المنبثقة */}
      <AnimatePresence>
        {rechargeModalCustomer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#12141f] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-amber-500/35 space-y-4 text-zinc-100"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-100 text-sm">شارژ کیف پول بازیکن</h3>
                    <p className="text-xs text-zinc-400">{rechargeModalCustomer.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRechargeModalCustomer(null)}
                  className="text-zinc-400 hover:text-zinc-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRechargeSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">
                    مبلغ شارژ مورد نظر (دینار):
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[5000, 10000, 25000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRechargeAmount(amt)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition ${
                          rechargeAmount === amt
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-400 font-black'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                        }`}
                      >
                        {formatCurrency(amt)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-sm font-mono font-bold bg-zinc-900 border border-zinc-700 text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setRechargeModalCustomer(null)}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    انصراف
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 shadow-md shadow-amber-500/25"
                  >
                    تأیید شارژ کیف پول
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

