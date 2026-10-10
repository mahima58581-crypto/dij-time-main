import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Building2,
  DollarSign,
  Bell,
  Database,
  Download,
  RotateCcw,
  Check,
  Save,
  Sparkles,
  Volume2,
  Radio,
  Clock,
  Receipt,
  KeyRound,
  ShieldCheck,
  Phone,
  MapPin,
  Landmark,
  Zap,
  Lock,
  HardDrive,
  ReceiptText
} from 'lucide-react';
import { ClubSettings as ClubSettingsType, StationType } from '../types';
import { PLATFORM_META } from './platformMeta';
import {
  play10MinWarningSound,
  play5MinWarningSound,
  playTimeOverAlarmSound,
  playCheckoutSound,
  unlockAudioContext
} from '../utils/audioAlerts';

interface ClubSettingsProps {
  settings: ClubSettingsType;
  onUpdateSettings: (settings: ClubSettingsType) => void;
  onResetToDemoData: () => void;
}

// ─── سوییچ مدرن ───
const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
      checked
        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/40'
        : 'bg-slate-200 dark:bg-slate-700'
    }`}
  >
    <span
      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
        checked ? 'left-[22px]' : 'left-0.5'
      }`}
    />
  </button>
);

// ─── هدر بخش شماره‌دار ───
const SectionHeader: React.FC<{
  num: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accent?: string;
}> = ({ num, icon, title, subtitle, accent = 'from-emerald-500 to-teal-500' }) => (
  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
    <div className="relative shrink-0">
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black flex items-center justify-center shadow-md">
        {num}
      </span>
    </div>
    <div className="min-w-0">
      <h3 className="text-sm font-black text-slate-900 dark:text-white">{title}</h3>
      {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

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

  const ratePlatforms: { key: StationType; label: string; step: string }[] = [
    { key: 'PC', label: 'كمبيوتر (PC)', step: '500' },
    { key: 'PS5', label: 'بلايستيشن 5 (PS5)', step: '500' },
    { key: 'XBOX', label: 'إكسبوکس (XBOX)', step: '500' },
    { key: 'VIP_SIM', label: 'محاكي قيادة (VIP)', step: '1000' },
  ];

  const audioPreviews = [
    { label: 'تنبيه 10 دقائق', icon: Clock, color: 'text-teal-600 dark:text-teal-400', fn: play10MinWarningSound },
    { label: 'تنبيه 5 دقائق', icon: Clock, color: 'text-emerald-600 dark:text-emerald-400', fn: play5MinWarningSound },
    { label: 'صفارة النهاية', icon: Bell, color: 'text-rose-500 dark:text-rose-400', fn: playTimeOverAlarmSound },
    { label: 'نغمة الدفع', icon: Receipt, color: 'text-cyan-600 dark:text-cyan-400', fn: playCheckoutSound },
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
        <div className="absolute -left-12 -top-20 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-6 -bottom-24 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <Settings className="absolute left-10 top-5 w-5 h-5 text-white/40 float-slow pointer-events-none" />
        <ShieldCheck className="absolute left-48 bottom-7 w-4 h-4 text-white/30 float-slower pointer-events-none" />
        <Database className="absolute right-1/3 top-3 w-4 h-4 text-white/35 float-slow pointer-events-none" />
        <Sparkles className="absolute right-1/4 bottom-4 w-4 h-4 text-white/30 float-slower pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-sm">
                إعدادات النظام وتهيئة النادي
              </h2>
              <p className="text-xs text-emerald-50/90 mt-1">
                بيانات مركز الألعاب، الأسعار الافتراضية لكل منصة، التنبيهات والنسخ الاحتياطي
              </p>
            </div>
          </div>

          <AnimatePresence>
            {savedSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -8 }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-700 text-xs font-black shadow-lg shadow-emerald-900/25"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
                </span>
                <span>تم حفظ الإعدادات بنجاح!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ─── محتوای بخش‌ها ─── */}
      <div className="w-full min-w-0 space-y-5">
        <form onSubmit={handleSave} className="space-y-5">

            {/* ═══ Section 1: Club Info ═══ */}
            <motion.section
              id="general"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm scroll-mt-4"
            >
              <SectionHeader
                num="1"
                icon={<Building2 className="w-5 h-5 text-white" />}
                title="بيانات مركز الألعاب والفاتورة المطبوعة"
                subtitle="هذه البيانات تظهر في ترويسة الفواتير والاستندات المطبوعة"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    اسم النادي / الصالة:
                  </label>
                  <input
                    type="text"
                    required
                    value={localSettings.clubName}
                    onChange={(e) => setLocalSettings({ ...localSettings, clubName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    الفرع:
                  </label>
                  <input
                    type="text"
                    value={localSettings.branchName}
                    onChange={(e) => setLocalSettings({ ...localSettings, branchName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    رقم الهاتف للدعم والفواتير:
                  </label>
                  <input
                    type="text"
                    value={localSettings.phone}
                    onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono-digits shadow-xs transition"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    العنوان:
                  </label>
                  <input
                    type="text"
                    value={localSettings.address}
                    onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
                  />
                </div>
              </div>

              {/* ─── پیش‌نمایش زنده ترويسة الفاتورة ─── */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 dark:text-slate-400 mb-3">
                  <ReceiptText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  معاينة حية لترويسة الفاتورة المطبوعة:
                </div>
                <div className="mx-auto max-w-xs p-4 rounded-xl bg-white dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-1 shadow-inner">
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider">ديج تايم لنادي الألعاب</div>
                  <div className="text-base font-black text-slate-900 dark:text-white">
                    {localSettings.clubName || 'اسم النادي'}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    {localSettings.branchName || 'الفرع'}
                  </div>
                  <div className="border-t border-dashed border-slate-200 dark:border-slate-700 my-2" />
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-mono-digits" dir="ltr">
                    {localSettings.phone || '07700000000'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {localSettings.address || 'العنوان'}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ═══ Section 2: Default Hourly Rates ═══ */}
            <motion.section
              id="rates"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm scroll-mt-4"
            >
              <SectionHeader
                num="2"
                icon={<DollarSign className="w-5 h-5 text-white" />}
                title="التعرفة الافتراضية بالساعة للمحطات الجديدة"
                subtitle="بالدينار العراقي — تُطبق تلقائياً عند إنشاء محطة جديدة"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {ratePlatforms.map((p) => {
                  const pm = PLATFORM_META[p.key];
                  const PIcon = pm.icon;
                  const val = localSettings.defaultRates[p.key];
                  const step = Number(p.step);
                  const setVal = (v: number) =>
                    setLocalSettings({
                      ...localSettings,
                      defaultRates: { ...localSettings.defaultRates, [p.key]: Math.max(0, v) },
                    });
                  return (
                    <motion.div
                      key={p.key}
                      whileHover={{ y: -3 }}
                      className={`relative overflow-hidden rounded-2xl border-2 ${pm.softBg} p-6 transition-all hover:shadow-2xl`}
                    >
                      {/* نوار گرادینت بالای کارت */}
                      <div className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r ${pm.accent} animate-gradient-x`} />

                      <div className="flex flex-col sm:flex-row items-center gap-5">
                        {/* آیکون و نام پلتفرم */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pm.accent} flex items-center justify-center shadow-xl shrink-0 ring-4 ring-white dark:ring-slate-800`}>
                            <PIcon className="w-8 h-8 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-base font-black text-slate-900 dark:text-white">{p.label}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">التعرفة الافتراضية</div>
                          </div>
                        </div>

                        {/* کنترل قیمت */}
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            type="button"
                            onClick={() => setVal(val - step)}
                            className={`w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-xl flex items-center justify-center hover:border-rose-400 hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer shadow-sm shrink-0`}
                          >
                            −
                          </motion.button>
                          <div className="relative">
                            <input
                              type="number"
                              step={p.step}
                              value={val}
                              onChange={(e) => setVal(Number(e.target.value) || 0)}
                              className={`w-28 sm:w-32 px-3 py-3 text-center text-2xl font-black bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none font-mono-digits shadow-inner transition no-spinner ${pm.text}`}
                              dir="ltr"
                            />
                            <span className="absolute -bottom-5 right-1/2 translate-x-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                              د.ع / ساعة
                            </span>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            type="button"
                            onClick={() => setVal(val + step)}
                            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${pm.accent} text-white font-black text-xl flex items-center justify-center shadow-lg hover:brightness-110 transition cursor-pointer shrink-0`}
                          >
                            +
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* ═══ Section 3: Alerts & Switches ═══ */}
            <motion.section
              id="alerts"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm scroll-mt-4"
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <SectionHeader
                  num="3"
                  icon={<Bell className="w-5 h-5 text-white" />}
                  title="التنبيهات والأصوات الذكية للنظام"
                  subtitle="محرك التنبيهات الصوتية"
                />
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-700 flex items-center gap-1 shrink-0">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  <span>محرك الأصوات نشط</span>
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600/50 transition group">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      تنبيه صوتي ومرئي عند اقتراب انتهاء وقت الجلسات المحددة
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      تشغيل التنبيه عند وصول الوقت المتبقي إلى 10 و 5 دقائق وإطلاق صفارة النهاية
                    </div>
                  </div>
                  <Toggle
                    checked={localSettings.enableSoundAlerts}
                    onChange={(v) => setLocalSettings({ ...localSettings, enableSoundAlerts: v })}
                  />
                </label>

                <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600/50 transition group">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      الاحتساب التلقائي للوقت الإضافي (Overtime)
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      في حال تجاوز الوقت المحدد للجلسة، يتم احتساب الوقت الإضافي تلقائياً وفق تعرفة الساعة
                    </div>
                  </div>
                  <Toggle
                    checked={localSettings.autoOvertimeAlert}
                    onChange={(v) => setLocalSettings({ ...localSettings, autoOvertimeAlert: v })}
                  />
                </label>

                {/* Quick Live Audio Preview */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                      <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>معاينة وتجربة أصوات النظام فورياً:</span>
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">اضغط للاستماع المباشر</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {audioPreviews.map((a) => (
                      <motion.button
                        key={a.label}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          unlockAudioContext();
                          a.fn();
                        }}
                        className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <a.icon className={`w-3.5 h-3.5 ${a.color}`} />
                        <span>{a.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ═══ Section 4: Security & PIN ═══ */}
            <motion.section
              id="security"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm scroll-mt-4"
            >
              <SectionHeader
                num="4"
                icon={<KeyRound className="w-5 h-5 text-white" />}
                title="الأمان ورموز الدخول المزدوجة"
                subtitle="أمان الرمز — نظام الحماية المزدوج"
                accent="from-amber-500 to-orange-500"
              />

              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/40 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>نظام الحماية المزدوج:</strong> يتضمن النظام مستويين منفصلين من الأمان؛ رمز رئيسي لفتح واجهة الكلوپ عند فتح المتصفح، ورمز مدير إضافي لحماية تقارير الأرباح المالية وإعدادات النظام.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    رمز الدخول العام للمتصفح (رمز دخول التطبيق الرئيسي)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      maxLength={4}
                      value={localSettings.appEntryPin || '1234'}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setLocalSettings({ ...localSettings, appEntryPin: val });
                      }}
                      className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-[0.3em] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
                      placeholder="1234"
                      dir="ltr"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    مطلوب عند فتح المتصفح للدخول لكافة أقسام النظام (الافتراضي: 1234)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    رمز المدير لتقارير الأرباح والإعدادات (رمز المدير)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      maxLength={4}
                      value={localSettings.adminPin || '5858'}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setLocalSettings({ ...localSettings, adminPin: val });
                      }}
                      className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-amber-600 dark:text-amber-400 tracking-[0.3em] focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition"
                      placeholder="5858"
                      dir="ltr"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    مطلوب لفتح آخر صفحتين (تقارير النفقات والإعدادات) (الافتراضي: 5858)
                  </span>
                </div>
              </div>
            </motion.section>

            {/* ═══ Section 5: Data Backup & Reset ═══ */}
            <motion.section
              id="backup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm scroll-mt-4"
            >
              <SectionHeader
                num="5"
                icon={<Database className="w-5 h-5 text-white" />}
                title="النسخ الاحتياطي واستعادة بيانات التطبيق"
                subtitle="يتم حفظ جميع البيانات والإعدادات في ذاكرة المتصفح تلقائياً"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  يمكنك تنزيل نسخة احتياطية لحفظها أو نقلها لجهاز آخر.
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleBackupExport}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>تنزيل نسخة احتياطية (JSON)</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      onResetToDemoData();
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة البيانات الافتراضية</span>
                  </motion.button>
                </div>
              </div>
            </motion.section>

            {/* ─── دکمه حفظ ─── */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-7 py-3 rounded-xl text-sm font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer font-gaming animate-gradient-x"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>حفظ جميع الإعدادات</span>
              </motion.button>
            </div>
          </form>
      </div>

    </div>
  );
};
