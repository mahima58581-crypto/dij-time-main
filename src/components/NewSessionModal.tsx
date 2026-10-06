import { GamingPcIcon } from './GamingPcIcon';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Station, Customer, GameItem, Session, StationType } from '../types';
import { formatCurrency } from '../utils/formatters';
import { AlertCircle, Check, ChevronDown, Clock, Gamepad2, KeyRound, Minus, Play, Plus, RefreshCw, Search, Tv, User, X, Zap } from 'lucide-react';
import { VipSimulatorIcon } from './VipSimulatorIcon';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: Station[];
  customers: Customer[];
  games?: GameItem[]; // Optional now since selected games section has been removed
  preSelectedStationId?: string;
  preSelectedCustomerId?: string;
  onStartSession: (newSession: Omit<Session, 'id'>) => void;
  onQuickAddCustomer: (customer: Omit<Customer, 'id' | 'totalPlayMinutes' | 'totalSpent' | 'registeredAt'>) => Customer;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  stations,
  customers,
  preSelectedStationId,
  preSelectedCustomerId,
  onStartSession,
  onQuickAddCustomer,
}) => {
  if (!isOpen) return null;

  // المحطات الشاغرة
  const availableStations = stations.filter(
    (s) => s.status === 'available' || s.id === preSelectedStationId
  );

  const [stationId, setStationId] = useState<string>(
    preSelectedStationId || (availableStations[0]?.id || '')
  );

  // تصنيف وتصفية الأجهزة حسب القسم (كمبيوتر، بلايستيشن، إكس بوكس، محاكي VIP)
  const [stationTypeFilter, setStationTypeFilter] = useState<'all' | StationType>('all');

  const filteredAvailableStations = availableStations.filter((st) => {
    if (stationTypeFilter === 'all') return true;
    return st.type === stationTypeFilter;
  });

  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preSelectedCustomerId || (customers[0]?.id || '')
  );

  // بحث اللاعب بالاسم أو رمز PIN أو رقم الهاتف
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [isCustomerListExpanded, setIsCustomerListExpanded] = useState(false);

  // تصفية اللاعبين بناء على الاسم أو رمز PIN أو الهاتف
  const filteredCustomers = customers.filter((c) => {
    if (!customerSearchQuery.trim()) return true;
    const q = customerSearchQuery.trim().toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.pin.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  // بيانات اللاعب الجديد
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustPin, setNewCustPin] = useState(
    Math.floor(1000 + Math.random() * 9000).toString()
  );

  const handleRegeneratePin = () => {
    setNewCustPin(Math.floor(1000 + Math.random() * 9000).toString());
  };

  // نوع الوقت: مفتوح أو مخصص (تحديد ساعات باليد)
  const [sessionType, setSessionType] = useState<'open' | 'fixed'>('open');
  // عدد الساعات اختياري يكتبه المستخدم يدوياً
  const [customHoursInput, setCustomHoursInput] = useState<string>('2');
  const [notes, setNotes] = useState('');

  const selectedStation = stations.find((s) => s.id === stationId);
  const selectedCust = customers.find((c) => c.id === selectedCustomerId);

  // حساب الساعات الرقمية بدقة
  const parsedHours = Math.max(0.25, parseFloat(customHoursInput) || 1);
  const calculatedMinutes = Math.round(parsedHours * 60);

  // حساب التكلفة التقريبية
  const estimatedCost = selectedStation 
    ? Math.round(parsedHours * selectedStation.hourlyRate)
    : 0;

  // حساب وقت الانتهاء التقريبي للجلسة محددة الوقت
  const getProjectedEndTime = (hours: number) => {
    const end = new Date(Date.now() + hours * 3600 * 1000);
    return end.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getStationTypeIcon = (type: StationType) => {
    switch (type) {
      case 'PC':
        return <GamingPcIcon className="w-4 h-4 text-cyan-500" />;
      case 'PS5':
        return <Gamepad2 className="w-4 h-4 text-blue-500" />;
      case 'XBOX':
        return <Tv className="w-4 h-4 text-emerald-500" />;
      case 'VIP_SIM':
        return <VipSimulatorIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <GamingPcIcon className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getVipBadgeColor = (level: string) => {
    switch (level) {
      case 'VIP فاخر':
        return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40';
      case 'ذهبي':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/40';
      case 'فضي':
        return 'bg-slate-400/20 text-slate-600 dark:text-slate-300 border-slate-400/40';
      default:
        return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation) {
      alert('يرجى اختيار جهاز أو محطة ألعاب شاغرة!');
      return;
    }

    let customerName = '';
    let customerPhone = '';
    let customerPin = '';
    let customerId = '';

    if (customerMode === 'existing' && selectedCust) {
      customerId = selectedCust.id;
      customerName = selectedCust.name;
      customerPhone = selectedCust.phone;
      customerPin = selectedCust.pin;
    } else {
      if (!newCustName.trim() || !newCustPhone.trim()) {
        alert('يرجى إدخال اسم ورقم هاتف اللاعب!');
        return;
      }
      const created = onQuickAddCustomer({
        name: newCustName.trim(),
        phone: newCustPhone.trim(),
        pin: newCustPin.trim() || '1234',
        balance: 0,
        vipLevel: 'برونزي',
      });
      customerId = created.id;
      customerName = created.name;
      customerPhone = created.phone;
      customerPin = created.pin;
    }

    onStartSession({
      stationId: selectedStation.id,
      stationName: selectedStation.name,
      stationType: selectedStation.type,
      customerId,
      customerName,
      customerPhone,
      customerPin,
      checkInTime: new Date().toISOString(),
      status: 'active',
      sessionType,
      allocatedMinutes: sessionType === 'fixed' ? calculatedMinutes : undefined,
      hourlyRate: selectedStation.hourlyRate,
      gamesPlayed: [], // تم حذف قسم الألعاب المختارة كما طلب المستخدم
      snacks: [],
      timeCost: 0,
      snacksCost: 0,
      discount: 0,
      finalAmount: 0,
      paymentStatus: 'unpaid',
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative bg-white dark:bg-[#0c1220] dark-card border border-slate-200 dark:border-emerald-500/30 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl dark:shadow-[0_0_50px_rgba(16,185,129,0.15)] space-y-5 my-6 overflow-hidden text-right"
        dir="rtl"
      >
        {/* Glow ambient background elements for Cyber Dark Mode */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* رأس النافذة المنبثقة Cyber Header */}
        <div className="relative flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/30">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wide">
                  بدء جلسة لعب جديدة
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  تسجيل دخول
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                اختيار الجهاز، بيانات اللاعب، وتحديد عدد الساعات بحرية تامة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-4">
          
          {/* ١. اختيار المحطة / الجهاز مع تصنيف الأقسام (كمبيوتر، بلايستيشن، إكس بوكس، محاكي VIP) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <GamingPcIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>اختيار الجهاز أو المحطة الشاغرة:</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                المتاح: {availableStations.length} جهاز
              </span>
            </div>

            {/* شريط أقسام الأجهزة مصغر ومضغوط (بخش کامپیوتر، اکس باکس، پلی استیشن، محاکی VIP) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 custom-scrollbar">
              <button
                type="button"
                onClick={() => setStationTypeFilter('all')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 border ${
                  stationTypeFilter === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                <span>الكل</span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-black/10 dark:bg-white/10 font-mono font-mono-digits">
                  {availableStations.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStationTypeFilter('PC')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 border ${
                  stationTypeFilter === 'PC'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                }`}
              >
                <GamingPcIcon className="w-3 h-3" />
                <span>كامپیوتر (PC)</span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-black/10 dark:bg-white/10 font-mono font-mono-digits">
                  {availableStations.filter(s => s.type === 'PC').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStationTypeFilter('PS5')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 border ${
                  stationTypeFilter === 'PS5'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                <Gamepad2 className="w-3 h-3" />
                <span>پلی‌استیشن (PS5)</span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-black/10 dark:bg-white/10 font-mono font-mono-digits">
                  {availableStations.filter(s => s.type === 'PS5').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStationTypeFilter('XBOX')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 border ${
                  stationTypeFilter === 'XBOX'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                <Tv className="w-3 h-3" />
                <span>اکس‌باکس (Xbox)</span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-black/10 dark:bg-white/10 font-mono font-mono-digits">
                  {availableStations.filter(s => s.type === 'XBOX').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStationTypeFilter('VIP_SIM')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 border ${
                  stationTypeFilter === 'VIP_SIM'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                }`}
              >
                <VipSimulatorIcon className="w-3 h-3" />
                <span>محاکی VIP</span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-black/10 dark:bg-white/10 font-mono font-mono-digits">
                  {availableStations.filter(s => s.type === 'VIP_SIM').length}
                </span>
              </button>
            </div>

            {filteredAvailableStations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                {filteredAvailableStations.map((st) => {
                  const isSelected = stationId === st.id;
                  return (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      key={st.id}
                      type="button"
                      onClick={() => setStationId(st.id)}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between relative overflow-hidden group ${
                        isSelected
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-400 text-emerald-950 dark:text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500 dark:ring-emerald-400'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-slate-800'
                      }`}
                    >
                      {/* Active indicator dot */}
                      {isSelected && (
                        <span className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      )}

                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                          {getStationTypeIcon(st.type)}
                          <span className="truncate">{st.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                          {st.type}
                        </span>
                        <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 font-mono-digits">
                          {formatCurrency(st.hourlyRate)}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : availableStations.length > 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-center space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  لا توجد أجهزة شاغرة في هذا القسم حالياً
                </p>
                <button
                  type="button"
                  onClick={() => setStationTypeFilter('all')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-xs"
                >
                  عرض جميع الأجهزة المتاحة ({availableStations.length})
                </button>
              </div>
            ) : (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs text-rose-700 dark:text-rose-400 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>جميع المحطات والأجهزة مشغولة حالياً! يرجى إنهاء جلسة أو تفريغ جهاز أولاً.</span>
              </div>
            )}
          </div>

          {/* ٢. بيانات اللاعب */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>بيانات اللاعب (الاسم، الهاتف، رمز PIN):</span>
              </label>

              {/* Toggle Existing vs New */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setCustomerMode('existing')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    customerMode === 'existing' 
                      ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  لاعب مسجل
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerMode('new')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    customerMode === 'new' 
                      ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  + لاعب جديد
                </button>
              </div>
            </div>

            {customerMode === 'existing' ? (
              <div className="space-y-2">
                {/* فیلد جستجوی زنده بر اساس نام، رمز PIN یا شماره تلفن */}
                <div className="relative">
                  <Search className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onChange={(e) => {
                      setCustomerSearchQuery(e.target.value);
                      setIsCustomerListExpanded(true);
                    }}
                    onFocus={() => setIsCustomerListExpanded(true)}
                    placeholder="ابحث باسم اللاعب أو رمز PIN السري أو رقم الهاتف (مثال: علي أو 5858)..."
                    className="w-full pr-10 pl-9 py-2.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition shadow-xs"
                  />
                  {customerSearchQuery ? (
                    <button
                      type="button"
                      onClick={() => setCustomerSearchQuery('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      title="مسح البحث"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCustomerListExpanded(!isCustomerListExpanded)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCustomerListExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* قائمة نتائج البحث بالاسم أو رمز PIN */}
                {(isCustomerListExpanded || customerSearchQuery.trim() !== '') && (
                  <div className="max-h-52 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40 p-1.5 shadow-xl space-y-1 custom-scrollbar">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((c) => {
                        const isSelected = c.id === selectedCustomerId;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomerId(c.id);
                              setIsCustomerListExpanded(false);
                            }}
                            className={`w-full p-2.5 rounded-xl text-right transition flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 dark:border-emerald-500/60 text-emerald-900 dark:text-emerald-300'
                                : 'hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}>
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-xs flex items-center gap-1.5">
                                  <span className="truncate">{c.name}</span>
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-black border ${getVipBadgeColor(c.vipLevel)}`}>
                                    {c.vipLevel}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-mono-digits flex items-center gap-2 mt-0.5">
                                  <span className="flex items-center gap-0.5">
                                    <KeyRound className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                    PIN: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{c.pin}</strong>
                                  </span>
                                  <span>هاتف: {c.phone}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 font-mono font-mono-digits">
                              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(c.balance)}
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center space-y-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          لم يتم العثور على لاعب بالاسم أو رمز PIN: <strong className="text-emerald-600 dark:text-emerald-400">{customerSearchQuery}</strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomerMode('new');
                            if (/^\d{3,6}$/.test(customerSearchQuery.trim())) {
                              setNewCustPin(customerSearchQuery.trim());
                            } else {
                              setNewCustName(customerSearchQuery.trim());
                            }
                            setCustomerSearchQuery('');
                            setIsCustomerListExpanded(false);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-sm inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>تسجيل «{customerSearchQuery}» كلاعب جديد فوراً</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* كارت اللاعب المختار الحالي مع تفاصيل الاسم والرمز السري والرصيد */}
                {selectedCust && (
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-500/40 text-xs shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-xs">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 dark:text-white text-xs">{selectedCust.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${getVipBadgeColor(selectedCust.vipLevel)}`}>
                            {selectedCust.vipLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px] font-mono-digits text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            رمز PIN: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedCust.pin}</strong>
                          </span>
                          <span>هاتف: {selectedCust.phone}</span>
                          <span>الرصيد: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(selectedCust.balance)}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCustomerListExpanded(!isCustomerListExpanded)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500/50 transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Search className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{isCustomerListExpanded ? 'إغلاق البحث' : 'تغيير أو بحث'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">اسم اللاعب:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علي التميمي"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رقم الهاتف:</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="07xxxxxxxx"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-left font-mono-digits transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رمز PIN السري:</label>
                    <button
                      type="button"
                      onClick={handleRegeneratePin}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                      title="توليد رمز جديد"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      توليد
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    dir="ltr"
                    value={newCustPin}
                    onChange={(e) => setNewCustPin(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-500/50 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-center font-mono-digits transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ٣. طريقة احتساب وقت الجلسة والساعات الاختيارية المكتوبة */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>طريقة احتساب وقت الجلسة:</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {sessionType === 'open' ? 'عداد تصاعدي مفتوح' : 'وقت محدد مسبقاً'}
              </span>
            </div>

            {/* Time mode selection cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition relative overflow-hidden ${
                  sessionType === 'open'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-400/80 ring-1 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="sessionType"
                  checked={sessionType === 'open'}
                  onChange={() => setSessionType('open')}
                  className="mt-0.5 accent-emerald-600 dark:accent-emerald-400"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>وقت مفتوح (Open)</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">حر</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    احتساب دقيق بالثواني والدقائق حتى تسجيل مغادرة اللاعب
                  </div>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition relative overflow-hidden ${
                  sessionType === 'fixed'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-400/80 ring-1 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="sessionType"
                  checked={sessionType === 'fixed'}
                  onChange={() => setSessionType('fixed')}
                  className="mt-0.5 accent-emerald-600 dark:accent-emerald-400"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>وقت محدد (أدخل الساعات)</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">تخصيص يدوي</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    اكتب عدد الساعات بحرية مع إشعار صوتي عند قرب الانتهاء
                  </div>
                </div>
              </label>
            </div>

            {/* إدخال عدد الساعات المخصص يدويًا واختياريًا */}
            {sessionType === 'fixed' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3.5 border border-emerald-200 dark:border-emerald-500/30 space-y-3 shadow-inner"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        عدد الساعات المطلوبة (كتابة حرة واختيارية):
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        اكتب عدد الساعات التي يريدها اللاعب مباشرة (مثلاً: 1 أو 1.5 أو 2 أو 3 أو 4...)
                      </p>
                    </div>
                  </div>

                  {/* حقل كتابة عدد الساعات باليد مع أزرار الزيادة والنقصان */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        const current = parseFloat(customHoursInput) || 1;
                        const next = Math.max(0.5, current - 0.5);
                        setCustomHoursInput(next.toString());
                      }}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-slate-600 transition shadow-xs active:scale-95"
                      title="إنقاص نصف ساعة"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative">
                      <input
                        type="number"
                        min="0.1"
                        max="99"
                        step="0.5"
                        required={sessionType === 'fixed'}
                        value={customHoursInput}
                        onChange={(e) => setCustomHoursInput(e.target.value)}
                        placeholder="2"
                        className="w-28 sm:w-32 text-center px-2 py-1.5 rounded-xl font-mono font-black text-sm text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 border-2 border-emerald-500 dark:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono-digits"
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">
                        ساعة
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = parseFloat(customHoursInput) || 0;
                        const next = current + 0.5;
                        setCustomHoursInput(next.toString());
                      }}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-slate-600 transition shadow-xs active:scale-95"
                      title="زيادة نصف ساعة"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* شريط الإحصائيات التقديرية الحية (الوقت والتكلفة ووقت الانتهاء) */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono font-mono-digits">
                  <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/70">
                    <div className="text-[10px] text-slate-400 font-sans">المدة بالدقائق</div>
                    <div className="text-xs font-black text-slate-800 dark:text-white mt-0.5">
                      {calculatedMinutes} دقيقة
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/70">
                    <div className="text-[10px] text-slate-400 font-sans">وقت الانتهاء التقريبي</div>
                    <div className="text-xs font-black text-cyan-600 dark:text-cyan-400 mt-0.5">
                      {getProjectedEndTime(parsedHours)}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/70">
                    <div className="text-[10px] text-slate-400 font-sans">المبلغ المقدر</div>
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {formatCurrency(estimatedCost)}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ملاحظات إضافية اختيارية */}
            <div className="pt-1">
              <input
                type="text"
                placeholder="ملاحظات إضافية على الجلسة (اختياري)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition"
              />
            </div>

          </div>

          {/* الملخص السفلي وأزرار الإجراءات Cyber Action Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                إلغاء
              </button>

              {selectedStation && (
                <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  المحطة: <strong className="text-slate-800 dark:text-white">{selectedStation.name}</strong> • السعر: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedStation.hourlyRate)}/ساعة</strong>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!selectedStation}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 dark:shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>بدء الجلسة وتشغيل العداد</span>
              {sessionType === 'fixed' && (
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[11px] font-mono font-bold font-mono-digits">
                  ({parsedHours} س)
                </span>
              )}
            </motion.button>
          </div>

        </form>

      </motion.div>
    </div>
  );
};
