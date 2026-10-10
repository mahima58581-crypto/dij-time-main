import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TariffRate, StationType } from '../types';
import { formatCurrency } from '../utils/formatters';
import { XboxIcon } from './XboxIcon';
import { PlaystationIcon } from './PlaystationIcon';
import { VipSimulatorIcon } from './VipSimulatorIcon';
import { Badge, Box, Brackets, Calculator, Clock, Command, Delete, Diamond, DollarSign, Edit, Edit3, Filter, Flame, Grid, Layers, LayoutGrid, ListFilter, Monitor, Plus, Save, Sparkles, Tag, Trash2, View, Wifi, X } from 'lucide-react';

interface TariffsManagerProps {
  tariffs: TariffRate[];
  onAddTariff: (tariff: Omit<TariffRate, 'id'>) => void;
  onUpdateTariff: (tariff: TariffRate) => void;
  onDeleteTariff: (tariffId: string) => void;
}

// 1. Unified Platform Color & Esports Theme Definition for Tariffs
const getTariffMeta = (platform: StationType | 'ALL', isPackage?: boolean) => {
  if (isPackage) {
    return {
      label: 'باقة خاصة VIP',
      categoryTitle: '✨ الباقات والعروض الخاصة (Special Packages)',
      desc: 'باقات مخصصة بعدد ساعات محددة مع هدايا مشروبات ووجبات خفيفة بأسعار تفضيلية',
      icon: Sparkles,
      color: 'text-amber-500 dark:text-amber-400',
      colorHex: '#f59e0b',
      bg: 'bg-amber-500/10 dark:bg-amber-950/60',
      cardBg: 'bg-white dark:bg-[#140e02]',
      border: 'border-amber-300/80 dark:border-amber-500/40 hover:border-amber-500 dark:hover:border-amber-400 shadow-sm hover:shadow-lg hover:shadow-amber-500/25',
      badge: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-600/70',
      accent: 'from-amber-400 via-orange-400 to-yellow-500',
      accentText: 'text-amber-600 dark:text-amber-400',
      brackets: 'border-amber-500/70 dark:border-amber-400/80',
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.22)]',
      headerGlow: 'from-amber-500/15 via-orange-500/5 to-transparent',
      headerBorder: 'border-amber-500/40 dark:border-amber-500/50',
    };
  }

  switch (platform) {
    case 'VIP_SIM':
      return {
        label: 'محاكي قيادة VIP',
        categoryTitle: '🏎️ تعرفات محاكيات القيادة الاحترافية (Simulator)',
        desc: 'أسعار مقصورات السباق الواقعية مع عجلات قيادة هيدروليكية وشاشات بانورامية',
        icon: VipSimulatorIcon,
        color: 'text-orange-500 dark:text-orange-400',
        colorHex: '#f97316',
        bg: 'bg-orange-500/10 dark:bg-orange-950/60',
        cardBg: 'bg-white dark:bg-[#120803]',
        border: 'border-orange-300/80 dark:border-orange-500/40 hover:border-orange-500 dark:hover:border-orange-400 shadow-sm hover:shadow-lg hover:shadow-orange-500/25',
        badge: 'bg-orange-50 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600/70',
        accent: 'from-orange-500 via-amber-400 to-red-500',
        accentText: 'text-orange-600 dark:text-orange-400',
        brackets: 'border-orange-500/70 dark:border-orange-400/80',
        glow: 'shadow-[0_0_24px_rgba(249,115,22,0.22)]',
        headerGlow: 'from-orange-500/15 via-orange-500/5 to-transparent',
        headerBorder: 'border-orange-500/40 dark:border-orange-500/50',
      };
    case 'XBOX':
      return {
        label: 'إكس بوكس سيريز X',
        categoryTitle: '🎮 تعرفات منصات إكس بوكس (Xbox Series X)',
        desc: 'أسعار ساعات اللعب على أقوى أجهزة مايكروسوفت بمعدل 120 إطار وGame Pass',
        icon: XboxIcon,
        color: 'text-green-500 dark:text-green-400',
        colorHex: '#22c55e',
        bg: 'bg-green-500/10 dark:bg-green-950/60',
        cardBg: 'bg-white dark:bg-[#031206]',
        border: 'border-green-300/80 dark:border-green-500/40 hover:border-green-500 dark:hover:border-green-400 shadow-sm hover:shadow-lg hover:shadow-green-500/25',
        badge: 'bg-green-50 dark:bg-green-950/80 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600/70',
        accent: 'from-green-500 via-emerald-400 to-lime-400',
        accentText: 'text-green-600 dark:text-green-400',
        brackets: 'border-green-500/70 dark:border-green-400/80',
        glow: 'shadow-[0_0_24px_rgba(34,197,94,0.22)]',
        headerGlow: 'from-green-500/15 via-green-500/5 to-transparent',
        headerBorder: 'border-green-500/40 dark:border-green-500/50',
      };
    case 'PS5':
      return {
        label: 'بلايستيشن 5 (PS5)',
        categoryTitle: '🕹️ تعرفات منصات بلايستيشن 5 (PlayStation 5)',
        desc: 'أسعار ساعات اللعب الفردية والجماعية على منصات سوني الرسمية وشاشات 4K',
        icon: PlaystationIcon,
        color: 'text-blue-500 dark:text-blue-400',
        colorHex: '#3b82f6',
        bg: 'bg-blue-500/10 dark:bg-blue-950/60',
        cardBg: 'bg-white dark:bg-[#040916]',
        border: 'border-blue-300/80 dark:border-blue-500/40 hover:border-blue-500 dark:hover:border-blue-400 shadow-sm hover:shadow-lg hover:shadow-blue-500/25',
        badge: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600/70',
        accent: 'from-blue-600 via-indigo-500 to-sky-400',
        accentText: 'text-blue-600 dark:text-blue-400',
        brackets: 'border-blue-500/70 dark:border-blue-400/80',
        glow: 'shadow-[0_0_24px_rgba(59,130,246,0.22)]',
        headerGlow: 'from-blue-500/15 via-blue-500/5 to-transparent',
        headerBorder: 'border-blue-500/40 dark:border-blue-500/50',
      };
    case 'PC':
      return {
        label: 'حاسوب ألعاب PC',
        categoryTitle: '🖥️ تعرفات حواسيب الألعاب الاحترافية (Gaming PC)',
        desc: 'أسعار اللعب على أجهزة RTX 4080 وشاشات 240Hz وملحقات احترافية فائقة السرعة',
        icon: Monitor,
        color: 'text-cyan-500 dark:text-cyan-400',
        colorHex: '#06b6d4',
        bg: 'bg-cyan-500/10 dark:bg-cyan-950/60',
        cardBg: 'bg-white dark:bg-[#030e14]',
        border: 'border-cyan-300/80 dark:border-cyan-500/40 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-sm hover:shadow-lg hover:shadow-cyan-500/25',
        badge: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-600/70',
        accent: 'from-cyan-500 via-teal-400 to-blue-500',
        accentText: 'text-cyan-600 dark:text-cyan-400',
        brackets: 'border-cyan-500/70 dark:border-cyan-400/80',
        glow: 'shadow-[0_0_24px_rgba(6,182,212,0.22)]',
        headerGlow: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
        headerBorder: 'border-cyan-500/40 dark:border-cyan-500/50',
      };
    case 'ALL':
    default:
      return {
        label: 'كافة المنصات',
        categoryTitle: '🌐 تعرفات عامة لكافة المنصات (General Tariffs)',
        desc: 'تعرفات موحدة تنطبق على مختلف أجهزة الصالة',
        icon: Layers,
        color: 'text-emerald-500 dark:text-emerald-400',
        colorHex: '#10b981',
        bg: 'bg-emerald-500/10 dark:bg-emerald-950/60',
        cardBg: 'bg-white dark:bg-[#03100a]',
        border: 'border-emerald-300/80 dark:border-emerald-500/40 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-sm hover:shadow-lg hover:shadow-emerald-500/25',
        badge: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/70',
        accent: 'from-emerald-500 via-teal-400 to-cyan-500',
        accentText: 'text-emerald-600 dark:text-emerald-400',
        brackets: 'border-emerald-500/70 dark:border-emerald-400/80',
        glow: 'shadow-[0_0_24px_rgba(16,185,129,0.22)]',
        headerGlow: 'from-emerald-500/15 via-teal-500/5 to-transparent',
        headerBorder: 'border-emerald-500/40 dark:border-emerald-500/50',
      };
  }
};

