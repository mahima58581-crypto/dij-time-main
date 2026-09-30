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
  Save,
  Zap,
  Play,
  Activity,
  Clock
} from 'lucide-react';
import { Station, StationType, StationStatus } from '../types';
import { formatCurrency } from '../utils/formatters';
import { XboxIcon } from './XboxIcon';
import { PlaystationIcon } from './PlaystationIcon';

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
          <span className="px-2.5 py-1 text-[10px] sm:text-[11px] font-black rounded-full bg-white dark:bg-emerald-950/80 text-emerald-700 dark:text-white border border-emerald-300 dark:border-emerald-500/50 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 shadow-xs transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse shrink-0" />
            <span className="text-emerald-800 dark:text-white">شاغر ومتاح</span>
          </span>
        );
      case 'in-use':
        return (
          <span className="px-2.5 py-1 text-[10px] sm:text-[11px] font-black rounded-full bg-white dark:bg-cyan-950/80 text-cyan-700 dark:text-white border border-cyan-300 dark:border-cyan-500/50 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 shadow-xs transition-colors">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-ping shrink-0" />
            <span className="text-cyan-800 dark:text-white">جلسة نشطة</span>
          </span>
        );
      case 'cleaning':
        return (
          <span className="px-2.5 py-1 text-[10px] sm:text-[11px] font-black rounded-full bg-white dark:bg-teal-950/80 text-teal-700 dark:text-white border border-teal-300 dark:border-teal-500/50 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 shadow-xs transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400 shrink-0" />
            <span className="text-teal-800 dark:text-white">قيد التنظيف</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2.5 py-1 text-[10px] sm:text-[11px] font-black rounded-full bg-white dark:bg-rose-950/80 text-rose-700 dark:text-white border border-rose-300 dark:border-rose-500/50 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 shadow-xs transition-colors">
            <Wrench className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
            <span className="text-rose-800 dark:text-white">تحت الصيانة</span>
          </span>
        );
    }
  };

  return (
    <div id="station-management-root" className="space-y-6">
      
      {/* Filters, Add Station Action & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 dark-card rounded-2xl border border-emerald-100/80 dark:border-slate-800/80 shadow-xs">
        {/* 1. Search Bar */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم المحطة أو المواصفات..."
            className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* 2. Middle Action: Add Station Button (هم‌اندازه و هماهنگ دقیق با دکمه جميع المنصات) */}
        <div className="flex items-center justify-center my-1 md:my-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xs shadow-emerald-500/25 transition whitespace-nowrap cursor-pointer"
            title="إضافة جهاز أو منصة ألعاب جديدة للمنظومة"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>إضافة محطة جديدة</span>
          </motion.button>
        </div>

        {/* 3. Platform Filters (تب‌های پلتفرم‌ها - عرض جمع‌وجور برای جای‌گیری دقیق در چهارچوب) */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-0.5 sm:p-1 bg-slate-100/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/60 dark:border-slate-800 shrink-0">
          {(['all', 'PC', 'PS5', 'XBOX', 'VIP_SIM'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredStations.map((st) => {
          const isAvailable = st.status === 'available';
          const isInUse = st.status === 'in-use';
          const isCleaning = st.status === 'cleaning';

          // Platform theme metadata
          const platformMeta = {
            PC: {
              label: 'حاسوب ألعاب PC',
              icon: Monitor,
              color: 'text-cyan-400',
              bg: 'bg-slate-950 dark:bg-black',
              border: 'border-cyan-500/40 dark:border-cyan-500/50 shadow-md shadow-cyan-500/20',
              badge: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
              accent: 'from-cyan-500 to-blue-600',
            },
            PS5: {
              label: 'منصة بلايستيشن 5',
              icon: PlaystationIcon,
              color: 'text-blue-500',
              bg: 'bg-[#030612] dark:bg-black',
              border: 'border-blue-500/50 dark:border-blue-500/60 shadow-lg shadow-blue-500/25',
              badge: 'bg-blue-500/15 dark:bg-blue-950/60 text-blue-400 border border-blue-500/30',
              accent: 'from-blue-500 via-indigo-600 to-purple-600',
            },
            XBOX: {
              label: 'إكس بوكس سيريز',
              icon: XboxIcon,
              color: 'text-emerald-400',
              bg: 'bg-[#020a04] dark:bg-black',
              border: 'border-emerald-500/60 dark:border-emerald-500/70 shadow-lg shadow-emerald-500/25',
              badge: 'bg-emerald-500/15 dark:bg-emerald-950/60 text-emerald-400 border border-emerald-500/30',
              accent: 'from-emerald-400 via-green-500 to-teal-500',
            },
            VIP_SIM: {
              label: 'محاكي قيادة VIP',
              icon: Zap,
              color: 'text-amber-400',
              bg: 'bg-slate-950 dark:bg-black',
              border: 'border-amber-500/50 dark:border-amber-500/60 shadow-md shadow-amber-500/20',
              badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
              accent: 'from-amber-500 to-orange-600',
            },
          }[st.type] || {
            label: st.type,
            icon: Monitor,
            color: 'text-emerald-400',
            bg: 'bg-slate-950 dark:bg-black',
            border: 'border-emerald-500/40 dark:border-emerald-500/50 shadow-md shadow-emerald-500/20',
            badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
            accent: 'from-emerald-500 to-teal-600',
          };

          const PlatformIcon = platformMeta.icon;

          return (
            <motion.div
              key={st.id}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${platformMeta.accent}`} />

              <div className="p-5 space-y-4">
                {/* 1. Header: Platform Icon + Name & Platform Details + Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        const types: StationType[] = ['PC', 'PS5', 'XBOX', 'VIP_SIM'];
                        const nextType = types[(types.indexOf(st.type) + 1) % types.length];
                        onUpdateStation({ ...st, type: nextType });
                      }}
                      title="انقر لتبديل نوع المنصة (PC / PS5 / XBOX / VIP)"
                      className={`w-14 h-14 rounded-2xl ${platformMeta.bg} border-2 ${platformMeta.border} flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md group/pod relative`}
                    >
                      <PlatformIcon className="w-10 h-10" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                        {st.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-white">
                        <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-300 dark:border-slate-700 shadow-2xs">
                          #{st.id}
                        </span>
                        <span className="text-slate-400 dark:text-white">•</span>
                        <span className="font-bold text-slate-800 dark:text-white">{platformMeta.label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {getStatusBadge(st.status)}
                  </div>
                </div>

                {/* 2. Specs Box */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                    <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>المواصفات والعتاد:</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {st.specs}
                  </p>
                </div>

                {/* 3. Tariff Rate Display */}
                <div className="flex items-center justify-between py-1 px-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-bold">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>سعر الساعة الأساسي:</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400 font-mono-digits">
                      {formatCurrency(st.hourlyRate)}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">
                      / ساعة
                    </span>
                  </div>
                </div>

                {/* 4. Quick Mode Switcher */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-black text-slate-900 dark:text-white block">
                    تغيير حالة الجهاز السريعة:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(st, 'available')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                        st.status === 'available'
                          ? 'bg-emerald-600 text-white shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>متاح</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(st, 'cleaning')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                        st.status === 'cleaning'
                          ? 'bg-teal-600 text-white shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تنظيف</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(st, 'maintenance')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                        st.status === 'maintenance'
                          ? 'bg-rose-600 text-white shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>صيانة</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Bottom Action Deck & Utility Links */}
              <div className="p-5 pt-0 space-y-3">
                {/* Main Action Launcher */}
                {isAvailable ? (
                  <button
                    type="button"
                    onClick={() => onStartSessionForStation(st)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer font-gaming"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>بدء جلسة لعب جديدة الآن</span>
                  </button>
                ) : isInUse ? (
                  <div className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80 flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
                    <span>الجهاز قيد الاستخدام حالياً (جلسة نشطة)</span>
                  </div>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    <span>الجهاز غير متاح ({isCleaning ? 'قيد التنظيف' : 'تحت الصيانة'})</span>
                  </div>
                )}

                {/* Secondary Utility Links: Edit & Delete */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setEditingStation(st)}
                    className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="تعديل المواصفات وسعر الساعة"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل المواصفات</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onDeleteStation(st.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-bold transition py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer active:scale-95"
                    title="حذف المحطة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف المحطة</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
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
