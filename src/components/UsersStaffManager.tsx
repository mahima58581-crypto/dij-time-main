import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  UserPlus,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  X,
  Save,
  Check,
  UserCheck,
  Users,
  UserCog,
  Sparkles,
  KeyRound,
  LogIn,
  LogOut,
  Calendar,
  Coffee,
  Timer,
  AlertTriangle,
  Plus,
  Hourglass,
  ClipboardList
} from 'lucide-react';
import { StaffOperator } from '../types';

// ─── رکورد حضور و غیاب کارمند ───
interface WorkerAttendance {
  id: string;
  workerId: string;
  date: string; // YYYY/MM/DD
  clockIn: string; // HH:MM
  clockOut: string; // HH:MM
  workHours?: number; // ساعات کاری دستی (اختیاری — خالی باشد: خودکار از ورود/خروج)
  leaveHours: number;
  leaveDays: number;
  drinks: string[];
  lateMinutes: number;
  absentDays: number;
  overtimeHours: number;
}

const ATTENDANCE_STORAGE_KEY = 'dij_tiem_worker_attendance_v1';

const loadAttendance = (): WorkerAttendance[] => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

interface UsersStaffManagerProps {
  staffList: StaffOperator[];
  currentOperator: StaffOperator;
  onSetCurrentOperator: (operator: StaffOperator) => void;
  onAddStaff: (staff: Omit<StaffOperator, 'id'>) => void;
  onUpdateStaff: (staff: StaffOperator) => void;
  onDeleteStaff: (staffId: string) => void;
}

