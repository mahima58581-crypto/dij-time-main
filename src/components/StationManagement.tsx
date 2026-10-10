import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Station, StationType, StationStatus } from '../types';
import { formatCurrency } from '../utils/formatters';
import { XboxIcon } from './XboxIcon';
import { GamingPcIcon } from './GamingPcIcon';
import { PlaystationIcon } from './PlaystationIcon';
import { VipSimulatorIcon } from './VipSimulatorIcon';
import { Activity, AlertCircle, Badge, Box, Brackets, CheckCircle2, Clock, Command, Cpu, Delete, Diamond, Edit, Edit3, Grid, Layers, LayoutGrid, ListFilter, Monitor, Play, Plus, Save, Search, Sparkles, Trash2, View, Wrench, X } from 'lucide-react';

interface StationManagementProps {
  stations: Station[];
  onAddStation: (station: Omit<Station, 'id'>) => void;
  onUpdateStation: (station: Station) => void;
  onDeleteStation: (stationId: string) => void;
  onStartSessionForStation: (station: Station) => void;
}

// 1. Unified Platform Color & Esports Theme Definition
const getPlatformMeta = (stType: StationType) => {
  switch (stType) {
    case 'VIP_SIM':
      return {
        id: 'VIP_SIM',
        label: 'محاكي قيادة VIP',
        categoryTitle: '🏎️ مقصورات ومحاكيات القيادة الاحترافية (Simulator)',
        desc: 'مقصورات سباق واقعية بمحركات دفع هوائي، دركسون احترافي ودواسات هيدروليكية',
        icon: VipSimulatorIcon,
        color: 'text-orange-500 dark:text-orange-400',
        colorHex: '#f97316',
        bg: 'bg-orange-500/10 dark:bg-orange-950/60',
        cardBg: 'bg-white dark:bg-[#120803]',
        border: 'border-orange-300/80 dark:border-orange-500/40 hover:border-orange-500 dark:hover:border-orange-400 shadow-sm hover:shadow-lg hover:shadow-orange-500/25',
        badge: 'bg-orange-50 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600/70',
        accent: 'from-orange-500 via-amber-400 to-red-500',
        accentText: 'text-orange-600 dark:text-orange-400',
        buttonGrad: 'from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-500/30',
        brackets: 'border-orange-500/70 dark:border-orange-400/80',
        glow: 'shadow-[0_0_24px_rgba(249,115,22,0.22)]',
        headerGlow: 'from-orange-500/15 via-orange-500/5 to-transparent',
        headerBorder: 'border-orange-500/40 dark:border-orange-500/50',
      };
    case 'XBOX':
      return {
        id: 'XBOX',
        label: 'إكس بوكس سيريز X',
        categoryTitle: '🎮 منصات إكس بوكس الرسمية (Xbox Series X)',
        desc: 'أقوى أجهزة مايكروسوفت بمعدل 120 إطار وخدمة Xbox Game Pass Ultimate فائقة',
        icon: XboxIcon,
        color: 'text-green-500 dark:text-green-400',
        colorHex: '#22c55e',
        bg: 'bg-green-500/10 dark:bg-green-950/60',
        cardBg: 'bg-white dark:bg-[#031206]',
        border: 'border-green-300/80 dark:border-green-500/40 hover:border-green-500 dark:hover:border-green-400 shadow-sm hover:shadow-lg hover:shadow-green-500/25',
        badge: 'bg-green-50 dark:bg-green-950/80 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600/70',
        accent: 'from-green-500 via-emerald-400 to-lime-400',
        accentText: 'text-green-600 dark:text-green-400',
        buttonGrad: 'from-green-600 via-emerald-600 to-green-600 hover:from-green-500 hover:to-emerald-500 shadow-md shadow-green-500/30',
        brackets: 'border-green-500/70 dark:border-green-400/80',
        glow: 'shadow-[0_0_24px_rgba(34,197,94,0.22)]',
        headerGlow: 'from-green-500/15 via-green-500/5 to-transparent',
        headerBorder: 'border-green-500/40 dark:border-green-500/50',
      };
    case 'PS5':
      return {
        id: 'PS5',
        label: 'بلايستيشن 5 (PS5)',
        categoryTitle: '🕹️ منصات بلايستيشن 5 الرسمية (PlayStation 5)',
        desc: 'أجهزة سوني الجيل الجديد مع وحدات تحكم DualSense وشاشات 4K HDR فائقة الألوان',
        icon: PlaystationIcon,
        color: 'text-blue-500 dark:text-blue-400',
        colorHex: '#3b82f6',
        bg: 'bg-blue-500/10 dark:bg-blue-950/60',
        cardBg: 'bg-white dark:bg-[#040916]',
        border: 'border-blue-300/80 dark:border-blue-500/40 hover:border-blue-500 dark:hover:border-blue-400 shadow-sm hover:shadow-lg hover:shadow-blue-500/25',
        badge: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600/70',
        accent: 'from-blue-600 via-indigo-500 to-sky-400',
        accentText: 'text-blue-600 dark:text-blue-400',
        buttonGrad: 'from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/30',
        brackets: 'border-blue-500/70 dark:border-blue-400/80',
        glow: 'shadow-[0_0_24px_rgba(59,130,246,0.22)]',
        headerGlow: 'from-blue-500/15 via-blue-500/5 to-transparent',
        headerBorder: 'border-blue-500/40 dark:border-blue-500/50',
      };
    case 'PC':
    default:
      return {
        id: 'PC',
        label: 'حاسوب ألعاب PC',
        categoryTitle: '🖥️ حواسيب الألعاب الاحترافية الفائقة (Gaming PC)',
        desc: 'عتاد فائق السرعة RTX 4080 وشاشات 240Hz وملحقات احترافية لألعاب الشوتر التنافسية',
        icon: Monitor,
        color: 'text-cyan-500 dark:text-cyan-400',
        colorHex: '#06b6d4',
        bg: 'bg-cyan-500/10 dark:bg-cyan-950/60',
        cardBg: 'bg-white dark:bg-[#030e14]',
        border: 'border-cyan-300/80 dark:border-cyan-500/40 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-sm hover:shadow-lg hover:shadow-cyan-500/25',
        badge: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-600/70',
        accent: 'from-cyan-500 via-teal-400 to-blue-500',
        accentText: 'text-cyan-600 dark:text-cyan-400',
        buttonGrad: 'from-cyan-600 via-teal-600 to-cyan-600 hover:from-cyan-500 hover:to-teal-500 shadow-md shadow-cyan-500/30',
        brackets: 'border-cyan-500/70 dark:border-cyan-400/80',
        glow: 'shadow-[0_0_24px_rgba(6,182,212,0.22)]',
        headerGlow: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
        headerBorder: 'border-cyan-500/40 dark:border-cyan-500/50',
      };
  }
};

