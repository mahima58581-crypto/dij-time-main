import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tag, 
  Plus, 
  Edit3, 
  Clock, 
  Zap, 
  Wifi, 
  Check, 
  Sparkles, 
  Calculator, 
  X, 
  Save, 
  Monitor, 
  Tv, 
  Gamepad2,
  Trash2
} from 'lucide-react';
import { TariffRate, StationType } from '../types';
import { formatCurrency } from '../utils/formatters';

interface TariffsManagerProps {
  tariffs: TariffRate[];
  onAddTariff: (tariff: Omit<TariffRate, 'id'>) => void;
  onUpdateTariff: (tariff: TariffRate) => void;
  onDeleteTariff: (tariffId: string) => void;
}

export const TariffsManager: React.FC<TariffsManagerProps> = ({
  tariffs,
  onAddTariff,
  onUpdateTariff,
  onDeleteTariff,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState<TariffRate | null>(null);

  // Quick Calculator State
  const [calcPlatform, setCalcPlatform] = useState<StationType>('PC');
  const [calcHours, setCalcHours] = useState<number>(2);
  const [calcIsPeak, setCalcIsPeak] = useState<boolean>(false);
  const [calcIsOnline, setCalcIsOnline] = useState<boolean>(true);

  // New Tariff Form
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<StationType | 'ALL'>('PC');
  const [baseHourlyRate, setBaseHourlyRate] = useState<number>(4500);
  const [peakMultiplier, setPeakMultiplier] = useState<number>(1.2);
  const [onlineGameMultiplier, setOnlineGameMultiplier] = useState<number>(1.1);
  const [minPlayMinutes, setMinPlayMinutes] = useState<number>(30);
  const [isPackage, setIsPackage] = useState(false);
  const [packageHours, setPackageHours] = useState<number>(3);
  const [packagePrice, setPackagePrice] = useState<number>(12000);
  const [packageDescription, setPackageDescription] = useState('');

  // Calculate simulated rate
  const matchedTariff = tariffs.find((t) => !t.isPackage && (t.platform === calcPlatform || t.platform === 'ALL')) || tariffs[0];
  let calculatedSimPrice = 0;
  if (matchedTariff) {
    let rate = matchedTariff.baseHourlyRate;
    if (calcIsPeak) rate *= (matchedTariff.peakMultiplier || 1);
    if (calcIsOnline) rate *= (matchedTariff.onlineGameMultiplier || 1);
    calculatedSimPrice = Math.round(rate * calcHours);
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTariff({
      title: title.trim(),
      platform,
      baseHourlyRate,
      peakMultiplier,
      onlineGameMultiplier,
      minPlayMinutes,
      isPackage,
      packageHours: isPackage ? packageHours : undefined,
      packagePrice: isPackage ? packagePrice : undefined,
      packageDescription: packageDescription.trim(),
    });
    setTitle('');
    setPackageDescription('');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTariff) return;
    onUpdateTariff(editingTariff);
    setEditingTariff(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-emerald-100 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>إدارة التعرفات وباقات الأسعار</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ضبط الأسعار الأساسية بالساعة، معامل أوقات الذروة، اشتراک الألعاب أونلاين، والباقات الترويجية
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition font-gaming"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ تعريف تعرفة / باقة جديدة</span>
        </motion.button>
      </div>

      {/* Interactive Live Price Simulator */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-emerald-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
          <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>حاسبة محاكاة أسعار اللعب (احتساب فوري بالدينار)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-600 dark:text-slate-300 font-bold">المنصة:</label>
            <select
              value={calcPlatform}
              onChange={(e) => setCalcPlatform(e.target.value as StationType)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="PC">كمبيوتر (PC)</option>
              <option value="PS5">بلايستيشن (PS5)</option>
              <option value="XBOX">إكسبوكس (XBOX)</option>
              <option value="VIP_SIM">محاكي قيادة VIP</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-600 dark:text-slate-300 font-bold">المدة (بالساعات):</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={calcHours}
              onChange={(e) => setCalcHours(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono-digits"
            />
          </div>

          <div className="flex flex-col justify-end space-y-1">
            <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition">
              <input
                type="checkbox"
                checked={calcIsPeak}
                onChange={(e) => setCalcIsPeak(e.target.checked)}
                className="rounded accent-emerald-600"
              />
              <span>ساعات الذروة (Peak)</span>
            </label>
          </div>

          <div className="flex flex-col justify-end space-y-1">
            <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition">
              <input
                type="checkbox"
                checked={calcIsOnline}
                onChange={(e) => setCalcIsOnline(e.target.checked)}
                className="rounded accent-emerald-600"
              />
              <span>ألعاب أونلاين (ألياف ضوئية)</span>
            </label>
          </div>

          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex flex-col justify-center text-center font-mono">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">المبلغ التقديري:</div>
            <div className="text-sm font-black text-emerald-800 dark:text-emerald-400 mt-0.5 font-mono-digits">
              {formatCurrency(calculatedSimPrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Tariffs List */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="text-slate-900 dark:text-slate-100 font-black">التعرفات الأساسية والباقات النشطة في النادي</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-digits">({tariffs.length} تعرفة)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tariffs.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 dark-card border transition-all shadow-sm space-y-4 flex flex-col justify-between ${
                t.isPackage ? 'border-emerald-300 dark:border-emerald-700/80 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/20 to-white dark:to-slate-900' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                      {t.isPackage ? <Sparkles className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{t.title}</h4>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-bold font-mono-digits">
                        المنصة: {t.platform === 'ALL' ? 'كافة المنصات' : t.platform}
                      </span>
                    </div>
                  </div>

                  {t.isPackage ? (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      باقة خاصة
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      تعرفة ساعية
                    </span>
                  )}
                </div>

                {t.packageDescription && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {t.packageDescription}
                  </p>
                )}

                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/80 dark-card-inner rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs font-mono space-y-1.5 font-mono-digits">
                  {t.isPackage ? (
                    <>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>مدة الباقة:</span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold">{t.packageHours} ساعة</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                        <span>سعر الباقة (د.ع):</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm">
                          {formatCurrency(t.packagePrice || 0)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>سعر الساعة الأساسي:</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black">
                          {formatCurrency(t.baseHourlyRate)} / ساعة
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>معامل الذروة:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold">{t.peakMultiplier}×</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>معامل ألعاب أونلاين:</span>
                        <span className="text-teal-700 dark:text-teal-300 font-bold">{t.onlineGameMultiplier}×</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setEditingTariff(t)}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 transition"
                  title="تعديل التعرفة"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`هل أنت متأكد من حذف التعرفة ${t.title}؟`)) {
                      onDeleteTariff(t.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700 transition"
                  title="حذف التعرفة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Tariff Modal */}
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
                  <Tag className="w-5 h-5 text-emerald-600" />
                  <span>تعريف تعرفة أو باقة ساعية جديدة</span>
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
                  <label className="text-xs font-bold text-slate-700">عنوان التعرفة:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: تعرفة ليلية PS5 أو باقة 5 ساعات VIP"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">المنصة المستهدفة:</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    >
                      <option value="PC">PC</option>
                      <option value="PS5">PS5</option>
                      <option value="XBOX">XBOX</option>
                      <option value="VIP_SIM">VIP_SIM</option>
                      <option value="ALL">كافة المنصات</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">نوع التعرفة:</label>
                    <div className="flex items-center gap-2 pt-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPackage}
                          onChange={(e) => setIsPackage(e.target.checked)}
                          className="rounded accent-emerald-600"
                        />
                        <span>باقة محددة الساعات</span>
                      </label>
                    </div>
                  </div>
                </div>

                {!isPackage ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">السعر الأساسي (د.ع):</label>
                      <input
                        type="number"
                        step="500"
                        required
                        value={baseHourlyRate}
                        onChange={(e) => setBaseHourlyRate(Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-emerald-800 focus:border-emerald-500 focus:bg-white font-mono-digits"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">معامل الذروة (Peak):</label>
                      <input
                        type="number"
                        step="0.05"
                        value={peakMultiplier}
                        onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white font-mono-digits"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">معامل أونلاين:</label>
                      <input
                        type="number"
                        step="0.05"
                        value={onlineGameMultiplier}
                        onChange={(e) => setOnlineGameMultiplier(Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-teal-700 focus:border-emerald-500 focus:bg-white font-mono-digits"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">عدد ساعات الباقة:</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={packageHours}
                        onChange={(e) => setPackageHours(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white font-mono-digits"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">سعر الباقة (د.ع):</label>
                      <input
                        type="number"
                        step="1000"
                        required
                        value={packagePrice}
                        onChange={(e) => setPackagePrice(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-mono font-black bg-slate-50 border border-slate-200 rounded-xl text-emerald-800 focus:border-emerald-500 focus:bg-white font-mono-digits"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">التفاصيل والميزات الإضافية:</label>
                  <textarea
                    rows={2}
                    value={packageDescription}
                    onChange={(e) => setPackageDescription(e.target.value)}
                    placeholder="تشمل مشروب طاقة مجاناً، شاشة 240 هرتز، أولوية الحجز..."
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
                    حفظ التعرفة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Tariff Modal */}
      <AnimatePresence>
        {editingTariff && (
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
                  <span>تعديل التعرفة: {editingTariff.title}</span>
                </h3>
                <button
                  onClick={() => setEditingTariff(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">عنوان التعرفة:</label>
                  <input
                    type="text"
                    required
                    value={editingTariff.title}
                    onChange={(e) => setEditingTariff({ ...editingTariff, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                {!editingTariff.isPackage ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">سعر الساعة الأساسي (د.ع):</label>
                      <input
                        type="number"
                        step="500"
                        required
                        value={editingTariff.baseHourlyRate}
                        onChange={(e) => setEditingTariff({ ...editingTariff, baseHourlyRate: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-emerald-800 focus:border-emerald-500 focus:bg-white font-mono-digits"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">معامل الذروة (Peak):</label>
                      <input
                        type="number"
                        step="0.05"
                        value={editingTariff.peakMultiplier}
                        onChange={(e) => setEditingTariff({ ...editingTariff, peakMultiplier: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white font-mono-digits"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">عدد الساعات:</label>
                      <input
                        type="number"
                        min="1"
                        value={editingTariff.packageHours || 1}
                        onChange={(e) => setEditingTariff({ ...editingTariff, packageHours: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white font-mono-digits"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">سعر الباقة (د.ع):</label>
                      <input
                        type="number"
                        step="1000"
                        value={editingTariff.packagePrice || 0}
                        onChange={(e) => setEditingTariff({ ...editingTariff, packagePrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-emerald-800 focus:border-emerald-500 focus:bg-white font-mono-digits"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingTariff(null)}
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
