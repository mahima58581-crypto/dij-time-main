import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  PieChart,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  Receipt,
  Sparkles
} from 'lucide-react';
import { ExpenseItem, Session } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ExpenseReportsProps {
  expenses: ExpenseItem[];
  sessions: Session[];
}

// رنگ‌های نمودار دونات
const CHART_COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#6366f1', '#8b5cf6', '#f43f5e', '#f59e0b'];

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

  // Donut chart segments
  let accOffset = 0;
  const donutSegments = categoryBreakdown.map((item, i) => {
    const seg = { ...item, offset: accOffset, color: CHART_COLORS[i % CHART_COLORS.length] };
    accOffset += item.percentage;
    return seg;
  });

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

  const kpiStats = [
    {
      label: 'إجمالي الإيرادات المسجلة',
      value: formatCurrency(totalRev),
      sub: `ألعاب: ${formatCurrency(totalTimeRev)} • بوفيه: ${formatCurrency(totalSnackRev)}`,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40',
    },
    {
      label: 'إجمالي نفقات ومصاريف التشغيل',
      value: formatCurrency(totalExpenseAmount),
      sub: `${expenses.length} بند مصروف مسجل`,
      icon: TrendingDown,
      gradient: 'from-rose-500 to-red-500',
      bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/40',
    },
    {
      label: 'هامش الربح للنادي',
      value: `${profitMargin}%`,
      sub: `صافي: ${formatCurrency(netSavings)}`,
      icon: PiggyBank,
      gradient: 'from-teal-500 via-cyan-500 to-sky-500',
      bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-400/40',
      highlight: true,
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
        <div className="absolute -left-12 -top-20 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-6 -bottom-24 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <FileSpreadsheet className="absolute left-10 top-5 w-5 h-5 text-white/40 float-slow pointer-events-none" />
        <PieChart className="absolute left-48 bottom-7 w-4 h-4 text-white/30 float-slower pointer-events-none" />
        <TrendingUp className="absolute right-1/3 top-3 w-4 h-4 text-white/35 float-slow pointer-events-none" />
        <Sparkles className="absolute right-1/4 bottom-4 w-4 h-4 text-white/30 float-slower pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
              <FileSpreadsheet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-sm">
                التقارير التحليلية وسجل مصروفات النادي
              </h2>
              <p className="text-xs text-emerald-50/90 mt-1">
                تحليل نسب المصروفات، توزيع فئات الإنفاق، هامش الربح التشغيلي وتصدير ملف إكسل أو الطباعة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-emerald-900 bg-white hover:bg-emerald-50 shadow-lg shadow-emerald-900/20 transition"
            >
              <Download className="w-4 h-4" />
              <span>تصدير إكسل (CSV)</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─── صحة المالي النادي (۳ کارت) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className={`p-5 rounded-2xl border shadow-sm space-y-2.5 transition-all duration-300 ${s.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {s.label}
              </span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className={`text-xl font-black font-mono font-mono-digits bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent ${s.highlight ? 'text-2xl' : ''}`}>
              {s.value}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/70 dark:border-slate-800">
              {s.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── توزيع المصروفات: دونات + لیست ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <PieChart className="w-4 h-4 text-white" />
            </div>
            <span>توزيع نسب المصروفات حسب فئة الإنفاق</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-mono-digits">
            المجموع الكلي: {formatCurrency(totalExpenseAmount)}
          </span>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="text-sm font-black text-slate-700 dark:text-slate-200">لا توجد مصروفات مسجلة بعد</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">سجل مصروفات من صفحة «التدفق المالي» لرؤية التوزيع هنا</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* نمودار دونات SVG */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 42 42" className="w-44 h-44 -rotate-90">
                <circle cx="21" cy="21" r="15.915" fill="none" stroke="#1e293b" strokeOpacity="0.3" strokeWidth="5" />
                {donutSegments.map((seg) => (
                  <motion.circle
                    key={seg.category}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 100`, strokeDashoffset: 25 }}
                    animate={{ strokeDasharray: `${seg.percentage} ${100 - seg.percentage}`, strokeDashoffset: 25 - seg.offset }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                ))}
              </svg>
              {/* مرکز دونات */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black font-mono-digits text-slate-900 dark:text-white bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  {categoryBreakdown.length}
                </span>
                <span className="text-[9px] font-bold text-slate-400">فئات</span>
              </div>
            </div>

            {/* لیست فئات با نوار پیشرفت */}
            <div className="flex-1 w-full space-y-3">
              {categoryBreakdown.map((item, idx) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: donutSegments[idx]?.color }} />
                      {item.category}
                    </span>
                    <div className="flex items-center gap-3 font-mono font-mono-digits">
                      <span className="text-slate-500 dark:text-slate-400">{formatCurrency(item.amount)}</span>
                      <span
                        className="font-black px-1.5 py-0.5 rounded text-[11px] border"
                        style={{
                          color: donutSegments[idx]?.color,
                          borderColor: `${donutSegments[idx]?.color}50`,
                          backgroundColor: `${donutSegments[idx]?.color}15`,
                        }}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to left, ${donutSegments[idx]?.color}, ${donutSegments[idx]?.color}cc)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* ─── سجل التفاصيل والمصروفات ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            سجل التفاصيل والمصروفات المسجلة:
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-mono font-mono-digits">{expenses.length} معاملات</span>
        </div>

        {expenses.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="text-sm font-black text-slate-700 dark:text-slate-200">السجل فارغ</div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-right text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">
                  <th className="py-3 px-3 whitespace-nowrap">#</th>
                  <th className="py-3 px-3 whitespace-nowrap">تاريخ التسجيل</th>
                  <th className="py-3 px-3 whitespace-nowrap">وصف المصروف</th>
                  <th className="py-3 px-3 whitespace-nowrap">الفئة</th>
                  <th className="py-3 px-3 whitespace-nowrap">المبلغ المدفوع</th>
                  <th className="py-3 px-3 whitespace-nowrap">المسجِّل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono font-mono-digits whitespace-nowrap">
                {expenses.map((e, index) => (
                  <tr key={e.id} className="hover:bg-emerald-50/50 dark:hover:bg-slate-800/40 transition whitespace-nowrap">
                    <td className="py-3 px-3 text-slate-400 dark:text-slate-500">{index + 1}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-bold">{e.date}</td>
                    <td className="py-3 px-3 font-sans font-bold text-slate-900 dark:text-white max-w-[200px] truncate">{e.title}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-sm">
                      <span className="bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent">
                        {formatCurrency(e.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-600 dark:text-slate-300">{e.registeredBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

    </div>
  );
};
