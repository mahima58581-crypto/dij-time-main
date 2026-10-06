import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Plus,
  Search,
  AlertTriangle,
  Edit3,
  Trash2,
  Layers,
  TrendingUp,
  X,
  Save,
  CheckCircle2,
  QrCode,
  Package,
  Banknote,
  Boxes,
  BellRing
} from 'lucide-react';
import { SnackItem } from '../types';
import { formatCurrency } from '../utils/formatters';

interface GoodsManagerProps {
  snacks: SnackItem[];
  onAddSnack: (snack: Omit<SnackItem, 'id'>) => void;
  onUpdateSnack: (snack: SnackItem) => void;
  onDeleteSnack: (snackId: string) => void;
  onRestock: (snackId: string, quantity: number) => void;
  onNavigateToQrOrders?: () => void;
}

// ─── هویت بصری هر دسته‌بندی بوفيه: رنگ، گرادینت و آیکون ───
const CATEGORY_META: Record<
  string,
  {
    label: string;
    emoji: string;
    gradient: string;
    text: string;
    badge: string;
    glow: string;
    softBg: string;
    tabActive: string;
  }
> = {
  'مشروبات طاقة': {
    label: 'مشروبات طاقة',
    emoji: '⚡',
    gradient: 'from-rose-500 via-red-500 to-orange-500',
    text: 'text-rose-600 dark:text-rose-400',
    badge:
      'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    glow: 'ring-2 ring-rose-500/30 shadow-xl shadow-rose-500/15',
    softBg:
      'bg-rose-50/60 dark:bg-rose-950/25 border-rose-100 dark:border-rose-900/40',
    tabActive:
      'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/50',
  },
  'تسالي وشيبس': {
    label: 'تسالي ومقرمشات',
    emoji: '🍟',
    gradient: 'from-amber-400 via-orange-500 to-amber-600',
    text: 'text-amber-600 dark:text-amber-400',
    badge:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    glow: 'ring-2 ring-amber-500/30 shadow-xl shadow-amber-500/15',
    softBg:
      'bg-amber-50/60 dark:bg-amber-950/25 border-amber-100 dark:border-amber-900/40',
    tabActive:
      'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/50',
  },
  'مشروبات ساخنة وباردة': {
    label: 'مشروبات ساخنة وباردة',
    emoji: '☕',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    text: 'text-cyan-600 dark:text-cyan-400',
    badge:
      'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    glow: 'ring-2 ring-cyan-500/30 shadow-xl shadow-cyan-500/15',
    softBg:
      'bg-cyan-50/60 dark:bg-cyan-950/25 border-cyan-100 dark:border-cyan-900/40',
    tabActive:
      'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/50',
  },
  'وجبات وشطائر': {
    label: 'وجبات وسندويشات',
    emoji: '🥪',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    glow: 'ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/15',
    softBg:
      'bg-emerald-50/60 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900/40',
    tabActive:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/50',
  },
  'حلويات': {
    label: 'حلويات وشوكولاتة',
    emoji: '🍫',
    gradient: 'from-fuchsia-400 via-pink-500 to-rose-500',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    badge:
      'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800',
    glow: 'ring-2 ring-fuchsia-500/30 shadow-xl shadow-fuchsia-500/15',
    softBg:
      'bg-fuchsia-50/60 dark:bg-fuchsia-950/25 border-fuchsia-100 dark:border-fuchsia-900/40',
    tabActive:
      'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/50',
  },
};

const getCategoryMeta = (cat: string) =>
  CATEGORY_META[cat] || {
    label: cat,
    emoji: '📦',
    gradient: 'from-slate-400 to-slate-500',
    text: 'text-slate-600 dark:text-slate-400',
    badge:
      'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    glow: 'ring-1 ring-slate-300/50 shadow-sm',
    softBg: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800',
    tabActive: 'bg-emerald-600 text-white border-transparent',
  };