export const StationManagement: React.FC<StationManagementProps> = ({
  stations,
  onAddStation,
  onUpdateStation,
  onDeleteStation,
  onStartSessionForStation,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | StationType>('all');
  const [viewLayout, setViewLayout] = useState<'grouped' | 'grid'>('grouped');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);

  // New Station Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<StationType>('VIP_SIM');
  const [hourlyRate, setHourlyRate] = useState<number>(6000);
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
          <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-500/15 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 border border-emerald-500/60 shadow-xs shadow-emerald-500/25 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse shrink-0" />
            <span className="tracking-wide">شاغر ومتاح</span>
          </span>
        );
      case 'in-use':
        return (
          <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-cyan-500/15 dark:bg-cyan-950/90 text-cyan-700 dark:text-cyan-300 border border-cyan-500/60 shadow-xs shadow-cyan-500/30 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-ping shrink-0" />
            <span className="tracking-wide">جلسة نشطة</span>
          </span>
        );
      case 'cleaning':
        return (
          <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-teal-500/15 dark:bg-teal-950/90 text-teal-700 dark:text-teal-300 border border-teal-500/60 shadow-xs shadow-teal-500/25 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all">
            <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
            <span className="tracking-wide">تنظيف</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-rose-500/15 dark:bg-rose-950/90 text-rose-700 dark:text-rose-300 border border-rose-500/60 shadow-xs shadow-rose-500/30 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all">
            <Wrench className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="tracking-wide">صيانة</span>
          </span>
        );
    }
  };

  const countForType = (t: 'all' | StationType) => {
    if (t === 'all') return stations.length;
    return stations.filter(s => s.type === t).length;
  };

  // Render Single Station Card with Distinct Cyber Branding
  const renderStationCard = (st: Station) => {
    const isAvailable = st.status === 'available';
    const isInUse = st.status === 'in-use';
    const isCleaning = st.status === 'cleaning';
    const meta = getPlatformMeta(st.type);
    const PlatformIcon = meta.icon;

    return (
      <motion.div
        key={st.id}
        whileHover={{ y: -3, transition: { duration: 0.15 } }}
        className={`relative rounded-2xl ${meta.cardBg} border-2 ${meta.border} transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
      >
        {/* Cyber Neon Corner Brackets */}
        <div className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 ${meta.brackets} pointer-events-none z-10`} />
        <div className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 ${meta.brackets} pointer-events-none z-10`} />
        <div className={`absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 ${meta.brackets} pointer-events-none z-10`} />
        <div className={`absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 ${meta.brackets} pointer-events-none z-10`} />

        {/* Top Accent Strip with Platform Gradient */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${meta.accent}`} />

        <div className="p-3.5 sm:p-4 space-y-3 relative z-0">
          {/* 1. Header: Platform Icon + Station Name + ID Badge + Status Badge */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => {
                  const types: StationType[] = ['VIP_SIM', 'XBOX', 'PS5', 'PC'];
                  const nextType = types[(types.indexOf(st.type) + 1) % types.length];
                  onUpdateStation({ ...st, type: nextType });
                }}
                title="انقر لتبديل المنصة (محاكي / إكس بوكس / بلايستيشن / PC)"
                className={`w-12 h-12 rounded-xl ${meta.bg} border-2 ${meta.border} flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs group/pod relative`}
              >
                <PlatformIcon className={`w-6 h-6 ${meta.color} group-hover:scale-110 transition-transform`} />
              </button>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white truncate leading-tight font-gaming">
                  {st.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                  <span className="font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[10px] border border-slate-300 dark:border-slate-700">
                    #{st.id}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className={`font-black text-[11px] ${meta.accentText}`}>{meta.label}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              {getStatusBadge(st.status)}
            </div>
          </div>

          {/* 2. Specs Box */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 dark:text-white">
              <Cpu className={`w-3.5 h-3.5 ${meta.accentText} shrink-0`} />
              <span>المواصفات والعتاد:</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans line-clamp-2">
              {st.specs}
            </p>
          </div>

          {/* 3. Tariff Rate Display */}
          <div className="flex items-center justify-between py-0.5 px-0.5">
            <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-bold">
              <Clock className={`w-3.5 h-3.5 ${meta.accentText}`} />
              <span>سعر الساعة:</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`font-mono font-black text-base sm:text-lg ${meta.accentText} font-mono-digits`}>
                {formatCurrency(st.hourlyRate)}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                / ساعة
              </span>
            </div>
          </div>

          {/* 4. Quick Mode Switcher */}
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              تغيير حالة الجهاز السريعة:
            </span>
            <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => handleQuickStatusChange(st, 'available')}
                className={`py-1 px-1.5 rounded-md text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  st.status === 'available'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>متاح</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickStatusChange(st, 'cleaning')}
                className={`py-1 px-1.5 rounded-md text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  st.status === 'cleaning'
                    ? 'bg-teal-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>تنظيف</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickStatusChange(st, 'maintenance')}
                className={`py-1 px-1.5 rounded-md text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  st.status === 'maintenance'
                    ? 'bg-rose-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <Wrench className="w-3 h-3" />
                <span>صيانة</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. Bottom Action Deck & Utility Links */}
        <div className="p-3.5 sm:p-4 pt-0 space-y-2 relative z-0">
          {/* Main Action Launcher */}
          {isAvailable ? (
            <button
              type="button"
              onClick={() => onStartSessionForStation(st)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r ${meta.buttonGrad} transition flex items-center justify-center gap-1.5 cursor-pointer font-gaming tracking-wide`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>بدء جلسة لعب جديدة</span>
            </button>
          ) : isInUse ? (
            <div className="w-full py-2 px-3 rounded-xl text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80 flex items-center justify-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span>الجهاز قيد الاستخدام حالياً</span>
            </div>
          ) : (
            <div className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>غير متاح ({isCleaning ? 'تنظيف' : 'صيانة'})</span>
            </div>
          )}

          {/* Secondary Utility Links: Edit & Delete */}
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => setEditingStation(st)}
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition py-0.5 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="تعديل المواصفات وسعر الساعة"
            >
              <Edit3 className="w-3 h-3" />
              <span>تعديل المواصفات</span>
            </button>

            <button
              type="button"
              onClick={() => onDeleteStation(st.id)}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-bold transition py-0.5 px-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer active:scale-95"
              title="حذف المحطة"
            >
              <Trash2 className="w-3 h-3" />
              <span>حذف المحطة</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Platform ordering in esports priority: Simulator (Orange) -> Xbox (Green) -> PS5 (Blue) -> PC (Cyan)
  const platformOrder: StationType[] = ['VIP_SIM', 'XBOX', 'PS5', 'PC'];

  return (
    <div id="station-management-root" className="space-y-6">
      
      {/* Top Gaming Command & Category Deck */}
      <div className="space-y-3.5">
        
        {/* 1. Upper Action Bar: Search Console & View Mode & Add Station CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200/90 dark:border-slate-800 shadow-xs">
          {/* Tactical Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-500 dark:text-emerald-400 absolute right-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم الجهاز، كود المحطة (#01)، أو المواصفات (RTX, 240Hz)..."
              className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all shadow-inner"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute left-3 top-2.5 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 flex-wrap">
            {/* View Mode Toggle: Grouped vs Grid */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setViewLayout('grouped')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  viewLayout === 'grouped'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="عرض مقسم حسب فئات المنصات"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="hidden md:inline">مقسم بالفئات</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  viewLayout === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="عرض شبكي موحد"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">شبكة موحدة</span>
              </button>
            </div>

            {/* Glowing Add Station CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm shadow-emerald-500/25 border border-emerald-400/30 transition-all cursor-pointer font-gaming shrink-0"
              title="إضافة جهاز أو منصة ألعاب جديدة للمنظومة"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة محطة</span>
            </motion.button>
          </div>
        </div>

        {/* 2. Interactive 5-Category Platform Deck: Orange for SIM, Green for XBOX, Blue for PS5, Cyan for PC */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {[
            {
              id: 'all',
              title: 'جميع المنصات',
              icon: Layers,
              count: countForType('all'),
              idleClass: 'bg-white dark:bg-emerald-950/20 border-emerald-200/90 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:shadow-md hover:shadow-emerald-500/15 text-slate-800 dark:text-emerald-100',
              activeClass: 'border-emerald-500 dark:border-emerald-400 bg-gradient-to-b from-emerald-50 via-emerald-100/60 to-white dark:from-emerald-500/20 dark:via-emerald-950/50 dark:to-slate-950 text-emerald-950 dark:text-white shadow-md dark:shadow-lg shadow-emerald-500/20 dark:shadow-emerald-500/25 scale-[1.02] border-2',
              iconBoxIdle: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
              iconBoxActive: 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black shadow-xs dark:shadow-[0_0_12px_#10b981]',
              laserAccent: 'from-emerald-400 to-teal-400',
              badgeIdle: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 font-bold',
              badgeActive: 'bg-emerald-600 dark:bg-emerald-500/30 text-white dark:text-emerald-200 border-emerald-600 dark:border-emerald-400/60 font-black shadow-xs',
              beaconColor: 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#10b981]',
            },
            {
              id: 'VIP_SIM',
              title: 'محاكي قيادة VIP',
              icon: VipSimulatorIcon,
              count: countForType('VIP_SIM'),
              // Distinct Pure Neon Orange Theme as requested by user
              idleClass: 'bg-white dark:bg-orange-950/20 border-orange-200/90 dark:border-orange-500/30 hover:border-orange-400 dark:hover:border-orange-500/60 hover:shadow-md hover:shadow-orange-500/20 text-slate-800 dark:text-orange-100',
              activeClass: 'border-orange-500 dark:border-orange-400 bg-gradient-to-b from-orange-50 via-orange-100/60 to-white dark:from-orange-500/20 dark:via-orange-950/50 dark:to-slate-950 text-orange-950 dark:text-white shadow-md dark:shadow-lg shadow-orange-500/25 scale-[1.02] border-2',
              iconBoxIdle: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400',
              iconBoxActive: 'bg-orange-600 dark:bg-orange-500 text-white shadow-xs dark:shadow-[0_0_12px_#f97316]',
              laserAccent: 'from-orange-500 via-amber-400 to-red-500',
              badgeIdle: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/30 font-bold',
              badgeActive: 'bg-orange-600 dark:bg-orange-500/30 text-white dark:text-orange-200 border-orange-600 dark:border-orange-400/60 font-black shadow-xs',
              beaconColor: 'bg-orange-500 dark:bg-orange-400 shadow-[0_0_8px_#f97316]',
            },
            {
              id: 'XBOX',
              title: 'Xbox Series X',
              icon: XboxIcon,
              count: countForType('XBOX'),
              // Distinct Pure Xbox Laser Green Theme as requested by user
              idleClass: 'bg-white dark:bg-green-950/20 border-green-200/90 dark:border-green-500/30 hover:border-green-400 dark:hover:border-green-500/60 hover:shadow-md hover:shadow-green-500/20 text-slate-800 dark:text-green-100',
              activeClass: 'border-green-500 dark:border-green-400 bg-gradient-to-b from-green-50 via-green-100/60 to-white dark:from-green-500/20 dark:via-green-950/50 dark:to-slate-950 text-green-950 dark:text-white shadow-md dark:shadow-lg shadow-green-500/25 scale-[1.02] border-2',
              iconBoxIdle: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400',
              iconBoxActive: 'bg-green-600 dark:bg-green-500 text-white shadow-xs dark:shadow-[0_0_12px_#22c55e]',
              laserAccent: 'from-green-400 to-emerald-400',
              badgeIdle: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/30 font-bold',
              badgeActive: 'bg-green-600 dark:bg-green-500/30 text-white dark:text-green-200 border-green-600 dark:border-green-400/60 font-black shadow-xs',
              beaconColor: 'bg-green-500 dark:bg-green-400 shadow-[0_0_8px_#22c55e]',
            },
            {
              id: 'PS5',
              title: 'PlayStation 5',
              icon: PlaystationIcon,
              count: countForType('PS5'),
              idleClass: 'bg-white dark:bg-blue-950/20 border-blue-200/90 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/60 hover:shadow-md hover:shadow-blue-500/20 text-slate-800 dark:text-blue-100',
              activeClass: 'border-blue-500 dark:border-blue-400 bg-gradient-to-b from-blue-50 via-blue-100/60 to-white dark:from-blue-500/20 dark:via-blue-950/50 dark:to-slate-950 text-blue-950 dark:text-white shadow-md dark:shadow-lg shadow-blue-500/25 scale-[1.02] border-2',
              iconBoxIdle: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
              iconBoxActive: 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs dark:shadow-[0_0_12px_#3b82f6]',
              laserAccent: 'from-blue-400 via-indigo-500 to-violet-500',
              badgeIdle: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 font-bold',
              badgeActive: 'bg-blue-600 dark:bg-blue-500/30 text-white dark:text-blue-200 border-blue-600 dark:border-blue-400/60 font-black shadow-xs',
              beaconColor: 'bg-blue-500 dark:bg-blue-400 shadow-[0_0_8px_#3b82f6]',
            },
            {
              id: 'PC',
              title: 'حواسيب PC',
              icon: Monitor,
              count: countForType('PC'),
              idleClass: 'bg-white dark:bg-cyan-950/20 border-cyan-200/90 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:shadow-md hover:shadow-cyan-500/20 text-slate-800 dark:text-cyan-100',
              activeClass: 'border-cyan-500 dark:border-cyan-400 bg-gradient-to-b from-cyan-50 via-cyan-100/60 to-white dark:from-cyan-500/20 dark:via-cyan-950/50 dark:to-slate-950 text-cyan-950 dark:text-white shadow-md dark:shadow-lg shadow-cyan-500/25 scale-[1.02] border-2',
              iconBoxIdle: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
              iconBoxActive: 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black shadow-xs dark:shadow-[0_0_12px_#06b6d4]',
              laserAccent: 'from-cyan-400 to-blue-400',
              badgeIdle: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30 font-bold',
              badgeActive: 'bg-cyan-600 dark:bg-cyan-500/30 text-white dark:text-cyan-200 border-cyan-600 dark:border-cyan-400/60 font-black shadow-xs',
              beaconColor: 'bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_#06b6d4]',
            },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = filterType === cat.id;

            return (
              <motion.button
                key={cat.id}
                type="button"
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFilterType(cat.id as any)}
                className={`relative p-3.5 rounded-2xl border text-right transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[102px] group ${
                  isActive ? cat.activeClass : cat.idleClass
                }`}
              >
                {/* Top Subtle Gradient Light Glow */}
                <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${cat.laserAccent} ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} transition-opacity`} />

                {/* Top Deck: Icon & Count Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 group-hover:scale-110 ${
                    isActive ? cat.iconBoxActive : cat.iconBoxIdle
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md border tracking-wider transition-all duration-200 ${
                    isActive ? cat.badgeActive : cat.badgeIdle
                  }`}>
                    {cat.count} جهاز
                  </span>
                </div>

                {/* Bottom Deck: Category Name */}
                <div>
                  <h3 className="text-xs sm:text-sm font-black font-gaming tracking-wide truncate text-slate-900 dark:text-white">
                    {cat.title}
                  </h3>
                </div>

                {/* Active Diamond Beacon */}
                {isActive && (
                  <div className="absolute top-2 left-2">
                    <span className={`w-1.5 h-1.5 rounded-[1px] rotate-45 animate-pulse block ${cat.beaconColor}`} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

      </div>

      {/* Main Stations Display Area: Either Grouped by Category or Uniform Grid */}
      {filteredStations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <GamingPcIcon className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-black text-slate-800 dark:text-slate-200 font-gaming">لا توجد محطات مطابقة للبحث</h3>
          <p className="text-xs text-slate-500">جرب تعديل كلمة البحث أو تبديل تصنيف المنصة من القائمة أعلاه</p>
        </div>
      ) : filterType === 'all' && viewLayout === 'grouped' ? (
        /* Categorized Platform Sections View */
        <div className="space-y-8">
          {platformOrder.map((pType) => {
            const stationsOfType = filteredStations.filter((s) => s.type === pType);
            if (stationsOfType.length === 0) return null;
            const meta = getPlatformMeta(pType);
            const PlatformIcon = meta.icon;
            const availableInType = stationsOfType.filter(s => s.status === 'available').length;

            return (
              <div key={pType} className="space-y-4">
                {/* Platform Header Banner */}
                <div className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r ${meta.headerGlow} bg-white dark:bg-slate-950/80 border ${meta.headerBorder} shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden backdrop-blur-md`}>
                  {/* Subtle Top Strip */}
                  <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${meta.accent}`} />

                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${meta.bg} border-2 ${meta.border} flex items-center justify-center shrink-0 shadow-xs`}>
                      <PlatformIcon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm sm:text-base font-black font-gaming text-slate-900 dark:text-white tracking-wide truncate">
                          {meta.categoryTitle}
                        </h2>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black font-mono-digits ${meta.badge}`}>
                          {stationsOfType.length} محطات
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1">
                        {meta.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right Status Counter for this section */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto text-xs font-mono font-bold">
                    <span className="text-slate-500 dark:text-slate-400">الجاهزية:</span>
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black font-mono-digits ${meta.badge} flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${availableInType > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      {availableInType} شاغر للعب
                    </span>
                  </div>
                </div>

                {/* Grid of Stations in this platform */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {stationsOfType.map((st) => renderStationCard(st))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Uniform Grid View (Filtered to single category or flat grid) */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStations.map((st) => renderStationCard(st))}
        </div>
      )}

      {/* Add Station Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 font-gaming">
                  <GamingPcIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>إضافة محطة ألعاب جديدة للمنظومة</span>
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم أو رقم المحطة:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محاكي السباق SIM-03 أو إكس بوكس XBOX-02"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">فئة المنصة:</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as StationType)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none font-bold"
                    >
                      <option value="VIP_SIM">🏎️ محاكي قيادة وسياقة VIP (برتقالي)</option>
                      <option value="XBOX">🎮 إكسبوکس سيريز X (أخضر)</option>
                      <option value="PS5">🕹️ بلايستيشن 5 PS5 (أزرق)</option>
                      <option value="PC">🖥️ کمبيوتر ألعاب PC (سيان)</option>
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
                    placeholder="مقصورة هيدروليكية، شاشة 49 انش منحنية، عجلة قيادة فاناتيك، بدالات ألمنيوم..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-105 shadow-md shadow-emerald-500/25 font-gaming cursor-pointer"
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
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 font-gaming">
                  <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>تعديل المحطة: {editingStation.name}</span>
                </h3>
                <button
                  onClick={() => setEditingStation(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المنصة:</label>
                    <select
                      value={editingStation.type}
                      onChange={(e) => setEditingStation({ ...editingStation, type: e.target.value as StationType })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none font-bold"
                    >
                      <option value="VIP_SIM">🏎️ محاكي قيادة وسياقة VIP (برتقالي)</option>
                      <option value="XBOX">🎮 إكسبوکس سيريز X (أخضر)</option>
                      <option value="PS5">🕹️ بلايستيشن 5 PS5 (أزرق)</option>
                      <option value="PC">🖥️ کمبيوتر ألعاب PC (سيان)</option>
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
                    className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-105 shadow-md shadow-emerald-500/25 flex items-center gap-1.5 font-gaming cursor-pointer"
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
