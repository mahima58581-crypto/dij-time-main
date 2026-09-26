import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Plus, 
  Edit3, 
  Trash2, 
  Power, 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Tv, 
  Gamepad, 
  Search, 
  X,
  Cpu,
  Save
} from 'lucide-react';
import { Station, StationType, StationStatus } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CyberSectionIcon } from './CyberSectionIcon';

interface StationManagementProps {
  stations: Station[];
  onAddStation: (station: Omit<Station, 'id'>) => void;
  onUpdateStation: (station: Station) => void;
  onDeleteStation: (stationId: string) => void;
  onStartSessionForStation: (station: Station) => void;
}

export const StationManagement: React.FC<StationManagementProps> = ({
  stations,
  onAddStation,
  onUpdateStation,
  onDeleteStation,
  onStartSessionForStation,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | StationType>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);

  // New Station Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<StationType>('PC');
  const [hourlyRate, setHourlyRate] = useState<number>(4500);
  const [specs, setSpecs] = useState('');
  const [status, setStatus] = useState<StationStatus>('available');

  const filteredStations = stations.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(search.toLowerCase()) || st.specs.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || st.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddStation({
      name: name.trim(),
      type,
      hourlyRate,
      specs: specs.trim() || 'جهاز ألعاب متكامل مع كافة الملحقات والعتاد الاحترافي',
      status,
    });
    setName('');
    setSpecs('');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStation) return;
    onUpdateStation(editingStation);
    setEditingStation(null);
  };

  const handleQuickStatusChange = (st: Station, newStatus: StationStatus) => {
    onUpdateStation({
      ...st,
      status: newStatus,
    });
  };

  const getStatusBadge = (stStatus: StationStatus) => {
    switch (stStatus) {
      case 'available':
        return (
          <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap shrink-0 inline-flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shrink-0"></span>
            <span>متاح</span>
          </span>
        );
      case 'in-use':
        return (
          <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0 inline-flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping shrink-0"></span>
            <span>جلسة نشطة</span>
          </span>
        );
      case 'cleaning':
        return (
          <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0 inline-flex items-center gap-1 shadow-2xs">
            <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>تنظيف</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 whitespace-nowrap shrink-0 inline-flex items-center gap-1 shadow-2xs">
            <Wrench className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>صيانة</span>
          </span>
        );
    }
  };

  return (
    <div id="station-management-root" className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-emerald-100 dark:border-slate-800/80 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <CyberSectionIcon icon={Monitor} size="lg" variant="emerald" />
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              إدارة وضبط المحطات والمنصات
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              إضافة أجهزة جديدة، تحديد المواصفات الفنية، تعديل حالات التشغيل وتحديد السعر بالساعة
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition font-gaming"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ إضافة محطة جديدة</span>
        </motion.button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 dark-card rounded-2xl border border-emerald-100/80 dark:border-slate-800/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم المحطة أو المواصفات..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/60 dark:border-slate-800">
          {(['all', 'PC', 'PS5', 'XBOX', 'VIP_SIM'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                filterType === t
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {t === 'all' ? 'جميع المنصات' : t === 'VIP_SIM' ? 'محاكي VIP' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Stations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((st) => (
          <motion.div
            key={st.id}
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 dark-card border border-slate-200/90 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-md hover:shadow-emerald-500/10 space-y-4 flex flex-col justify-between"
          >
            {/* Top row */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black shrink-0">
                    {st.type === 'PC' ? <Monitor className="w-3.5 h-3.5" /> : st.type === 'PS5' ? <Gamepad className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-100 truncate leading-snug">
                      {st.name}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold font-mono-digits truncate block leading-tight">
                      المعرف: {st.id}
                    </span>
                  </div>
                </div>
                {getStatusBadge(st.status)}
              </div>

              {/* Specs */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 dark-card-inner border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>المواصفات والعتاد:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{st.specs}</p>
              </div>
            </div>

            {/* Rate & Quick State */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">سعر الساعة الأساسي:</span>
                <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400 font-mono-digits">
                  {formatCurrency(st.hourlyRate)} / ساعة
                </span>
              </div>

              {/* Status Switcher & Actions */}
              <div className="flex items-center justify-between gap-1 pt-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQuickStatusChange(st, 'available')}
                    title="تغيير إلى شاغر ومتاح"
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      st.status === 'available'
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleQuickStatusChange(st, 'cleaning')}
                    title="تغيير إلى وضع التنظيف"
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      st.status === 'cleaning'
                        ? 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleQuickStatusChange(st, 'maintenance')}
                    title="تغيير إلى وضع الصيانة"
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      st.status === 'maintenance'
                        ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingStation(st)}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
                    title="تعديل المواصفات"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف المحطة ${st.name}؟`)) {
                        onDeleteStation(st.id);
                      }
                    }}
                    disabled={st.status === 'in-use'}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                    title={st.status === 'in-use' ? 'الجهاز قيد الاستخدام حالياً' : 'حذف المحطة'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Start Session Quick Action */}
              {st.status === 'available' && (
                <button
                  onClick={() => onStartSessionForStation(st)}
                  className="w-full py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1 font-gaming"
                >
                  <Power className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>بدء اللعب فوراً على هذا الجهاز</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Station Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>إضافة محطة جديدة إلى النادي</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم أو رقم المحطة:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: جهاز PC-06 أو منصة PS5-03"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نوع المنصة:</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as StationType)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="PC">کمبيوتر (PC)</option>
                      <option value="PS5">بلايستيشن 5 (PS5)</option>
                      <option value="XBOX">إكسبوکس (XBOX)</option>
                      <option value="VIP_SIM">محاكي قيادة وسياقة VIP</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سعر الساعة (د.ع):</label>
                    <input
                      type="number"
                      step="500"
                      required
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المواصفات الفنية والعتاد:</label>
                  <textarea
                    rows={3}
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    placeholder="شاشة 240Hz، كارت شاشة RTX 4070، معالج Core i7، سماعات ريزر..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-105 shadow-md shadow-emerald-500/25 font-gaming"
                  >
                    حفظ المحطة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Station Modal */}
      <AnimatePresence>
        {editingStation && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>تعديل المحطة: {editingStation.name}</span>
                </h3>
                <button
                  onClick={() => setEditingStation(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم المحطة:</label>
                  <input
                    type="text"
                    required
                    value={editingStation.name}
                    onChange={(e) => setEditingStation({ ...editingStation, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المنصة:</label>
                    <select
                      value={editingStation.type}
                      onChange={(e) => setEditingStation({ ...editingStation, type: e.target.value as StationType })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="PC">PC</option>
                      <option value="PS5">PS5</option>
                      <option value="XBOX">XBOX</option>
                      <option value="VIP_SIM">VIP_SIM</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سعر الساعة (د.ع):</label>
                    <input
                      type="number"
                      step="500"
                      required
                      value={editingStation.hourlyRate}
                      onChange={(e) => setEditingStation({ ...editingStation, hourlyRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المواصفات الفنية:</label>
                  <textarea
                    rows={3}
                    value={editingStation.specs}
                    onChange={(e) => setEditingStation({ ...editingStation, specs: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingStation(null)}
                    className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
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
