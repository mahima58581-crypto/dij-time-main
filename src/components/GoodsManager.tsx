import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  PackagePlus, 
  Layers, 
  TrendingUp, 
  X,
  Save,
  CheckCircle2,
  DollarSign,
  QrCode
} from 'lucide-react';
import { SnackItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CyberSectionIcon } from './CyberSectionIcon';

interface GoodsManagerProps {
  snacks: SnackItem[];
  onAddSnack: (snack: Omit<SnackItem, 'id'>) => void;
  onUpdateSnack: (snack: SnackItem) => void;
  onDeleteSnack: (snackId: string) => void;
  onRestock: (snackId: string, quantity: number) => void;
  onNavigateToQrOrders?: () => void;
}

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
    { key: 'all', label: 'كافة الأصناف' },
    { key: 'مشروبات طاقة', label: 'مشروبات طاقة' },
    { key: 'تسالي وشيبس', label: 'تسالي ومقرمشات' },
    { key: 'مشروبات ساخنة وباردة', label: 'مشروبات ساخنة وباردة' },
    { key: 'وجبات وشطائر', label: 'وجبات وسندويشات' },
    { key: 'حلويات', label: 'حلويات وشوكولاتة' },
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

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <CyberSectionIcon icon={ShoppingBag} size="lg" variant="amber" />
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              إدارة سلع ومخزون بوفيه النادي
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              متابعة المخزون، تسعير المشروبات والوجبات الخفيفة، تنبيهات النقص وإعادة تعبئة البوفيه
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToQrOrders && (
            <button
              type="button"
              onClick={onNavigateToQrOrders}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition shadow-xs"
            >
              <QrCode className="w-4 h-4 text-amber-700" />
              <span>طلبات الطاولات بالـ QR</span>
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition font-gaming"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ إضافة صنف جديد</span>
          </motion.button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">قيمة المخزون الكلية (د.ع):</div>
          <div className="text-lg font-black font-mono font-mono-digits text-emerald-700 dark:text-emerald-400">
            {formatCurrency(totalInventoryValue)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">إجمالي عدد السلع المتوفرة:</div>
          <div className="text-lg font-black font-mono font-mono-digits text-slate-900 dark:text-slate-100">
            {totalStockCount} وحدة في المخزن
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">أصناف تتطلب إعادة التعبئة (أقل من 10):</div>
          <div className="text-lg font-black font-mono font-mono-digits text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <span>{lowStockItems.length} صنف</span>
            {lowStockItems.length > 0 && <AlertTriangle className="w-4 h-4 text-rose-500" />}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في سلع ومخزون المقصف..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                categoryFilter === cat.key
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goods Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSnacks.map((item) => {
          const isLowStock = item.stock <= 10;
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 dark-card border transition-all shadow-sm space-y-3 flex flex-col justify-between ${
                isLowStock ? 'border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {item.imageIcon}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.category}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h3>
                  <div className="flex items-center justify-between mt-2 font-mono font-mono-digits text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">سعر البيع:</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 font-mono font-mono-digits text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">المتوفر بالمخزن:</span>
                    <span className={`font-bold ${isLowStock ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {item.stock} وحدة
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Restock & Edit */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">شحن سريع:</span>
                  <div className="flex items-center gap-1 font-mono-digits">
                    <button
                      onClick={() => onRestock(item.id, 5)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-[11px] font-bold font-mono text-emerald-800 dark:text-emerald-300"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => onRestock(item.id, 10)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-[11px] font-bold font-mono text-emerald-800 dark:text-emerald-300"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => onRestock(item.id, 20)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-[11px] font-bold font-mono text-emerald-800 dark:text-emerald-300"
                    >
                      +20
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => setEditingSnack(item)}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 transition"
                    title="تعديل مواصفات وسعر الصنف"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onDeleteSnack(item.id);
                    }}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95"
                    title="حذف الصنف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Snack Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>إضافة صنف جديد للبوفيه</span>
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
                  <label className="text-xs font-bold text-slate-700">اسم الصنف:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: مشروب طاقة ريد بول أو شوكولاتة كيندر"
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
                      <option value="مشروبات طاقة">مشروبات طاقة</option>
                      <option value="تسالي وشيبس">تسالي ومقرمشات</option>
                      <option value="مشروبات ساخنة وباردة">مشروبات ساخنة وباردة</option>
                      <option value="وجبات وشطائر">وجبات وسندويشات</option>
                      <option value="حلويات">حلويات وشوكولاتة</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">رمز تعبيري (أيقونة):</label>
                    <input
                      type="text"
                      value={imageIcon}
                      onChange={(e) => setImageIcon(e.target.value)}
                      placeholder="⚡ أو 🍫 أو 🥤"
                      className="w-full px-3 py-2 text-center text-base bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">سعر البيع (د.ع):</label>
                    <input
                      type="number"
                      step="250"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">الكمية الأولية بالمخزن:</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                    />
                  </div>
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
                    إضافة للمخزن
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Snack Modal */}
      <AnimatePresence>
        {editingSnack && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>تعديل الصنف: {editingSnack.name}</span>
                </h3>
                <button
                  onClick={() => setEditingSnack(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">اسم الصنف:</label>
                  <input
                    type="text"
                    required
                    value={editingSnack.name}
                    onChange={(e) => setEditingSnack({ ...editingSnack, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">السعر (د.ع):</label>
                    <input
                      type="number"
                      step="250"
                      required
                      value={editingSnack.price}
                      onChange={(e) => setEditingSnack({ ...editingSnack, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">المخزون الحالي:</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editingSnack.stock}
                      onChange={(e) => setEditingSnack({ ...editingSnack, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingSnack(null)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-105 shadow-md shadow-emerald-500/25 flex items-center gap-1.5 font-gaming"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ التعديلات</span>
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