export const TariffsManager: React.FC<TariffsManagerProps> = ({
  tariffs,
  onAddTariff,
  onUpdateTariff,
  onDeleteTariff,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | StationType | 'packages'>('all');
  const [viewLayout, setViewLayout] = useState<'grouped' | 'grid'>('grouped');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState<TariffRate | null>(null);

  // Quick Calculator State
  const [calcPlatform, setCalcPlatform] = useState<StationType>('XBOX');
  const [calcHours, setCalcHours] = useState<number>(2);
  const [calcMinutes, setCalcMinutes] = useState<number>(0);
  const [calcCustomRate, setCalcCustomRate] = useState<string>('');
  const [calcIsPeak, setCalcIsPeak] = useState<boolean>(false);
  const [calcIsOnline, setCalcIsOnline] = useState<boolean>(true);

  // New Tariff Form
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<StationType | 'ALL'>('XBOX');
  const [baseHourlyRate, setBaseHourlyRate] = useState<number>(5000);
  const [peakMultiplier, setPeakMultiplier] = useState<number>(1.2);
  const [onlineGameMultiplier, setOnlineGameMultiplier] = useState<number>(1.1);
  const [minPlayMinutes, setMinPlayMinutes] = useState<number>(30);
  const [isPackage, setIsPackage] = useState(false);
  const [packageHours, setPackageHours] = useState<number>(2);
  const [packagePrice, setPackagePrice] = useState<number>(12000);
  const [packageDescription, setPackageDescription] = useState('');

  // Calculate simulated rate — حالت سعری دستی (خودت بنویس) یا از تعرفه
  const matchedTariff = tariffs.find((t) => !t.isPackage && (t.platform === calcPlatform || t.platform === 'ALL')) || tariffs[0];
  const customRateNum = parseFloat(calcCustomRate);
  const isCustomRate = calcCustomRate.trim() !== '' && !isNaN(customRateNum) && customRateNum > 0;
  const totalCalcHours = calcHours + calcMinutes / 60;
  const totalCalcMinutes = Math.round(totalCalcHours * 60);
  let calculatedSimPrice = 0;
  if (isCustomRate) {
    // قیمت دستی کاربر × ساعت‌ها و دقایق
    let rate = customRateNum;
    if (calcIsPeak) rate *= 1.25;
    if (calcIsOnline) rate *= 1.1;
    calculatedSimPrice = Math.round(rate * totalCalcHours);
  } else if (matchedTariff) {
    let rate = matchedTariff.baseHourlyRate;
    if (calcIsPeak) rate *= (matchedTariff.peakMultiplier || 1);
    if (calcIsOnline) rate *= (matchedTariff.onlineGameMultiplier || 1);
    calculatedSimPrice = Math.round(rate * totalCalcHours);
  }

  // Filter tariffs based on selected category pill
  const filteredTariffs = tariffs.filter((t) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'packages') return t.isPackage;
    return !t.isPackage && (t.platform === filterCategory || t.platform === 'ALL');
  });

  const countForCategory = (cat: 'all' | StationType | 'packages') => {
    if (cat === 'all') return tariffs.length;
    if (cat === 'packages') return tariffs.filter((t) => t.isPackage).length;
    return tariffs.filter((t) => !t.isPackage && (t.platform === cat || t.platform === 'ALL')).length;
  };

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

  // Render Single Tariff Card with Cyber Styling
  const renderTariffCard = (t: TariffRate) => {
    const meta = getTariffMeta(t.platform, t.isPackage);
    const PlatformIcon = meta.icon;

    return (
      <motion.div
        key={t.id}
        whileHover={{ y: -3, transition: { duration: 0.15 } }}
        className={`relative p-5 rounded-2xl ${meta.cardBg} border-2 ${meta.border} transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:${meta.glow} group`}
      >
        {/* Cyber Neon Corner Brackets */}
        <div className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 ${meta.brackets} pointer-events-none z-10`} />
        <div className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 ${meta.brackets} pointer-events-none z-10`} />
        <div className={`absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 ${meta.brackets} pointer-events-none z-10`} />
        <div className={`absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 ${meta.brackets} pointer-events-none z-10`} />

        {/* Top Accent Strip */}
        <div className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r ${meta.accent}`} />

        <div className="space-y-4 pt-1">
          {/* Card Top: Platform Icon + Title + Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-11 h-11 rounded-xl ${meta.bg} border-2 ${meta.border} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                <PlatformIcon className={`w-6 h-6 ${meta.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate font-gaming">
                  {t.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                  <span className={`font-black font-mono ${meta.accentText}`}>
                    {t.isPackage ? 'باقة خاصة' : meta.label}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono font-bold text-[10px]">
                    الحد الأدنى: {t.minPlayMinutes} دقيقة
                  </span>
                </div>
              </div>
            </div>

            <span className={`px-2 py-0.5 text-[10px] font-black font-mono rounded-md shrink-0 border ${meta.badge}`}>
              {t.isPackage ? 'باقة VIP' : 'تعرفة ساعية'}
            </span>
          </div>

          {/* Description */}
          {t.packageDescription && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans line-clamp-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {t.packageDescription}
            </p>
          )}

          {/* Price & Multipliers Deck */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs font-mono font-mono-digits">
            {t.isPackage ? (
              <>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-bold">عدد ساعات الباقة:</span>
                  <span className="text-slate-900 dark:text-white font-black">{t.packageHours} ساعات متواصلة</span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold">السعر الإجمالي للباقة:</span>
                  <span className={`font-black text-base sm:text-lg ${meta.accentText}`}>
                    {formatCurrency(t.packagePrice || 0)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-bold">سعر الساعة الأساسي:</span>
                  <span className={`font-black text-sm sm:text-base ${meta.accentText}`}>
                    {formatCurrency(t.baseHourlyRate)} / س
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/80 dark:border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" />
                      <span>الذروة:</span>
                    </span>
                    <span className="text-slate-900 dark:text-white font-black">{t.peakMultiplier || 1.0}×</span>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-cyan-500" />
                      <span>أونلاين:</span>
                    </span>
                    <span className="text-slate-900 dark:text-white font-black">{t.onlineGameMultiplier || 1.0}×</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card Footer: Edit & Delete Buttons */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setEditingTariff(t)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="تعديل التعرفة"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل التعرفة</span>
          </button>

          <button
            type="button"
            onClick={() => onDeleteTariff(t.id)}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-bold transition py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer active:scale-95"
            title="حذف التعرفة"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف</span>
          </button>
        </div>
      </motion.div>
    );
  };

  const platformOrder: Array<StationType | 'packages'> = ['VIP_SIM', 'XBOX', 'PS5', 'PC', 'packages'];

  return (
    <div id="tariffs-manager-root" className="space-y-6">
      
      {/* 1. Header Banner & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <Tag className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black font-gaming text-slate-900 dark:text-white flex items-center gap-2">
              <span>إدارة التعرفات وباقات الأسعار الرسمية</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              ضبط أسعار الساعات، أوقات الذروة، اشتراكات الألعاب، وباقات الأصدقاء الترويجية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm shadow-emerald-500/25 border border-emerald-400/30 transition font-gaming cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة تعرفة جديدة</span>
          </motion.button>
        </div>
      </div>

      {/* 2. Interactive 6-Category Platform Deck with Official Logos (Xbox, PlayStation, Simulator, PC, Packages) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {[
          {
            id: 'all',
            title: 'جميع التعرفات',
            desc: 'كامل الأسعار والباقات',
            icon: Layers,
            count: countForCategory('all'),
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
            desc: 'سباقات واقعية (برتقالي)',
            icon: VipSimulatorIcon,
            count: countForCategory('VIP_SIM'),
            // Neon Orange Theme
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
            desc: 'لوجو إكس بوكس (أخضر)',
            icon: XboxIcon, // Official Xbox Logo
            count: countForCategory('XBOX'),
            // Xbox Green Theme
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
            desc: 'لوجو بلايستيشن (أزرق)',
            icon: PlaystationIcon, // Official PlayStation Logo
            count: countForCategory('PS5'),
            // PlayStation Blue Theme
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
            desc: 'عتاد فائق (سيان سايبر)',
            icon: Monitor,
            count: countForCategory('PC'),
            // Cyber Cyan Theme
            idleClass: 'bg-white dark:bg-cyan-950/20 border-cyan-200/90 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:shadow-md hover:shadow-cyan-500/20 text-slate-800 dark:text-cyan-100',
            activeClass: 'border-cyan-500 dark:border-cyan-400 bg-gradient-to-b from-cyan-50 via-cyan-100/60 to-white dark:from-cyan-500/20 dark:via-cyan-950/50 dark:to-slate-950 text-cyan-950 dark:text-white shadow-md dark:shadow-lg shadow-cyan-500/25 scale-[1.02] border-2',
            iconBoxIdle: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
            iconBoxActive: 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black shadow-xs dark:shadow-[0_0_12px_#06b6d4]',
            laserAccent: 'from-cyan-400 to-blue-400',
            badgeIdle: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30 font-bold',
            badgeActive: 'bg-cyan-600 dark:bg-cyan-500/30 text-white dark:text-cyan-200 border-cyan-600 dark:border-cyan-400/60 font-black shadow-xs',
            beaconColor: 'bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_#06b6d4]',
          },
          {
            id: 'packages',
            title: 'الباقات والعروض',
            desc: 'ساعات وهدايا VIP (ذهبي)',
            icon: Sparkles,
            count: countForCategory('packages'),
            // Amber / Gold Theme
            idleClass: 'bg-white dark:bg-amber-950/20 border-amber-200/90 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-500/60 hover:shadow-md hover:shadow-amber-500/20 text-slate-800 dark:text-amber-100',
            activeClass: 'border-amber-500 dark:border-amber-400 bg-gradient-to-b from-amber-50 via-amber-100/60 to-white dark:from-amber-500/20 dark:via-amber-950/50 dark:to-slate-950 text-amber-950 dark:text-white shadow-md dark:shadow-lg shadow-amber-500/25 scale-[1.02] border-2',
            iconBoxIdle: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400',
            iconBoxActive: 'bg-amber-600 dark:bg-amber-500 text-white shadow-xs dark:shadow-[0_0_12px_#f59e0b]',
            laserAccent: 'from-amber-400 to-yellow-400',
            badgeIdle: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30 font-bold',
            badgeActive: 'bg-amber-600 dark:bg-amber-500/30 text-white dark:text-amber-200 border-amber-600 dark:border-amber-400/60 font-black shadow-xs',
            beaconColor: 'bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_#f59e0b]',
          },
        ].map((cat) => {
          const Icon = cat.icon;
          const isActive = filterCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              type="button"
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilterCategory(cat.id as any)}
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
                  {cat.count}
                </span>
              </div>

              {/* Bottom Deck: Category Name & Subtitle */}
              <div>
                <h3 className="text-xs sm:text-sm font-black font-gaming tracking-wide truncate text-slate-900 dark:text-white">
                  {cat.title}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  {cat.desc}
                </p>
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

      {/* 3. Ultra-Epic Interactive Gaming Controller Deck & Tactical Price Simulator */}
      <div className={`p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#080d19] border-2 transition-all duration-300 shadow-md relative overflow-hidden ${
        calcPlatform === 'XBOX' 
          ? 'border-green-500/50 shadow-green-500/15' 
          : calcPlatform === 'PS5'
          ? 'border-blue-500/50 shadow-blue-500/15'
          : calcPlatform === 'VIP_SIM'
          ? 'border-orange-500/50 shadow-orange-500/15'
          : 'border-cyan-500/50 shadow-cyan-500/15'
      }`}>
        {/* Dynamic Laser Strip matching selected Controller */}
        <div className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r ${
          calcPlatform === 'XBOX' 
            ? 'from-green-500 via-emerald-400 to-lime-400' 
            : calcPlatform === 'PS5'
            ? 'from-blue-600 via-indigo-500 to-sky-400'
            : calcPlatform === 'VIP_SIM'
            ? 'from-orange-500 via-amber-400 to-red-500'
            : 'from-cyan-500 via-teal-400 to-blue-500'
        }`} />

        {/* Header of Simulator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-all ${
              calcPlatform === 'XBOX' 
                ? 'bg-gradient-to-tr from-green-600 to-emerald-500 shadow-green-500/30' 
                : calcPlatform === 'PS5'
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-500/30'
                : calcPlatform === 'VIP_SIM'
                ? 'bg-gradient-to-tr from-orange-600 to-amber-500 shadow-orange-500/30'
                : 'bg-gradient-to-tr from-cyan-600 to-teal-500 shadow-cyan-500/30'
            }`}>
              <Calculator className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-gaming text-slate-900 dark:text-white tracking-wide">
                  شبیه‌ساز و حاسبة أسعار اللعب التفاعلية
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  LIVE HUD
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                اختر نوع اليد / الجهاز لمعاينة الأسعار الفورية، معاملات الذروة، واشتراكات الألعاب
              </p>
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            المنصة النشطة: <span className={`font-black font-gaming text-sm ${
              calcPlatform === 'XBOX' ? 'text-green-600 dark:text-green-400' :
              calcPlatform === 'PS5' ? 'text-blue-600 dark:text-blue-400' :
              calcPlatform === 'VIP_SIM' ? 'text-orange-600 dark:text-orange-400' :
              'text-cyan-600 dark:text-cyan-400'
            }`}>
              {calcPlatform === 'XBOX' ? 'Xbox Series X' : calcPlatform === 'PS5' ? 'PlayStation 5' : calcPlatform === 'VIP_SIM' ? 'Simulator VIP' : 'Gaming PC'}
            </span>
          </div>
        </div>

        {/* 1. The 4 Badass Controller Command Pods (دسته‌های بازی فوق‌العاده با رنگ و لوگوی اختصاصی) */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-gaming">
            <span>اختر نوع اليد أو المنصة:</span>
            <span className="text-[10px] text-slate-400 font-normal font-sans">(انقر لتفعيل المنصة)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                type: 'XBOX',
                title: 'Xbox Series X',
                subtitle: 'دسته بازی بی‌سیم رسمی مايكروسوفت',
                baseRate: 5000,
                icon: XboxIcon, // Official Xbox Logo
                activeTheme: 'border-green-500 bg-gradient-to-b from-green-50 via-green-100/60 to-white dark:from-green-500/25 dark:via-green-950/60 dark:to-slate-950 text-slate-900 dark:text-white shadow-lg shadow-green-500/30 scale-[1.03] border-2',
                idleTheme: 'bg-white dark:bg-green-950/20 border-green-300/80 dark:border-green-500/30 hover:border-green-400 dark:hover:border-green-400/80 hover:shadow-md hover:shadow-green-500/20 text-slate-800 dark:text-green-100',
                iconBoxActive: 'bg-green-600 dark:bg-green-500 text-white dark:text-black shadow-md shadow-green-500/40 ring-4 ring-green-500/20',
                iconBoxIdle: 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400',
                accentText: 'text-green-600 dark:text-green-400',
                laserAccent: 'from-green-400 to-emerald-400',
                beaconColor: 'bg-green-500 dark:bg-green-400 shadow-[0_0_10px_#22c55e]',
                badgeClass: 'bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700',
              },
              {
                type: 'PS5',
                title: 'PlayStation 5',
                subtitle: 'دسته بازی بی‌سیم DualSense سوني',
                baseRate: 6000,
                icon: PlaystationIcon, // Official PlayStation Logo
                activeTheme: 'border-blue-500 bg-gradient-to-b from-blue-50 via-blue-100/60 to-white dark:from-blue-500/25 dark:via-blue-950/60 dark:to-slate-950 text-slate-900 dark:text-white shadow-lg shadow-blue-500/30 scale-[1.03] border-2',
                idleTheme: 'bg-white dark:bg-blue-950/20 border-blue-300/80 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400/80 hover:shadow-md hover:shadow-blue-500/20 text-slate-800 dark:text-blue-100',
                iconBoxActive: 'bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-500/40 ring-4 ring-blue-500/20',
                iconBoxIdle: 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
                accentText: 'text-blue-600 dark:text-blue-400',
                laserAccent: 'from-blue-400 to-indigo-500',
                beaconColor: 'bg-blue-500 dark:bg-blue-400 shadow-[0_0_10px_#3b82f6]',
                badgeClass: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
              },
              {
                type: 'VIP_SIM',
                title: 'محاكي قيادة VIP',
                subtitle: 'فرمان مسابقه‌ای Moza و پدال هیدرولیک',
                baseRate: 12000,
                icon: VipSimulatorIcon,
                activeTheme: 'border-orange-500 bg-gradient-to-b from-orange-50 via-orange-100/60 to-white dark:from-orange-500/25 dark:via-orange-950/60 dark:to-slate-950 text-slate-900 dark:text-white shadow-lg shadow-orange-500/30 scale-[1.03] border-2',
                idleTheme: 'bg-white dark:bg-orange-950/20 border-orange-300/80 dark:border-orange-500/30 hover:border-orange-400 dark:hover:border-orange-400/80 hover:shadow-md hover:shadow-orange-500/20 text-slate-800 dark:text-orange-100',
                iconBoxActive: 'bg-orange-600 dark:bg-orange-500 text-white shadow-md shadow-orange-500/40 ring-4 ring-orange-500/20',
                iconBoxIdle: 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400',
                accentText: 'text-orange-600 dark:text-orange-400',
                laserAccent: 'from-orange-500 to-amber-400',
                beaconColor: 'bg-orange-500 dark:bg-orange-400 shadow-[0_0_10px_#f97316]',
                badgeClass: 'bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700',
              },
              {
                type: 'PC',
                title: 'حاسوب ألعاب PC',
                subtitle: 'ماوس گیمینگ، کیبورد مکانیکال و هدست',
                baseRate: 4000,
                icon: Monitor,
                activeTheme: 'border-cyan-500 bg-gradient-to-b from-cyan-50 via-cyan-100/60 to-white dark:from-cyan-500/25 dark:via-cyan-950/60 dark:to-slate-950 text-slate-900 dark:text-white shadow-lg shadow-cyan-500/30 scale-[1.03] border-2',
                idleTheme: 'bg-white dark:bg-cyan-950/20 border-cyan-300/80 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-400/80 hover:shadow-md hover:shadow-cyan-500/20 text-slate-800 dark:text-cyan-100',
                iconBoxActive: 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black shadow-md shadow-cyan-500/40 ring-4 ring-cyan-500/20',
                iconBoxIdle: 'bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
                accentText: 'text-cyan-600 dark:text-cyan-400',
                laserAccent: 'from-cyan-400 to-teal-400',
                beaconColor: 'bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_10px_#06b6d4]',
                badgeClass: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
              },
            ].map((p) => {
              const Icon = p.icon;
              const isSelected = calcPlatform === p.type;

              return (
                <motion.button
                  key={p.type}
                  type="button"
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCalcPlatform(p.type as StationType)}
                  className={`relative p-4 rounded-2xl text-right transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[120px] group ${
                    isSelected ? p.activeTheme : p.idleTheme
                  }`}
                >
                  {/* Top Ambient Laser Light */}
                  <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${p.laserAccent} ${isSelected ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} />

                  {/* Corner Brackets on Active */}
                  {isSelected && (
                    <>
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-current opacity-80" />
                      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-current opacity-80" />
                      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-current opacity-80" />
                      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-current opacity-80" />
                    </>
                  )}

                  {/* Top: Controller Logo & Tariff Tag */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                      isSelected ? p.iconBoxActive : p.iconBoxIdle
                    }`}>
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black border ${p.badgeClass}`}>
                      {formatCurrency(p.baseRate)} / س
                    </span>
                  </div>

                  {/* Bottom: Name & Subtitle */}
                  <div>
                    <h4 className="text-sm font-black font-gaming tracking-wide truncate">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                      {p.subtitle}
                    </p>
                  </div>

                  {/* Pulsing Active Beacon */}
                  {isSelected && (
                    <div className="absolute top-2 left-2">
                      <span className={`w-2 h-2 rounded-full animate-ping block ${p.beaconColor}`} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 2. Interactive Telemetry Controls & Holographic Output HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left: Duration Slider & Modifiers (8 Cols) */}
          <div className="lg:col-span-7 space-y-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            {/* قیمت دستی — خودت بنویس */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>قیمت هر ساعت — خودت بنویس (د.ع):</span>
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                  isCustomRate
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  {isCustomRate ? 'حاسبة سعری دستی' : 'از تعرفه انتخابی'}
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={calcCustomRate}
                onChange={(e) => setCalcCustomRate(e.target.value)}
                placeholder="مثلاً: 5000 — خالی گذاشتن = استفاده از تعرفه"
                className="w-full px-3 py-2.5 text-xs font-mono font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
              />
            </div>

            {/* Duration Selector — ساعت و دقیقه */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>تحديد مدة اللعب (ساعت و دقیقه):</span>
                </span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-white px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono-digits">
                  {calcHours} {calcHours === 1 ? 'ساعة' : calcHours === 2 ? 'ساعتان' : 'ساعات'} و {calcMinutes} دقيقة ({totalCalcMinutes} دقيقة)
                </span>
              </div>

              {/* Inputs: ساعت + دقیقه */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">ساعت (0–24):</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={calcHours}
                    onChange={(e) => setCalcHours(Math.max(0, Math.min(24, Number(e.target.value) || 0)))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">دقیقه (0–59):</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={calcMinutes}
                    onChange={(e) => setCalcMinutes(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
                  />
                </div>
              </div>

              {/* Quick Time Preset Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {[
                  { label: '30 دقيقة', val: 0.5 },
                  { label: 'ساعة واحدة', val: 1 },
                  { label: 'ساعتان (الأكثر طلباً)', val: 2 },
                  { label: '3 ساعات (ماراثون)', val: 3 },
                  { label: '4 ساعات', val: 4 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => { setCalcHours(item.val); setCalcMinutes(0); }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      calcHours === item.val && calcMinutes === 0
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modifiers (Peak & Online Low-Ping) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-800">
              {/* Peak Toggle Card */}
              <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                calcIsPeak 
                  ? 'border-amber-400 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-xs' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${calcIsPeak ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black block">وقت الذروة (Peak)</span>
                    <span className="text-[10px] opacity-75">معامل إضافي +25%</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={calcIsPeak}
                  onChange={(e) => setCalcIsPeak(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500 dark:accent-amber-400 cursor-pointer"
                />
              </label>

              {/* Online Game Low-Ping Toggle Card */}
              <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                calcIsOnline 
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-900 dark:text-cyan-200 shadow-xs' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${calcIsOnline ? 'bg-cyan-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black block">سيرفرات أونلاين</span>
                    <span className="text-[10px] opacity-75">Low-Ping فايبر +10%</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={calcIsOnline}
                  onChange={(e) => setCalcIsOnline(e.target.checked)}
                  className="w-4 h-4 rounded accent-cyan-500 dark:accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Right: Holographic Telemetry Result Box (5 Cols) */}
          <div className={`lg:col-span-5 p-5 rounded-2xl border-2 flex flex-col justify-between text-center relative overflow-hidden transition-all duration-300 ${
            calcPlatform === 'XBOX' 
              ? 'bg-gradient-to-b from-green-500/15 via-green-950/40 to-slate-950 border-green-500/60 shadow-lg shadow-green-500/20' 
              : calcPlatform === 'PS5'
              ? 'bg-gradient-to-b from-blue-500/15 via-blue-950/40 to-slate-950 border-blue-500/60 shadow-lg shadow-blue-500/20'
              : calcPlatform === 'VIP_SIM'
              ? 'bg-gradient-to-b from-orange-500/15 via-orange-950/40 to-slate-950 border-orange-500/60 shadow-lg shadow-orange-500/20'
              : 'bg-gradient-to-b from-cyan-500/15 via-cyan-950/40 to-slate-950 border-cyan-500/60 shadow-lg shadow-cyan-500/20'
          }`}>
            {/* Micro Corner Brackets */}
            <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-current opacity-70 pointer-events-none" />
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-current opacity-70 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-current opacity-70 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-current opacity-70 pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/80 dark:bg-black/60 border border-current shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span>المبلغ التقديري المحسوب (IQD)</span>
              </div>

              {/* Big Digital Glowing Scoreboard Number */}
              <div className="my-3">
                <span className={`text-3xl sm:text-4xl font-black font-gaming tracking-wide font-mono-digits ${
                  calcPlatform === 'XBOX' ? 'text-green-600 dark:text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]' :
                  calcPlatform === 'PS5' ? 'text-blue-600 dark:text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]' :
                  calcPlatform === 'VIP_SIM' ? 'text-orange-600 dark:text-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]' :
                  'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                }`}>
                  {formatCurrency(calculatedSimPrice)}
                </span>
              </div>

              {/* Mathematical Formula Breakdown */}
              <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/40 border border-slate-200/60 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span>{isCustomRate ? 'سعر الساعة (دستی):' : 'سعر الساعة الأساسي:'}</span>
                  <span className="font-bold">
                    {isCustomRate ? formatCurrency(customRateNum) : formatCurrency(matchedTariff?.baseHourlyRate || 5000)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>المدة الكلية:</span>
                  <span className="font-bold">{totalCalcMinutes} دقيقة ({totalCalcHours.toFixed(2)} ساعة)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>المعامل الإجمالي المطبق:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    {((calcIsPeak ? (isCustomRate ? 1.25 : (matchedTariff?.peakMultiplier || 1.2)) : 1) * (calcIsOnline ? (isCustomRate ? 1.1 : (matchedTariff?.onlineGameMultiplier || 1.1)) : 1)).toFixed(2)}×
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-current/20 mt-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              يتم احتساب الدقائق والثواني بدقة لحظية فورية عند بدء الجلسة
            </div>
          </div>

        </div>
      </div>

      {/* 4. Tariffs Display Area: Grouped or Grid */}
      <div className="space-y-4">
        {filteredTariffs.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <Tag className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-black text-slate-800 dark:text-slate-200 font-gaming">لا توجد تعرفات في هذا التصنيف</h3>
            <p className="text-xs text-slate-500">جرب اختيار تصنيف آخر أو إضافة باقة جديدة عبر الزر في الأعلى</p>
          </div>
        ) : filterCategory === 'all' && viewLayout === 'grouped' ? (
          /* Categorized Platform Sections View */
          <div className="space-y-8">
            {platformOrder.map((catKey) => {
              const items = catKey === 'packages' 
                ? filteredTariffs.filter(t => t.isPackage) 
                : filteredTariffs.filter(t => !t.isPackage && (t.platform === catKey || (catKey === 'PC' && t.platform === 'ALL')));
              
              if (items.length === 0) return null;
              const meta = getTariffMeta(catKey as any, catKey === 'packages');
              const PlatformIcon = meta.icon;

              return (
                <div key={catKey} className="space-y-4">
                  {/* Category Header Banner */}
                  <div className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r ${meta.headerGlow} bg-white dark:bg-slate-950/80 border ${meta.headerBorder} shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden backdrop-blur-md`}>
                    <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${meta.accent}`} />

                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${meta.bg} border-2 ${meta.border} flex items-center justify-center shrink-0 shadow-xs`}>
                        <PlatformIcon className={`w-5 h-5 ${meta.color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-black font-gaming text-slate-900 dark:text-white tracking-wide truncate">
                            {meta.categoryTitle}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black font-mono-digits ${meta.badge}`}>
                            {items.length} باقات
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1">
                          {meta.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto text-xs font-mono font-bold">
                      <span className="text-slate-500 dark:text-slate-400">الفئة:</span>
                      <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black font-mono-digits ${meta.badge}`}>
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {items.map(t => renderTariffCard(t))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Uniform Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTariffs.map(t => renderTariffCard(t))}
          </div>
        )}
      </div>

      {/* Add Tariff Modal */}
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
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 font-gaming">
                  <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>تعريف تعرفة أو باقة ساعية جديدة</span>
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عنوان التعرفة:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: تعرفة إكس بوكس فورزا أو باقة 3 ساعات PS5"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المنصة المستهدفة:</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none font-bold"
                    >
                      <option value="VIP_SIM">🏎️ محاكي قيادة VIP (برتقالي)</option>
                      <option value="XBOX">🎮 إكسبوکس سيريز X (أخضر)</option>
                      <option value="PS5">🕹️ بلايستيشن 5 PS5 (أزرق)</option>
                      <option value="PC">🖥️ کمبيوتر ألعاب PC (سيان)</option>
                      <option value="ALL">🌐 كافة المنصات</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نوع التعرفة:</label>
                    <div className="flex items-center gap-2 pt-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={isPackage}
                          onChange={(e) => setIsPackage(e.target.checked)}
                          className="rounded accent-emerald-600 dark:accent-emerald-400"
                        />
                        <span>باقة محددة الساعات</span>
                      </label>
                    </div>
                  </div>
                </div>

                {!isPackage ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">السعر الأساسي (د.ع):</label>
                      <input
                        type="number"
                        step="500"
                        required
                        value={baseHourlyRate}
                        onChange={(e) => setBaseHourlyRate(Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">معامل الذروة:</label>
                      <input
                        type="number"
                        step="0.05"
                        value={peakMultiplier}
                        onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">معامل أونلاين:</label>
                      <input
                        type="number"
                        step="0.05"
                        value={onlineGameMultiplier}
                        onChange={(e) => setOnlineGameMultiplier(Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-teal-700 dark:text-teal-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عدد ساعات الباقة:</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={packageHours}
                        onChange={(e) => setPackageHours(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none font-mono-digits font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سعر الباقة (د.ع):</label>
                      <input
                        type="number"
                        step="1000"
                        required
                        value={packagePrice}
                        onChange={(e) => setPackagePrice(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-mono font-black bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">التفاصيل والميزات الإضافية:</label>
                  <textarea
                    rows={2}
                    value={packageDescription}
                    onChange={(e) => setPackageDescription(e.target.value)}
                    placeholder="تشمل مشروب طاقة مجاناً، شاشة 240 هرتز، أولوية الحجز، تشكيلة تسالي..."
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
                  <span>تعديل التعرفة: {editingTariff.title}</span>
                </h3>
                <button
                  onClick={() => setEditingTariff(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عنوان التعرفة:</label>
                  <input
                    type="text"
                    required
                    value={editingTariff.title}
                    onChange={(e) => setEditingTariff({ ...editingTariff, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {!editingTariff.isPackage ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سعر الساعة الأساسي (د.ع):</label>
                      <input
                        type="number"
                        step="500"
                        required
                        value={editingTariff.baseHourlyRate}
                        onChange={(e) => setEditingTariff({ ...editingTariff, baseHourlyRate: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">معامل الذروة (Peak):</label>
                      <input
                        type="number"
                        step="0.05"
                        value={editingTariff.peakMultiplier}
                        onChange={(e) => setEditingTariff({ ...editingTariff, peakMultiplier: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عدد الساعات:</label>
                      <input
                        type="number"
                        min="1"
                        value={editingTariff.packageHours || 1}
                        onChange={(e) => setEditingTariff({ ...editingTariff, packageHours: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none font-mono-digits font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سعر الباقة (د.ع):</label>
                      <input
                        type="number"
                        step="1000"
                        value={editingTariff.packagePrice || 0}
                        onChange={(e) => setEditingTariff({ ...editingTariff, packagePrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingTariff(null)}
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
