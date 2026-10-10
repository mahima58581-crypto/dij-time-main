import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Station, Session, SnackItem, DeskSnackOrder } from '../types';
import { formatCurrency } from '../utils/formatters';
import { playSnackSound, speakVoiceAlert, unlockAudioContext } from '../utils/audioAlerts';
import { PLATFORM_META } from './platformMeta';
import { GamingPcIcon } from './GamingPcIcon';
import { Badge, Battery, BatteryCharging, CheckCircle2, Clock, Code, Coffee, Frame, Grid, Home, Info, List, Minus, Monitor, Moon, Navigation, Phone, Pill, Plus, Power, Printer, QrCode, Receipt, Scroll, Search, Send, ShoppingBag, Signal, Smartphone, Sparkles, Sun, Table, Text, User, Volume, Volume2, Wifi, X } from 'lucide-react';

interface QrDeskOrderManagerProps {
  stations: Station[];
  activeSessions: Session[];
  snacks: SnackItem[];
  deskOrders: DeskSnackOrder[];
  onUpdateOrderStatus: (orderId: string, status: DeskSnackOrder['status']) => void;
  onAcceptAndBillOrder: (order: DeskSnackOrder) => void;
  onAddNewDeskOrder: (newOrder: Omit<DeskSnackOrder, 'id' | 'createdAt'>) => void;
  clubName: string;
}

// ─── هویت بصری دسته‌بندی‌های بوفيه (هم‌خوانی با صفحه المنتجات) ───
const SIM_CATEGORY_STYLE: Record<string, { emoji: string; gradient: string }> = {
  'مشروبات طاقة': { emoji: '⚡', gradient: 'from-rose-500 via-red-500 to-orange-500' },
  'تسالي وشيبس': { emoji: '🍟', gradient: 'from-amber-400 via-orange-500 to-amber-600' },
  'مشروبات ساخنة وباردة': { emoji: '☕', gradient: 'from-cyan-400 via-sky-500 to-blue-600' },
  'وجبات وشطائر': { emoji: '🥪', gradient: 'from-emerald-400 via-green-500 to-teal-600' },
  'حلويات': { emoji: '🍫', gradient: 'from-fuchsia-400 via-pink-500 to-rose-500' },
};

