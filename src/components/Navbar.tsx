import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Gamepad2, 
  Clock, 
  Users, 
  ReceiptText, 
  Coffee, 
  BarChart3, 
  PlusCircle, 
  UserPlus,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'stations' | 'sessions' | 'customers' | 'snacks' | 'reports';
  setActiveTab: (tab: 'stations' | 'sessions' | 'customers' | 'snacks' | 'reports') => void;
  onOpenNewSession: () => void;
  onOpenNewCustomer: () => void;
  activeSessionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewSession,
  onOpenNewCustomer,
  activeSessionsCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  interface NavItem {
    id: 'stations' | 'sessions' | 'customers' | 'snacks' | 'reports';
    label: string;
    icon: any;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'stations', label: 'الرئيسية والمحطات النشطة', icon: LayoutDashboard, badge: activeSessionsCount },
    { id: 'sessions', label: 'سجل الجلسات والفواتير', icon: ReceiptText },
    { id: 'customers', label: 'إدارة اللاعبين ورمز PIN', icon: Users },
    { id: 'snacks', label: 'بوفيه التسالي والمشروبات', icon: Coffee },
    { id: 'reports', label: 'التقارير المالية والأرباح (دينار)', icon: BarChart3 },
  ];

  return (
    <header className="bg-[#0b0d14]/90 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-30 shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* الشعار والهوية البصرية گیمینگ مشکی و طلایی */}
          <div className="flex items-center gap-3.5">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 p-[1.5px] shadow-lg shadow-amber-500/25"
            >
              <div className="w-full h-full bg-[#0d0f17] rounded-[14px] flex items-center justify-center border border-amber-500/30">
                <Gamepad2 className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <span className="absolute -top-0.5 -left-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Chakra_Petch',sans-serif] text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-sm">
                  dij-tiem
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  گیمینگ کلاب • طلایی
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                سیستم گیمینگ، زمان‌سنجی هوشمند، مدیریت بازیکنان و بوفه
              </p>
            </div>
          </div>

          {/* ساعت و زمان گیمینگ زنده */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900/80 border border-amber-500/25 shadow-inner">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <div className="text-right">
              <div className="text-sm font-black font-mono tracking-widest text-amber-300">
                {currentTime || '00:00:00'}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium">
                {currentDate}
              </div>
            </div>
          </div>

          {/* دکمه‌های اقدام سریع با استایل مشکی و طلایی */}
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              id="btn-quick-new-customer"
              onClick={onOpenNewCustomer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-amber-400 bg-zinc-900/90 hover:bg-amber-500/10 border border-amber-500/40 transition-all shadow-md active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">ثبت بازیکن جدید</span>
              <span className="sm:hidden">+ بازیکن</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              id="btn-quick-new-session"
              onClick={onOpenNewSession}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>شروع نشست جدید (ورود)</span>
            </motion.button>
          </div>

        </div>

        {/* نوار بخش‌ها و تب‌ها در تم گیمینگ مشکی و طلایی */}
        <nav className="flex space-x-2 space-x-reverse overflow-x-auto py-2.5 border-t border-amber-500/15 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
                    : 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-900/70 border border-transparent hover:border-amber-500/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400/80'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

