import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Sparkles,
  Check,
  Edit3,
  Users,
  Save,
  X,
  ArrowUpRight,
  Crown,
  Medal,
  Percent,
  Clock,
  Coins
} from 'lucide-react';
import { Customer, VipTierConfig } from '../types';
import { formatCurrency, formatDuration } from '../utils/formatters';

interface CustomerLevelsProps {
  customers: Customer[];
  vipTiers: VipTierConfig[];
  onUpdateTiers: (tiers: VipTierConfig[]) => void;
  onUpdateCustomerTier: (customerId: string, newTier: Customer['vipLevel']) => void;
  onStartSessionForCustomer: (customer: Customer) => void;
}

// ─── هویت بصری هر سطح VIP ───
const TIER_STYLE: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    text: string;
    badge: string;
    glow: string;
    hoverGlow: string;
    softBg: string;
    tabActive: string;
  }
> = {
  'VIP فاخر': {
    icon: Crown,
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    text: 'text-amber-600 dark:text-amber-400',
    badge:
      'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600/70 shadow-amber-500/30',
    glow: 'ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/20',
    hoverGlow: 'hover:shadow-2xl hover:shadow-amber-500/35',
    softBg:
      'bg-amber-50/70 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50',
    tabActive:
      'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white border-transparent shadow-md shadow-amber-500/30',
  },
  'ذهبي': {
    icon: Award,
    gradient: 'from-yellow-300 via-amber-400 to-orange-500',
    text: 'text-yellow-600 dark:text-yellow-400',
    badge:
      'bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600/60 shadow-yellow-500/30',
    glow: 'ring-2 ring-yellow-500/35 shadow-xl shadow-yellow-500/20',
    hoverGlow: 'hover:shadow-2xl hover:shadow-yellow-500/35',
    softBg:
      'bg-yellow-50/70 dark:bg-yellow-950/30 border-yellow-100 dark:border-yellow-900/50',
    tabActive:
      'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 text-white border-transparent shadow-md shadow-yellow-500/30',
  },
  'فضي': {
    icon: Medal,
    gradient: 'from-sky-300 via-slate-300 to-indigo-400',
    text: 'text-sky-600 dark:text-sky-400',
    badge:
      'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-600/60 shadow-sky-500/30',
    glow: 'ring-2 ring-sky-500/30 shadow-xl shadow-sky-500/20',
    hoverGlow: 'hover:shadow-2xl hover:shadow-sky-500/35',
    softBg:
      'bg-sky-50/60 dark:bg-sky-950/30 border-sky-100 dark:border-sky-900/50',
    tabActive:
      'bg-gradient-to-r from-sky-300 via-slate-300 to-indigo-400 text-white border-transparent shadow-md shadow-sky-500/30',
  },
  'برونزي': {
    icon: Medal,
    gradient: 'from-orange-400 via-amber-600 to-rose-700',
    text: 'text-orange-700 dark:text-orange-400',
    badge:
      'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600/60 shadow-orange-500/30',
    glow: 'ring-2 ring-orange-500/30 shadow-xl shadow-orange-500/20',
    hoverGlow: 'hover:shadow-2xl hover:shadow-orange-500/35',
    softBg:
      'bg-orange-50/60 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/50',
    tabActive:
      'bg-gradient-to-r from-orange-400 via-amber-600 to-rose-700 text-white border-transparent shadow-md shadow-orange-500/30',
  },
};

const getTierStyle = (tierId: string) =>
  TIER_STYLE[tierId] || {
    icon: Medal,
    gradient: 'from-slate-400 to-slate-500',
    text: 'text-slate-600 dark:text-slate-400',
    badge:
      'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    glow: 'ring-1 ring-slate-300/50 shadow-sm',
    hoverGlow: 'hover:shadow-md',
    softBg: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800',
    tabActive: 'bg-emerald-600 text-white border-transparent',
  };

