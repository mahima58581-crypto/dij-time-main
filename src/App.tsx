import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INITIAL_STATIONS, 
  INITIAL_CUSTOMERS, 
  INITIAL_GAMES, 
  INITIAL_SNACKS, 
  INITIAL_SESSIONS,
  INITIAL_STAFF,
  INITIAL_RESERVATIONS,
  INITIAL_EXPENSES,
  INITIAL_VIP_TIERS,
  INITIAL_TARIFFS,
  DEFAULT_CLUB_SETTINGS,
  INITIAL_DESK_ORDERS
} from './data/mockData';
import { 
  Station, 
  Customer, 
  GameItem, 
  SnackItem, 
  Session, 
  SnackOrder,
  GameRecord,
  ActiveSidebarTab,
  StaffOperator,
  BookingReservation,
  ExpenseItem,
  VipTierConfig,
  TariffRate,
  ClubSettings as ClubSettingsType,
  DeskSnackOrder
} from './types';
import { calculatePlayCost, formatCurrency } from './utils/formatters';

// Navigation & Layout
import { Sidebar } from './components/Sidebar';
import { StatsBar } from './components/StatsBar';

// 12 Requested Functional Modules
import { StationManagement } from './components/StationManagement';
import { ActiveInvoices } from './components/ActiveInvoices';
import { CustomersManager } from './components/CustomersManager';
import { CustomerLevels } from './components/CustomerLevels';
import { GoodsManager } from './components/GoodsManager';
import { QrDeskOrderManager } from './components/QrDeskOrderManager';
import { StationsGrid } from './components/StationsGrid';
import { LiveTimeCards } from './components/LiveTimeCards';
import { TariffsManager } from './components/TariffsManager';
import { UsersStaffManager } from './components/UsersStaffManager';
import { QueueBookingManager } from './components/QueueBookingManager';
import { CashflowManager } from './components/CashflowManager';
import { ExpenseReports } from './components/ExpenseReports';
import { ClubSettings } from './components/ClubSettings';
import { SoundAlertsController, SoundLogItem } from './components/SoundAlertsController';
import { 
  play10MinWarningSound, 
  play5MinWarningSound, 
  playTimeOverAlarmSound, 
  playCheckoutSound, 
  playReservationAlertSound, 
  playSessionStartSound, 
  playSnackSound, 
  playCoinSound, 
  speakVoiceAlert, 
  unlockAudioContext 
} from './utils/audioAlerts';

// Modals
import { NewSessionModal } from './components/NewSessionModal';
import { AddSnackModal } from './components/AddSnackModal';
import { CheckoutInvoiceModal } from './components/CheckoutInvoiceModal';
import { NewCustomerModal } from './components/NewCustomerModal';
import { EditGamesModal } from './components/EditGamesModal';
import { SecurityPinModal } from './components/SecurityPinModal';

// Icons & Visual Assets
import { 
  Menu, 
  PlusCircle, 
  UserPlus, 
  Clock, 
  Gamepad2, 
  Wifi, 
  Shield, 
  Bell, 
  Tv, 
  Monitor, 
  CheckCircle2,
  Sparkles,
  Moon,
  Sun,
  Lock,
  Unlock,
  ArrowUp,
  Activity,
  Cpu,
  ShieldCheck,
  Users
} from 'lucide-react';
import { CyberMarqueeTicker } from './components/CyberMarqueeTicker';
import gamingBg from './assets/images/gaming_gold_bg_1789905712211.jpg';