// ─── هویت بصری هر منصب (در خانواده سبز و فیروزه‌ای) ───
const ROLE_META: Record<string, { gradient: string; chip: string }> = {
  'المدير العام': {
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    chip: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  'أمين الصندوق': {
    gradient: 'from-teal-500 to-cyan-600',
    chip: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  },
  'مشرف الفترة': {
    gradient: 'from-cyan-500 to-sky-600',
    chip: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  },
  'الدعم الفني': {
    gradient: 'from-emerald-400 to-green-600',
    chip: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
};

const getRoleMeta = (role: string) =>
  ROLE_META[role] || {
    gradient: 'from-slate-400 to-slate-500',
    chip: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

export const UsersStaffManager: React.FC<UsersStaffManagerProps> = ({
  staffList,
  currentOperator,
  onSetCurrentOperator,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffOperator | null>(null);

  // New staff form
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<StaffOperator['role']>('أمين الصندوق');
  const [phone, setPhone] = useState('');
  const [shift, setShift] = useState<StaffOperator['shift']>('وردية مسائية (16:00 إلى 24:00)');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddStaff({
      name: name.trim(),
      username: username.trim() || `user_${Date.now().toString().slice(-4)}`,
      role,
      phone: phone.trim() || '07700000000',
      status: 'active',
      shift,
      lastLogin: 'ثبت جدید',
      avatarSeed: name.trim(),
    });
    setName('');
    setUsername('');
    setPhone('');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    onUpdateStaff(editingStaff);
    setEditingStaff(null);
  };

  const toggleStatus = (staff: StaffOperator) => {
    onUpdateStaff({
      ...staff,
      status: staff.status === 'active' ? 'inactive' : 'active',
    });
  };

  // ─── سیستم مدیریت حضور و غیاب کارکنان ───
  const [attendanceRecords, setAttendanceRecords] = useState<WorkerAttendance[]>(loadAttendance);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(staffList[0]?.id || '');
  const [isAttendanceFormOpen, setIsAttendanceFormOpen] = useState(false);

  // فرم ثبت حضور
  const [attDate, setAttDate] = useState(() => new Date().toISOString().split('T')[0].replace(/-/g, '/'));
  const [attClockIn, setAttClockIn] = useState('09:00');
  const [attClockOut, setAttClockOut] = useState('17:00');
  const [attWorkHours, setAttWorkHours] = useState('');
  const [attLeaveHours, setAttLeaveHours] = useState(0);
  const [attLeaveDays, setAttLeaveDays] = useState(0);
  const [attDrinks, setAttDrinks] = useState<string[]>([]);
  const [attDrinkInput, setAttDrinkInput] = useState('');
  const [attLateMinutes, setAttLateMinutes] = useState(0);
  const [attAbsentDays, setAttAbsentDays] = useState(0);
  const [attOvertimeHours, setAttOvertimeHours] = useState(0);

  // ذخیره در localStorage
  useEffect(() => {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const selectedWorker = staffList.find((s) => s.id === selectedWorkerId);
  const workerRecords = attendanceRecords
    .filter((r) => r.workerId === selectedWorkerId)
    .sort((a, b) => b.date.localeCompare(a.date));

  // محاسبه ساعات کاری از ورود و خروج
  const calcWorkHours = (clockIn: string, clockOut: string) => {
    if (!clockIn || !clockOut) return 0;
    const [inH, inM] = clockIn.split(':').map(Number);
    const [outH, outM] = clockOut.split(':').map(Number);
    const diff = outH * 60 + outM - (inH * 60 + inM);
    return diff > 0 ? Math.round((diff / 60) * 10) / 10 : 0;
  };

  // خلاصه آماری کارمند انتخاب‌شده
  const totalWorkHours = workerRecords.reduce((sum, r) => sum + (r.workHours ?? calcWorkHours(r.clockIn, r.clockOut)), 0);
  const totalLeaveHours = workerRecords.reduce((sum, r) => sum + r.leaveHours, 0);
  const totalLeaveDays = workerRecords.reduce((sum, r) => sum + r.leaveDays, 0);
  const totalLateMinutes = workerRecords.reduce((sum, r) => sum + r.lateMinutes, 0);
  const totalAbsentDays = workerRecords.reduce((sum, r) => sum + r.absentDays, 0);
  const totalOvertime = workerRecords.reduce((sum, r) => sum + r.overtimeHours, 0);
  const totalDrinks = workerRecords.reduce((sum, r) => sum + r.drinks.length, 0);

  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerId) return;
    const manualWorkHours =
      attWorkHours.trim() !== '' && !Number.isNaN(Number(attWorkHours))
        ? Number(attWorkHours)
        : undefined;
    const newRecord: WorkerAttendance = {
      id: `att_${Date.now()}`,
      workerId: selectedWorkerId,
      date: attDate,
      clockIn: attClockIn,
      clockOut: attClockOut,
      workHours: manualWorkHours,
      leaveHours: attLeaveHours,
      leaveDays: attLeaveDays,
      drinks: attDrinks,
      lateMinutes: attLateMinutes,
      absentDays: attAbsentDays,
      overtimeHours: attOvertimeHours,
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);
    // ریست فرم
    setAttDate(new Date().toISOString().split('T')[0].replace(/-/g, '/'));
    setAttClockIn('09:00');
    setAttClockOut('17:00');
    setAttWorkHours('');
    setAttLeaveHours(0);
    setAttLeaveDays(0);
    setAttDrinks([]);
    setAttDrinkInput('');
    setAttLateMinutes(0);
    setAttAbsentDays(0);
    setAttOvertimeHours(0);
    setIsAttendanceFormOpen(false);
  };

  const handleDeleteAttendance = (id: string) => {
    setAttendanceRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addDrink = () => {
    const d = attDrinkInput.trim();
    if (d && !attDrinks.includes(d)) {
      setAttDrinks((prev) => [...prev, d]);
    }
    setAttDrinkInput('');
  };

  const removeDrink = (drink: string) => {
    setAttDrinks((prev) => prev.filter((d) => d !== drink));
  };

  const activeCount = staffList.filter((s) => s.status === 'active').length;
  const inactiveCount = staffList.length - activeCount;

  const kpiStats = [
    { label: 'إجمالي أعضاء الطاقم', value: staffList.length, icon: Users, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40' },
    { label: 'حسابات فعالة', value: activeCount, icon: CheckCircle2, gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-900/40' },
    { label: 'حسابات معطلة', value: inactiveCount, icon: XCircle, gradient: 'from-slate-400 to-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800' },
    { label: 'المشغل النشط في الصندوق', value: currentOperator.name, icon: UserCog, gradient: 'from-cyan-500 to-sky-600', bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-900/40', isName: true },
  ];

  return (
    <div className="space-y-5 relative">

      {/* بخش‌های نورانی شناور در پس‌زمینه */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl float-slow" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl float-slower" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl float-slow" />
      </div>

      {/* ─── Header Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/30 animate-gradient-x"
      >
        {/* دوائر زخرفية */}
        <div className="absolute -left-12 -top-20 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-6 -bottom-24 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        {/* آیکون‌های شناور */}
        <ShieldCheck className="absolute left-10 top-5 w-5 h-5 text-white/40 float-slow pointer-events-none" />
        <UserPlus className="absolute left-48 bottom-7 w-4 h-4 text-white/30 float-slower pointer-events-none" />
        <KeyRound className="absolute right-1/3 top-3 w-4 h-4 text-white/35 float-slow pointer-events-none" />
        <Sparkles className="absolute right-1/4 bottom-4 w-4 h-4 text-white/30 float-slower pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-sm">
                إدارة المستخدمين وكادر النادي
              </h2>
              <p className="text-xs text-emerald-50/90 mt-1">
                تعيين حسابات أمناء الصندوق، مشرفي الشيفت، إدارة جداول العمل وسجلات الدخول
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm shadow-lg shadow-emerald-900/20">
              <UserCog className="w-4 h-4 text-white" />
              <span className="text-xs text-emerald-50/90">المشغل النشط:</span>
              <span className="text-xs font-black text-white">{currentOperator.name}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-emerald-900 bg-white hover:bg-emerald-50 shadow-lg shadow-emerald-900/20 transition font-gaming"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>+ إضافة موظف جديد</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ─── شريط الإحصاءات ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`p-4 rounded-2xl border shadow-xs ${s.bg}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {s.label}
              </span>
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md shrink-0`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className={`text-lg sm:text-xl font-black font-mono font-mono-digits mt-1.5 truncate bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent ${s.isName ? 'text-lg' : ''}`}>
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── شبكة كروت الطاقم ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {staffList.map((staff, idx) => {
            const isCurrent = staff.id === currentOperator.id;
            const isActive = staff.status === 'active';
            const rm = getRoleMeta(staff.role);

            return (
              <motion.div
                key={staff.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.35) }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl bg-white dark:bg-[#0c101c] border transition-all duration-300 flex flex-col overflow-hidden ${
                  isCurrent
                    ? 'border-emerald-400 dark:border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/15'
                    : isActive
                    ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600/50 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                {/* شريط علوي — متحرك للمشغل الحالي */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${rm.gradient} ${isCurrent ? 'animate-gradient-x shimmer' : ''}`} />

                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  {/* رأس الكارت */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${rm.gradient} text-white flex items-center justify-center font-black text-base shadow-lg ring-2 ring-white dark:ring-slate-800 shrink-0 animate-gradient-x`}>
                        {staff.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{staff.name}</h3>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/40 animate-pulse">
                              صندوق نشط
                            </span>
                          )}
                        </div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${rm.chip}`}>
                          {staff.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStatus(staff)}
                      title={isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isActive ? 'نشط' : 'معطل'}
                    </button>
                  </div>

                  {/* اطلاعات */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080d19] border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-[11px]">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-sm shrink-0">
                          <Phone className="w-3.5 h-3.5 text-white" />
                        </span>
                        رقم الهاتف:
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono font-mono-digits font-bold" dir="ltr">{staff.phone}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-[11px]">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shrink-0">
                          <Clock className="w-3.5 h-3.5 text-white" />
                        </span>
                        نوبة العمل:
                      </span>
                      <span className="text-emerald-800 dark:text-emerald-400 font-sans font-bold text-[11px]">{staff.shift}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                      <span className="flex items-center gap-1.5 font-bold text-[11px]">
                        <LogIn className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        آخر تسجيل دخول:
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{staff.lastLogin}</span>
                    </div>

                    {staff.username && (
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-bold text-[11px]">
                          <KeyRound className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                          اسم المستخدم:
                        </span>
                        <span className="font-mono text-slate-700 dark:text-slate-300" dir="ltr">{staff.username}</span>
                      </div>
                    )}
                  </div>

                  {/* أزرار */}
                  <div className="flex items-center justify-between gap-2 pt-2 mt-auto border-t border-slate-100 dark:border-slate-800">
                    {!isCurrent ? (
                      <button
                        onClick={() => onSetCurrentOperator(staff)}
                        disabled={!isActive}
                        className="py-1.5 px-3 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>تعيين كمشغل نشط حالياً</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        يعمل على النظام حالياً
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingStaff(staff)}
                        className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition cursor-pointer"
                        title="تعديل البيانات"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {staffList.length > 1 && (
                        <button
                          onClick={() => {
                            onDeleteStaff(staff.id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer active:scale-95"
                          title="حذف الحساب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          سیستم مدیریت حضور و غیاب کارکنان
          ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        {/* هدر بخش */}
        <div className="relative overflow-hidden p-5 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white">
          <div className="absolute -left-8 -top-16 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
          <ClipboardList className="absolute left-8 top-4 w-5 h-5 text-white/40 float-slow pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <ClipboardList className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">مدیریت حضور و غیاب کارکنان</h3>
              <p className="text-[11px] text-emerald-50/90 mt-0.5">ثبت ورود/خروج، مرخصی، تاخیر، غیبت، اضافه‌کاری و نوشیدنی‌های بوفی</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* انتخاب کارمند — کارت‌های آواتار */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">انتخاب کارمند:</label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {staffList.map((s) => {
                const active = selectedWorkerId === s.id;
                const rm = getRoleMeta(s.role);
                return (
                  <motion.button
                    key={s.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setSelectedWorkerId(s.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer shrink-0 min-w-[110px] ${
                      active
                        ? `border-transparent bg-gradient-to-b ${rm.gradient} text-white shadow-xl ring-4 ring-emerald-500/30`
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500/50'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ring-2 ring-white dark:ring-slate-800 ${active ? 'bg-white/20 text-white' : `bg-gradient-to-br ${rm.gradient} text-white`}`}>
                      {s.name.slice(0, 1)}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-black truncate max-w-[90px]">{s.name}</div>
                      <div className={`text-[9px] font-bold mt-0.5 ${active ? 'text-white/80' : 'text-slate-400'}`}>{s.role}</div>
                    </div>
                    {active && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-800 shadow-md animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {selectedWorker && (
            <>
              {/* کارت‌های خلاصه آماری — داشبورد مینیمال */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'ساعات کاری', value: totalWorkHours, unit: 'ساعت', icon: Clock, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40', max: 160 },
                  { label: 'مرخصی (ساعت)', value: totalLeaveHours, unit: 'ساعت', icon: Hourglass, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/40', max: 80 },
                  { label: 'مرخصی (روز)', value: totalLeaveDays, unit: 'روز', icon: Calendar, gradient: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/40', max: 10 },
                  { label: 'تاخیر', value: totalLateMinutes, unit: 'دقیقه', icon: AlertTriangle, gradient: 'from-rose-500 to-red-500', bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/40', max: 480 },
                  { label: 'غیبت', value: totalAbsentDays, unit: 'روز', icon: XCircle, gradient: 'from-slate-400 to-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800', max: 10 },
                  { label: 'اضافه‌کاری', value: totalOvertime, unit: 'ساعت', icon: Timer, gradient: 'from-cyan-500 to-sky-600', bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-900/40', max: 80 },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.03 }}
                    className={`relative overflow-hidden p-4 rounded-2xl border shadow-xs ${s.bg}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{s.label}</span>
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}>
                        <s.icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className={`text-xl font-black font-mono font-mono-digits bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                      {s.value}
                      <span className="text-[10px] font-bold text-slate-400 mr-1">{s.unit}</span>
                    </div>
                    {/* نوار پیشرفت مینیمال */}
                    <div className="mt-2 h-1.5 rounded-full bg-slate-200/70 dark:bg-slate-700/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                        className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* دکمه ثبت رکورد جدید */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                  رکوردهای {selectedWorker.name}:
                  <span className="text-slate-400 font-mono font-mono-digits mr-1">({workerRecords.length} رکورد)</span>
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsAttendanceFormOpen(!isAttendanceFormOpen)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                    isAttendanceFormOpen
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 hover:brightness-110'
                  }`}
                >
                  <Plus className={`w-3.5 h-3.5 transition-transform ${isAttendanceFormOpen ? 'rotate-45' : ''}`} />
                  <span>ثبت رکورد جدید</span>
                </motion.button>
              </div>

              {/* فرم ثبت حضور — پنل مدرن */}
              <AnimatePresence>
                {isAttendanceFormOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleAddAttendance} className="relative rounded-2xl bg-gradient-to-br from-emerald-500/50 via-slate-600/40 to-cyan-500/50 p-[1px] shadow-2xl shadow-emerald-500/10">
                      <div className="relative overflow-hidden rounded-[15px] bg-white dark:bg-slate-900">
                      {/* هاله‌های نورانی + نقشهٔ سایبری */}
                      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none glow-pulse" />
                      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="cyber-grid absolute inset-0 opacity-[0.05] pointer-events-none" />
                      {/* خط LED سقف پنل */}
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 animate-gradient-x" />

                      {/* هدر پنل */}
                      <div className="relative flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-l from-emerald-500/10 via-transparent to-cyan-500/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-1 ring-white/20">
                            <ClipboardList className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 dark:text-white font-gaming">ثبت رکورد حضور</div>
                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">پنل کنترل حضور و انصراف — دقت ساعتی</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            LIVE
                          </span>
                          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold font-gaming">
                            {selectedWorker.name}
                          </span>
                        </div>
                      </div>

                      <div className="relative space-y-6 p-5">

                          {/* ── ردیابی زمان ── */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700/80 to-transparent" />
                              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-widest font-gaming">ردیابی زمان</span>
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700/80 to-transparent" />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                    <Calendar className="w-3 h-3 text-emerald-400" />
                                  </span>
                                  تاریخ (سال/ماه/روز)
                                </label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={attDate}
                                  onChange={(e) => setAttDate(e.target.value)}
                                  placeholder="مثلاً 2026/06/06"
                                  title="به‌ترتیب سال، ماه، روز وارد کن"
                                  className="w-full px-3.5 py-3 text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-800 dark:text-emerald-100 placeholder-emerald-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none font-mono-digits transition shadow-inner"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                    <LogIn className="w-3 h-3 text-emerald-400" />
                                  </span>
                                  ساعت ورود
                                </label>
                                <input
                                  type="time"
                                  value={attClockIn}
                                  onChange={(e) => setAttClockIn(e.target.value)}
                                  className="w-full px-3.5 py-3 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition shadow-inner"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                                    <LogOut className="w-3 h-3 text-rose-400" />
                                  </span>
                                  ساعت خروج
                                </label>
                                <input
                                  type="time"
                                  value={attClockOut}
                                  onChange={(e) => setAttClockOut(e.target.value)}
                                  className="w-full px-3.5 py-3 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:border-rose-500/70 focus:ring-2 focus:ring-rose-500/20 focus:outline-none font-mono-digits transition shadow-inner"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                    <Clock className="w-3 h-3 text-cyan-400" />
                                  </span>
                                  ساعات کاری (اختیاری)
                                </label>
                                <div className="w-full px-3.5 py-2.5 flex items-center justify-center gap-2 rounded-xl led-bezel">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    inputMode="decimal"
                                    value={attWorkHours}
                                    onChange={(e) => setAttWorkHours(e.target.value)}
                                    placeholder={String(calcWorkHours(attClockIn, attClockOut))}
                                    title="خالی بگذار تا خودکار از ساعت ورود و خروج حساب بشه"
                                    className="no-spinner w-16 bg-transparent text-center text-lg font-mono font-black text-emerald-700 dark:text-emerald-300 font-mono-digits tracking-widest placeholder-emerald-600/60 focus:outline-none"
                                  />
                                  <span className="text-[10px] font-bold text-emerald-500/90">ساعت</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ── تعدیل و معاینه ── */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700/80 to-transparent" />
                              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-widest font-gaming">تعدیل و معاینه</span>
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700/80 to-transparent" />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                                    <Hourglass className="w-3 h-3 text-amber-400" />
                                  </span>
                                  مرخصی (ساعت)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={attLeaveHours}
                                  onChange={(e) => setAttLeaveHours(Number(e.target.value))}
                                  className="no-spinner w-full px-3.5 py-3 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 focus:outline-none font-mono-digits transition shadow-inner"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                                    <Calendar className="w-3 h-3 text-amber-400" />
                                  </span>
                                  مرخصی (روز)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={attLeaveDays}
                                  onChange={(e) => setAttLeaveDays(Number(e.target.value))}
                                  className="no-spinner w-full px-3.5 py-3 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 focus:outline-none font-mono-digits transition shadow-inner"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                                  </span>
                                  تاخیر (دقیقه)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={attLateMinutes}
                                  onChange={(e) => setAttLateMinutes(Number(e.target.value))}
                                  className="no-spinner w-full px-3.5 py-3 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:border-rose-500/70 focus:ring-2 focus:ring-rose-500/20 focus:outline-none font-mono-digits transition shadow-inner"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                    <Timer className="w-3 h-3 text-cyan-400" />
                                  </span>
                                  اضافه‌کاری (ساعت)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={attOvertimeHours}
                                  onChange={(e) => setAttOvertimeHours(Number(e.target.value))}
                                  className="no-spinner w-full px-3.5 py-3 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none font-mono-digits transition shadow-inner"
                                />
                              </div>
                            </div>
                          </div>

                          {/* ── بوفه و غیبت ── */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700/80 to-transparent" />
                              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-widest font-gaming">بوفه و غیبت</span>
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700/80 to-transparent" />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-slate-500/15 border border-slate-500/30 flex items-center justify-center shrink-0">
                                    <XCircle className="w-3 h-3 text-slate-400" />
                                  </span>
                                  غیبت (روز)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={attAbsentDays}
                                  onChange={(e) => setAttAbsentDays(Number(e.target.value))}
                                  className="no-spinner w-full px-3.5 py-3 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:border-slate-400/60 focus:ring-2 focus:ring-slate-400/20 focus:outline-none font-mono-digits transition shadow-inner"
                                />
                              </div>
                              <div className="space-y-1.5 sm:col-span-3">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                                    <Coffee className="w-3 h-3 text-amber-400" />
                                  </span>
                                  نوشیدنی‌های بوفه
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={attDrinkInput}
                                    onChange={(e) => setAttDrinkInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDrink(); } }}
                                    placeholder="مثلاً: مشروب طاقة، شاي، قهوة..."
                                    className="flex-1 px-3.5 py-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition shadow-inner"
                                  />
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={addDrink}
                                    title="افزودن نوشیدنی"
                                    className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30 hover:brightness-110 transition cursor-pointer shrink-0"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </motion.button>
                                </div>
                                {attDrinks.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {attDrinks.map((d) => (
                                      <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold shadow-sm">
                                        <Coffee className="w-3 h-3" />
                                        {d}
                                        <button type="button" onClick={() => removeDrink(d)} className="hover:text-rose-400 cursor-pointer">
                                          <X className="w-3 h-3" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                            {/* ── ثبت نهایی ── */}
                            <div className="relative flex items-center justify-end gap-2 pt-1">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="shimmer relative overflow-hidden px-10 py-3.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 shadow-lg shadow-emerald-500/40 flex items-center gap-2 cursor-pointer"
                              >
                                <Check className="w-4 h-4 stroke-[2.5]" />
                                <span>ثبت رکورد حضور</span>
                              </motion.button>
                            </div>
                          </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* جدول رکوردها — با انیمیشن ردیف */}
              {workerRecords.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-black text-slate-700 dark:text-slate-200">هنوز رکوردی ثبت نشده</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">روی «ثبت رکورد جدید» بزن تا اولین حضور {selectedWorker.name} ثبت بشه</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <table className="w-full text-right text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-800/40 text-slate-500 dark:text-slate-400 font-bold">
                        <th className="py-3.5 px-3">تاریخ</th>
                        <th className="py-3.5 px-3">ورود</th>
                        <th className="py-3.5 px-3">خروج</th>
                        <th className="py-3.5 px-3">ساعات کاری</th>
                        <th className="py-3.5 px-3">مرخصی</th>
                        <th className="py-3.5 px-3">نوشیدنی‌ها</th>
                        <th className="py-3.5 px-3">تاخیر</th>
                        <th className="py-3.5 px-3">غیبت</th>
                        <th className="py-3.5 px-3">اضافه‌کاری</th>
                        <th className="py-3.5 px-3 text-center">حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {workerRecords.map((r, idx) => (
                        <motion.tr
                          key={r.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                          className="hover:bg-emerald-50/60 dark:hover:bg-slate-800/50 transition"
                        >
                          <td className="py-3 px-3 font-mono font-mono-digits font-bold text-slate-800 dark:text-slate-200">{r.date}</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 font-mono font-mono-digits text-emerald-600 dark:text-emerald-400 font-bold">
                              <LogIn className="w-3 h-3" />{r.clockIn}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 font-mono font-mono-digits text-rose-600 dark:text-rose-400 font-bold">
                              <LogOut className="w-3 h-3" />{r.clockOut}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 font-mono font-mono-digits font-black text-emerald-700 dark:text-emerald-400">
                              <Clock className="w-3 h-3" />{r.workHours ?? calcWorkHours(r.clockIn, r.clockOut)} س
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-mono-digits">
                            {r.leaveHours > 0 || r.leaveDays > 0 ? (
                              <span className="text-amber-600 dark:text-amber-400 font-bold">
                                {r.leaveHours > 0 ? `${r.leaveHours} س` : ''}
                                {r.leaveHours > 0 && r.leaveDays > 0 ? ' • ' : ''}
                                {r.leaveDays > 0 ? `${r.leaveDays} روز` : ''}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {r.drinks.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {r.drinks.map((d) => (
                                  <span key={d} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                                    <Coffee className="w-2.5 h-2.5" />
                                    {d}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono font-mono-digits">
                            {r.lateMinutes > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold">
                                <AlertTriangle className="w-3 h-3" />{r.lateMinutes} دقیقه
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono font-mono-digits">
                            {r.absentDays > 0 ? (
                              <span className="text-slate-600 dark:text-slate-400 font-bold">{r.absentDays} روز</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono font-mono-digits">
                            {r.overtimeHours > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 font-bold">
                                <Timer className="w-3 h-3" />{r.overtimeHours} س
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => handleDeleteAttendance(r.id)}
                              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                              title="حذف رکورد"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* ─── مودال إضافة موظف ─── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-x" />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                      <UserPlus className="w-4 h-4 text-white" />
                    </div>
                    <span>إضافة مشغل / موظف جديد</span>
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
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم الكامل:</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: رضا أحمد"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم المستخدم:</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="reza_gamer"
                        className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الدور والمنصب:</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none cursor-pointer transition"
                      >
                        <option value="أمين الصندوق">أمين الصندوق (كاشير)</option>
                        <option value="مشرف الفترة">مشرف الفترة</option>
                        <option value="الدعم الفني">الدعم الفني والصيانة</option>
                        <option value="المدير العام">المدير العام</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف:</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07701234567"
                      className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نوبة العمل (الوردية):</label>
                    <select
                      value={shift}
                      onChange={(e) => setShift(e.target.value as any)}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none cursor-pointer transition"
                    >
                      <option value="وردية صباحية (09:00 إلى 16:00)">وردية صباحية (09:00 إلى 16:00)</option>
                      <option value="وردية مسائية (16:00 إلى 24:00)">وردية مسائية (16:00 إلى 24:00)</option>
                      <option value="وردية ليلية متأخرة">وردية ليلية متأخرة</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-110 shadow-md shadow-emerald-500/30 flex items-center gap-1.5 font-gaming cursor-pointer animate-gradient-x"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>إنشاء الحساب</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── مودال تعديل الموظف ─── */}
      <AnimatePresence>
        {editingStaff && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-x" />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md">
                      <Edit3 className="w-4 h-4 text-white" />
                    </div>
                    <span>تعديل الموظف: {editingStaff.name}</span>
                  </h3>
                  <button
                    onClick={() => setEditingStaff(null)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم الكامل:</label>
                    <input
                      type="text"
                      required
                      value={editingStaff.name}
                      onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الدور:</label>
                      <select
                        value={editingStaff.role}
                        onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as any })}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none cursor-pointer transition"
                      >
                        <option value="أمين الصندوق">أمين الصندوق (كاشير)</option>
                        <option value="مشرف الفترة">مشرف الفترة</option>
                        <option value="الدعم الفني">الدعم الفني والصيانة</option>
                        <option value="المدير العام">المدير العام</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف:</label>
                      <input
                        type="text"
                        value={editingStaff.phone}
                        onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono-digits transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نوبة العمل:</label>
                    <select
                      value={editingStaff.shift}
                      onChange={(e) => setEditingStaff({ ...editingStaff, shift: e.target.value as any })}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none cursor-pointer transition"
                    >
                      <option value="وردية صباحية (09:00 إلى 16:00)">وردية صباحية (09:00 إلى 16:00)</option>
                      <option value="وردية مسائية (16:00 إلى 24:00)">وردية مسائية (16:00 إلى 24:00)</option>
                      <option value="وردية ليلية متأخرة">وردية ليلية متأخرة</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingStaff(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-110 shadow-md shadow-emerald-500/30 flex items-center gap-1.5 font-gaming cursor-pointer animate-gradient-x"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>حفظ التعديلات</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
