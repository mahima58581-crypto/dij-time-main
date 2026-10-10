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
  Medal,
  Crown,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Customer } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CustomersManagerProps {
  customers: Customer[];
  onOpenNewCustomer: () => void;
  onStartSessionForCustomer: (customer: Customer) => void;
  onRechargeBalance: (customerId: string, amount: number) => void;
}

type TierFilter = 'all' | Customer['vipLevel'];

// ─── هویت بصری هر سطح VIP: رنگ، آیکون و گرادینت اختصاصی ───
const TIER_META: Record<
  Customer['vipLevel'],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    badge: string;
    gradient: string;
    glow: string;
    hoverGlow: string;
    softBg: string;
    progress: string;
    tabActive: string;
  }
> = {
  'VIP فاخر': {
    label: 'VIP فاخر',
    icon: Crown,
    text: 'text-amber-600 dark:text-amber-400',
    badge:
      'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600/70 shadow-amber-500/30',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    glow: 'ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/20',
    hoverGlow: 'hover:shadow-2xl hover:shadow-amber-500/35',
    softBg:
      'bg-amber-50/70 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50',
    progress: 'from-amber-400 via-orange-500 to-rose-500',
    tabActive:
      'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/50',
  },
  'ذهبي': {
    label: 'ذهبي',
    icon: Award,
    text: 'text-yellow-600 dark:text-yellow-400',
    badge:
      'bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600/60 shadow-yellow-500/30',
    gradient: 'from-yellow-300 via-amber-400 to-orange-500',
    glow: 'ring-2 ring-yellow-500/35 shadow-xl shadow-yellow-500/20',
    hoverGlow: 'hover:shadow-2xl hover:shadow-yellow-500/35',
    softBg:
      'bg-yellow-50/70 dark:bg-yellow-950/30 border-yellow-100 dark:border-yellow-900/50',
    progress: 'from-yellow-300 via-amber-400 to-orange-500',
    tabActive:
      'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/50',
  },
  'فضي': {
    label: 'فضي',
    icon: Medal,
    text: 'text-sky-600 dark:text-sky-400',
    badge:
      'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-600/60 shadow-sky-500/30',
    gradient: 'from-sky-300 via-slate-300 to-indigo-400',
    glow: 'ring-2 ring-sky-500/30 shadow-xl shadow-sky-500/20',
    hoverGlow: 'hover:shadow-2xl hover:shadow-sky-500/35',
    softBg:
      'bg-sky-50/60 dark:bg-sky-950/30 border-sky-100 dark:border-sky-900/50',
    progress: 'from-sky-300 via-slate-300 to-indigo-400',
    tabActive:
      'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/50',
  },
  'برونزي': {
    label: 'برونزي',
    icon: Medal,
    text: 'text-orange-700 dark:text-orange-400',
    badge:
      'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600/60 shadow-orange-500/30',
    gradient: 'from-orange-400 via-amber-600 to-rose-700',
    glow: 'ring-2 ring-orange-500/30 shadow-xl shadow-orange-500/20',
    hoverGlow: 'hover:shadow-2xl hover:shadow-orange-500/35',
    softBg:
      'bg-orange-50/60 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/50',
    progress: 'from-orange-400 via-amber-600 to-rose-700',
    tabActive:
      'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/50',
  },
};

// عتبات الترقية بين المستويات (مطابقة لإعدادات النادي: 15 / 40 / 80 ساعة)
const nextTierFor = (cust: Customer) => {
  const hours = cust.totalPlayMinutes / 60;
  if (cust.vipLevel === 'VIP فاخر')
    return { pct: 100, next: null, target: 80, hours };
  if (cust.vipLevel === 'ذهبي')
    return { pct: Math.min(100, ((hours - 40) / 40) * 100), next: 'VIP فاخر', target: 80, hours };
  if (cust.vipLevel === 'فضي')
    return { pct: Math.min(100, ((hours - 15) / 25) * 100), next: 'ذهبي', target: 40, hours };
  return { pct: Math.min(100, (hours / 15) * 100), next: 'فضي', target: 15, hours };
};