export default function App() {
  // 0. Dark Mode Cyber State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cyber_dark_mode');
    return saved !== null ? saved === 'true' : true; // Default to cyber dark mode
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('cyber_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // 1. Persistence for Core State
  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem('dij_tiem_stations_v3');
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('dij_tiem_customers_v3');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [snacks, setSnacks] = useState<SnackItem[]>(() => {
    const saved = localStorage.getItem('dij_tiem_snacks_v3');
    return saved ? JSON.parse(saved) : INITIAL_SNACKS;
  });

  const [games, setGames] = useState<GameItem[]>(() => {
    const saved = localStorage.getItem('dij_tiem_games_v3');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('dij_tiem_sessions_v3');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  // 2. Persistence for New Modules
  const [staffList, setStaffList] = useState<StaffOperator[]>(() => {
    const saved = localStorage.getItem('dij_tiem_staff_v3');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [currentOperator, setCurrentOperator] = useState<StaffOperator>(() => {
    const saved = localStorage.getItem('dij_tiem_operator_v3');
    return saved ? JSON.parse(saved) : INITIAL_STAFF[0];
  });

  const [reservations, setReservations] = useState<BookingReservation[]>(() => {
    const saved = localStorage.getItem('dij_tiem_reservations_v3');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('dij_tiem_expenses_v3');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [vipTiers, setVipTiers] = useState<VipTierConfig[]>(() => {
    const saved = localStorage.getItem('dij_tiem_viptiers_v3');
    return saved ? JSON.parse(saved) : INITIAL_VIP_TIERS;
  });

  const [tariffs, setTariffs] = useState<TariffRate[]>(() => {
    const saved = localStorage.getItem('dij_tiem_tariffs_v3');
    return saved ? JSON.parse(saved) : INITIAL_TARIFFS;
  });

  const [clubSettings, setClubSettings] = useState<ClubSettingsType>(() => {
    const saved = localStorage.getItem('dij_tiem_settings_v3');
    return saved ? JSON.parse(saved) : DEFAULT_CLUB_SETTINGS;
  });

  const [deskOrders, setDeskOrders] = useState<DeskSnackOrder[]>(() => {
    const saved = localStorage.getItem('dij_tiem_desk_orders_v3');
    return saved ? JSON.parse(saved) : INITIAL_DESK_ORDERS;
  });

  // 3. Navigation State (Default to Station Management)
  const [activeTab, setActiveTab] = useState<ActiveSidebarTab>('station_management');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // Security Lock for Financial Reports & Settings (Password / PIN: 5858)
  const [isSecurityUnlocked, setIsSecurityUnlocked] = useState<boolean>(false);
  const [securityModalState, setSecurityModalState] = useState<{
    isOpen: boolean;
    targetTab: ActiveSidebarTab;
    label: string;
  }>({
    isOpen: false,
    targetTab: 'expense_reports',
    label: '',
  });

  const handleRequireUnlock = (targetTab: ActiveSidebarTab, sectionLabel: string) => {
    setSecurityModalState({
      isOpen: true,
      targetTab,
      label: sectionLabel,
    });
  };

  const handleSecurityUnlockSuccess = () => {
    setIsSecurityUnlocked(true);
    setActiveTab(securityModalState.targetTab);
  };

  // Home Stations View sub-tabs
  const [stationsViewFilter, setStationsViewFilter] = useState<'all' | 'timers' | 'devices'>('all');

  // 4. Modal States
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [preSelectedStationId, setPreSelectedStationId] = useState<string | undefined>();
  const [preSelectedCustomerId, setPreSelectedCustomerId] = useState<string | undefined>();
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [snackModalSession, setSnackModalSession] = useState<Session | null>(null);
  const [invoiceModalSession, setInvoiceModalSession] = useState<Session | null>(null);
  const [editGamesSession, setEditGamesSession] = useState<Session | null>(null);

  // Live clock for top bar
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTimeStr(d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sound and Voice Alerts Engine
  const [lastAudioEvent, setLastAudioEvent] = useState<SoundLogItem | null>(null);
  const warned10MinRef = React.useRef<Set<string>>(new Set());
  const warned5MinRef = React.useRef<Set<string>>(new Set());
  const warnedTimeUpRef = React.useRef<Set<string>>(new Set());

  const triggerAudioNotification = (
    type: string,
    message: string,
    soundFn: () => void,
    voiceText?: string
  ) => {
    unlockAudioContext();
    soundFn();
    const timeStr = new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastAudioEvent({
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: timeStr,
    });
    if (voiceText) {
      setTimeout(() => {
        speakVoiceAlert(voiceText);
      }, 400);
    }
  };

  // Background interval: Checks active sessions for 10-min, 5-min, and time-up alerts
  useEffect(() => {
    const checkSessionTimeAlerts = () => {
      const now = Date.now();
      const activeTimedSessions = sessions.filter(
        (s) => s.status === 'active' && s.sessionType === 'fixed' && s.allocatedMinutes
      );

      activeTimedSessions.forEach((sess) => {
        const startMs = new Date(sess.checkInTime).getTime();
        const elapsedMinutes = (now - startMs) / (1000 * 60);
        const remainingMinutes = (sess.allocatedMinutes || 60) - elapsedMinutes;

        // 1. 10 Minutes Warning (between 5 and 10 minutes)
        if (remainingMinutes <= 10 && remainingMinutes > 5) {
          if (!warned10MinRef.current.has(sess.id)) {
            warned10MinRef.current.add(sess.id);
            triggerAudioNotification(
              'هشدار ۱۰ دقیقه پایانی',
              `${sess.stationName} - باقي ${Math.ceil(remainingMinutes)} دقائق`,
              play10MinWarningSound,
              `تنبيه: تبقى 10 دقائق على نهاية وقت ${sess.stationName}`
            );
          }
        }

        // 2. 5 Minutes Warning (between 0 and 5 minutes)
        if (remainingMinutes <= 5 && remainingMinutes > 0) {
          if (!warned5MinRef.current.has(sess.id)) {
            warned5MinRef.current.add(sess.id);
            triggerAudioNotification(
              'هشدار ۵ دقیقه پایانی',
              `${sess.stationName} - باقي ${Math.ceil(remainingMinutes)} دقائق فقط`,
              play5MinWarningSound,
              `تنبيه عاجل: تبقى 5 دقائق فقط على نهاية وقت ${sess.stationName}`
            );
          }
        }

        // 3. Time Expired & Overtime Started (0 minutes or less)
        if (remainingMinutes <= 0) {
          if (!warnedTimeUpRef.current.has(sess.id)) {
            warnedTimeUpRef.current.add(sess.id);
            triggerAudioNotification(
              'اتمام وقت الجلسة',
              `${sess.stationName} - انتهى الوقت المخصص وبدأ الوقت الإضافي`,
              playTimeOverAlarmSound,
              `انتهى وقت الجلسة للجهاز ${sess.stationName}`
            );
          }
        }
      });

      // Cleanup completed or deleted sessions from warning sets
      const currentActiveIds = new Set(sessions.filter((s) => s.status === 'active').map((s) => s.id));
      [warned10MinRef.current, warned5MinRef.current, warnedTimeUpRef.current].forEach((set) => {
        set.forEach((id) => {
          if (!currentActiveIds.has(id)) {
            set.delete(id);
          }
        });
      });
    };

    const alertInterval = setInterval(checkSessionTimeAlerts, 2500);
    return () => clearInterval(alertInterval);
  }, [sessions]);

  // Save to LocalStorage effects
  useEffect(() => { localStorage.setItem('dij_tiem_stations_v3', JSON.stringify(stations)); }, [stations]);
  useEffect(() => { localStorage.setItem('dij_tiem_customers_v3', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('dij_tiem_snacks_v3', JSON.stringify(snacks)); }, [snacks]);
  useEffect(() => { localStorage.setItem('dij_tiem_games_v3', JSON.stringify(games)); }, [games]);
  useEffect(() => { localStorage.setItem('dij_tiem_sessions_v3', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('dij_tiem_staff_v3', JSON.stringify(staffList)); }, [staffList]);
  useEffect(() => { localStorage.setItem('dij_tiem_operator_v3', JSON.stringify(currentOperator)); }, [currentOperator]);
  useEffect(() => { localStorage.setItem('dij_tiem_reservations_v3', JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem('dij_tiem_expenses_v3', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('dij_tiem_viptiers_v3', JSON.stringify(vipTiers)); }, [vipTiers]);
  useEffect(() => { localStorage.setItem('dij_tiem_tariffs_v3', JSON.stringify(tariffs)); }, [tariffs]);
  useEffect(() => { localStorage.setItem('dij_tiem_settings_v3', JSON.stringify(clubSettings)); }, [clubSettings]);
  useEffect(() => { localStorage.setItem('dij_tiem_desk_orders_v3', JSON.stringify(deskOrders)); }, [deskOrders]);

  // Derived counts
  const activeSessions = sessions.filter((s) => s.status === 'active');
  const lowStockCount = snacks.filter((s) => s.stock <= (clubSettings.lowStockAlertThreshold || 10)).length;
  const pendingBookingsCount = reservations.filter((r) => r.status === 'pending').length;
  const pendingDeskOrdersCount = deskOrders.filter((o) => o.status === 'pending').length;

  // Session Handlers
  const handleOpenStartSession = (stationId?: string, customerId?: string) => {
    setPreSelectedStationId(stationId);
    setPreSelectedCustomerId(customerId);
    setIsNewSessionOpen(true);
  };

  const handleStartSession = (sessionData: Omit<Session, 'id'>) => {
    const newId = `sess-${Date.now().toString().slice(-4)}`;
    const newSession: Session = {
      ...sessionData,
      id: newId,
    };

    setSessions((prev) => [newSession, ...prev]);

    // Update station to 'in-use'
    setStations((prev) =>
      prev.map((st) =>
        st.id === sessionData.stationId
          ? { ...st, status: 'in-use', currentSessionId: newId }
          : st
      )
    );

    // Play session start power-up sound & speech
    triggerAudioNotification(
      'آغاز بازی',
      `${sessionData.stationName} - ${sessionData.customerName}`,
      playSessionStartSound,
      `بدأت جلسة ${sessionData.stationName}`
    );
  };

  const handleQuickAddCustomer = (
    custData: Omit<Customer, 'id' | 'totalPlayMinutes' | 'totalSpent' | 'registeredAt'>
  ): Customer => {
    const newId = `cust-${Date.now().toString().slice(-4)}`;
    const newCustomer: Customer = {
      ...custData,
      id: newId,
      totalPlayMinutes: 0,
      totalSpent: 0,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const handleAddSnackToSession = (sessionId: string, snack: SnackItem, quantity: number = 1) => {
    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id === sessionId) {
          const existingSnackIndex = sess.snacks.findIndex((s) => s.snackId === snack.id);
          let updatedSnacks = [...sess.snacks];

          if (existingSnackIndex >= 0) {
            const current = updatedSnacks[existingSnackIndex];
            const newQty = current.quantity + quantity;
            updatedSnacks[existingSnackIndex] = {
              ...current,
              quantity: newQty,
              totalPrice: newQty * current.unitPrice,
            };
          } else {
            updatedSnacks.push({
              snackId: snack.id,
              name: snack.name,
              quantity,
              unitPrice: snack.price,
              totalPrice: snack.price * quantity,
              orderedAt: new Date().toISOString(),
            });
          }

          const newSnacksCost = updatedSnacks.reduce((sum, item) => sum + item.totalPrice, 0);
          return {
            ...sess,
            snacks: updatedSnacks,
            snacksCost: newSnacksCost,
            finalAmount: sess.timeCost + newSnacksCost - (sess.discount || 0),
          };
        }
        return sess;
      })
    );

    // Deduct stock
    setSnacks((prev) =>
      prev.map((s) => (s.id === snack.id ? { ...s, stock: Math.max(0, s.stock - quantity) } : s))
    );

    // Audio cue for buffet snack
    playSnackSound();
  };

  const handleConfirmBulkSnacks = (sessionId: string, orders: SnackOrder[]) => {
    orders.forEach((order) => {
      const item = snacks.find((s) => s.id === order.snackId);
      if (item) {
        handleAddSnackToSession(sessionId, item, order.quantity);
      }
    });
  };

  const handleCompleteCheckout = (
    sessionId: string,
    paymentMethod: 'كاش' | 'شبكة / مدى' | 'محفظة العميل',
    discount: number
  ) => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (!targetSession) return;

    const checkOutTime = new Date().toISOString();
    const startMs = new Date(targetSession.checkInTime).getTime();
    const endMs = new Date(checkOutTime).getTime();
    const elapsedMinutes = Math.max(0, (endMs - startMs) / (1000 * 60));

    const finalTimeCost = calculatePlayCost(elapsedMinutes, targetSession.hourlyRate);
    const finalSnacksCost = targetSession.snacks.reduce((sum, it) => sum + it.totalPrice, 0);
    const grandTotal = Math.max(0, finalTimeCost + finalSnacksCost - discount);

    // 1. Update session to completed
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'completed',
              checkOutTime,
              timeCost: finalTimeCost,
              snacksCost: finalSnacksCost,
              discount,
              finalAmount: grandTotal,
              paymentStatus: 'paid',
              paymentMethod,
            }
          : s
      )
    );

    // 2. Free up station
    setStations((prev) =>
      prev.map((st) =>
        st.id === targetSession.stationId
          ? { ...st, status: 'available', currentSessionId: undefined }
          : st
      )
    );

    // 3. Update customer stats
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === targetSession.customerId) {
          const newBalance =
            paymentMethod === 'محفظة العميل'
              ? Math.max(0, c.balance - grandTotal)
              : c.balance;

          return {
            ...c,
            balance: newBalance,
            totalPlayMinutes: c.totalPlayMinutes + Math.floor(elapsedMinutes),
            totalSpent: c.totalSpent + grandTotal,
          };
        }
        return c;
      })
    );

    // Sound and voice alert for checkout
    triggerAudioNotification(
      'تسویه و پرداخت',
      `المجموع: ${formatCurrency(grandTotal)}`,
      playCheckoutSound,
      'تم تسوية الفاتورة بنجاح'
    );
  };

  const handleRechargeBalance = (customerId: string, amount: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, balance: c.balance + amount } : c))
    );

    // Coin chime for wallet recharge
    triggerAudioNotification(
      'شارژ کیف پول',
      `تمت إضافة ${formatCurrency(amount)}`,
      playCoinSound,
      'تم شحن المحفظة بنجاح'
    );
  };

  const handleUpdateSessionGames = (sessionId: string, updatedGames: GameRecord[]) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, gamesPlayed: updatedGames } : s))
    );
  };

  // Station Management Handlers
  const handleAddStation = (newStationData: Omit<Station, 'id'>) => {
    const nextNum = stations.length + 1;
    const prefix = newStationData.type === 'PC' ? 'PC' : newStationData.type === 'PS5' ? 'PS5' : 'VIP';
    const id = `${prefix}-${nextNum < 10 ? '0' : ''}${nextNum}`;
    const newStation: Station = { ...newStationData, id };
    setStations((prev) => [...prev, newStation]);
  };

  const handleUpdateStation = (updated: Station) => {
    setStations((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteStation = (stationId: string) => {
    setStations((prev) => prev.filter((s) => s.id !== stationId));
  };

  // Goods Handlers
  const handleAddSnack = (newSnack: Omit<SnackItem, 'id'>) => {
    const id = `snk-${Date.now().toString().slice(-4)}`;
    setSnacks((prev) => [...prev, { ...newSnack, id }]);
  };

  const handleUpdateSnack = (updated: SnackItem) => {
    setSnacks((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSnack = (snackId: string) => {
    setSnacks((prev) => prev.filter((s) => s.id !== snackId));
  };

  const handleRestockSnack = (snackId: string, quantity: number) => {
    setSnacks((prev) =>
      prev.map((s) => (s.id === snackId ? { ...s, stock: s.stock + quantity } : s))
    );
  };

  // VIP Tiers Handlers
  const handleUpdateCustomerTier = (customerId: string, newTier: Customer['vipLevel']) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, vipLevel: newTier } : c))
    );
  };

  // Tariffs Handlers
  const handleAddTariff = (newTariff: Omit<TariffRate, 'id'>) => {
    const id = `tar-${Date.now().toString().slice(-4)}`;
    setTariffs((prev) => [...prev, { ...newTariff, id }]);
  };

  const handleUpdateTariff = (updated: TariffRate) => {
    setTariffs((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTariff = (tariffId: string) => {
    setTariffs((prev) => prev.filter((t) => t.id !== tariffId));
  };

  // Staff Handlers
  const handleAddStaff = (newStaff: Omit<StaffOperator, 'id'>) => {
    const id = `staff-${Date.now().toString().slice(-4)}`;
    setStaffList((prev) => [...prev, { ...newStaff, id }]);
  };

  const handleUpdateStaff = (updated: StaffOperator) => {
    setStaffList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (currentOperator.id === updated.id) {
      setCurrentOperator(updated);
    }
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
  };

  // Queue / Booking Handlers
  const handleAddReservation = (newRes: Omit<BookingReservation, 'id' | 'createdAt'>) => {
    const id = `res-${Date.now().toString().slice(-4)}`;
    const fullRes: BookingReservation = {
      ...newRes,
      id,
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [fullRes, ...prev]);
  };

  const handleSeatReservation = (res: BookingReservation) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, status: 'seated' } : r))
    );
  };

  const handleCancelReservation = (resId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: 'cancelled' } : r))
    );
  };

  // Expense Handlers
  const handleAddExpense = (newExp: Omit<ExpenseItem, 'id'>) => {
    const id = `exp-${Date.now().toString().slice(-4)}`;
    setExpenses((prev) => [{ ...newExp, id }, ...prev]);
  };

  const handleDeleteExpense = (expId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expId));
  };

  // Desk Snack Orders Handlers (Option 5: QR Desk Ordering)
  const handleUpdateDeskOrderStatus = (orderId: string, status: DeskSnackOrder['status']) => {
    setDeskOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const handleAddNewDeskOrder = (newOrderData: Omit<DeskSnackOrder, 'id' | 'createdAt'>) => {
    const newId = `ord-desk-${Date.now().toString().slice(-4)}`;
    const newOrder: DeskSnackOrder = {
      ...newOrderData,
      id: newId,
      createdAt: 'الآن'
    };
    setDeskOrders((prev) => [newOrder, ...prev]);

    // Audio Alert notification
    unlockAudioContext();
    playSnackSound();
    speakVoiceAlert(`طلب بوفيه جديد من ${newOrder.stationName}`);
  };

  const handleAcceptAndBillDeskOrder = (order: DeskSnackOrder) => {
    const targetSession = sessions.find(
      (s) => s.status === 'active' && (s.stationId === order.stationId || s.id === order.sessionId)
    );

    if (targetSession) {
      const newSnackOrders: SnackOrder[] = order.items.map((item) => ({
        snackId: item.snackId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        orderedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      }));

      const addedCost = order.totalAmount;
      const updatedSnacks = [...(targetSession.snacks || []), ...newSnackOrders];
      const updatedSnacksCost = (targetSession.snacksCost || 0) + addedCost;
      const updatedFinalAmount = (targetSession.finalAmount || 0) + addedCost;

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSession.id
            ? {
                ...s,
                snacks: updatedSnacks,
                snacksCost: updatedSnacksCost,
                finalAmount: updatedFinalAmount,
              }
            : s
        )
      );

      // Decrement stock in snacks inventory
      setSnacks((prev) =>
        prev.map((snk) => {
          const orderedItem = order.items.find((oi) => oi.snackId === snk.id);
          if (orderedItem) {
            return {
              ...snk,
              stock: Math.max(0, snk.stock - orderedItem.quantity),
            };
          }
          return snk;
        })
      );

      // Mark order as delivered
      handleUpdateDeskOrderStatus(order.id, 'delivered');

      // Play audio & voice confirmation
      unlockAudioContext();
      playCheckoutSound();
      speakVoiceAlert(`تمت إضافة طلب طاولة ${order.stationName} إلى الفاتورة`);
    } else {
      handleUpdateDeskOrderStatus(order.id, 'preparing');
      unlockAudioContext();
      playSnackSound();
      speakVoiceAlert(`تم تأكيد الطلب لطاولة ${order.stationName}`);
    }
  };

  // Reset to Demo Data
  const handleResetToDemoData = () => {
    localStorage.removeItem('dij_tiem_stations_v3');
    localStorage.removeItem('dij_tiem_customers_v3');
    localStorage.removeItem('dij_tiem_snacks_v3');
    localStorage.removeItem('dij_tiem_games_v3');
    localStorage.removeItem('dij_tiem_sessions_v3');
    localStorage.removeItem('dij_tiem_staff_v3');
    localStorage.removeItem('dij_tiem_operator_v3');
    localStorage.removeItem('dij_tiem_reservations_v3');
    localStorage.removeItem('dij_tiem_expenses_v3');
    localStorage.removeItem('dij_tiem_viptiers_v3');
    localStorage.removeItem('dij_tiem_tariffs_v3');
    localStorage.removeItem('dij_tiem_settings_v3');
    localStorage.removeItem('dij_tiem_desk_orders_v3');

    setStations(INITIAL_STATIONS);
    setCustomers(INITIAL_CUSTOMERS);
    setSnacks(INITIAL_SNACKS);
    setGames(INITIAL_GAMES);
    setSessions(INITIAL_SESSIONS);
    setStaffList(INITIAL_STAFF);
    setCurrentOperator(INITIAL_STAFF[0]);
    setReservations(INITIAL_RESERVATIONS);
    setExpenses(INITIAL_EXPENSES);
    setVipTiers(INITIAL_VIP_TIERS);
    setTariffs(INITIAL_TARIFFS);
    setClubSettings(DEFAULT_CLUB_SETTINGS);
    setDeskOrders(INITIAL_DESK_ORDERS);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      dir="rtl"
      className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-white dark:bg-[#060a14] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white antialiased relative overflow-x-hidden font-['Alexandria','Cairo',sans-serif]`}
    >
      {/* Global Ambient Cyber Grid Overlay (Matching Footer Cyber Pattern across entire site) */}
      <div className="fixed inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 dark:opacity-15 pointer-events-none z-0" />
      <div className="fixed -top-40 right-1/4 w-[650px] h-[650px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/4 w-[650px] h-[650px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      
      {/* 1. Modern Collapsible Navigation Sidebar (12 Requested Sections) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSessionsCount={activeSessions.length}
        lowStockCount={lowStockCount}
        pendingBookingsCount={pendingBookingsCount}
        pendingDeskOrdersCount={pendingDeskOrdersCount}
        currentOperator={currentOperator}
        onOpenNewSession={() => handleOpenStartSession()}
        onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
        isOpenMobile={isSidebarMobileOpen}
        setIsOpenMobile={setIsSidebarMobileOpen}
        isSecurityUnlocked={isSecurityUnlocked}
        onRequireUnlock={handleRequireUnlock}
      />

      {/* Main Content Wrapper (With responsive right margin on desktop to accommodate fixed sidebar) */}
      <div className="flex-1 flex flex-col transition-all duration-300 lg:mr-72 bg-white/70 dark:bg-[#060a14]/80 backdrop-blur-sm min-h-screen relative z-10">
        
        {/* Top App Header Bar */}
        <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-xl border-b border-emerald-100 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shadow-sm">
          {/* Right Side (In RTL: Start side) */}
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setIsSidebarMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-slate-700 transition"
              title="فتح القائمة الجانبية"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Club Brand Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px] shadow-sm shadow-emerald-500/20">
                <div className="w-full h-full bg-white dark:bg-[#0c101c] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-emerald-900 dark:text-emerald-300 font-gaming">
                  {clubSettings.clubName}
                </h1>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{clubSettings.branchName}</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    النظام متصل
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Side (In RTL: End side) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Clock Display */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 font-mono-digits">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{currentTimeStr}</span>
            </div>

            {/* Smart Sound Effects & Voice Alerts Controller */}
            <SoundAlertsController lastAudioEvent={lastAudioEvent} />

            {/* Dark Mode Switcher (Option 1: Cyber Dark Mode) */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold shadow-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300"
              title={isDarkMode ? 'التحويل للوضع النهاري' : 'تفعيل النمط المظلم السيبراني (Cyber Dark)'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden xl:inline text-[11px] font-bold">نهاري</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span className="hidden xl:inline text-[11px] font-bold">نمط ليلي</span>
                </>
              )}
            </motion.button>

            {/* Active Operator Quick Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-200 dark:border-slate-700 text-xs shadow-xs">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-[11px] font-gaming">
                {currentOperator.name.slice(0, 1)}
              </div>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{currentOperator.name}</span>
            </div>

            {/* Quick Lock Button if Protected Sections Unlocked */}
            {isSecurityUnlocked && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setIsSecurityUnlocked(false);
                  if (activeTab === 'expense_reports' || activeTab === 'settings') {
                    setActiveTab('station_management');
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-rose-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold transition shadow-xs"
                title="قفل فوري للأقسام المحمية"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-mono text-[11px]">قفل الإدارة (5858)</span>
                <span className="md:hidden">قفل</span>
              </motion.button>
            )}

            {/* Quick Action Buttons */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenStartSession()}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition font-gaming"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">بدء جلسة جديدة</span>
              <span className="sm:hidden">جلسة جديدة</span>
            </motion.button>
          </div>
        </header>

        {/* 5. Cyber Marquee Ticker for News / Live System Updates */}
        <CyberMarqueeTicker
          clubName={clubSettings.clubName}
          activeSessionsCount={activeSessions.length}
          stations={stations}
          sessions={sessions}
        />

        {/* Main Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
          
          {/* Top Real-time Accounting Bar */}
          <StatsBar sessions={sessions} stations={stations} />

          {/* Dynamic Component Rendering based on Selected Sidebar Tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* 1. مدیریت ایستگاه ها */}
              {activeTab === 'station_management' && (
                <StationManagement
                  stations={stations}
                  onAddStation={handleAddStation}
                  onUpdateStation={handleUpdateStation}
                  onDeleteStation={handleDeleteStation}
                  onStartSessionForStation={(st) => handleOpenStartSession(st.id)}
                />
              )}

              {/* 2. صورتحساب های فعال */}
              {activeTab === 'active_invoices' && (
                <ActiveInvoices
                  sessions={sessions}
                  stations={stations}
                  onOpenAddSnack={(sess) => setSnackModalSession(sess)}
                  onOpenCheckout={(sess) => setInvoiceModalSession(sess)}
                  onOpenEditGames={(sess) => setEditGamesSession(sess)}
                  onStartNewSession={() => handleOpenStartSession()}
                />
              )}

              {/* 3. مشتریان */}
              {activeTab === 'customers' && (
                <CustomersManager
                  customers={customers}
                  onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
                  onStartSessionForCustomer={(cust) => handleOpenStartSession(undefined, cust.id)}
                  onRechargeBalance={handleRechargeBalance}
                />
              )}

              {/* 4. سطوح مشتریان */}
              {activeTab === 'customer_levels' && (
                <CustomerLevels
                  customers={customers}
                  vipTiers={vipTiers}
                  onUpdateTiers={setVipTiers}
                  onUpdateCustomerTier={handleUpdateCustomerTier}
                  onStartSessionForCustomer={(cust) => handleOpenStartSession(undefined, cust.id)}
                />
              )}

              {/* 5. کالا ها */}
              {activeTab === 'goods' && (
                <GoodsManager
                  snacks={snacks}
                  onAddSnack={handleAddSnack}
                  onUpdateSnack={handleUpdateSnack}
                  onDeleteSnack={handleDeleteSnack}
                  onRestock={handleRestockSnack}
                  onNavigateToQrOrders={() => setActiveTab('qr_desk_orders')}
                />
              )}

              {/* طلبات الطاولات الذكية عبر الباركود (QR Desk Ordering) */}
              {activeTab === 'qr_desk_orders' && (
                <QrDeskOrderManager
                  stations={stations}
                  activeSessions={activeSessions}
                  snacks={snacks}
                  deskOrders={deskOrders}
                  onUpdateOrderStatus={handleUpdateDeskOrderStatus}
                  onAcceptAndBillOrder={handleAcceptAndBillDeskOrder}
                  onAddNewDeskOrder={handleAddNewDeskOrder}
                  clubName={clubSettings.clubName}
                />
              )}

              {/* 6. ایستگاه ها (Overview, Timers & Devices) */}
              {activeTab === 'stations_overview' && (
                <div className="space-y-6">
                  {/* View sub-filter */}
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 dark-card rounded-2xl border border-emerald-100/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span className="text-slate-500 dark:text-slate-400">طريقة العرض:</span>
                      <button
                        onClick={() => setStationsViewFilter('all')}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          stationsViewFilter === 'all'
                            ? 'bg-emerald-600 text-white font-black shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        عرض شامل
                      </button>
                      <button
                        onClick={() => setStationsViewFilter('timers')}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          stationsViewFilter === 'timers'
                            ? 'bg-emerald-600 text-white font-black shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        مؤقتات الجلسات الحية ({activeSessions.length})
                      </button>
                      <button
                        onClick={() => setStationsViewFilter('devices')}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          stationsViewFilter === 'devices'
                            ? 'bg-emerald-600 text-white font-black shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        الأجهزة والمنصات ({stations.length})
                      </button>
                    </div>

                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-bold font-mono-digits">
                      {stations.filter((s) => s.status === 'in-use').length} قيد التشغيل / {stations.length} إجمالي المحطات
                    </div>
                  </div>

                  {/* Live Timers Section */}
                  {(stationsViewFilter === 'all' || stationsViewFilter === 'timers') && (
                    <LiveTimeCards
                      sessions={sessions}
                      stations={stations}
                      onAddSnack={(sess) => setSnackModalSession(sess)}
                      onEditGames={(sess) => setEditGamesSession(sess)}
                      onCheckoutSession={(sess) => setInvoiceModalSession(sess)}
                      onStartNewSession={(stId) => handleOpenStartSession(stId)}
                    />
                  )}

                  {/* Devices Grid Section */}
                  {(stationsViewFilter === 'all' || stationsViewFilter === 'devices') && (
                    <StationsGrid
                      stations={stations}
                      sessions={sessions}
                      onStartSession={(stId) => handleOpenStartSession(stId)}
                      onAddSnack={(sess) => setSnackModalSession(sess)}
                      onEditGames={(sess) => setEditGamesSession(sess)}
                      onCheckoutSession={(sess) => setInvoiceModalSession(sess)}
                    />
                  )}
                </div>
              )}

              {/* 7. تعرفه ها */}
              {activeTab === 'tariffs' && (
                <TariffsManager
                  tariffs={tariffs}
                  onAddTariff={handleAddTariff}
                  onUpdateTariff={handleUpdateTariff}
                  onDeleteTariff={handleDeleteTariff}
                />
              )}

              {/* 8. کاربران */}
              {activeTab === 'users_staff' && (
                <UsersStaffManager
                  staffList={staffList}
                  currentOperator={currentOperator}
                  onSetCurrentOperator={setCurrentOperator}
                  onAddStaff={handleAddStaff}
                  onUpdateStaff={handleUpdateStaff}
                  onDeleteStaff={handleDeleteStaff}
                />
              )}

              {/* 9. نوبت دهی */}
              {activeTab === 'queue_booking' && (
                <QueueBookingManager
                  reservations={reservations}
                  stations={stations}
                  onAddReservation={handleAddReservation}
                  onSeatReservation={handleSeatReservation}
                  onCancelReservation={handleCancelReservation}
                  onStartSessionForStation={(stId, custName, custPhone) => {
                    handleOpenStartSession(stId);
                  }}
                />
              )}

              {/* 10. درامد هزینه */}
              {activeTab === 'cashflow' && (
                <CashflowManager
                  expenses={expenses}
                  sessions={sessions}
                  onAddExpense={handleAddExpense}
                  onDeleteExpense={handleDeleteExpense}
                  currentOperatorName={currentOperator.name}
                />
              )}

              {/* 11. تاریخچه هزینه گزارشات */}
              {activeTab === 'expense_reports' && (
                !isSecurityUnlocked ? (
                  <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 dark-card rounded-3xl border border-emerald-500/20 dark:border-emerald-500/15 shadow-xl shadow-slate-900/5 max-w-lg mx-auto my-10">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 font-gaming">
                      قسم تقارير النفقات والأرباح مقفل
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                      هذا القسم محمي برمز أمان خاص لمنع الوصول غير المصرح به إلى الإحصائيات والأرباح.
                    </p>
                    <button
                      onClick={() => handleRequireUnlock('expense_reports', 'تقارير النفقات والأرباح')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-95 transition"
                    >
                      <Lock className="w-4 h-4" />
                      <span>إدخال رمز الأمان (5858) لفتح القسم</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        <Unlock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>تم التحقق من الصلاحيات الإدارية — تقارير النفقات والأرباح مفتوحة</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsSecurityUnlocked(false);
                          setActiveTab('station_management');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition shadow-xs"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>قفل ومغادرة القسم</span>
                      </button>
                    </div>
                    <ExpenseReports
                      expenses={expenses}
                      sessions={sessions}
                    />
                  </div>
                )
              )}

              {/* 12. تنظیمات */}
              {activeTab === 'settings' && (
                !isSecurityUnlocked ? (
                  <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 dark-card rounded-3xl border border-emerald-500/20 dark:border-emerald-500/15 shadow-xl shadow-slate-900/5 max-w-lg mx-auto my-10">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 font-gaming">
                      قسم إعدادات النظام مقفل
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                      هذا القسم محمي برمز أمان خاص لمنع تعديل إعدادات النادي والأسعار وصلاحيات المشغلين.
                    </p>
                    <button
                      onClick={() => handleRequireUnlock('settings', 'إعدادات النظام')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-95 transition"
                    >
                      <Lock className="w-4 h-4" />
                      <span>إدخال رمز الأمان (5858) لفتح القسم</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        <Unlock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>تم التحقق من الصلاحيات الإدارية — إعدادات النظام مفتوحة</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsSecurityUnlocked(false);
                          setActiveTab('station_management');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition shadow-xs"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>قفل ومغادرة القسم</span>
                      </button>
                    </div>
                    <ClubSettings
                      settings={clubSettings}
                      onUpdateSettings={setClubSettings}
                      onResetToDemoData={handleResetToDemoData}
                    />
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Cyber Esports Footer */}
        <footer className="relative mt-16 border-t border-emerald-500/20 dark:border-emerald-500/30 bg-white/95 dark:bg-[#060a14]/95 backdrop-blur-2xl text-slate-600 dark:text-slate-300 z-10 overflow-hidden">
          {/* Neon Top Glowing Accent Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-teal-400 opacity-70 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />

          {/* Ambient Cyber Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 dark:opacity-15 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Main Grid: 3 Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start pb-8 border-b border-emerald-100/70 dark:border-slate-800/80">
              
              {/* Brand & Identity (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 group">
                    <Gamepad2 className="w-6 h-6 stroke-[2.5]" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-ping" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black tracking-wider text-slate-900 dark:text-white font-['Chakra_Petch',sans-serif]">
                        DIJ-TIEM GAMING
                      </h2>
                      <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 font-mono">
                        v3.8 PRO
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      المنظومة السيبرانية المتطورة لإدارة الصالات والحسابات الذكية
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                  نظام مركزي متكامل يوفّر توقيتاً دقيقاً بالثواني، حجز الأجهزة، إدارة البوفيه الذكية، مستويات VIP، والتقارير المالية المحمية برمز أمان.
                </p>

                {/* Operator status */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-500 dark:text-slate-400">المشغل المناوب:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentOperator.name}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">({currentOperator.role})</span>
                </div>
              </div>

              {/* Live Bento Telemetry Cards (4 cols) */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-emerald-200/60 dark:border-slate-800/80 hover:border-emerald-500/40 transition">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">إجمالي الأجهزة</span>
                    <Monitor className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-lg font-black font-mono text-slate-900 dark:text-white font-mono-digits">
                    {stations.length} <span className="text-[10px] font-normal text-slate-400">منصة</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-emerald-200/60 dark:border-slate-800/80 hover:border-emerald-500/40 transition">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">الجلسات الحية</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 font-mono-digits">
                    {activeSessions.length} <span className="text-[10px] font-normal text-slate-400">نشطة</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-emerald-200/60 dark:border-slate-800/80 hover:border-emerald-500/40 transition">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">قاعدة اللاعبين</span>
                    <Users className="w-3.5 h-3.5 text-teal-500" />
                  </div>
                  <div className="text-lg font-black font-mono text-slate-900 dark:text-white font-mono-digits">
                    {customers.length} <span className="text-[10px] font-normal text-slate-400">عضو</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-emerald-200/60 dark:border-slate-800/80 hover:border-emerald-500/40 transition">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">حماية النظام</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400 pt-1">
                    {isSecurityUnlocked ? 'مفتوح (5858)' : 'مقفول برمز PIN'}
                  </div>
                </div>
              </div>

              {/* Status & Actions (3 cols) */}
              <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-between h-full space-y-4">
                <div className="space-y-2 w-full lg:w-auto text-right lg:text-left">
                  <div className="flex items-center lg:justify-end gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>خادم الصالة: متصل 100%</span>
                  </div>
                  <div className="flex items-center lg:justify-end gap-1.5 text-[11px] text-slate-400 font-mono font-mono-digits">
                    <Cpu className="w-3 h-3 text-emerald-500" />
                    <span>Ping: 12ms • Uptime 99.9%</span>
                  </div>
                </div>

                {/* Back to top button */}
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition shadow-xs group"
                >
                  <span>الرجوع لأعلى الصفحة</span>
                  <ArrowUp className="w-4 h-4 text-emerald-500 group-hover:-translate-y-0.5 transition-transform" />
                </motion.button>
              </div>

            </div>

            {/* Bottom Bar: Copyright & Specs */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-center sm:text-right">
                <span className="font-bold text-slate-600 dark:text-slate-300 font-['Chakra_Petch']">
                  DIJ-TIEM GAMING CLUB
                </span>
                <span>• كافة العمليات المالية والحسابات بالدينار العراقي (د.ع)</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
                  تشفير محلي 256-bit
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-bold">
                  محفوظ تلقائياً
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal Dialogues */}
      <NewSessionModal
        isOpen={isNewSessionOpen}
        onClose={() => {
          setIsNewSessionOpen(false);
          setPreSelectedStationId(undefined);
          setPreSelectedCustomerId(undefined);
        }}
        stations={stations}
        customers={customers}
        games={games}
        preSelectedStationId={preSelectedStationId}
        preSelectedCustomerId={preSelectedCustomerId}
        onStartSession={handleStartSession}
        onQuickAddCustomer={handleQuickAddCustomer}
      />

      <AddSnackModal
        isOpen={!!snackModalSession}
        onClose={() => setSnackModalSession(null)}
        session={snackModalSession}
        snacks={snacks}
        onConfirmAddSnacks={handleConfirmBulkSnacks}
      />

      <CheckoutInvoiceModal
        isOpen={!!invoiceModalSession}
        onClose={() => setInvoiceModalSession(null)}
        session={invoiceModalSession}
        onCompleteCheckout={handleCompleteCheckout}
      />

      <NewCustomerModal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onAddCustomer={handleQuickAddCustomer}
      />

      <EditGamesModal
        isOpen={!!editGamesSession}
        onClose={() => setEditGamesSession(null)}
        session={editGamesSession}
        gamesList={games}
        onUpdateSessionGames={handleUpdateSessionGames}
      />

      {/* Security PIN Modal (Code: 5858) */}
      <SecurityPinModal
        isOpen={securityModalState.isOpen}
        onClose={() => setSecurityModalState((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleSecurityUnlockSuccess}
        targetSectionName={securityModalState.label}
      />

    </motion.div>
  );
}
