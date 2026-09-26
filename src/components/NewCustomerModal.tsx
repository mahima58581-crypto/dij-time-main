import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, UserPlus, Phone, KeyRound, Wallet, RefreshCw } from 'lucide-react';
import { Customer } from '../types';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Omit<Customer, 'id' | 'totalPlayMinutes' | 'totalSpent' | 'registeredAt'>) => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState(
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const [balance, setBalance] = useState<number>(0);
  const [vipLevel, setVipLevel] = useState<Customer['vipLevel']>('برونزي');
  const [notes, setNotes] = useState('');

  const generateRandomPin = () => {
    setPin(Math.floor(1000 + Math.random() * 9000).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !pin.trim()) {
      alert('يرجى إدخال اسم اللاعب، ورقم الهاتف، ورمز PIN!');
      return;
    }

    onAddCustomer({
      name,
      phone,
      pin,
      balance,
      vipLevel,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4"
      >
        
        {/* رأس النافذة المنبثقة */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">إضافة لاعب جديد إلى الصالة</h2>
              <p className="text-xs text-slate-500">
                تسجيل الاسم، رقم الهاتف، رمز PIN وشحن الرصيد المبدئي بالدينار
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* اسم اللاعب */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">الاسم الثلاثي للاعب:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: علي التميمي"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* رقم الهاتف */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>رقم الهاتف النقال:</span>
            </label>
            <input
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xxxxxxxx"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-left font-mono-digits"
            />
          </div>

          {/* رمز PIN السري */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                <span>رمز PIN السري (٤ إلى ٦ أرقام):</span>
              </label>
              <button
                type="button"
                onClick={generateRandomPin}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" /> توليد عشوائي
              </button>
            </div>
            <input
              type="text"
              required
              maxLength={6}
              dir="ltr"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="1234"
              className="w-full px-3.5 py-2.5 rounded-xl text-center text-base font-mono font-black tracking-widest text-emerald-800 bg-emerald-50/50 border border-emerald-300 focus:outline-none focus:border-emerald-500 font-mono-digits"
            />
          </div>

          {/* الرصيد المبدئي ومستوى العضوية */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>الرصيد الافتتاحي (د.ع):</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white text-left font-mono-digits"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">فئة العضوية VIP:</label>
              <select
                value={vipLevel}
                onChange={(e) => setVipLevel(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              >
                <option value="برونزي">عضو برونزي (عادي)</option>
                <option value="فضي">عضو فضي (خصم 5%)</option>
                <option value="ذهبي">عضو ذهبي (خصم 10%)</option>
                <option value="VIP فاخر">عضو VIP فاخر (خصم 15%)</option>
              </select>
            </div>
          </div>

          {/* ملاحظات */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">ملاحظات وتفضيلات اللاعب:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: يفضل ألعاب الشوتر، شاشة 240Hz..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 transition"
            >
              إلغاء
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 transition shadow-md shadow-emerald-500/20"
            >
              حفظ وإنشاء ملف اللاعب
            </motion.button>
          </div>

        </form>

      </motion.div>
    </div>
  );
};