export const CustomerLevels: React.FC<CustomerLevelsProps> = ({
  customers,
  vipTiers,
  onUpdateTiers,
  onUpdateCustomerTier,
  onStartSessionForCustomer,
}) => {
  const [editingTier, setEditingTier] = useState<VipTierConfig | null>(null);
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');

  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;
    const updated = vipTiers.map((t) => (t.id === editingTier.id ? editingTier : t));
    onUpdateTiers(updated);
    setEditingTier(null);
  };

  const getTierPlayers = (tierId: string) => {
    return customers.filter((c) => c.vipLevel === tierId);
  };

  const totalPlayers = customers.length || 1;

  return (
    <div className="space-y-6 relative">
      {/* بخش‌های نورانی شناور در پس‌زمینه */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl float-slow" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl float-slower" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl float-slow" />
      </div>

      {/* ─── Header Banner لوکس ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl shadow-amber-500/30 animate-gradient-x"
      >
        {/* دوائر زخرفية */}
        <div className="absolute -left-12 -top-20 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-6 -bottom-24 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        {/* ستاره‌های شناور */}
        <Sparkles className="absolute left-10 top-5 w-5 h-5 text-white/40 float-slow pointer-events-none" />
        <Sparkles className="absolute left-44 bottom-7 w-4 h-4 text-white/30 float-slower pointer-events-none" />
        <Crown className="absolute right-1/3 top-3 w-4 h-4 text-white/35 float-slow pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-amber-900/20 shrink-0">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-sm">
                فئات ومستويات نادي الزبائن
              </h2>
              <p className="text-xs text-amber-50/90 mt-1">
                ضبط نسب الخصم، الحد الأدنى لساعات اللعب المطلوبة للترقية والمزايا الحصرية لكل فئة
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm shadow-lg shadow-amber-900/20">
            <Users className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white">
              إجمالي رواد النادي:{' '}
              <span className="font-mono font-mono-digits text-base font-black">
                {customers.length}
              </span>{' '}
              عضو
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── نوار توزیع الأعضاء بين المستويات ─── */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-amber-500" />
            توزیع الأعضاء على المستويات
          </span>
        </div>
        <div className="h-3.5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 shadow-inner">
          {vipTiers.map((t) => {
            const n = getTierPlayers(t.id).length;
            const pct = (n / totalPlayers) * 100;
            const style = getTierStyle(t.id);
            return (
              <div
                key={t.id}
                className={`h-full bg-gradient-to-r ${style.gradient} transition-all duration-700 ${pct > 0 ? 'shimmer' : ''}`}
                style={{ width: `${Math.max(pct, n > 0 ? 2 : 0)}%` }}
                title={`${t.id}: ${n} عضو (${pct.toFixed(0)}%)`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {vipTiers.map((t) => {
            const n = getTierPlayers(t.id).length;
            const style = getTierStyle(t.id);
            const Icon = style.icon;
            return (
              <span
                key={t.id}
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${style.badge}`}
              >
                <Icon className="w-3 h-3" />
                {t.id}
                <span className="font-mono font-mono-digits px-1.5 py-0.5 rounded-full bg-white/80 dark:bg-white/20">
                  {n} • {((n / totalPlayers) * 100).toFixed(0)}%
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ─── شبكة كروت المستويات ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {vipTiers.map((tier, idx) => {
          const playersCount = getTierPlayers(tier.id).length;
          const isVip = tier.id === 'VIP فاخر';
          const style = getTierStyle(tier.id);
          const TierIcon = style.icon;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.07 }}
              whileHover={{ y: -5 }}
              className={`rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-all duration-300 overflow-hidden ${style.glow} ${style.hoverGlow}`}
            >
              {/* شريط لون المستوى */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${style.gradient} animate-gradient-x shimmer`} />

              <div className="p-5 space-y-4 flex-1 flex flex-col">
                {isVip && (
                  <div className="flex justify-start -mt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r ${style.gradient} text-white shadow-md shadow-amber-500/30 animate-gradient-x">
                      <Sparkles className="w-3 h-3 spin-slow" />
                      الفئة الأعلى
                    </span>
                  </div>
                )}

                {/* رأس الكارت: الأيقونة + الاسم + نسبة الخصم */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg shrink-0 animate-gradient-x ring-2 ring-white dark:ring-slate-800`}>
                      <TierIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {tier.name}
                      </h3>
                      <div className={`text-[11px] font-bold ${style.text} flex items-center gap-1 mt-0.5`}>
                        <Users className="w-3 h-3" />
                        {playersCount} لاعب نشط
                      </div>
                    </div>
                  </div>

                  {/* شارة الخصم الكبيرة */}
                  <div className={`text-center px-3 py-1.5 rounded-xl border ${style.softBg} shrink-0`}>
                    <div className={`text-xl font-black font-mono font-mono-digits bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent leading-none`}>
                      {tier.discountPercent}%
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      خصم الفاتورة
                    </div>
                  </div>
                </div>

                {/* متطلبات الترقية */}
                <div className={`p-3 rounded-xl border ${style.softBg} text-xs space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${style.text}`} />
                      ساعات اللعب المطلوبة:
                    </span>
                    <span className="font-mono font-mono-digits font-bold text-slate-800 dark:text-slate-200">
                      {tier.minHoursRequired} ساعة
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold flex items-center gap-1.5">
                      <Coins className={`w-3.5 h-3.5 ${style.text}`} />
                      الحد الأدنى للإنفاق:
                    </span>
                    <span className={`font-mono font-mono-digits font-bold ${style.text}`}>
                      {formatCurrency(tier.minSpendRequired)}
                    </span>
                  </div>
                </div>

                {/* المزايا */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    المزايا والمكافآت:
                  </div>
                  <ul className="space-y-1">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center shrink-0`}>
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
                        </span>
                        <span className="truncate">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* أزرار */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 p-4 pt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedTierFilter(tier.id)}
                  className={`text-xs font-black flex items-center gap-1 transition cursor-pointer ${style.text} hover:opacity-80`}
                >
                  عرض الأعضاء ({playersCount})
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingTier(tier)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${style.badge} hover:brightness-95 dark:hover:brightness-125`}
                  title="تعديل الفئة والخصومات"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── قائمة رواد النادي ─── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <Users className="w-4.5 h-4.5 text-white" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              قائمة رواد النادي في فئة:{' '}
              <span className="text-emerald-600 dark:text-emerald-400">
                {selectedTierFilter === 'all' ? 'كافة المستويات' : selectedTierFilter}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedTierFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap border ${
                selectedTierFilter === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-md shadow-emerald-500/25 border-transparent'
                  : 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:brightness-95'
              }`}
            >
              الكل ({customers.length})
            </button>
            {vipTiers.map((t) => {
              const style = getTierStyle(t.id);
              const Icon = style.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTierFilter(t.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 border ${
                    selectedTierFilter === t.id
                      ? style.tabActive
                      : `${style.softBg} ${style.text} hover:brightness-95`
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {t.id} ({getTierPlayers(t.id).length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Players Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-right text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">
                <th className="py-3 px-3 whitespace-nowrap">اسم اللاعب</th>
                <th className="py-3 px-3 text-blue-700 dark:text-blue-300 font-black whitespace-nowrap">رقم الهاتف</th>
                <th className="py-3 px-3 whitespace-nowrap">المستوى الحالي</th>
                <th className="py-3 px-3 whitespace-nowrap">إجمالي وقت اللعب</th>
                <th className="py-3 px-3 whitespace-nowrap">إجمالي الإنفاق (د.ع)</th>
                <th className="py-3 px-3 whitespace-nowrap">رصيد المحفظة</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">إجراءات الترقية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 whitespace-nowrap">
              {customers
                .filter((c) => selectedTierFilter === 'all' || c.vipLevel === selectedTierFilter)
                .map((cust) => {
                  const style = getTierStyle(cust.vipLevel);
                  const TierIcon = style.icon;
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition whitespace-nowrap">
                      <td className="py-3 px-3 font-black text-slate-900 dark:text-white flex items-center gap-2 whitespace-nowrap">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${style.gradient} text-white border border-white/20 flex items-center justify-center font-black text-xs shrink-0 shadow-sm`}>
                          {cust.name.slice(0, 1)}
                        </div>
                        <span className="text-slate-900 dark:text-white font-bold whitespace-nowrap">{cust.name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-mono-digits text-blue-700 dark:text-blue-300 font-black text-xs whitespace-nowrap tracking-wider" dir="ltr">{cust.phone}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${style.badge}`}>
                          <TierIcon className="w-3 h-3" />
                          {cust.vipLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-mono-digits text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatDuration(cust.totalPlayMinutes)}</td>
                      <td className={`py-3 px-3 font-mono font-mono-digits font-bold whitespace-nowrap ${style.text}`}>{formatCurrency(cust.totalSpent)}</td>
                      <td className="py-3 px-3 font-mono font-mono-digits font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap">{formatCurrency(cust.balance)}</td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <select
                            value={cust.vipLevel}
                            onChange={(e) => onUpdateCustomerTier(cust.id, e.target.value as any)}
                            className={`border rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer ${style.softBg} ${style.text}`}
                          >
                            <option value="برونزي">برونزي</option>
                            <option value="فضي">فضي</option>
                            <option value="ذهبي">ذهبي</option>
                            <option value="VIP فاخر">VIP فاخر</option>
                          </select>

                          <button
                            onClick={() => onStartSessionForCustomer(cust)}
                            title="بدء جلسة جديدة لهذا الزبون"
                            className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 font-bold text-xs cursor-pointer shadow-sm shadow-emerald-500/25 transition"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── مودال تعديل الفئة ─── */}
      <AnimatePresence>
        {editingTier && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* شريط لون الفئة */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${getTierStyle(editingTier.id).gradient} animate-gradient-x`} />

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getTierStyle(editingTier.id).gradient} flex items-center justify-center shadow-md`}>
                      {React.createElement(getTierStyle(editingTier.id).icon, { className: 'w-4 h-4 text-white' })}
                    </div>
                    <span>تعديل إعدادات الفئة: {editingTier.name}</span>
                  </h3>
                  <button
                    onClick={() => setEditingTier(null)}
                    title="إغلاق"
                    className={`p-1.5 rounded-lg border transition hover:brightness-95 active:scale-95 ${getTierStyle(editingTier.id).badge}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveTier} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عنوان الفئة:</label>
                    <input
                      type="text"
                      required
                      value={editingTier.name}
                      onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                      className={`w-full px-3 py-2.5 text-xs border rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${getTierStyle(editingTier.id).softBg}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نسبة الخصم (%):</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        required
                        value={editingTier.discountPercent}
                        onChange={(e) => setEditingTier({ ...editingTier, discountPercent: Number(e.target.value) })}
                        className={`w-full px-3 py-2.5 text-xs font-mono font-bold border rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits ${getTierStyle(editingTier.id).softBg}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ساعات اللعب المطلوبة:</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={editingTier.minHoursRequired}
                        onChange={(e) => setEditingTier({ ...editingTier, minHoursRequired: Number(e.target.value) })}
                        className={`w-full px-3 py-2.5 text-xs font-mono font-bold border rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none font-mono-digits ${getTierStyle(editingTier.id).softBg}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الحد الأدنى للإنفاق الإجمالي (د.ع):</label>
                    <input
                      type="number"
                      step="5000"
                      required
                      value={editingTier.minSpendRequired}
                      onChange={(e) => setEditingTier({ ...editingTier, minSpendRequired: Number(e.target.value) })}
                      className={`w-full px-3 py-2.5 text-xs font-mono font-bold border rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits ${getTierStyle(editingTier.id).softBg}`}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingTier(null)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition hover:brightness-95 ${getTierStyle(editingTier.id).softBg} ${getTierStyle(editingTier.id).text}`}
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r ${getTierStyle(editingTier.id).gradient} rounded-xl hover:brightness-110 shadow-md flex items-center gap-1.5 font-gaming cursor-pointer animate-gradient-x`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>حفظ الإعدادات</span>
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
