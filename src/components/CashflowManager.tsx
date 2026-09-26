import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  DollarSign, 
  Calendar, 
  FileText, 
  Trash2, 
  Tag, 
  Filter, 
  Search, 
  X, 
  Save, 
  Receipt,
  Wallet
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

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>إدارة الإيرادات، المصروفات والتدفق المالي (Cashflow)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تسجيل نفقات التشغيل، احتساب إيرادات اللعب والمقصف، ومتابعة صافي الربح الفعلي بالدينار العراقي
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition font-gaming"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ تسجيل مصروف جديد</span>
        </motion.button>
      </div>

      {/* 4 Big Cashflow Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-2">
          <div className="text-[11px] text-slate-600 font-bold flex items-center justify-between">
            <span>إجمالي الإيرادات (اللعب + البوفيه):</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black font-mono font-mono-digits text-emerald-700">
            {formatCurrency(grossRevenue)}
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-100 font-mono-digits">
            <span>ألعاب: {formatCurrency(timeRevenue)}</span>
            <span>بوفيه: {formatCurrency(snackRevenue)}</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-2">
          <div className="text-[11px] text-slate-600 font-bold flex items-center justify-between">
            <span>مجموع النفقات والمصاريف:</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-black font-mono font-mono-digits text-rose-600">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono-digits">
            {expenses.length} بند مصروف مسجل
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-300 shadow-sm space-y-2">
          <div className="text-[11px] text-emerald-800 font-bold flex items-center justify-between">
            <span>صافي الربح للنادي:</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black font-mono font-mono-digits text-emerald-800">
            {formatCurrency(netProfit)}
          </div>
          <div className="text-[10px] text-emerald-700 pt-1 border-t border-emerald-200/60">
            الإيرادات الإجمالية مطروحاً منها المصاريف
          </div>
        </div>

        {/* Average Ticket */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="text-[11px] text-slate-600 font-bold flex items-center justify-between">
            <span>متوسط قيمة الفاتورة:</span>
            <Receipt className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-black font-mono font-mono-digits text-teal-700">
            {formatCurrency(paidSessions.length > 0 ? Math.round(grossRevenue / paidSessions.length) : 0)}
          </div>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono-digits">
            بناءً على {paidSessions.length} جلسة مسددة
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في العنوان أو الملاحظات..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                categoryFilter === cat.key
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Ledger Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
          <span className="font-bold text-slate-800">سجل مصروفات ونفقات النادي:</span>
          <span className="text-slate-500 font-mono font-mono-digits">{filteredExpenses.length} سجلات</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold">
                <th className="py-2.5 px-3">بند المصروف</th>
                <th className="py-2.5 px-3">الفئة</th>
                <th className="py-2.5 px-3">المبلغ (د.ع)</th>
                <th className="py-2.5 px-3">تاريخ التسجيل</th>
                <th className="py-2.5 px-3">المسجِّل</th>
                <th className="py-2.5 px-3">الملاحظات</th>
                <th className="py-2.5 px-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono font-mono-digits">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-black text-slate-900 font-sans">
                    {exp.title}
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-600 text-sm">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{exp.date}</td>
                  <td className="py-3 px-3 text-slate-800 font-sans">{exp.registeredBy}</td>
                  <td className="py-3 px-3 text-slate-500 font-sans text-[11px] max-w-xs truncate">
                    {exp.notes || '-'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف المصروف: ${exp.title}؟`)) {
                          onDeleteExpense(exp.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-rose-600 hover:bg-rose-50 transition"
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
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-emerald-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                  <span>تسجيل مصروف جديد في السجل المالي</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">عنوان ووصف المصروف:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: شراء كابلات، صيانة وحدات التحكم، فاتورة إنترنت..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">الفئة:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
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
                    <label className="text-xs font-bold text-slate-700">المبلغ (د.ع):</label>
                    <input
                      type="number"
                      step="1000"
                      required
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-rose-600 focus:border-rose-500 focus:bg-white focus:outline-none font-mono-digits"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">التاريخ:</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">ملاحظات إضافية:</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="رقم الفاتورة، اسم المورد أو تفاصيل الشراء..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-105 shadow-md shadow-emerald-500/25 font-gaming"
                  >
                    تسجيل في السجل
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
