import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  Plus, 
  Edit3, 
  Users, 
  Clock, 
  Percent, 
  ChevronRight, 
  Save, 
  X,
  ArrowUpRight
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

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>فئات ومستويات نادي الزبائن (VIP Tiers)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ضبط نسب الخصم، الحد الأدنى لساعات اللعب المطلوبة للترقية والمزايا الحصرية لكل فئة
          </p>
        </div>

        <div className="text-xs text-emerald-800 font-bold px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs">
          إجمالي رواد النادي: <span className="font-mono font-mono-digits text-sm font-black text-emerald-700">{customers.length}</span> عضو
        </div>
      </div>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vipTiers.map((tier) => {
          const playersCount = getTierPlayers(tier.id).length;
          const isVip = tier.id === 'VIP فاخر';
          const isGold = tier.id === 'ذهبي';

          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-2xl bg-white border transition-all shadow-sm space-y-4 flex flex-col justify-between relative overflow-hidden ${
                isVip
                  ? 'border-emerald-500 shadow-emerald-500/10'
                  : isGold
                  ? 'border-teal-400'
                  : 'border-slate-200'
              }`}
            >
              {isVip && (
                <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  الفئة الأعلى
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-xs"
                    style={{ backgroundColor: tier.color }}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{tier.name}</h3>
                    <div className="text-xs text-emerald-700 font-bold font-mono font-mono-digits">
                      {tier.discountPercent}% خصم الفاتورة
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono font-mono-digits">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-sans">ساعات اللعب المطلوبة:</span>
                    <span className="text-slate-800 font-bold">{tier.minHoursRequired} ساعة</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-sans">الحد الأدنى للإنفاق:</span>
                    <span className="text-emerald-700 font-bold">{formatCurrency(tier.minSpendRequired)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                    <span className="font-sans">عدد الأعضاء النشطين:</span>
                    <span className="text-emerald-700 font-bold">{playersCount} لاعب</span>
                  </div>
                </div>

                {/* Perks List */}
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] font-bold text-slate-600">المزايا والمكافآت:</div>
                  <ul className="space-y-1">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedTierFilter(tier.id)}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  عرض الأعضاء ({playersCount})
                </button>
                <button
                  onClick={() => setEditingTier(tier)}
                  className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-emerald-700 hover:bg-emerald-50 transition"
                  title="تعديل الفئة والخصومات"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Players in selected Tier */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900">
              قائمة رواد النادي في فئة: {selectedTierFilter === 'all' ? 'كافة المستويات' : selectedTierFilter}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedTierFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                selectedTierFilter === 'all'
                  ? 'bg-emerald-600 text-white font-black'
                  : 'text-slate-600 hover:text-emerald-700 bg-slate-100'
              }`}
            >
              الكل ({customers.length})
            </button>
            {vipTiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTierFilter(t.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  selectedTierFilter === t.id
                    ? 'bg-emerald-600 text-white font-black'
                    : 'text-slate-600 hover:text-emerald-700 bg-slate-100'
                }`}
              >
                {t.id} ({getTierPlayers(t.id).length})
              </button>
            ))}
          </div>
        </div>

        {/* Players Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold">
                <th className="py-2.5 px-3">اسم اللاعب</th>
                <th className="py-2.5 px-3">رقم الهاتف</th>
                <th className="py-2.5 px-3">المستوى الحالي</th>
                <th className="py-2.5 px-3">إجمالي وقت اللعب</th>
                <th className="py-2.5 px-3">إجمالي الإنفاق (د.ع)</th>
                <th className="py-2.5 px-3">رصيد المحفظة</th>
                <th className="py-2.5 px-3 text-center">إجراءات الترقية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers
                .filter((c) => selectedTierFilter === 'all' || c.vipLevel === selectedTierFilter)
                .map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-black text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-xs">
                        {cust.name.slice(0, 1)}
                      </div>
                      <span>{cust.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-mono-digits text-slate-500">{cust.phone}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {cust.vipLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-mono-digits text-slate-600">{formatDuration(cust.totalPlayMinutes)}</td>
                    <td className="py-3 px-3 font-mono font-mono-digits font-bold text-emerald-700">{formatCurrency(cust.totalSpent)}</td>
                    <td className="py-3 px-3 font-mono font-mono-digits font-bold text-teal-700">{formatCurrency(cust.balance)}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <select
                          value={cust.vipLevel}
                          onChange={(e) => onUpdateCustomerTier(cust.id, e.target.value as any)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
                        >
                          <option value="برونزي">برونزي</option>
                          <option value="فضي">فضي</option>
                          <option value="ذهبي">ذهبي</option>
                          <option value="VIP فاخر">VIP فاخر</option>
                        </select>

                        <button
                          onClick={() => onStartSessionForCustomer(cust)}
                          title="بدء جلسة جديدة لهذا الزبون"
                          className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Tier Modal */}
      <AnimatePresence>
        {editingTier && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-emerald-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                  <span>تعديل إعدادات الفئة: {editingTier.name}</span>
                </h3>
                <button
                  onClick={() => setEditingTier(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTier} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">عنوان الفئة:</label>
                  <input
                    type="text"
                    required
                    value={editingTier.name}
                    onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">نسبة الخصم (%):</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      required
                      value={editingTier.discountPercent}
                      onChange={(e) => setEditingTier({ ...editingTier, discountPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">ساعات اللعب المطلوبة:</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editingTier.minHoursRequired}
                      onChange={(e) => setEditingTier({ ...editingTier, minHoursRequired: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">الحد الأدنى للإنفاق الإجمالي (د.ع):</label>
                  <input
                    type="number"
                    step="5000"
                    required
                    value={editingTier.minSpendRequired}
                    onChange={(e) => setEditingTier({ ...editingTier, minSpendRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingTier(null)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-105 shadow-md shadow-emerald-500/25 flex items-center gap-1.5 font-gaming"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ الإعدادات</span>
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
