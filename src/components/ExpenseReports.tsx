import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  PieChart, 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { ExpenseItem, Session } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CyberSectionIcon } from './CyberSectionIcon';

interface ExpenseReportsProps {
  expenses: ExpenseItem[];
  sessions: Session[];
}

export const ExpenseReports: React.FC<ExpenseReportsProps> = ({ expenses, sessions }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'all'>('month');

  // Calculate totals
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryMap: { [cat: string]: number } = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenseAmount > 0 ? Math.round((amount / totalExpenseAmount) * 100) : 0,
  })).sort((a, b) => b.amount - a.amount);

  // Revenue summary
  const paidSessions = sessions.filter((s) => s.paymentStatus === 'paid');
  const totalTimeRev = paidSessions.reduce((sum, s) => sum + (s.timeCost || 0), 0);
  const totalSnackRev = paidSessions.reduce((sum, s) => sum + (s.snacksCost || 0), 0);
  const totalRev = totalTimeRev + totalSnackRev;
  const netSavings = totalRev - totalExpenseAmount;
  const profitMargin = totalRev > 0 ? Math.round((netSavings / totalRev) * 100) : 0;

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = 'عنوان المصروف,الفئة,المبلغ (د.ع),التاريخ,المسجل,ملاحظات\n';
    const rows = expenses
      .map(
        (e) =>
          `"${e.title}","${e.category}",${e.amount},"${e.date}","${e.registeredBy}","${e.notes || ''}"`
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_مصروفات_النادي_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <CyberSectionIcon icon={FileSpreadsheet} size="lg" variant="teal" />
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              التقارير التحليلية وسجل مصروفات النادي
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              تحليل نسب المصروفات، توزيع فئات الإنفاق، هامش الربح التشغيلي وتصدير ملف إكسل أو الطباعة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>تصدير إكسل (CSV)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] text-slate-500">إجمالي الإيرادات المسجلة:</div>
          <div className="text-lg font-black font-mono font-mono-digits text-emerald-700">
            {formatCurrency(totalRev)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] text-slate-500">إجمالي نفقات ومصاريف التشغيل:</div>
          <div className="text-lg font-black font-mono font-mono-digits text-rose-600">
            {formatCurrency(totalExpenseAmount)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-sm space-y-1">
          <div className="text-[11px] text-emerald-800 font-bold">هامش الربح للنادي (Profit Margin):</div>
          <div className="text-lg font-black font-mono font-mono-digits text-emerald-800 flex items-center gap-2">
            <span>{profitMargin}%</span>
            <span className="text-xs text-emerald-600 font-normal">({formatCurrency(netSavings)})</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>توزيع نسب المصروفات حسب فئة الإنفاق</span>
          </div>
          <span className="text-xs text-slate-500 font-mono font-mono-digits">
            المجموع الكلي: {formatCurrency(totalExpenseAmount)}
          </span>
        </div>

        <div className="space-y-3">
          {categoryBreakdown.map((item, idx) => (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {item.category}
                </span>
                <div className="flex items-center gap-3 font-mono font-mono-digits">
                  <span className="text-slate-500">{formatCurrency(item.amount)}</span>
                  <span className="font-black text-emerald-800 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[11px]">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Records Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
          <span className="font-bold text-slate-800">سجل التفاصيل والمصروفات المسجلة:</span>
          <span className="text-slate-500 font-mono font-mono-digits">{expenses.length} معاملات</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">تاريخ التسجيل</th>
                <th className="py-2.5 px-3">وصف المصروف</th>
                <th className="py-2.5 px-3">الفئة</th>
                <th className="py-2.5 px-3">المبلغ المدفوع</th>
                <th className="py-2.5 px-3">المسجِّل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono font-mono-digits">
              {expenses.map((e, index) => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 text-slate-400">{index + 1}</td>
                  <td className="py-2.5 px-3 text-slate-600">{e.date}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{e.title}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-black text-rose-600">
                    {formatCurrency(e.amount)}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">{e.registeredBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
