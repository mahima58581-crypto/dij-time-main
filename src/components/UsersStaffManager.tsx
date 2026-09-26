import React, { useState } from 'react';
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
  KeyRound, 
  X, 
  Save,
  Check,
  UserCheck
} from 'lucide-react';
import { StaffOperator } from '../types';

interface UsersStaffManagerProps {
  staffList: StaffOperator[];
  currentOperator: StaffOperator;
  onSetCurrentOperator: (operator: StaffOperator) => void;
  onAddStaff: (staff: Omit<StaffOperator, 'id'>) => void;
  onUpdateStaff: (staff: StaffOperator) => void;
  onDeleteStaff: (staffId: string) => void;
}

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

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>إدارة المستخدمين والمشغلين وكادر النادي</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تعيين حسابات أمناء الصندوق، مشرفي الشيفت، إدارة جداول العمل وسجلات الدخول
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-right shadow-xs">
            <span className="text-slate-600">المشغل النشط في الصندوق: </span>
            <span className="font-black text-emerald-800">{currentOperator.name}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 transition font-gaming"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ إضافة موظف جديد</span>
          </motion.button>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((staff) => {
          const isCurrent = staff.id === currentOperator.id;
          const isActive = staff.status === 'active';

          return (
            <motion.div
              key={staff.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-2xl bg-white border transition-all shadow-sm space-y-4 flex flex-col justify-between ${
                isCurrent
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/10'
                  : isActive
                  ? 'border-slate-200 hover:border-emerald-300'
                  : 'border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                      {staff.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900">{staff.name}</h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                            صندوق نشط
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                        {staff.role}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStatus(staff)}
                    title={isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {isActive ? 'نشط' : 'معطل'}
                  </button>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5 font-mono font-mono-digits">
                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span className="flex items-center gap-1 font-sans">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      رقم الهاتف:
                    </span>
                    <span className="text-slate-800">{staff.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span className="flex items-center gap-1 font-sans">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      نوبة العمل:
                    </span>
                    <span className="text-emerald-800 font-sans font-bold">{staff.shift}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1 border-t border-slate-200 font-sans">
                    <span>آخر تسجيل دخول:</span>
                    <span className="text-slate-500">{staff.lastLogin}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                {!isCurrent ? (
                  <button
                    onClick={() => onSetCurrentOperator(staff)}
                    disabled={!isActive}
                    className="py-1.5 px-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 disabled:opacity-30 transition flex items-center gap-1 shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تعيين كمشغل نشط حالياً</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    يعمل على النظام حالياً
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingStaff(staff)}
                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-emerald-700 hover:bg-emerald-50 transition"
                    title="تعديل البيانات"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {staffList.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف حساب ${staff.name}؟`)) {
                          onDeleteStaff(staff.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-rose-600 hover:bg-rose-50 transition"
                      title="حذف الحساب"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-emerald-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  <span>إضافة مشغل / موظف جديد</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: رضا أحمد"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">اسم المستخدم:</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="reza_gamer"
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">الدور والمنصب:</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    >
                      <option value="أمين الصندوق">أمين الصندوق (كاشير)</option>
                      <option value="مشرف الفترة">مشرف الفترة</option>
                      <option value="الدعم الفني">الدعم الفني والصيانة</option>
                      <option value="المدير العام">المدير العام</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">رقم الهاتف:</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07701234567"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-mono-digits"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">نوبة العمل (الوردية):</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    <option value="وردية صباحية (09:00 إلى 16:00)">وردية صباحية (09:00 إلى 16:00)</option>
                    <option value="وردية مسائية (16:00 إلى 24:00)">وردية مسائية (16:00 إلى 24:00)</option>
                    <option value="وردية ليلية متأخرة">وردية ليلية متأخرة</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-105 shadow-md shadow-emerald-500/25 font-gaming"
                  >
                    إنشاء الحساب
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Staff Modal */}
      <AnimatePresence>
        {editingStaff && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-emerald-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                  <span>تعديل الموظف: {editingStaff.name}</span>
                </h3>
                <button
                  onClick={() => setEditingStaff(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">الدور:</label>
                    <select
                      value={editingStaff.role}
                      onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    >
                      <option value="أمين الصندوق">أمين الصندوق (كاشير)</option>
                      <option value="مشرف الفترة">مشرف الفترة</option>
                      <option value="الدعم الفني">الدعم الفني والصيانة</option>
                      <option value="المدير العام">المدير العام</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">رقم الهاتف:</label>
                    <input
                      type="text"
                      value={editingStaff.phone}
                      onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono-digits"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">نوبة العمل:</label>
                  <select
                    value={editingStaff.shift}
                    onChange={(e) => setEditingStaff({ ...editingStaff, shift: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="وردية صباحية (09:00 إلى 16:00)">وردية صباحية (09:00 إلى 16:00)</option>
                    <option value="وردية مسائية (16:00 إلى 24:00)">وردية مسائية (16:00 إلى 24:00)</option>
                    <option value="وردية ليلية متأخرة">وردية ليلية متأخرة</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingStaff(null)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:brightness-105 shadow-md shadow-emerald-500/25 flex items-center gap-1.5 font-gaming"
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
