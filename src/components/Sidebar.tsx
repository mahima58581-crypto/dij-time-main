import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Monitor, 
  ReceiptText, 
  Users, 
  Award, 
  ShoppingBag, 
  LayoutGrid, 
  Tag, 
  ShieldCheck, 
  CalendarClock, 
  TrendingUp, 
  FileSpreadsheet, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  Sparkles,
  UserPlus,
  PlusCircle,
  Clock,
  QrCode,
  Lock
} from 'lucide-react';
import { ActiveSidebarTab, StaffOperator } from '../types';

interface SidebarProps {
  activeTab: ActiveSidebarTab;
  setActiveTab: (tab: ActiveSidebarTab) => void;
  activeSessionsCount: number;
  lowStockCount: number;
  pendingBookingsCount: number;
  pendingDeskOrdersCount?: number;
  currentOperator?: StaffOperator;
  onOpenNewSession: () => void;
  onOpenNewCustomer: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  isSecurityUnlocked?: boolean;
  onRequireUnlock?: (targetTab: ActiveSidebarTab, sectionLabel: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeSessionsCount,
  lowStockCount,
  pendingBookingsCount,
  pendingDeskOrdersCount = 0,
  currentOperator,
  onOpenNewSession,
  onOpenNewCustomer,
  isOpenMobile,
  setIsOpenMobile,
  isSecurityUnlocked = false,
  onRequireUnlock,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  interface MenuItem {
    id: ActiveSidebarTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
    category?: string;
  }

  const menuItems: MenuItem[] = [
    // قسم المراقبة والمحطات
    { id: 'station_management', label: 'إدارة المحطات', icon: Monitor, category: 'الأجهزة والعتاد' },
    { id: 'stations_overview', label: 'نظرة عامة على المحطات', icon: LayoutGrid, category: 'الأجهزة والعتاد' },
    
    // قسم الفواتير واللاعبين
    { id: 'active_invoices', label: 'الفواتير النشطة', icon: ReceiptText, badge: activeSessionsCount, badgeColor: 'bg-emerald-600 text-white font-black', category: 'شؤون اللاعبين والجلسات' },
    { id: 'customers', label: 'العملاء واللاعبين', icon: Users, category: 'شؤون اللاعبين والجلسات' },
    { id: 'customer_levels', label: 'مستويات VIP', icon: Award, category: 'شؤون اللاعبين والجلسات' },
    { id: 'queue_booking', label: 'الحجوزات والانتظار', icon: CalendarClock, badge: pendingBookingsCount, badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200', category: 'شؤون اللاعبين والجلسات' },

    // قسم البوفيه والأسعار
    { id: 'goods', label: 'المنتجات والبوفيه', icon: ShoppingBag, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200', category: 'المبيعات والتعرفة' },
    { id: 'qr_desk_orders', label: 'طلبات الطاولات (QR)', icon: QrCode, badge: pendingDeskOrdersCount > 0 ? pendingDeskOrdersCount : undefined, badgeColor: 'bg-amber-500 text-slate-950 font-black animate-pulse', category: 'المبيعات والتعرفة' },
    { id: 'tariffs', label: 'التعرفة والباقات', icon: Tag, category: 'المبيعات والتعرفة' },

    // قسم المالية والموظفين
    { id: 'users_staff', label: 'طاقم العمل والموظفين', icon: ShieldCheck, category: 'المالية والتقارير' },
    { id: 'cashflow', label: 'الإيرادات والمصروفات', icon: TrendingUp, category: 'المالية والتقارير' },
    { id: 'expense_reports', label: 'تقارير النفقات والأرباح', icon: FileSpreadsheet, category: 'المالية والتقارير' },

    // الإعدادات
    { id: 'settings', label: 'إعدادات النظام', icon: Settings, category: 'النظام' },
  ];

  const handleSelect = (tab: ActiveSidebarTab, label: string) => {
    if (['expense_reports', 'settings'].includes(tab) && !isSecurityUnlocked && onRequireUnlock) {
      onRequireUnlock(tab, label);
      setIsOpenMobile(false);
      return;
    }
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpenMobile(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 flex flex-col bg-white/95 dark:bg-[#060a14]/95 backdrop-blur-2xl border-l border-emerald-100 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 sm:h-20 flex items-center justify-between px-4 border-b border-emerald-100 dark:border-slate-800/80 bg-gradient-to-r from-emerald-50/60 to-white dark:from-[#090f1e] dark:to-[#060a14]">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 overflow-hidden group cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 6 }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px] shadow-md shadow-emerald-500/20 shrink-0 relative"
              >
                <div className="w-full h-full bg-white dark:bg-[#0c101c] rounded-[14px] flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500">
                  <Gamepad2 className="w-5 h-5 stroke-[2.2] transition-transform group-hover:scale-110" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-ping" />
              </motion.div>
              <div className="text-right truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-['Chakra_Petch',sans-serif] text-lg font-black tracking-wider text-emerald-800 dark:text-emerald-400">
                    dij-tiem
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  نظام إدارة ومحاسبة صالة الألعاب
                </p>
              </div>
            </motion.div>
          )}

          {isCollapsed && (
            <div className="mx-auto">
              <motion.div 
                whileHover={{ scale: 1.12, rotate: 6 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px] flex items-center justify-center shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <div className="w-full h-full bg-white dark:bg-[#0c101c] rounded-[14px] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Gamepad2 className="w-5 h-5 stroke-[2.2]" />
                </div>
              </motion.div>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-100 dark:hover:bg-slate-700 transition"
            title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
          >
            {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Buttons on top of Sidebar */}
        <div className="h-12 px-3 border-b border-emerald-200/80 dark:border-emerald-500/25 bg-slate-50/50 dark:bg-[#0a0f1d] flex items-center">
          {!isCollapsed ? (
            <div className="grid grid-cols-2 gap-2 w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onOpenNewSession();
                  setIsOpenMobile(false);
                }}
                className="h-8 px-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-sm shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition font-gaming"
              >
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>بدء جلسة</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onOpenNewCustomer();
                  setIsOpenMobile(false);
                }}
                className="h-8 px-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800/90 hover:bg-emerald-100/70 dark:hover:bg-slate-700 border border-emerald-200 dark:border-slate-700 flex items-center justify-center gap-1 transition"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>تسجيل لاعب</span>
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 w-full">
              <button
                onClick={onOpenNewSession}
                title="بدء جلسة جديدة"
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm shadow-emerald-500/25"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={onOpenNewCustomer}
                title="تسجيل لاعب جديد"
                className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 flex items-center justify-center"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items (Scrollable List) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showCategory = 
              !isCollapsed && 
              (idx === 0 || menuItems[idx - 1].category !== item.category);

            const isLockedSection = (item.id === 'expense_reports' || item.id === 'settings') && !isSecurityUnlocked;

            return (
              <React.Fragment key={item.id}>
                {showCategory && item.category && (
                  <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-emerald-800/70 dark:text-emerald-400/80 uppercase tracking-wider">
                    {item.category}
                  </div>
                )}

                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(item.id, item.label)}
                  id={`sidebar-tab-${item.id}`}
                  title={isCollapsed ? (isLockedSection ? `${item.label} (مقفل برمز)` : item.label) : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-md shadow-emerald-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-slate-800/60 border border-transparent hover:border-emerald-200/60 dark:hover:border-slate-700/60'
                  }`}
                >
                  {/* Animated Cyber Icon Badge */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ duration: 0.2 }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 relative ${
                      isActive
                        ? 'bg-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.45)] ring-1 ring-white/50'
                        : 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_12px_rgba(16,185,129,0.45)] border border-emerald-500/20'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'stroke-[2.5]' : 'stroke-2'
                    }`} />
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-teal-200 animate-ping" />
                    )}
                  </motion.div>
                  
                  {!isCollapsed && (
                    <span className="flex-1 text-right truncate">
                      {item.label}
                    </span>
                  )}

                  {!isCollapsed && isLockedSection && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-[10px] font-medium border border-amber-200/70 dark:border-amber-800/50">
                      <Lock className="w-2.5 h-2.5" />
                      <span>مقفل</span>
                    </span>
                  )}

                  {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full font-bold shadow-xs ${
                      item.badgeColor || (isActive ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300')
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {isCollapsed && isLockedSection && (
                    <span className="absolute top-1 left-1 w-3 h-3 rounded-full bg-amber-500/90 text-white flex items-center justify-center text-[7px] ring-2 ring-white dark:ring-slate-900">
                      <Lock className="w-2 h-2" />
                    </span>
                  )}

                  {isCollapsed && !isLockedSection && item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </motion.button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Operator Profile & Shift info at bottom */}
        <div className="p-3 border-t border-emerald-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#060a14]">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-[#0b1020] border border-emerald-100 dark:border-slate-800 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0 font-gaming">
                {currentOperator ? currentOperator.name.slice(0, 1) : 'ع'}
              </div>
              <div className="text-right truncate flex-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentOperator ? currentOperator.name : 'علي الكرخي'}
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{currentOperator ? currentOperator.role : 'المدير العام'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div 
                title={currentOperator ? `${currentOperator.name} (${currentOperator.role})` : 'أمين الصندوق'}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs font-gaming"
              >
                {currentOperator ? currentOperator.name.slice(0, 1) : 'ع'}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
