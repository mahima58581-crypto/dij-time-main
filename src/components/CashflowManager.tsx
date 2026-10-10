import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  DollarSign,
  Trash2,
  Search,
  X,
  Receipt,
  Wallet,
  Gamepad2,
  Coffee,
  PiggyBank,
  Sparkles,
  Landmark
} from 'lucide-react';
import { ExpenseItem, Session } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CashflowManagerProps {
  expenses: ExpenseItem[];
  sessions: Session[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (expenseId: string) => void;
  currentOperatorName: string;
}

export const CashflowManager: React.FC<CashflowManagerProps> = ({
  expenses,
  sessions,
  onAddExpense,
  onDeleteExpense,
  currentOperatorName,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Expense Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('إنترنت وألياف ضوئية');
  const [amount, setAmount] = useState<number>(50000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const categories = [
    { key: 'all', label: 'كافة المصروفات' },
    { key: 'إنترنت وألياف ضوئية', label: 'إنترنت وألياف ضوئية' },
    { key: 'فواتير الكهرباء والماء', label: 'فواتير الكهرباء والماء' },
    { key: 'تعبئة البوفيه والمشروبات', label: 'تعبئة البوفيه والمشروبات' },
    { key: 'رواتب الموظفين', label: 'رواتب الموظفين' },
    { key: 'صيانة وإصلاحات', label: 'صيانة وإصلاحات' },
    { key: 'تسويق وإعلانات', label: 'تسويق وإعلانات' },
    { key: 'أخرى', label: 'أخرى' },
  ];

  // Revenue Calculations from paid sessions
  const paidSessions = sessions.filter((s) => s.paymentStatus === 'paid');
  const timeRevenue = paidSessions.reduce((sum, s) => sum + (s.timeCost || 0), 0);
  const snackRevenue = paidSessions.reduce((sum, s) => sum + (s.snacksCost || 0), 0);
  const totalDiscounts = paidSessions.reduce((sum, s) => sum + (s.discount || 0), 0);
  const grossRevenue = timeRevenue + snackRevenue - totalDiscounts;

  // Total Expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Net Profit
  const netProfit = grossRevenue - totalExpenses;
  const avgTicket = paidSessions.length > 0 ? Math.round(grossRevenue / paidSessions.length) : 0;

  const filteredExpenses = expenses.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.notes?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || e.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddExpense({
      title: title.trim(),
      category,
      amount,
      date,
      registeredBy: currentOperatorName,
      notes: notes.trim(),
    });
    setTitle('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const kpiStats = [
    {
      label: 'إجمالي الإيرادات (اللعب + البوفيه)',
      value: formatCurrency(grossRevenue),
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40',
      footer: (
        <div className="flex justify-between font-mono-digits">
          <span>ألعاب: {formatCurrency(timeRevenue)}</span>
          <span>بوفيه: {formatCurrency(snackRevenue)}</span>
        </div>
      ),
    },
    {
      label: 'مجموع النفقات والمصاريف',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      gradient: 'from-rose-500 to-red-500',
      bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/40',
      footer: <span>{expenses.length} بند مصروف مسجل</span>,
    },
    {
      label: 'صافي الربح للنادي',
      value: formatCurrency(netProfit),
      icon: PiggyBank,
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-400/40',
      footer: <span>الإيرادات مطروحاً منها المصاريف</span>,
      highlight: true,
    },
    {
      label: 'متوسط قيمة الفاتورة',
      value: formatCurrency(avgTicket),
      icon: Receipt,
      gradient: 'from-cyan-500 to-sky-600',
      bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-900/40',
      footer: <span>بناءً على {paidSessions.length} جلسة مسددة</span>,
    },
  ];

  return (
    <div className="space-y-5 relative">

      {/* بخش‌های نورانی شناور در پس‌زمینه */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl float-slow" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl float-slower" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl float-slow" />
      </div>

      {/* ─── Header Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/30 animate-gradient-x"
      >
        {/* دوائر زخرفية */}
        <div className="absolute -left-12 -top-20 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-6 -bottom-24 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        {/* آیکون‌های شناور */}
        <TrendingUp className="absolute left-10 top-5 w-5 h-5 text-white/40 float-slow pointer-events-none" />
        <Wallet className="absolute left-48 bottom-7 w-4 h-4 text-white/30 float-slower pointer-events-none" />
        <DollarSign className="absolute right-1/3 top-3 w-4 h-4 text-white/35 float-slow pointer-events-none" />
        <Sparkles className="absolute right-1/4 bottom-4 w-4 h-4 text-white/30 float-slower pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-sm">
                الإيرادات، المصروفات والتدفق المالي
              </h2>
              <p className="text-xs text-emerald-50/90 mt-1">
                تسجيل نفقات التشغيل، احتساب إيرادات اللعب والمقصف، ومتابعة صافي الربح الفعلي بالدينار العراقي
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-emerald-900 bg-white hover:bg-emerald-50 shadow-lg shadow-emerald-900/20 transition font-gaming"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ تسجيل مصروف جديد</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ─── 4 کارت خلاصه مالی ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className={`p-5 rounded-2xl border shadow-sm space-y-2.5 transition-all duration-300 ${s.bg}`}
          >
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>{s.label}</span>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md shrink-0`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className={`text-xl font-black font-mono font-mono-digits bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent ${s.highlight ? 'text-2xl drop-shadow-sm' : ''}`}>
              {s.value}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/70 dark:border-slate-800 font-mono-digits">
              {s.footer}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── جستجو + فیلتر دسته ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في العنوان أو الملاحظات..."
            className="w-full pl-3 pr-9 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono-digits">
          {categories.map((cat) => {
            const active = categoryFilter === cat.key;
            return (
              <motion.button
                whileTap={{ scale: 0.96 }}
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                }`}
              >
                {cat.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ─── جدول سجل المصروفات ─── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            سجل مصروفات ونفقات النادي:
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-mono font-mono-digits">{filteredExpenses.length} سجلات</span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="text-sm font-black text-slate-700 dark:text-slate-200">لم يتم العثور على سجل مصروف</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">مع تغيير البحث أو تصفية الفئة، سيتم عرض سجلات أخرى</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-right text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">
                  <th className="py-3 px-3 whitespace-nowrap">بند المصروف</th>
                  <th className="py-3 px-3 font-black whitespace-nowrap">الفئة</th>
                  <th className="py-3 px-3 whitespace-nowrap">المبلغ (د.ع)</th>
                  <th className="py-3 px-3 whitespace-nowrap">تاريخ التسجيل</th>
                  <th className="py-3 px-3 whitespace-nowrap">المسجِّل</th>
                  <th className="py-3 px-3 whitespace-nowrap">الملاحظات</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono font-mono-digits whitespace-nowrap">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-emerald-50/50 dark:hover:bg-slate-800/40 transition whitespace-nowrap">
                    <td className="py-3 px-3 font-black text-slate-900 dark:text-white font-sans whitespace-nowrap">
                      {exp.title}
                    </td>
                    <td className="py-3 px-3 font-sans whitespace-nowrap">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-black whitespace-nowrap bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-xs tracking-wide">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-sm whitespace-nowrap">
                      <span className="bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent">
                        {formatCurrency(exp.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">{exp.date}</td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-sans whitespace-nowrap">{exp.registeredBy}</td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-sans text-[11px] max-w-xs truncate whitespace-nowrap">
                      {exp.notes || '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          onDeleteExpense(exp.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer active:scale-95"
                        title="حذف السجل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── مودال تسجيل مصروف ─── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 animate-gradient-x" />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-md">
                      <TrendingDown className="w-4 h-4 text-white" />
                    </div>
                    <span>تسجيل مصروف جديد في السجل المالي</span>
                  </h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عنوان ووصف المصروف:</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: شراء كابلات، صيانة وحدات التحكم، فاتورة إنترنت..."
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الفئة:</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none cursor-pointer transition"
                      >
                        <option value="إنترنت وألياف ضوئية">إنترنت وألياف ضوئية</option>
                        <option value="فواتير الكهرباء والماء">فواتير الكهرباء والماء</option>
                        <option value="تعبئة البوفيه والمشروبات">تعبئة البوفيه والمشروبات</option>
                        <option value="رواتب الموظفين">رواتب الموظفين</option>
                        <option value="صيانة وإصلاحات">صيانة وإصلاحات</option>
                        <option value="تسويق وإعلانات">تسويق وإعلانات</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المبلغ (د.ع):</label>
                      <input
                        type="number"
                        step="1000"
                        required
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-rose-600 dark:text-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none font-mono-digits transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">التاريخ:</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ملاحظات إضافية:</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="رقم الفاتورة، اسم المورد أو تفاصيل الشراء..."
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-110 shadow-md shadow-emerald-500/30 flex items-center gap-1.5 font-gaming cursor-pointer animate-gradient-x"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>تسجيل في السجل</span>
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