export const CustomersManager: React.FC<CustomersManagerProps> = ({
  customers,
  onOpenNewCustomer,
  onStartSessionForCustomer,
  onRechargeBalance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [rechargeModalCustomer, setRechargeModalCustomer] = useState<Customer | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState<number>(10000);

  const togglePin = (customerId: string) => {
    setRevealedPins((prev) => ({ ...prev, [customerId]: !prev[customerId] }));
  };

  const filteredCustomers = customers.filter((c) => {
    if (tierFilter !== 'all' && c.vipLevel !== tierFilter) return false;
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

  // إحصاءات النادي الحية
  const totalBalance = customers.reduce((s, c) => s + c.balance, 0);
  const totalHours = customers.reduce((s, c) => s + c.totalPlayMinutes, 0) / 60;
  const vipCount = customers.filter((c) => c.vipLevel === 'VIP فاخر').length;

  const stats = [
    { label: 'إجمالي الزبائن', value: customers.length, suffix: 'عضو', icon: Users, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/70' },
    { label: 'مجموع أرصدة المحافظ', value: formatCurrency(totalBalance), suffix: '', icon: Wallet, gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800/70' },
    { label: 'ساعات اللعب المسجلة', value: totalHours.toFixed(1), suffix: 'ساعة', icon: Clock, gradient: 'from-cyan-500 to-sky-500', bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800/70' },
    { label: 'أعضاء VIP فاخر', value: vipCount, suffix: 'عضو', icon: Crown, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/70' },
  ];

  return (
    <div className="space-y-5 relative">
      {/* بخش‌های نورانی شناور در پس‌زمینه */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl float-slow" />
        <div className="absolute top-1/3 -left-24 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl float-slower" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl float-slow" />
      </div>

      {/* ─── Header Banner متحول ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/30 animate-gradient-x"
      >
        {/* دوائر زخرفية */}
        <div className="absolute -left-12 -top-20 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-6 -bottom-24 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        {/* ستاره‌های شناور */}
        <Sparkles className="absolute left-10 top-5 w-5 h-5 text-white/40 float-slow pointer-events-none" />
        <Sparkles className="absolute left-44 bottom-7 w-4 h-4 text-white/30 float-slower pointer-events-none" />
        <Sparkles className="absolute right-1/3 top-3 w-3.5 h-3.5 text-white/35 float-slow pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-sm">
                إدارة حسابات وبيانات زبائن النادي
              </h2>
              <p className="text-xs text-emerald-50/90 mt-1">
                عرض الأسماء، رمز الدخول السري، أرصدة المحافظ بالدينار وساعات اللعب المسجلة
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="btn-add-customer-main"
            onClick={onOpenNewCustomer}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-emerald-700 bg-white hover:bg-emerald-50 shadow-lg shadow-emerald-900/25 transition font-gaming"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ إضافة زبون جديد</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ─── شريط الإحصاءات الحية ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`p-3.5 rounded-2xl border shadow-xs ${s.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {s.label}
              </span>
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md shadow-slate-900/10`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className={`text-lg sm:text-xl font-black font-mono font-mono-digits mt-1.5 bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
              {s.value}
              {s.suffix && (
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1">
                  {s.suffix}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── البحث + تصفية المستويات ─── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          <input
            id="search-customers-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث بالاسم، رقم الهاتف أو الرمز السري..."
            className="w-full pl-3 pr-10 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'VIP فاخر', 'ذهبي', 'فضي', 'برونزي'] as const).map((tier) => {
            if (tier === 'all') {
              return (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                    tierFilter === tier
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/50'
                      : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>الكل</span>
                </motion.button>
              );
            }
            const meta = TIER_META[tier];
            const Icon = meta.icon;
            const active = tierFilter === tier;
            const count = customers.filter((c) => c.vipLevel === tier).length;
            return (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                  active ? meta.tabActive : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{meta.label}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono-digits">
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ─── شبكة كروت الزبائن ─── */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3 shadow-xs">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            لا يوجد زبائن مطابقون للبحث أو التصفية
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTierFilter('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
          >
            إظهار جميع الزبائن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCustomers.map((cust, idx) => {
              const isPinRevealed = !!revealedPins[cust.id];
              const tier = TIER_META[cust.vipLevel];
              const TierIcon = tier.icon;
              const prog = nextTierFor(cust);

              return (
                <motion.div
                  key={cust.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                  whileHover={{ y: -4 }}
                  id={`customer-card-${cust.id}`}
                  className={`rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm flex flex-col transition-all duration-300 group overflow-hidden ${tier.glow} ${tier.hoverGlow}`}
                >
                  {/* شريط لون المستوى */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${tier.gradient} animate-gradient-x shimmer`} />

                  <div className="p-4 space-y-3.5 flex-1 flex flex-col">
                    {/* رأس الكارت: الصورة + الاسم + مستوى VIP */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tier.gradient} text-white flex items-center justify-center font-black text-lg shadow-lg shrink-0 ring-2 ring-white dark:ring-slate-800 animate-gradient-x`}>
                          {cust.name.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-slate-900 dark:text-white text-sm truncate">
                            {cust.name}
                          </h3>
                          <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                            <Phone className={`w-3 h-3 ${tier.text}`} />
                            <span dir="ltr" className="font-mono font-mono-digits text-slate-700 dark:text-slate-300">
                              {cust.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 shadow-xs shrink-0 glow-pulse ${tier.badge}`}>
                        <TierIcon className={`w-3 h-3 ${cust.vipLevel === 'VIP فاخر' ? 'spin-slow' : ''}`} />
                        {tier.label}
                      </span>
                    </div>

                    {/* PIN والمحفظة */}
                    <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl border ${tier.softBg}`}>
                      {/* PIN */}
                      <div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <KeyRound className={`w-3 h-3 ${tier.text}`} />
                          <span>رمز الدخول السري:</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-mono font-mono-digits font-bold text-xs tracking-widest text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {isPinRevealed ? cust.pin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePin(cust.id)}
                            className={`p-0.5 transition cursor-pointer ${tier.text} hover:opacity-80`}
                            title={isPinRevealed ? 'إخفاء الرمز' : 'إظهار الرمز'}
                          >
                            {isPinRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Wallet */}
                      <div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Wallet className={`w-3 h-3 ${tier.text}`} />
                          <span>رصيد المحفظة:</span>
                        </div>
                        <div className={`font-mono font-mono-digits font-black text-sm mt-0.5 bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                          {formatCurrency(cust.balance)}
                        </div>
                      </div>
                    </div>

                    {/* إحصاءات اللعب */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${tier.softBg}`}>
                        <Clock className={`w-3.5 h-3.5 ${tier.text} shrink-0`} />
                        <span>
                          وقت اللعب:{' '}
                          <strong className="text-slate-800 dark:text-slate-200 font-mono font-mono-digits">
                            {(cust.totalPlayMinutes / 60).toFixed(1)} س
                          </strong>
                        </span>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${tier.softBg}`}>
                        <Coins className={`w-3.5 h-3.5 ${tier.text} shrink-0`} />
                        <span>
                          المشتريات:{' '}
                          <strong className={`font-mono font-mono-digits ${tier.text}`}>
                            {formatCurrency(cust.totalSpent)}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* نوار التقدم نحو المستوى التالي */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <TrendingUp className={`w-3 h-3 ${tier.text}`} />
                          {prog.next ? `التقدم إلى مستوى «${prog.next}»` : 'وصل إلى أعلى مستوى'}
                        </span>
                        <span className={tier.text}>
                          {prog.next ? `${prog.hours.toFixed(1)} / ${prog.target} ساعة` : '🏆 رئيس VIP'}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${tier.progress} transition-all duration-700 animate-gradient-x`}
                          style={{ width: `${Math.max(4, prog.pct)}%` }}
                        />
                      </div>
                    </div>

                    {cust.notes && (
                      <div className={`text-[11px] text-slate-600 dark:text-slate-300 p-2 rounded-lg border ${tier.softBg}`}>
                        {cust.notes}
                      </div>
                    )}

                    {/* الإجراءات */}
                    <div className="flex items-center gap-2 pt-2 mt-auto border-t border-slate-100 dark:border-slate-800">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setRechargeModalCustomer(cust)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition shadow-xs cursor-pointer ${tier.badge} hover:brightness-95 dark:hover:brightness-125`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>شحن المحفظة</span>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onStartSessionForCustomer(cust)}
                        className="flex-1 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 transition shadow-md shadow-emerald-500/30 text-center flex items-center justify-center gap-1 font-gaming cursor-pointer animate-gradient-x"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>بدء الجلسة</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ─── مودال شحن المحفظة ─── */}
      <AnimatePresence>
        {rechargeModalCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setRechargeModalCustomer(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0c101c] rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* شريط لون المستوى */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${TIER_META[rechargeModalCustomer.vipLevel].gradient}`} />

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${TIER_META[rechargeModalCustomer.vipLevel].gradient} text-white flex items-center justify-center font-black text-base shadow-md shrink-0`}>
                    {rechargeModalCustomer.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Wallet className={`w-4 h-4 ${TIER_META[rechargeModalCustomer.vipLevel].text}`} />
                      <span>شحن محفظة: {rechargeModalCustomer.name}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      الرصيد الحالي:{' '}
                      <strong className={`font-mono font-mono-digits ${TIER_META[rechargeModalCustomer.vipLevel].text}`}>
                        {formatCurrency(rechargeModalCustomer.balance)}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    مبلغ الشحن (د.ع):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5000, 10000, 25000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRechargeAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold font-mono font-mono-digits transition border ${
                          rechargeAmount === amt
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black border-transparent shadow-md shadow-emerald-500/25'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600'
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
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-mono font-mono-digits font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-left"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRechargeModalCustomer(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                  >
                    إلغاء
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleConfirmRecharge}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-105 shadow-md shadow-emerald-500/25 font-gaming"
                  >
                    تأكيد شحن الرصيد
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
