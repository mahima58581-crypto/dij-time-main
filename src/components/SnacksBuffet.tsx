import { GamingPcIcon } from './GamingPcIcon';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SnackItem, Session } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Check, ChevronDown, Coffee, Key, Plus, Search, ShoppingBag, User, X } from 'lucide-react';

interface SnacksBuffetProps {
  snacks: SnackItem[];
  activeSessions: Session[];
  onAddSnackToSession: (sessionId: string, snack: SnackItem, quantity: number) => void;
  onAddNewSnackItem: (newSnack: Omit<SnackItem, 'id'>) => void;
}

export const SnacksBuffet: React.FC<SnacksBuffetProps> = ({
  snacks,
  activeSessions,
  onAddSnackToSession,
  onAddNewSnackItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    activeSessions.length > 0 ? activeSessions[0].id : ''
  );
  const [sessionSearchText, setSessionSearchText] = useState('');
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // New Snack Item State
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<SnackItem['category']>('مشروبات طاقة');
  const [newPrice, setNewPrice] = useState<number>(2000);
  const [newStock, setNewStock] = useState<number>(30);
  const [newIcon, setNewIcon] = useState('🍿');

  const categories = ['الكل', 'مشروبات طاقة', 'تسالي ومقرمشات', 'مشروبات ساخنة وباردة', 'وجبات وسندويشات', 'حلويات وسكاكر'];

  const filteredSnacks = snacks.filter((item) => {
    if (selectedCategory !== 'الكل' && item.category !== selectedCategory) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectedSession = activeSessions.find((s) => s.id === selectedSessionId) || activeSessions[0];

  const matchingSessions = activeSessions.filter((sess) => {
    if (!sessionSearchText.trim()) return true;
    const q = sessionSearchText.trim().toLowerCase();
    return (
      sess.stationName.toLowerCase().includes(q) ||
      sess.stationId.toLowerCase().includes(q) ||
      sess.customerName.toLowerCase().includes(q) ||
      (sess.customerPin && sess.customerPin.toLowerCase().includes(q)) ||
      (sess.customerPhone && sess.customerPhone.includes(q))
    );
  });

  const handleQuickAdd = (snack: SnackItem) => {
    if (!selectedSessionId) {
      alert('يرجى اختيار جلسة نشطة أولاً لإضافة الطلب!');
      return;
    }

    onAddSnackToSession(selectedSessionId, snack, 1);
    const targetSession = activeSessions.find((s) => s.id === selectedSessionId);
    setOrderSuccessMsg(`تمت إضافة «${snack.name}» بنجاح إلى حساب ${targetSession?.customerName}.`);
    setTimeout(() => setOrderSuccessMsg(null), 3000);
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newPrice <= 0) return;

    onAddNewSnackItem({
      name: newName,
      category: newCategory,
      price: newPrice,
      stock: newStock,
      imageIcon: newIcon,
    });

    setIsAddingNewItem(false);
    setNewName('');
    setNewPrice(2000);
  };

  return (
    <div className="space-y-5">
      
      {/* رأس قسم البوفيه والتسالي */}
      <div className="bg-[#10121b]/95 rounded-2xl p-5 border border-amber-500/25 shadow-xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-zinc-100 flex items-center gap-2">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20"
              >
                <Coffee className="w-5 h-5 stroke-[2.5]" />
              </motion.div>
              <span>بوفه و تسالی اختصاصی کلوپ گیمینگ (نوشیدنی‌های انرژی‌زا، اسنک، تنقلات)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              ثبت فوری خرید روی حساب بازیکن با محاسبه و اضافه شدن اتوماتیک به فاکتور نهایی
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            id="btn-add-snack-product"
            onClick={() => setIsAddingNewItem(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/25 transition"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>+ افزودن خوراکی جدید به بوفه</span>
          </motion.button>
        </div>

        {/* شريط ربط سريع بطلب اللاعب والبحث الذكي بالرقم أو الاسم أو الرمز */}
        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 shadow-inner space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-300 whitespace-nowrap flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>انتخاب نشست جهت ثبت سریع سفارش:</span>
            </span>

            {selectedSession && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 font-mono-digits">
                  <GamingPcIcon className="w-3 h-3 text-amber-400" />
                  <span>شماره دستگاه:</span>
                  <span className="font-mono text-white font-black">{selectedSession.stationId}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>نام بازیکن: {selectedSession.customerName}</span>
                </span>
                {selectedSession.customerPin && (
                  <span className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold flex items-center gap-1 font-mono-digits">
                    <Key className="w-3 h-3 text-violet-400" />
                    <span>رمز / PIN:</span>
                    <span className="font-mono text-white font-black">{selectedSession.customerPin}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {activeSessions.length > 0 ? (
            <div className="space-y-2">
              {/* کادر جستجوی پیشرفته بر اساس شماره سیستم، نام بازیکن یا رمز عبور */}
              <div className="relative">
                <Search className="w-4 h-4 text-amber-400/80 absolute right-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={sessionSearchText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSessionSearchText(val);
                    setIsSessionDropdownOpen(true);
                    const match = activeSessions.find(
                      s => s.stationId.toLowerCase() === val.trim().toLowerCase() ||
                           s.customerPin === val.trim()
                    );
                    if (match) {
                      setSelectedSessionId(match.id);
                    }
                  }}
                  onFocus={() => setIsSessionDropdownOpen(true)}
                  placeholder="جستجو با شماره دستگاه (مثلاً PC-01)، نام بازیکن (مثلاً سجاد)، یا رمز بازیکن (مثلاً 7721)..."
                  className="w-full pl-20 pr-9 py-2 text-xs sm:text-sm bg-zinc-950 border border-amber-500/40 text-amber-200 placeholder-zinc-500 rounded-xl focus:outline-none focus:border-amber-400 shadow-inner font-sans"
                />

                <div className="absolute left-2 top-2 flex items-center gap-1">
                  {sessionSearchText && (
                    <button
                      type="button"
                      onClick={() => setSessionSearchText('')}
                      className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      title="پاک کردن متن جستجو"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
                    className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs flex items-center gap-1 border border-zinc-700 transition"
                    title="مشاهده همه نشست‌ها"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSessionDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* منوی شناور نتایج جستجو */}
                <AnimatePresence>
                  {isSessionDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-zinc-950 border border-amber-500/50 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                    >
                      <div className="p-2 text-[11px] font-bold text-zinc-400 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-3">
                        <span>نتایج جستجو ({matchingSessions.length} نشست):</span>
                        <button
                          type="button"
                          onClick={() => setIsSessionDropdownOpen(false)}
                          className="text-zinc-400 hover:text-white text-[10px]"
                        >
                          بستن ✕
                        </button>
                      </div>

                      {matchingSessions.length > 0 ? (
                        <div className="divide-y divide-zinc-800/60 p-1">
                          {matchingSessions.map((sess) => {
                            const isSelected = sess.id === selectedSessionId;
                            return (
                              <button
                                key={sess.id}
                                type="button"
                                onClick={() => {
                                  setSelectedSessionId(sess.id);
                                  setIsSessionDropdownOpen(false);
                                  setSessionSearchText('');
                                }}
                                className={`w-full text-right p-2.5 rounded-lg transition flex items-center justify-between gap-2 ${
                                  isSelected
                                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                                    : 'hover:bg-zinc-900 text-zinc-200'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-amber-300 font-mono font-bold text-xs font-mono-digits">
                                    {sess.stationId}
                                  </span>
                                  <div>
                                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                                      <span>{sess.customerName}</span>
                                      <span className="text-[10px] text-zinc-400 font-normal">({sess.stationName})</span>
                                    </div>
                                    <div className="text-[10px] text-zinc-400 font-mono font-mono-digits">
                                      تلفن: {sess.customerPhone}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {sess.customerPin && (
                                    <span className="px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/40 text-violet-300 font-mono text-[11px] font-mono-digits flex items-center gap-1">
                                      <Key className="w-3 h-3 text-violet-400" />
                                      <span>رمز: {sess.customerPin}</span>
                                    </span>
                                  )}
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-xs text-zinc-500">
                          هیچ نشستی با این شماره دستگاه، نام بازیکن یا رمز یافت نشد.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* منوی انتخابی سریع با مشخصات کامل */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedSessionId}
                  onChange={(e) => {
                    setSelectedSessionId(e.target.value);
                    setSessionSearchText('');
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-zinc-950 border border-amber-500/30 text-amber-300 focus:outline-none focus:border-amber-400 font-mono-digits"
                >
                  {matchingSessions.map((sess) => (
                    <option key={sess.id} value={sess.id}>
                      [{sess.stationId}] {sess.stationName} • بازیکن: {sess.customerName} (رمز/PIN: {sess.customerPin || '---'}) • تلفن: {sess.customerPhone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <span className="text-xs text-zinc-400 italic">
              در حال حاضر نشستی فعال نیست. لطفاً ابتدا یک جلسه بازی شروع کنید.
            </span>
          )}
        </div>

        {/* إشعار النجاح */}
        <AnimatePresence>
          {orderSuccessMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{orderSuccessMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* تصنيفات الأصناف وشريط البحث */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 border border-amber-500/20'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نوشیدنی یا خوراکی..."
              className="w-full pl-3 pr-9 py-2 rounded-xl text-xs bg-zinc-900 border border-amber-500/20 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

        </div>

      </div>

      {/* شبكة أصناف البوفيه */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AnimatePresence>
          {filteredSnacks.map((snack) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              key={snack.id}
              id={`snack-card-${snack.id}`}
              className="bg-[#11131d]/95 border border-amber-500/20 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between space-y-3 transition-all group backdrop-blur-md"
            >
              <div className="flex items-start justify-between">
                <motion.span 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="text-3xl p-2 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-center shadow-inner"
                >
                  {snack.imageIcon}
                </motion.span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-amber-300/90 border border-zinc-800">
                  موجودی: {snack.stock}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-zinc-100 text-sm line-clamp-1">
                  {snack.name}
                </h4>
                <span className="text-[11px] text-zinc-400">
                  {snack.category}
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {formatCurrency(snack.price)}
                </span>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  id={`btn-add-snack-${snack.id}`}
                  onClick={() => handleQuickAdd(snack)}
                  disabled={activeSessions.length === 0}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none transition shadow-md shadow-amber-500/20"
                  title="افزودن به نشست انتخابی"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>+ ثبت</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* نافذة منبثقة لإضافة صنف جديد */}
      <AnimatePresence>
        {isAddingNewItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onSubmit={handleSaveNewItem}
              className="bg-[#12141f] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-zinc-100"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-400" />
                  <span>افزودن خوراکی یا نوشیدنی جدید به بوفه</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNewItem(false)}
                  className="text-zinc-400 hover:text-zinc-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-bold">نام محصول:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: ردبول توت، چیپس پنیری، قهوه اسپرسو..."
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-bold">دسته‌بندی:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="مشروبات طاقة">مشروبات طاقة</option>
                    <option value="تسالي ومقرمشات">تسالي ومقرمشات</option>
                    <option value="مشروبات ساخنة وباردة">مشروبات ساخنة وباردة</option>
                    <option value="وجبات وسندويشات">وجبات وسندويشات</option>
                    <option value="حلويات وسكاكر">حلويات وسكاكر</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-bold">آیکون / ایموجی:</label>
                  <input
                    type="text"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-center text-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-bold">قیمت فروش (دینار):</label>
                  <input
                    type="number"
                    min="250"
                    step="250"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-bold">موجودی انبار:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddingNewItem(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  انصراف
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 shadow-md shadow-amber-500/25"
                >
                  ذخیره کالا
                </motion.button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
