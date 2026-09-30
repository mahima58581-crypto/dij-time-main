import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Building2, 
  DollarSign, 
  Bell, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Save, 
  ShieldAlert, 
  Sparkles,
  Volume2,
  Play,
  Radio,
  Clock,
  Receipt,
  Gamepad2,
  KeyRound,
  Lock
} from 'lucide-react';
import { ClubSettings as ClubSettingsType, StationType } from '../types';
import { CyberSectionIcon } from './CyberSectionIcon';
import { 
  play10MinWarningSound, 
  play5MinWarningSound, 
  playTimeOverAlarmSound, 
  playCheckoutSound, 
  playReservationAlertSound,
  playSessionStartSound,
  unlockAudioContext
} from '../utils/audioAlerts';

interface ClubSettingsProps {
  settings: ClubSettingsType;
  onUpdateSettings: (settings: ClubSettingsType) => void;
  onResetToDemoData: () => void;
}

export const ClubSettings: React.FC<ClubSettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetToDemoData,
}) => {
  const [localSettings, setLocalSettings] = useState<ClubSettingsType>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleBackupExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `gaming_club_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-emerald-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <CyberSectionIcon icon={Settings} size="lg" variant="emerald" />
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              إعدادات النظام وتهيئة النادي
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              بيانات مركز الألعاب، الأسعار الافتراضية لكل منصة، التنبيهات والنسخ الاحتياطي
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ الإعدادات بنجاح!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Club Info */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>بيانات مركز الألعاب والفاتورة المطبوعة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">اسم النادي / الصالة:</label>
              <input
                type="text"
                required
                value={localSettings.clubName}
                onChange={(e) => setLocalSettings({ ...localSettings, clubName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">الفرع:</label>
              <input
                type="text"
                value={localSettings.branchName}
                onChange={(e) => setLocalSettings({ ...localSettings, branchName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">رقم الهاتف للدعم والفواتير:</label>
              <input
                type="text"
                value={localSettings.phone}
                onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono-digits"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">العنوان:</label>
              <input
                type="text"
                value={localSettings.address}
                onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Default Hourly Rates */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>التعرفة الافتراضية بالساعة للمحطات الجديدة (بالدينار)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="font-bold font-sans text-slate-700 dark:text-slate-300">كمبيوتر (PC):</label>
              <input
                type="number"
                step="500"
                value={localSettings.defaultRates.PC}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    defaultRates: { ...localSettings.defaultRates, PC: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-800 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold font-sans text-slate-700 dark:text-slate-300">بلايستيشن 5 (PS5):</label>
              <input
                type="number"
                step="500"
                value={localSettings.defaultRates.PS5}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    defaultRates: { ...localSettings.defaultRates, PS5: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-800 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold font-sans text-slate-700 dark:text-slate-300">إكسبوکس (XBOX):</label>
              <input
                type="number"
                step="500"
                value={localSettings.defaultRates.XBOX}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    defaultRates: { ...localSettings.defaultRates, XBOX: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-800 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold font-sans text-slate-700 dark:text-slate-300">محاكي قيادة (VIP):</label>
              <input
                type="number"
                step="1000"
                value={localSettings.defaultRates.VIP_SIM}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    defaultRates: { ...localSettings.defaultRates, VIP_SIM: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-800 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono-digits"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Alerts & Switches */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>التنبيهات والأصوات الذكية للنظام (Sound Alerts)</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-700 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>محرك الأصوات نشط</span>
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800 transition">
              <div>
                <div className="font-bold text-slate-800 dark:text-white">تنبيه صوتي ومرئي عند اقتراب انتهاء وقت الجلسات المحددة</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">تشغيل التنبيه عند وصول الوقت المتبقي إلى 10 و 5 دقائق وإطلاق صفارة النهاية</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.enableSoundAlerts}
                onChange={(e) => setLocalSettings({ ...localSettings, enableSoundAlerts: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800 transition">
              <div>
                <div className="font-bold text-slate-800 dark:text-white">الاحتساب التلقائي للوقت الإضافي (Overtime)</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">في حال تجاوز الوقت المحدد للجلسة، يتم احتساب الوقت الإضافي تلقائياً وفق تعرفة الساعة</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.autoOvertimeAlert}
                onChange={(e) => setLocalSettings({ ...localSettings, autoOvertimeAlert: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            {/* Quick Live Audio Preview in Settings */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-200/80 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>معاينة وتجربة أصوات النظام فورياً:</span>
                </span>
                <span className="text-[10px] text-slate-500">اضغط للاستماع المباشر</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    unlockAudioContext();
                    play10MinWarningSound();
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>تنبيه 10 دقائق</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    unlockAudioContext();
                    play5MinWarningSound();
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تنبيه 5 دقائق</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    unlockAudioContext();
                    playTimeOverAlarmSound();
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Bell className="w-3.5 h-3.5 text-rose-500" />
                  <span>صفارة النهاية</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    unlockAudioContext();
                    playCheckoutSound();
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                  <span>نغمة الدفع</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security & PIN Codes Configuration */}
        <div className="bg-white dark:bg-[#0c101c] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CyberSectionIcon icon={KeyRound} size="sm" variant="amber" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              الأمان ورموز الدخول المزدوجة (PIN Security)
            </h3>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>نظام الحماية المزدوج:</strong> يتضمن النظام مستويين منفصلين من الأمان؛ رمز رئيسي لفتح واجهة الكلوپ عند فتح المتصفح، ورمز مدير إضافي لحماية تقارير الأرباح المالية وإعدادات النظام.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رمز الدخول العام للمتصفح (Master App Entry PIN)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={4}
                  value={localSettings.appEntryPin || '1234'}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setLocalSettings({ ...localSettings, appEntryPin: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-widest focus:outline-none focus:border-emerald-500"
                  placeholder="1234"
                  dir="ltr"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                مطلوب عند فتح المتصفح للدخول لكافة أقسام النظام (الافتراضي: 1234)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رمز المدير لتقارير الأرباح والإعدادات (Admin PIN)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={4}
                  value={localSettings.adminPin || '5858'}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setLocalSettings({ ...localSettings, adminPin: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-amber-600 dark:text-amber-400 tracking-widest focus:outline-none focus:border-emerald-500"
                  placeholder="5858"
                  dir="ltr"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                مطلوب لفتح آخر صفحتين (تقارير النفقات والإعدادات) (الافتراضي: 5858)
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-md shadow-emerald-500/25 flex items-center gap-2 cursor-pointer font-gaming"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>حفظ جميع الإعدادات</span>
          </motion.button>
        </div>
      </form>

      {/* Section 4: Data Backup & Reset */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>النسخ الاحتياطي واستعادة بيانات التطبيق</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 dark:text-slate-400">
            يتم حفظ جميع البيانات والإعدادات في ذاكرة المتصفح تلقائياً. يمكنك تنزيل نسخة احتياطية لحفظها أو نقلها لجهاز آخر.
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBackupExport}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>تنزيل نسخة احتياطية (JSON)</span>
            </button>

            <button
              onClick={() => {
                onResetToDemoData();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة البيانات الافتراضية</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