// سقف مرجعی برای نوار موجودی (50 واحد)
const STOCK_REF = 50;

export const GoodsManager: React.FC<GoodsManagerProps> = ({
  snacks,
  onAddSnack,
  onUpdateSnack,
  onDeleteSnack,
  onRestock,
  onNavigateToQrOrders,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSnack, setEditingSnack] = useState<SnackItem | null>(null);

  // New Snack Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SnackItem['category']>('مشروبات طاقة');
  const [price, setPrice] = useState<number>(3000);
  const [stock, setStock] = useState<number>(25);
  const [imageIcon, setImageIcon] = useState('⚡');

  const categories = [
    { key: 'all', label: 'كافة الأصناف', emoji: '🛍️' },
    { key: 'مشروبات طاقة', label: 'مشروبات طاقة', emoji: '⚡' },
    { key: 'تسالي وشيبس', label: 'تسالي ومقرمشات', emoji: '🍟' },
    { key: 'مشروبات ساخنة وباردة', label: 'مشروبات ساخنة وباردة', emoji: '☕' },
    { key: 'وجبات وشطائر', label: 'وجبات وسندويشات', emoji: '🥪' },
    { key: 'حلويات', label: 'حلويات وشوكولاتة', emoji: '🍫' },
  ];

  const filteredSnacks = snacks.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalInventoryValue = snacks.reduce((acc, s) => acc + s.price * s.stock, 0);
  const totalStockCount = snacks.reduce((acc, s) => acc + s.stock, 0);
  const lowStockItems = snacks.filter((s) => s.stock <= 10);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddSnack({
      name: name.trim(),
      category,
      price,
      stock,
      imageIcon: imageIcon || '📦',
    });
    setName('');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSnack) return;
    onUpdateSnack(editingSnack);
    setEditingSnack(null);
  };

  const stats = [
    { label: 'قيمة المخزون الكلية', value: formatCurrency(totalInventoryValue), suffix: '', icon: Banknote, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/70' },
    { label: 'إجمالي الوحدات المتوفرة', value: totalStockCount.toLocaleString('en-US'), suffix: 'وحدة', icon: Boxes, gradient: 'from-cyan-500 to-sky-500', bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800/70' },
    { label: 'عدد الأصناف المسجلة', value: snacks.length, suffix: 'صنف', icon: Package, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/70' },
    { label: 'أصناف تحتاج تعبئة', value: lowStockItems.length, suffix: 'صنف', icon: BellRing, gradient: 'from-rose-500 to-red-500', bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/70' },
  ];

  return (
    <div className="space-y-5 relative">
      {/* بخش‌های نورانی شناور در پس‌زمینه */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-lime-400/15 rounded-full blur-3xl float-slow" />
        <div className="absolute top-1/3 -left-24 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl float-slower" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl float-slow" />
      </div>

      {/* ─── Header Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-amber-400 text-white shadow-xl shadow-emerald-500/30 animate-gradient-x"
      >
        {/* دوائر زخرفية */}
        <div className="absolute -left-12 -top-20 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-6 -bottom-24 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        {/* اکموجی‌های غذایی شناور */}
        <span className="absolute left-10 top-4 text-2xl float-slow pointer-events-none">🍕</span>
        <span className="absolute left-48 bottom-6 text-xl float-slower pointer-events-none">🍟</span>
        <span className="absolute right-1/3 top-2 text-lg float-slow pointer-events-none">🥤</span>
        <span className="absolute right-1/4 bottom-4 text-xl float-slower pointer-events-none">🍫</span>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-sm">
                إدارة سلع ومخزون بوفيه النادي
              </h2>
              <p className="text-xs text-emerald-50/90 mt-1">
                متابعة المخزون، تسعير المشروبات والوجبات الخفيفة، تنبيهات النقص وإعادة تعبئة البوفيه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToQrOrders && (
              <button
                type="button"
                onClick={onNavigateToQrOrders}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-emerald-800 bg-white/90 hover:bg-white border border-white/40 shadow-lg shadow-emerald-900/20 transition"
              >
                <QrCode className="w-4 h-4 text-emerald-700" />
                <span>طلبات الطاولات بالـ QR</span>
              </button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-emerald-800 bg-white hover:bg-emerald-50 shadow-lg shadow-emerald-900/25 transition font-gaming"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ إضافة صنف جديد</span>
            </motion.button>
          </div>
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
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}>
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

      {/* ─── تنبيه إعادة التعبئة ─── */}
      <AnimatePresence>
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white shadow-lg shadow-rose-500/25 animate-gradient-x relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
            <BellRing className="absolute left-6 top-5 w-5 h-5 text-white/40 float-slow pointer-events-none" />
            <div className="relative flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-white">
                  تنبيه عاجل: {lowStockItems.length} صنف بحاجة إلى إعادة التعبئة فوراً!
                </h3>
                <p className="text-[11px] text-rose-50/90 mt-0.5">
                  المخزون أقل من 10 وحدات — اضغط +20 للشحن السريع
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {lowStockItems.map((item) => {
                    const meta = getCategoryMeta(item.category);
                    return (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 border border-white/25 text-[11px] font-bold backdrop-blur-sm"
                      >
                        <span className="text-base leading-none">{item.imageIcon}</span>
                        {item.name}
                        <span className="font-mono font-mono-digits text-rose-100">({item.stock})</span>
                        <button
                          onClick={() => onRestock(item.id, 20)}
                          className="mr-1 px-1.5 py-0.5 rounded-full bg-white text-rose-600 font-black text-[10px] hover:bg-rose-50 transition cursor-pointer"
                        >
                          +20
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── البحث + تصفية الأصناف ─── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في سلع ومخزون المقصف..."
            className="w-full pl-3 pr-10 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const active = categoryFilter === cat.key;
            const meta = cat.key === 'all' ? null : getCategoryMeta(cat.key);
            const count = cat.key === 'all' ? snacks.length : snacks.filter((s) => s.category === cat.key).length;
            return (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                  active
                    ? cat.key === 'all'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/50'
                      : meta!.tabActive
                    : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-sm leading-none">{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono-digits">
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ─── شبكة كروت السلع ─── */}
      {filteredSnacks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3 shadow-xs">
          <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            لا توجد أصناف مطابقة للبحث أو التصفية
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
          >
            إظهار جميع الأصناف
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredSnacks.map((item, idx) => {
              const isLowStock = item.stock <= 10;
              const meta = getCategoryMeta(item.category);
              const stockPct = Math.min(100, Math.max(4, (item.stock / STOCK_REF) * 100));
              const stockColor = isLowStock
                ? 'bg-rose-500'
                : item.stock <= 25
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl bg-white dark:bg-[#0c101c] border transition-all duration-300 flex flex-col overflow-hidden ${
                    isLowStock
                      ? 'border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/40 shadow-xl shadow-rose-500/15'
                      : `border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm ${meta.glow}`
                  }`}
                >
                  {/* شريط لون الفئة */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${meta.gradient} animate-gradient-x shimmer`} />

                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    {/* الأيقونة + الفئة */}
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-2xl shadow-lg ring-2 ring-white dark:ring-slate-800 animate-gradient-x shrink-0 ${
                          isLowStock ? 'glow-pulse' : ''
                        }`}
                      >
                        {item.imageIcon}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${meta.badge}`}>
                        <span className="text-sm leading-none">{meta.emoji}</span>
                        {meta.label}
                      </span>
                    </div>

                    {/* الاسم والسعر */}
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                          سعر البيع:
                        </span>
                        <span className={`text-base font-black font-mono font-mono-digits bg-gradient-to-r ${meta.gradient} bg-clip-text text-transparent`}>
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* نوار المخزون */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500 dark:text-slate-400">
                          المتوفر بالمخزن:
                        </span>
                        <span className={`font-mono font-mono-digits ${isLowStock ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {item.stock} وحدة
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${stockColor}`}
                          style={{ width: `${stockPct}%` }}
                        />
                      </div>
                    </div>

                    {/* تنبيه المخزون المنخفض */}
                    {isLowStock && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] font-black">
                        <AlertTriangle className="w-3.5 h-3.5 animate-pulse shrink-0" />
                        مخزون منخفض — أعد التعبئة
                      </div>
                    )}

                    {/* الشحن السريع */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                        شحن سريع:
                      </span>
                      <div className="flex items-center gap-1 font-mono-digits">
                        {[5, 10, 20].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => onRestock(item.id, amt)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-black font-mono border transition cursor-pointer ${
                              isLowStock
                                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60'
                                : `${meta.softBg} ${meta.text} hover:brightness-95 dark:hover:brightness-125`
                            }`}
                          >
                            +{amt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* أزرار التعديل والحذف */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 px-4 pb-3 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditingSnack(item)}
                      className={`p-2 rounded-xl border transition cursor-pointer ${meta.badge} hover:brightness-95 dark:hover:brightness-125`}
                      title="تعديل مواصفات وسعر الصنف"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSnack(item.id)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer active:scale-95"
                      title="حذف الصنف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ─── مودال إضافة صنف جديد ─── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-amber-400 animate-gradient-x" />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <span>إضافة صنف جديد للبوفيه</span>
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
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم الصنف:</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: مشروب طاقة ريد بول أو شوكولاتة كيندر"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الفئة:</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                      >
                        <option value="مشروبات طاقة">مشروبات طاقة</option>
                        <option value="تسالي وشيبس">تسالي ومقرمشات</option>
                        <option value="مشروبات ساخنة وباردة">مشروبات ساخنة وباردة</option>
                        <option value="وجبات وشطائر">وجبات وسندويشات</option>
                        <option value="حلويات">حلويات وشوكولاتة</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رمز تعبيري (أيقونة):</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={imageIcon}
                          onChange={(e) => setImageIcon(e.target.value)}
                          placeholder="⚡ أو 🍫 أو 🥤"
                          className="flex-1 px-3 py-2.5 text-center text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                        />
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-400 flex items-center justify-center text-xl shadow-md ring-2 ring-white dark:ring-slate-800 shrink-0">
                          {imageIcon || '📦'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سعر البيع (د.ع):</label>
                      <input
                        type="number"
                        step="250"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الكمية الأولية بالمخزن:</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>
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
                      className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-xl hover:brightness-110 shadow-md shadow-emerald-500/25 flex items-center gap-1.5 font-gaming cursor-pointer animate-gradient-x"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة للمخزن</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── مودال تعديل الصنف ─── */}
      <AnimatePresence>
        {editingSnack && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${getCategoryMeta(editingSnack.category).gradient} animate-gradient-x`} />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getCategoryMeta(editingSnack.category).gradient} flex items-center justify-center shadow-md`}>
                      <Edit3 className="w-4 h-4 text-white" />
                    </div>
                    <span>تعديل الصنف: {editingSnack.name}</span>
                  </h3>
                  <button
                    onClick={() => setEditingSnack(null)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم الصنف:</label>
                    <input
                      type="text"
                      required
                      value={editingSnack.name}
                      onChange={(e) => setEditingSnack({ ...editingSnack, name: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">السعر (د.ع):</label>
                      <input
                        type="number"
                        step="250"
                        required
                        value={editingSnack.price}
                        onChange={(e) => setEditingSnack({ ...editingSnack, price: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المخزون الحالي:</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={editingSnack.stock}
                        onChange={(e) => setEditingSnack({ ...editingSnack, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingSnack(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r ${getCategoryMeta(editingSnack.category).gradient} rounded-xl hover:brightness-110 shadow-md flex items-center gap-1.5 font-gaming cursor-pointer animate-gradient-x`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>حفظ التعديلات</span>
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