// ─── هویت بصری وضعیت الطلب ───
const STATUS_META = {
  pending: {
    strip: 'from-amber-400 via-orange-500 to-amber-500',
    badge: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse shadow-amber-500/30',
    ring: 'border-amber-300 dark:border-amber-700 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
  },
  preparing: {
    strip: 'from-teal-400 via-cyan-500 to-sky-500',
    badge: 'bg-teal-100 text-teal-900 border-teal-300 shadow-teal-500/25',
    ring: 'border-teal-300 dark:border-teal-800 ring-2 ring-teal-500/30 shadow-xl shadow-teal-500/10',
    text: 'text-teal-700 dark:text-teal-400',
  },
  delivered: {
    strip: 'from-emerald-400 via-green-500 to-teal-500',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-emerald-500/25',
    ring: 'border-emerald-200 dark:border-emerald-800 ring-2 ring-emerald-500/25 shadow-lg shadow-emerald-500/10 opacity-90',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  cancelled: {
    strip: 'from-slate-300 to-slate-400',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    ring: 'border-slate-200 dark:border-slate-700 ring-1 ring-slate-300/50 shadow-sm opacity-60',
    text: 'text-slate-500 dark:text-slate-400',
  },
};

export const QrDeskOrderManager: React.FC<QrDeskOrderManagerProps> = ({
  stations,
  activeSessions,
  snacks,
  deskOrders,
  onUpdateOrderStatus,
  onAcceptAndBillOrder,
  onAddNewDeskOrder,
  clubName,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'stands' | 'simulator'>('queue');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'delivered' | 'cancelled'>('all');
  const [selectedStationForSim, setSelectedStationForSim] = useState<string>(
    stations.length > 0 ? stations[0].id : ''
  );
  const [simStationSearch, setSimStationSearch] = useState<string>('');

  // Simulator Cart State
  const [simCart, setSimCart] = useState<{ [snackId: string]: number }>({});
  const [simCustomerName, setSimCustomerName] = useState('أحمد علي (لاعب)');
  const [simCustomerPhone, setSimCustomerPhone] = useState('07701234567');
  const [simNotes, setSimNotes] = useState('');
  const [simCategory, setSimCategory] = useState<string>('الكل');
  const [simTheme, setSimTheme] = useState<'dark' | 'light'>('dark');
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);

  // Selected Station for Stand Print Modal
  const [previewStandStation, setPreviewStandStation] = useState<Station | null>(null);

  // Calculations
  const pendingOrders = deskOrders.filter(o => o.status === 'pending');
  const preparingOrders = deskOrders.filter(o => o.status === 'preparing');
  const deliveredOrders = deskOrders.filter(o => o.status === 'delivered');
  const totalDeskRevenue = deskOrders
    .filter(o => o.status === 'delivered')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const filteredOrders = deskOrders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  // Simulator Cart Helpers
  const handleSimAddToCart = (snackId: string) => {
    setSimCart(prev => ({
      ...prev,
      [snackId]: (prev[snackId] || 0) + 1
    }));
  };

  const handleSimRemoveFromCart = (snackId: string) => {
    setSimCart(prev => {
      const current = prev[snackId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: current - 1 };
    });
  };

  const simCartItems = Object.entries(simCart).map(([snackId, qty]) => {
    const item = snacks.find(s => s.id === snackId);
    return {
      snackId,
      name: item?.name || 'صنف غير معروف',
      quantity: qty,
      unitPrice: item?.price || 0,
      totalPrice: (item?.price || 0) * qty,
      icon: item?.imageIcon || '🍿'
    };
  });

  const simCartTotal = simCartItems.reduce((acc, i) => acc + i.totalPrice, 0);

  const handleSimSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (simCartItems.length === 0) return;

    const currentStation = stations.find(s => s.id === selectedStationForSim);
    const activeSess = activeSessions.find(s => s.stationId === selectedStationForSim);

    onAddNewDeskOrder({
      stationId: selectedStationForSim,
      stationName: currentStation?.name || 'طاولة غير معروفة',
      sessionId: activeSess?.id,
      customerName: simCustomerName.trim() || activeSess?.customerName || 'لاعب الطاولة',
      customerPhone: simCustomerPhone.trim() || activeSess?.customerPhone,
      items: simCartItems,
      totalAmount: simCartTotal,
      status: 'pending',
      notes: simNotes.trim() || undefined
    });

    // Sound & Voice Alert
    unlockAudioContext();
    playSnackSound();
    speakVoiceAlert(`طلب جديد من طاولة ${currentStation?.name}`);

    setOrderSentSuccess(true);
    setSimCart({});
    setSimNotes('');
    setTimeout(() => {
      setOrderSentSuccess(false);
      setActiveSubTab('queue');
    }, 2000);
  };

  const handlePrintAllStands = () => {
    window.print();
  };

  const categories = ['الكل', 'مشروبات طاقة', 'تسالي وشيبس', 'مشروبات ساخنة وباردة', 'وجبات وشطائر', 'حلويات'];

  const subTabs = [
    { key: 'queue', label: 'طابور الطلبات الواردة', icon: ShoppingBag, badge: pendingOrders.length, gradient: 'from-cyan-500 to-blue-600' },
    { key: 'stands', label: `استندات وباركودات الطاولات (${stations.length})`, icon: QrCode, badge: 0, gradient: 'from-amber-400 to-orange-500' },
    { key: 'simulator', label: 'شاشة جوال اللاعب (طلب مباشر)', icon: Smartphone, badge: 0, gradient: 'from-violet-500 to-indigo-600' },
  ] as const;

  const statusPills: { key: typeof statusFilter; label: string; active: string }[] = [
    { key: 'all', label: 'الكل', active: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/50' },
    { key: 'pending', label: 'الجديدة', active: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/50' },
    { key: 'preparing', label: 'قيد التحضير', active: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/50' },
    { key: 'delivered', label: 'المسلمة', active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/50' },
    { key: 'cancelled', label: 'الملغاة', active: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/50' },
  ];

  const kpiStats = [
    {
      label: 'طلبات جديدة بانتظار التأكيد',
      value: pendingOrders.length,
      suffix: pendingOrders.length > 0 ? 'فوري' : '',
      icon: Clock,
      gradient: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/40',
      valueColor: 'text-amber-600 dark:text-amber-400',
      pulse: pendingOrders.length > 0,
    },
    {
      label: 'قيد التحضير في البوفيه',
      value: preparingOrders.length,
      suffix: '',
      icon: Coffee,
      gradient: 'from-teal-400 to-cyan-500',
      bg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-900/40',
      valueColor: 'text-teal-700 dark:text-teal-400',
      pulse: false,
    },
    {
      label: 'تم تسليمها إلى الطاولات',
      value: deliveredOrders.length,
      suffix: '',
      icon: CheckCircle2,
      gradient: 'from-emerald-400 to-green-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40',
      valueColor: 'text-emerald-700 dark:text-emerald-400',
      pulse: false,
    },
    {
      label: 'إجمالي مبيعات طلبات الـ QR',
      value: formatCurrency(totalDeskRevenue),
      suffix: '',
      icon: Receipt,
      gradient: 'from-indigo-500 to-violet-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/40',
      valueColor: 'text-indigo-700 dark:text-indigo-400',
      pulse: false,
    },
  ];

  return (
    <div className="space-y-5 relative">

      {/* بخش‌های نورانی شناور در پس‌زمینه */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl float-slow" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl float-slower" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl float-slow" />
      </div>

      {/* 1. Header Banner لوکس */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 animate-gradient-x"
      >
        {/* دوائر زخرفية */}
        <div className="absolute -left-12 -top-20 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-6 -bottom-24 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        {/* آیکون‌های شناور */}
        <QrCode className="absolute left-10 top-5 w-5 h-5 text-white/40 float-slow pointer-events-none" />
        <Smartphone className="absolute left-48 bottom-7 w-4 h-4 text-white/30 float-slower pointer-events-none" />
        <Coffee className="absolute right-1/3 top-3 w-4 h-4 text-white/35 float-slow pointer-events-none" />
        <Sparkles className="absolute right-1/4 bottom-4 w-4 h-4 text-white/30 float-slower pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-blue-900/20 shrink-0">
              <QrCode className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-sm">
                نظام طلبات الطاولات الذكي بالـ QR كود
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 border border-white/30 text-white backdrop-blur-sm">
                  خدمة ذاتية للجيمرز
                </span>
                <p className="text-xs text-cyan-50/90">
                  اللاعب يمسح كود QR على جهازه ويطلب مشروباته وسندويشاته فوراً
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('simulator')}
              className="flex-1 sm:flex-none inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 border border-white/30 shadow-lg shadow-blue-900/30 transition"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>تجربة طلب اللاعب</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('stands')}
              className="flex-1 sm:flex-none inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 border border-white/30 shadow-lg shadow-blue-900/30 transition"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>طباعة استندات الطاولات ({stations.length})</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Quick Live KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`p-4 rounded-2xl border shadow-xs ${s.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {s.label}
              </span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}>
                <s.icon className={`w-5 h-5 text-white ${s.pulse ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            <div className={`text-xl font-black font-mono font-mono-digits mt-1.5 flex items-center gap-2 bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
              <span>{s.value}</span>
              {s.suffix && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 animate-pulse border border-amber-300 dark:border-amber-700">
                  {s.suffix}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {subTabs.map(tab => {
            const active = activeSubTab === tab.key;
            const TabIcon = tab.icon;
            return (
              <motion.button
                whileTap={{ scale: 0.96 }}
                key={tab.key}
                type="button"
                onClick={() => setActiveSubTab(tab.key as typeof activeSubTab)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                  active
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md shadow-blue-500/25`
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 font-mono-digits animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {activeSubTab === 'queue' && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-bold text-[11px]">الحالة:</span>
            {statusPills.map(p => (
              <button
                key={p.key}
                type="button"
                onClick={() => setStatusFilter(p.key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  statusFilter === p.key ? p.active : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Tab 1: Queue of Incoming Desk Orders */}
      {activeSubTab === 'queue' && (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="text-base font-black text-slate-800 dark:text-slate-100">لا توجد طلبات في هذا التصنيف حالياً</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                عندما يقوم اللاعب بمسح كود الـ QR وطلب مشروبات أو وجبات من جهازه، ستظهر فوراً هنا مع نغمة صوتية تنبيهية.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('simulator')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black shadow-md shadow-cyan-500/25 hover:brightness-105 transition"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>إرسال طلب تجريبي من الجوال الآن</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredOrders.map(order => {
                  const isPending = order.status === 'pending';
                  const isPreparing = order.status === 'preparing';
                  const isDelivered = order.status === 'delivered';
                  const isCancelled = order.status === 'cancelled';
                  const sm = STATUS_META[order.status];

                  // لوگو و رنگ پلتفرم طاولة
                  const stationType = stations.find(s => s.id === order.stationId)?.type;
                  const plat = stationType ? PLATFORM_META[stationType] : null;
                  const StationIcon = plat ? plat.icon : Monitor;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={order.id}
                      className={`rounded-2xl bg-white dark:bg-[#0c101c] border transition-all duration-300 flex flex-col overflow-hidden ${sm.ring}`}
                    >
                      {/* شريط حالة الطلب */}
                      <div className={`h-1.5 w-full bg-gradient-to-r ${sm.strip} ${isPending ? 'animate-gradient-x shimmer' : ''}`} />

                      <div className="p-4 space-y-3 flex-1 flex flex-col">
                        {/* Top Order Card Header */}
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-1.5 font-gaming">
                                <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${plat ? plat.accent : 'from-slate-400 to-slate-500'} flex items-center justify-center shadow-sm shrink-0`}>
                                  <StationIcon className="w-4 h-4 text-white" />
                                </span>
                                <span>{order.stationName}</span>
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${sm.badge}`}>
                                {isPending && 'طلب جديد بانتظار التأكيد'}
                                {isPreparing && 'قيد التجهيز في البوفيه'}
                                {isDelivered && 'تم التسليم للطاولة'}
                                {isCancelled && 'ملغي'}
                              </span>
                            </div>

                            <div className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1.5 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{order.customerName}</span>
                              {order.customerPhone && (
                                <span className="text-[11px] text-slate-400 font-mono-digits" dir="ltr">
                                  ({order.customerPhone})
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-400 font-mono-digits flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" />
                            <span>{order.createdAt}</span>
                          </div>
                        </div>

                        {/* Items Ordered List */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold text-slate-400">الأصناف المطلوبة:</div>
                          <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-base leading-none shrink-0">{item.icon || '🍿'}</span>
                                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                                  <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded shrink-0">
                                    x{item.quantity}
                                  </span>
                                </div>
                                <span className="font-mono-digits font-bold text-slate-700 dark:text-slate-300 shrink-0">
                                  {formatCurrency(item.totalPrice)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Customer Notes */}
                          {order.notes && (
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-[11px] font-medium flex items-start gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                              <span><span className="font-bold">ملاحظة اللاعب:</span> {order.notes}</span>
                            </div>
                          )}
                        </div>

                        {/* Total Amount & Actions */}
                        <div className="pt-2 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">المجموع الكلي:</span>
                            <span className={`text-base font-black font-mono font-mono-digits bg-gradient-to-r ${sm.strip} bg-clip-text text-transparent`}>
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>

                          {/* Order Status Transition Buttons */}
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onAcceptAndBillOrder(order)}
                                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/30 font-gaming"
                                  title="تأكيد وإضافة فورية إلى فاتورة الجلسة وخصم المخزون"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>قبول وإضافة للفاتورة</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
                                  title="إلغاء الطلب"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {isPreparing && (
                              <button
                                type="button"
                                onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-black text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/30 font-gaming"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>تم التسليم إلى الطاولة الآن</span>
                              </button>
                            )}

                            {isDelivered && (
                              <div className="w-full py-1.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>تمت إضافة المبلغ لحساب اللاعب بنجاح</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* 5. Tab 2: Printable Desk Stands Generator */}
      {activeSubTab === 'stands' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  استندات الطاولات الجاهزة للطباعة والتثبيت
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  اطبع هذه الكروت وضعها داخل استند بلاستيكي شفاف على كل جهاز. اللاعب يمسح الكود بجواله ويطلب مباشرة.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrintAllStands}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 text-white font-black text-xs flex items-center gap-1.5 transition shadow-md shadow-amber-500/30 font-gaming"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الكل (Print All Stands)</span>
            </button>
          </div>

          {/* Grid of Stand Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-2">
            {stations.map(st => {
              const currentActiveSession = activeSessions.find(s => s.stationId === st.id);
              // QR URL represents local simulated station ordering route
              const qrValue = `https://dij-tiem.iq/order?station=${encodeURIComponent(st.id)}&name=${encodeURIComponent(st.name)}`;
              const plat = PLATFORM_META[st.type];
              const StationIcon = plat.icon;

              return (
                <motion.div
                  key={st.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0c101c] border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600/60 transition-all shadow-md hover:shadow-xl hover:shadow-amber-500/15 flex flex-col items-center text-center space-y-3 relative group overflow-hidden"
                >
                  {/* شريط علوي بلون كهرماني */}
                  <div className="absolute top-0 right-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 animate-gradient-x shimmer" />

                  {/* Stand Header Badge */}
                  <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 pt-1">
                    <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/70">
                      {clubName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${plat.badge}`}>
                      <StationIcon className="w-3 h-3" />
                      {st.type}
                    </span>
                  </div>

                  {/* Station Name Display */}
                  <div>
                    <div className="text-base font-black text-slate-900 dark:text-white font-gaming">
                      {st.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {st.specs}
                    </div>
                  </div>

                  {/* Real Rendered QR Code */}
                  <div className={`p-3 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center transition-all ${currentActiveSession ? 'ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20' : 'ring-2 ring-emerald-400/40'}`}>
                    <QRCodeSVG
                      value={qrValue}
                      size={135}
                      level="H"
                      includeMargin={false}
                      className="rounded-lg"
                    />
                  </div>

                  {/* Customer Instructional Text */}
                  <div className="space-y-1">
                    <div className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>امسح واطلب وأنت بمكانك!</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      مشروبات طاقة، سناك، تسالي ومقرمشات تصلك مباشرة إلى طاولتك
                    </p>
                  </div>

                  {/* Current Table Status Indicator */}
                  <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-bold">الحالة:</span>
                    {currentActiveSession ? (
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                        <span className="text-slate-700 dark:text-slate-200">مشغول: {currentActiveSession.customerName}</span>
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        متاح للعب
                      </span>
                    )}
                  </div>

                  {/* Action overlay for operator */}
                  <div className="w-full pt-1 flex items-center gap-1.5 print:hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStationForSim(st.id);
                        setActiveSubTab('simulator');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition border ${plat.tabActive}`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>تجربة كلاعب</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewStandStation(st)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] transition cursor-pointer"
                      title="معاينة وطباعة فردية"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Tab 3: Gamer Mobile QR Ordering Simulator */}
      {activeSubTab === 'simulator' && (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-6">

          {/* Simulator Info Column & Controls */}
          <div className="max-w-md w-full space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/25">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm">
                      شبیه ساز زنده گوشی موبایل گیمر
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">تجربة QR المباشرة للجوال</span>
                  </div>
                </div>

                {/* زر تبديل الثيم الخارجي */}
                <button
                  type="button"
                  onClick={() => setSimTheme(simTheme === 'dark' ? 'light' : 'dark')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                    simTheme === 'dark'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                      : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
                  }`}
                  title="تغییر تم گوشی گیمر"
                >
                  {simTheme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400 spin-slow" />
                      <span>الوضع الداكن مفعل</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>الوضع الفاتح مفعل</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                هذه الصفحة هي نفس تطبيق الويب الذي يراه اللاعب بعد مسح رمز QR للطاولة بجواله الشخصي. يمكنه في الوضع الداكن سيبر أو الوضع الفاتح أنيق، عرض الأطعمة وطلبها.
              </p>

              {/* تغییر تم لایت / دارک با دکمه‌های سوئیچ */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>تم نمایشی موبایل بازیکن:</span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {simTheme === 'dark' ? 'الوضع الداكن سيبر (داكن OLED)' : 'الوضع الفاتح أنيق (ضوء نظيف)'}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSimTheme('dark')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                      simTheme === 'dark'
                        ? 'bg-slate-950 text-emerald-400 border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-emerald-400" />
                    <span>الوضع الداكن (سيبر)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimTheme('light')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                      simTheme === 'light'
                        ? 'bg-white text-emerald-700 border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>الوضع الفاتح</span>
                  </button>
                </div>
              </div>

              {/* Station Selector - Searchable & By Name (no dropdown/select window) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <GamingPcIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>انتخاب دستگاه جهت تست سفارش (اسمی و سرچی):</span>
                  </label>
                  {(() => {
                    const currentSt = stations.find(s => s.id === selectedStationForSim) || stations[0];
                    return currentSt ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700 font-mono-digits">
                        {currentSt.name}
                      </span>
                    ) : null;
                  })()}
                </div>

                {/* Search Bar by Name */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={simStationSearch}
                    onChange={(e) => setSimStationSearch(e.target.value)}
                    placeholder="بحث باسم الجهاز (مثال: PC-01, PS5-02)..."
                    className="w-full pl-8 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                  {simStationSearch && (
                    <button
                      type="button"
                      onClick={() => setSimStationSearch('')}
                      className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Stations List / Chips (By Name) — با لوگو و رنگ پلتفرم */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                  {stations
                    .filter(st =>
                      st.name.toLowerCase().includes(simStationSearch.toLowerCase()) ||
                      st.type.toLowerCase().includes(simStationSearch.toLowerCase())
                    )
                    .map((st) => {
                      const isSelected = st.id === selectedStationForSim;
                      const plat = PLATFORM_META[st.type];
                      const StIcon = plat.icon;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setSelectedStationForSim(st.id)}
                          className={`p-2 rounded-lg text-xs font-bold transition flex items-center justify-between gap-1 text-right border cursor-pointer ${
                            isSelected
                              ? `bg-gradient-to-r ${plat.accent} text-white border-transparent shadow-md`
                              : `bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:bg-cyan-50/50 dark:hover:bg-slate-700`
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <StIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : plat.text}`} />
                            <span className="truncate font-mono-digits text-[11px]">{st.name}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-white" />}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Audio feedback notice */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>آزمایش صدای زنگ هشدار بوفه</span>
                </div>
                <div className="text-[11px] text-amber-800/90 dark:text-amber-400/90">
                  به محض کلیک روی «ارسال سفارش به بوفه» در صفحه گوشی، زنگ هوشمند سالن به صدا درمی‌آید.
                </div>
              </div>
            </div>
          </div>

          {/* Smartphone Hardware Frame (Titanium Pro Edition) */}
          <div className="relative">

            {/* Hardware Side Buttons */}
            {/* Left Buttons: Action Button & Volume Up/Down */}
            <div className="absolute -left-[5px] top-24 w-[5px] h-7 bg-amber-500 rounded-l-md shadow-xs z-10" title="زر الإجراء" />
            <div className="absolute -left-[5px] top-36 w-[5px] h-12 bg-slate-700 rounded-l-md shadow-xs z-10" title="رفع الصوت" />
            <div className="absolute -left-[5px] top-52 w-[5px] h-12 bg-slate-700 rounded-l-md shadow-xs z-10" title="خفض الصوت" />
            {/* زر أيمن: زر التشغيل */}
            <div className="absolute -right-[5px] top-36 w-[5px] h-16 bg-slate-700 rounded-r-md shadow-xs z-10" title="زر التشغيل" />

            {/* Main Phone Chassis */}
            <div className="w-[340px] sm:w-[350px] p-[10px] rounded-[50px] bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.2)] border-2 border-slate-600/70 relative">

              {/* Screen Bezel Frame */}
              <div
                className={`rounded-[42px] overflow-hidden min-h-[630px] flex flex-col justify-between relative shadow-inner transition-colors duration-300 ${
                  simTheme === 'dark'
                    ? 'bg-[#090d16] text-slate-100'
                    : 'bg-slate-50 text-slate-900'
                }`}
                dir="rtl"
              >

                {/* 1. iOS Top Status Bar & Dynamic Island */}
                <div className={`px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-mono select-none z-30 transition-colors ${
                  simTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {/* Real-time Clock on Left */}
                  <span className="font-black font-mono-digits tracking-tight">21:45</span>

                  {/* Dynamic Island Pill Notch in Center */}
                  <div className="h-[24px] w-[105px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-md border border-white/10 mx-auto">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#151515] ring-1 ring-emerald-500/40 flex items-center justify-center">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                      QR
                    </span>
                  </div>

                  {/* Icons on Right: 5G, Wifi, Battery */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <div className="flex items-center gap-0.5 text-[10px] font-bold">
                      <span>98%</span>
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* 2. Mobile App Header with In-Phone Theme Switcher */}
                <div className={`p-3.5 pt-2 text-white relative shadow-sm transition-colors ${
                  simTheme === 'dark'
                    ? 'bg-gradient-to-r from-emerald-950 via-[#0d1627] to-[#080f1d] border-b border-emerald-500/30'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                      <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                      <span>بوفيه مباشر {clubName}</span>
                    </div>

                    {/* زر الوضع الفاتح / الداكن داخل صفحة الجوال */}
                    <button
                      type="button"
                      onClick={() => setSimTheme(simTheme === 'dark' ? 'light' : 'dark')}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition shadow-xs border cursor-pointer ${
                        simTheme === 'dark'
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 hover:bg-amber-400/30'
                          : 'bg-white/25 text-white border-white/40 hover:bg-white/35'
                      }`}
                      title="تبديل الوضع الفاتح والداكن"
                    >
                      {simTheme === 'dark' ? (
                        <>
                          <Sun className="w-3 h-3 text-amber-300 spin-slow" />
                          <span>فاتح</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3 h-3 text-indigo-200" />
                          <span>داكن</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-sm font-black font-gaming mt-1 text-white flex items-center justify-between">
                    <span>طاولة: {stations.find(s => s.id === selectedStationForSim)?.name}</span>
                    <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-400/30 text-emerald-200">
                      طلب مباشر
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-200/90 mt-0.5">
                    يتم تسليم طلبك مباشرة إلى مكان اللعب
                  </div>
                </div>

                {/* 3. Mobile Category Scroll Tabs — رنگ مخصوص هر دسته */}
                <div className={`flex items-center gap-1.5 overflow-x-auto p-2 border-b custom-scrollbar transition-colors ${
                  simTheme === 'dark'
                    ? 'bg-[#0b101c] border-slate-800'
                    : 'bg-white border-slate-200'
                }`}>
                  {categories.map(cat => {
                    const isSelected = simCategory === cat;
                    const cs = SIM_CATEGORY_STYLE[cat] || { emoji: '🛍️', gradient: 'from-slate-500 to-slate-600' };
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSimCategory(cat)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition border flex items-center gap-1 ${
                          isSelected
                            ? `bg-gradient-to-r ${cs.gradient} text-white border-transparent shadow-md shadow-slate-900/30`
                            : simTheme === 'dark'
                              ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span className="leading-none">{cs.emoji}</span>
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* 4. Mobile Product Items List (خفن و قشنگ) */}
                <div className="flex-1 p-3 overflow-y-auto max-h-[310px] space-y-2.5 custom-scrollbar">
                  {snacks
                    .filter(s => simCategory === 'الكل' || s.category === simCategory)
                    .map(snack => {
                      const inCartCount = simCart[snack.id] || 0;
                      const cs = SIM_CATEGORY_STYLE[snack.category] || { emoji: '📦', gradient: 'from-slate-500 to-slate-600' };

                      return (
                        <div
                          key={snack.id}
                          className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                            simTheme === 'dark'
                              ? 'bg-[#0e1424]/90 border-slate-800/90 hover:border-emerald-500/40 shadow-md backdrop-blur-xs'
                              : 'bg-white border-slate-200/90 shadow-2xs hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`text-2xl p-2 rounded-xl border shadow-md shrink-0 bg-gradient-to-br ${cs.gradient} border-transparent`}>
                              {snack.imageIcon}
                            </span>
                            <div className="min-w-0">
                              <div className={`text-xs font-bold line-clamp-1 ${
                                simTheme === 'dark' ? 'text-white' : 'text-slate-900'
                              }`}>
                                {snack.name}
                              </div>
                              <div className={`text-[11px] font-black font-mono-digits ${
                                simTheme === 'dark'
                                  ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.35)]'
                                  : 'text-emerald-700'
                              }`}>
                                {formatCurrency(snack.price)}
                              </div>
                            </div>
                          </div>

                          {/* Quantity Counter */}
                          <div className={`flex items-center gap-1 p-1 rounded-xl border shrink-0 ${
                            simTheme === 'dark'
                              ? 'bg-slate-900/90 border-slate-800'
                              : 'bg-slate-100 border-slate-200'
                          }`}>
                            {inCartCount > 0 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSimRemoveFromCart(snack.id)}
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition cursor-pointer ${
                                    simTheme === 'dark'
                                      ? 'bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-rose-950/40'
                                      : 'bg-white text-slate-800 hover:text-rose-600 shadow-2xs'
                                  }`}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className={`text-xs font-black px-1 font-mono font-mono-digits ${
                                  simTheme === 'dark' ? 'text-white' : 'text-slate-900'
                                }`}>
                                  {inCartCount}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSimAddToCart(snack.id)}
                                  className="w-5 h-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xs transition cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSimAddToCart(snack.id)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 cursor-pointer ${
                                  simTheme === 'dark'
                                    ? 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 shadow-xs'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                                }`}
                              >
                                <Plus className="w-3 h-3" />
                                <span>طلب</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* 5. Mobile Cart & Order Footer */}
                <div className={`p-3 border-t space-y-2 transition-colors ${
                  simTheme === 'dark'
                    ? 'bg-[#0a0f1c]/95 border-slate-800 backdrop-blur-md'
                    : 'bg-white border-slate-200'
                }`}>

                  {/* Note Field */}
                  <input
                    type="text"
                    placeholder="ملاحظات (مثلاً: مثلج، بدون سكر...)"
                    value={simNotes}
                    onChange={(e) => setSimNotes(e.target.value)}
                    className={`w-full px-2.5 py-1.5 text-[11px] rounded-xl border focus:outline-none transition ${
                      simTheme === 'dark'
                        ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                    }`}
                  />

                  {/* Submit Order Button with Neon Glow */}
                  <button
                    type="button"
                    onClick={handleSimSubmitOrder}
                    disabled={simCartItems.length === 0}
                    className={`w-full py-2.5 rounded-xl font-black text-xs disabled:opacity-40 disabled:pointer-events-none transition flex items-center justify-between px-3 ${
                      simTheme === 'dark'
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:brightness-110'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:brightness-105'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال الطلب إلى البوفيه</span>
                    </span>
                    <span className={`font-mono font-mono-digits font-bold px-2 py-0.5 rounded-lg text-[11px] ${
                      simTheme === 'dark' ? 'bg-slate-950/30 text-slate-950' : 'bg-white/20 text-white'
                    }`}>
                      {formatCurrency(simCartTotal)}
                    </span>
                  </button>

                  {orderSentSuccess && (
                    <div className="p-2 rounded-xl bg-emerald-500 text-white text-[11px] font-bold text-center animate-bounce flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم إرسال طلبك بنجاح! جاري التجهيز...</span>
                    </div>
                  )}

                  {/* iPhone Bottom Home Indicator Swipe Bar */}
                  <div className="pt-1 flex justify-center">
                    <div className={`w-28 h-1 rounded-full ${
                      simTheme === 'dark' ? 'bg-slate-700/60' : 'bg-slate-300'
                    }`} />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}

      {/* Stand Single Preview & Print Modal */}
      <AnimatePresence>
        {previewStandStation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-sm w-full space-y-4 shadow-2xl overflow-hidden"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 animate-gradient-x" />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-amber-500" />
                    استند طاولة {previewStandStation.name}
                  </span>
                  <button
                    onClick={() => setPreviewStandStation(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white border-2 border-amber-400 shadow-md flex flex-col items-center space-y-3">
                  <div className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    {clubName}
                  </div>
                  <div className="text-lg font-black text-slate-900 font-gaming">
                    {previewStandStation.name}
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-slate-200 ring-2 ring-amber-400/40 shadow-inner">
                    <QRCodeSVG
                      value={`https://dij-tiem.iq/order?station=${encodeURIComponent(previewStandStation.id)}`}
                      size={150}
                      level="H"
                    />
                  </div>

                  <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    امسح الباركود واطلب المشروبات مباشرة
                  </div>
                  <div className="text-[10px] text-slate-500">تصلك الطلبات فوراً إلى مكانك دون الحاجة للنهوض</div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs hover:brightness-105 transition flex items-center justify-center gap-1 shadow-md shadow-amber-500/30 font-gaming"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة هذا الاستند</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewStandStation(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
