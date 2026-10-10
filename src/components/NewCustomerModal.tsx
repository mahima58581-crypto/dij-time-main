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
      alert('يرجى إدخال اسم اللاعب، ورقم الهاتف، ورمز الدخول!');
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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-[#0c1220] border border-emerald-200/80 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4 text-right"
        dir="rtl"
      >
        
        {/* رأس النافذة المنبثقة */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white font-gaming">إضافة لاعب جديد إلى الصالة</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تسجيل الاسم، رقم الهاتف، رمز الدخول وشحن الرصيد المبدئي بالدينار
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* اسم اللاعب */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم الثلاثي للاعب:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: علي التميمي"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#080e1b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-[#0c1220]"
            />
          </div>

          {/* رقم الهاتف */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>رقم الهاتف النقال:</span>
            </label>
            <input
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xxxxxxxx"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono bg-slate-50 dark:bg-[#080e1b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-[#0c1220] text-left font-mono-digits"
            />
          </div>

          {/* رمز PIN السري */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>رمز الدخول السري (٤ إلى ٦ أرقام):</span>
              </label>
              <button
                type="button"
                onClick={generateRandomPin}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 transition cursor-pointer"
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
              className="w-full px-3.5 py-2.5 rounded-xl text-center text-base font-mono font-black tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-600 focus:outline-none focus:border-emerald-500 font-mono-digits"
            />
          </div>

          {/* الرصيد المبدئي ومستوى العضوية */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>الرصيد الافتتاحي (د.ع):</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold bg-slate-50 dark:bg-[#080e1b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-[#0c1220] text-left font-mono-digits"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">فئة العضوية VIP:</label>
              <select
                value={vipLevel}
                onChange={(e) => setVipLevel(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#080e1b] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-[#0c1220]"
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
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">ملاحظات وتفضيلات اللاعب:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: يفضل ألعاب الشوتر، شاشة 240Hz..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#080e1b] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-[#0c1220]"
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
            >
              إلغاء
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 transition shadow-md shadow-emerald-500/20 cursor-pointer font-gaming"
            >
              حفظ وإنشاء ملف اللاعب
            </motion.button>
          </div>

        </form>

      </motion.div>
    </div>
  );
};

