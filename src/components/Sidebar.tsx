import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveSidebarTab, StaffOperator } from '../types';
import { Award, Badge, CalendarClock, ChevronLeft, ChevronRight, Container, Dot, FileSpreadsheet, Gamepad, Gamepad2, LayoutGrid, List, Lock, Monitor, Navigation, PlusCircle, QrCode, ReceiptText, Settings, ShieldCheck, ShoppingBag, Tag, TrendingUp, UserPlus, Users, X } from 'lucide-react';

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
  isCollapsed?: boolean;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
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
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed,
}) => {
  // Support both controlled and uncontrolled collapsed state
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

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
    { id: 'queue_booking', label: 'الحجوزات والانتظار', icon: CalendarClock, badge: pendingBookingsCount, badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800', category: 'شؤون اللاعبين والجلسات' },

    // قسم البوفيه والأسعار
    { id: 'goods', label: 'المنتجات والبوفيه', icon: ShoppingBag, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800', category: 'المبيعات والتعرفة' },
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
        className={`fixed top-0 bottom-0 right-0 z-50 flex flex-col bg-white/95 dark:bg-[#060a14]/95 backdrop-blur-2xl border-l border-emerald-100 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Floating Desktop Rail Toggle Button (Clearly positioned on the sidebar border edge) */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden lg:flex absolute top-6 -left-3.5 z-50 w-7 h-7 rounded-md bg-white dark:bg-[#0c1222] border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white shadow-md items-center justify-center transition-all cursor-pointer group"
          title={isCollapsed ? 'توسيع القائمة (فتح السايدبار)' : 'تصغير القائمة (طي السايدبار)'}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
          ) : (
            <ChevronRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>

        {/* 1. Sidebar Header */}
        <div className="h-16 sm:h-20 flex items-center justify-between px-3 sm:px-4 border-b border-emerald-100 dark:border-slate-800/80 bg-gradient-to-r from-emerald-50/60 to-white dark:from-[#090f1e] dark:to-[#060a14] shrink-0">
          {!isCollapsed ? (
            /* Expanded Header: Brand Identity (Clean & Minimal without extra button) */
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1px] shadow-sm shadow-emerald-500/20 shrink-0">
                  <div className="w-full h-full bg-white dark:bg-[#0c101c] rounded-[5px] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Gamepad2 className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>
                <div className="text-right truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Chakra_Petch',sans-serif] text-base font-black tracking-wider text-emerald-900 dark:text-emerald-400">
                      dij-tiem
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    إدارة صالات الألعاب
                  </p>
                </div>
              </div>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setIsOpenMobile(false)}
                className="lg:hidden p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Collapsed Header: Brand Logo Button replacing the arrow */
            <div className="flex items-center justify-center w-full">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="relative w-10 h-10 rounded-md bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-[1.5px] shadow-sm shadow-emerald-500/30 cursor-pointer group transition-all"
                title="توسيع القائمة الجانبية (انقر على الشعار للتوسيع)"
              >
                <div className="w-full h-full bg-white dark:bg-[#0c101c] rounded-[5px] flex items-center justify-center relative overflow-hidden transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-[#10192e]">
                  {/* Brand Gamepad Logo Icon */}
                  <Gamepad2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] group-hover:scale-110 transition-transform drop-shadow-[0_1px_4px_rgba(16,185,129,0.3)]" />
                  
                  {/* Status Indicator Dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-2 ring-white dark:ring-[#0c101c]" />
                </div>
              </motion.button>
            </div>
          )}
        </div>

        {/* 2. Quick Action Launcher Buttons */}
        <div className="h-12 px-2.5 border-b border-emerald-200/80 dark:border-emerald-500/25 bg-slate-50/50 dark:bg-[#0a0f1d] flex items-center shrink-0">
          {!isCollapsed ? (
            <div className="grid grid-cols-2 gap-2 w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => {
                  onOpenNewSession();
                  setIsOpenMobile(false);
                }}
                className="h-8 px-2 rounded-md text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-xs shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition font-gaming cursor-pointer"
              >
                <div className="w-4 h-4 rounded-[3px] bg-white/20 flex items-center justify-center">
                  <PlusCircle className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>بدء جلسة</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => {
                  onOpenNewCustomer();
                  setIsOpenMobile(false);
                }}
                className="h-8 px-2 rounded-md text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 hover:bg-emerald-50/70 dark:hover:bg-slate-800 border border-emerald-300/80 dark:border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <div className="w-4 h-4 rounded-[3px] bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                  <UserPlus className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span>تسجيل لاعب</span>
              </motion.button>
            </div>
          ) : (
            /* Collapsed Quick Actions: Sharp Rounded-md Buttons */
            <div className="flex items-center justify-center gap-1.5 w-full">
              <button
                type="button"
                onClick={onOpenNewSession}
                title="بدء جلسة جديدة"
                className="w-7 h-7 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs cursor-pointer hover:brightness-110 transition"
              >
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={onOpenNewCustomer}
                title="تسجيل لاعب جديد"
                className="w-7 h-7 rounded-md bg-white dark:bg-slate-900 border border-emerald-300/80 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 flex items-center justify-center cursor-pointer hover:bg-emerald-50 dark:hover:bg-slate-800 transition shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 3. Navigation Items (Scrollable List with Sharp Micro-Icon Badges) */}
        <div className="flex-1 overflow-y-auto px-2 py-2.5 space-y-1 custom-scrollbar">
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
                  <div className="pt-2.5 pb-1 px-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </div>
                )}

                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => handleSelect(item.id, item.label)}
                  id={`sidebar-tab-${item.id}`}
                  title={isCollapsed ? (isLockedSection ? `${item.label} (مقفل برمز)` : item.label) : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-bold transition-all relative group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-xs shadow-emerald-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-slate-800/60 border border-transparent hover:border-emerald-200/60 dark:hover:border-slate-800/80'
                  }`}
                >
                  {/* Pro Sharp Icon Badge (rounded-md with smaller radius) */}
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all duration-200 relative ${
                      isActive
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white border border-emerald-500/20'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-teal-200 animate-ping" />
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <span className="flex-1 text-right truncate">
                      {item.label}
                    </span>
                  )}

                  {!isCollapsed && isLockedSection && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-[10px] font-medium border border-amber-200/70 dark:border-amber-800/50">
                      <Lock className="w-2.5 h-2.5" />
                      <span>مقفل</span>
                    </span>
                  )}

                  {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-[4px] font-bold shadow-xs ${
                      item.badgeColor || (isActive ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300')
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {isCollapsed && isLockedSection && (
                    <span className="absolute top-1 left-1 w-3 h-3 rounded-[3px] bg-amber-500/90 text-white flex items-center justify-center text-[7px] ring-1 ring-white dark:ring-slate-900">
                      <Lock className="w-2 h-2" />
                    </span>
                  )}

                  {isCollapsed && !isLockedSection && item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-[2px] bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
                  )}
                </motion.button>
              </React.Fragment>
            );
          })}
        </div>

        {/* 4. Sidebar Footer: Current Operator Badge */}
        <div className="p-2.5 border-t border-emerald-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#060a14] shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 p-2 rounded-md bg-white dark:bg-[#0b1020] border border-emerald-100 dark:border-slate-800 shadow-xs">
              <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0 font-gaming">
                {currentOperator ? currentOperator.name.slice(0, 1) : 'ع'}
              </div>
              <div className="text-right truncate flex-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentOperator ? currentOperator.name : 'علي الكرخي'}
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{currentOperator ? currentOperator.role : 'المدير العام'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div 
                title={currentOperator ? `${currentOperator.name} (${currentOperator.role})` : 'المشغل الحالي'}
                className="w-8 h-8 rounded-md bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs font-gaming"
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
