export type StationType = 'PC' | 'PS5' | 'XBOX' | 'VIP_SIM';

export type StationStatus = 'available' | 'in-use' | 'cleaning' | 'maintenance';

export interface Station {
  id: string;
  name: string;
  type: StationType;
  hourlyRate: number;
  status: StationStatus;
  specs: string;
  currentSessionId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  pin: string; // رمز العميل السري / كلمة المرور
  balance: number; // الرصيد المتاح بالمحفظة (ر.س)
  totalPlayMinutes: number;
  totalSpent: number;
  registeredAt: string;
  vipLevel: 'برونزي' | 'فضي' | 'ذهبي' | 'VIP فاخر';
  notes?: string;
}

export type GameMode = 'online' | 'offline';

export interface GameRecord {
  gameId: string;
  gameName: string;
  mode: GameMode; // أونلاين أو أوفلاين
  playedMinutes?: number;
}

export interface GameItem {
  id: string;
  name: string;
  category: 'FPS' | 'Sports' | 'Battle Royale' | 'RPG' | 'Fighting' | 'Racing' | 'Sandbox' | 'Strategy';
  defaultMode: GameMode;
  coverImage?: string;
}

export interface SnackOrder {
  snackId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  orderedAt: string;
}

export interface SnackItem {
  id: string;
  name: string;
  category: 'مشروبات طاقة' | 'تسالي وشيبس' | 'مشروبات ساخنة وباردة' | 'وجبات وشطائر' | 'حلويات';
  price: number;
  stock: number;
  imageIcon: string;
}

export interface Session {
  id: string;
  stationId: string;
  stationName: string;
  stationType: StationType;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerPin: string;
  checkInTime: string; // ISO string ووقت الدخول
  checkOutTime?: string; // وقت الخروج
  status: 'active' | 'completed' | 'paused';
  sessionType: 'open' | 'fixed'; // وقت مفتوح أو محدد مسبقاً
  allocatedMinutes?: number; // إذا كان محدد
  gamesPlayed: GameRecord[];
  snacks: SnackOrder[];
  hourlyRate: number;
  timeCost: number; // تكلفة الوقت
  snacksCost: number; // تكلفة التسالي
  discount: number;
  finalAmount: number;
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: 'كاش' | 'شبكة / مدى' | 'محفظة العميل' | 'تحويل';
  notes?: string;
}

export interface DashboardFilter {
  searchQuery: string;
  stationType: 'all' | StationType;
  gameMode: 'all' | GameMode;
  status: 'all' | 'active' | 'completed';
}

export interface StaffOperator {
  id: string;
  name: string;
  username: string;
  role: 'المدير العام' | 'أمين الصندوق' | 'مشرف الفترة' | 'الدعم الفني';
  phone: string;
  status: 'active' | 'inactive';
  shift: 'وردية صباحية (09:00 إلى 16:00)' | 'وردية مسائية (16:00 إلى 24:00)' | 'وردية ليلية متأخرة';
  lastLogin: string;
  avatarSeed?: string;
}

export interface BookingReservation {
  id: string;
  customerName: string;
  customerPhone: string;
  stationId: string;
  stationName: string;
  reservedDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  status: 'pending' | 'seated' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface DeskSnackOrder {
  id: string;
  stationId: string;
  stationName: string;
  sessionId?: string;
  customerName: string;
  customerPhone?: string;
  items: {
    snackId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    icon?: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'إنترنت وألياف ضوئية' | 'فواتير الكهرباء والماء' | 'تعبئة البوفيه والمشروبات' | 'رواتب الموظفين' | 'صيانة وإصلاحات' | 'تسويق وإعلانات' | 'أخرى';
  amount: number; // دينار
  date: string; // YYYY-MM-DD
  registeredBy: string;
  notes?: string;
}

export interface VipTierConfig {
  id: 'برونزي' | 'فضي' | 'ذهبي' | 'VIP فاخر';
  name: string;
  discountPercent: number; // 0, 5, 10, 15
  minHoursRequired: number;
  minSpendRequired: number;
  color: string;
  perks: string[];
}

export interface TariffRate {
  id: string;
  title: string;
  platform: StationType | 'ALL';
  baseHourlyRate: number; // دينار
  peakMultiplier: number; // e.g. 1.25 for night/weekend
  onlineGameMultiplier: number; // e.g. 1.15 for low-ping fiber
  minPlayMinutes: number;
  packageDescription?: string;
  isPackage?: boolean;
  packageHours?: number;
  packagePrice?: number;
}

export interface ClubSettings {
  clubName: string;
  branchName: string;
  phone: string;
  address: string;
  currency: string;
  taxRatePercent: number;
  lowStockAlertThreshold: number;
  warningBeforeMinutes: number; // تنبيه قرب انتهاء الوقت
  allowOpenSessionsWithoutDeposit: boolean;
  themeAccent: 'gold' | 'amber' | 'emerald' | 'cyan';
  defaultRates: {
    PC: number;
    PS5: number;
    XBOX: number;
    VIP_SIM: number;
  };
  enableSoundAlerts: boolean;
  autoOvertimeAlert: boolean;
  appEntryPin?: string; // رمز ورود سراسری به سامانه (پیش‌فرض: 1234)
  adminPin?: string;    // رمز ورود مدیر ارشد به تنظیمات و گزارشات مالی (پیش‌فرض: 5858)
}

export type ActiveSidebarTab = 
  | 'station_management'   // إدارة المحطات
  | 'active_invoices'      // الفواتير النشطة
  | 'customers'            // العملاء
  | 'customer_levels'      // مستويات العملاء
  | 'goods'                // المنتجات والبوفيه
  | 'qr_desk_orders'       // طلبات الطاولات (QR كود)
  | 'stations_overview'    // نظرة عامة على المحطات
  | 'tariffs'              // التعرفة والباقات
  | 'users_staff'          // طاقم العمل والموظفين
  | 'queue_booking'        // الحجوزات وقائمة الانتظار
  | 'cashflow'             // الإيرادات والمصروفات
  | 'expense_reports'      // تقارير النفقات والأرباح
  | 'settings';            // الإعدادات العامة

