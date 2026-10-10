import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Volume1, 
  Bell, 
  Play, 
  Check, 
  Sparkles, 
  Clock, 
  Receipt, 
  CalendarClock, 
  Gamepad2, 
  Coffee, 
  Coins, 
  Mic, 
  MicOff, 
  X,
  Radio,
  Sliders
} from 'lucide-react';
import { 
  SoundSettings, 
  loadSoundSettings, 
  updateGlobalSoundSettings,
  play10MinWarningSound,
  play5MinWarningSound,
  playTimeOverAlarmSound,
  playCheckoutSound,
  playReservationAlertSound,
  playSessionStartSound,
  playSnackSound,
  playCoinSound,
  speakVoiceAlert,
  preloadAudioSamples,
  unlockAudioContext
} from '../utils/audioAlerts';

export interface SoundLogItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

interface SoundAlertsControllerProps {
  lastAudioEvent?: SoundLogItem | null;
}

export const SoundAlertsController: React.FC<SoundAlertsControllerProps> = ({
  lastAudioEvent,
}) => {
  const [settings, setSettings] = useState<SoundSettings>(loadSoundSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingTest, setIsPlayingTest] = useState<string | null>(null);
  const [recentLogs, setRecentLogs] = useState<SoundLogItem[]>([]);
  const [activeToast, setActiveToast] = useState<SoundLogItem | null>(null);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Listen to new audio events and auto-dismiss toast after 8 seconds
  useEffect(() => {
    if (lastAudioEvent) {
      setRecentLogs((prev) => [lastAudioEvent, ...prev.slice(0, 14)]);
      setActiveToast(lastAudioEvent);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      // Auto-hide after exactly 8 seconds as requested
      toastTimeoutRef.current = setTimeout(() => {
        setActiveToast(null);
      }, 8000);
    }
  }, [lastAudioEvent]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Unlock AudioContext on mount or click
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      unlockAudioContext();
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('keydown', handleFirstUserInteraction);
    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
  }, []);

  // Preload custom audio files so the first alert has no fetch latency
  useEffect(() => {
    preloadAudioSamples();
  }, []);

  const handleUpdate = (patch: Partial<SoundSettings>) => {
    const updated = updateGlobalSoundSettings(patch);
    setSettings({ ...updated });
  };

  const handleToggleMute = () => {
    unlockAudioContext();
    handleUpdate({ isMuted: !settings.isMuted });
  };

  const handleTestSound = (
    key: string,
    soundFn: () => void,
    voiceText?: string
  ) => {
    unlockAudioContext();
    setIsPlayingTest(key);
    soundFn();
    if (settings.voiceEnabled && voiceText) {
      setTimeout(() => {
        speakVoiceAlert(voiceText);
      }, 400);
    }
    setTimeout(() => setIsPlayingTest(null), 1200);
  };

  const getVolumeIcon = () => {
    if (settings.isMuted || settings.volume === 0) {
      return <VolumeX className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
    }
    if (settings.volume < 0.5) {
      return <Volume1 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    return <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
  };

  return (
    <div className="relative">
      
      {/* Top Bar Sound Status Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        id="btn-sound-controller-toggle"
        onClick={() => {
          unlockAudioContext();
          setIsOpen(!isOpen);
        }}
        className={`h-9 flex items-center gap-1.5 px-2.5 rounded-lg border text-xs font-bold transition shadow-xs cursor-pointer ${
          settings.isMuted
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-slate-800'
        }`}
        title="تنظیمات افکت‌ها و هشدارهای صوتی هوشمند"
      >
        <span className="relative flex items-center justify-center">
          {getVolumeIcon()}
          {!settings.isMuted && (
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </span>
        <span className="hidden lg:inline text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
          {settings.isMuted ? 'بی‌صدا' : `${Math.round(settings.volume * 100)}%`}
        </span>
      </motion.button>

      {/* Floating Active Sound Toast Notification (Auto-disappears after 8 seconds) */}
      <AnimatePresence>
        {activeToast && !isOpen && (
          <motion.div
            key={activeToast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-4 z-50 flex flex-col gap-1.5 p-3 rounded-2xl bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-xl border border-emerald-400 dark:border-emerald-500/50 shadow-2xl shadow-emerald-500/20 max-w-sm pointer-events-auto"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                <Radio className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex-1 min-w-[170px]">
                <div className="text-[11px] font-black text-slate-900 dark:text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>{activeToast.type}</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    ۸ ثانیه
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold mt-0.5">
                  {activeToast.message}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveToast(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                title="بستن اعلان"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* 8-second countdown progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 8, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Sound Settings Dropdown / Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Container */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 sm:left-auto right-0 sm:right-0 mt-2 w-[340px] sm:w-[380px] bg-white dark:bg-[#0c121e] rounded-3xl border border-emerald-200 dark:border-slate-800 shadow-2xl z-50 p-4 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      هشدارهای صوتی هوشمند سالن
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      پخش افکت و خوانش صوتی پایان وقت و رویدادها
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Master Volume Slider & Mute Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {getVolumeIcon()}
                    <span>میزان صدای خروجی:</span>
                  </span>
                  <button
                    onClick={handleToggleMute}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                      settings.isMuted
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {settings.isMuted ? 'خروج از حالت بی‌صدا' : 'بی‌صدا کردن'}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    disabled={settings.isMuted}
                    value={settings.volume}
                    onChange={(e) => handleUpdate({ volume: parseFloat(e.target.value), isMuted: false })}
                    className="w-full accent-emerald-600 cursor-pointer disabled:opacity-40"
                  />
                  <span className="text-xs font-mono font-mono-digits font-bold text-slate-700 dark:text-slate-300 w-9 text-left">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </div>
              </div>

              {/* Voice Announcement Toggle */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    {settings.voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">اعلان گفتاری هوشمند (TTS)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">خواندن نام دستگاه و وضعیت به زبان فارسی/عربی</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={(e) => handleUpdate({ voiceEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Individual Sound Events & Test Buttons */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 px-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>افکت‌های صوتی و دکمه تست زنده:</span>
                </div>

                {/* 1. 10 Min Warning */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">هشدار ۱۰ دقیقه مانده به پایان</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">فایل صوتی اختصاصی (audio-1)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTestSound('10min', play10MinWarningSound, 'باقي 10 دقائق من وقتك')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                        isPlayingTest === '10min'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>تست</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={settings.alert10MinEnabled}
                      onChange={(e) => handleUpdate({ alert10MinEnabled: e.target.checked })}
                      className="w-3.5 h-3.5 accent-emerald-600"
                    />
                  </div>
                </div>

                {/* 2. 5 Min Warning */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">هشدار ۵ دقیقه مانده به پایان</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">زنگ هشدار سه‌گانه</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTestSound('5min', play5MinWarningSound, 'باقي 5 دقائق فقط من وقتك')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                        isPlayingTest === '5min'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>تست</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={settings.alert5MinEnabled}
                      onChange={(e) => handleUpdate({ alert5MinEnabled: e.target.checked })}
                      className="w-3.5 h-3.5 accent-emerald-600"
                    />
                  </div>
                </div>

                {/* 3. Time Over Alarm */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">زنگ اتمام وقت و شروع اضافه کاری</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">بوق دیجیتال پایان جلسه</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTestSound('timeup', playTimeOverAlarmSound, 'انتهى وقت الجلسة، تم احتساب الوقت الإضافي')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                        isPlayingTest === 'timeup'
                          ? 'bg-rose-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:border-rose-400'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>تست</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={settings.alertTimeUpEnabled}
                      onChange={(e) => handleUpdate({ alertTimeUpEnabled: e.target.checked })}
                      className="w-3.5 h-3.5 accent-emerald-600"
                    />
                  </div>
                </div>

                {/* 4. Checkout Chime */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">افکت تسویه حساب و فاکتور</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">زنگ صندوق و نغمه موفقیت</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTestSound('checkout', playCheckoutSound, 'تم تسوية الفاتورة بنجاح')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                        isPlayingTest === 'checkout'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>تست</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={settings.checkoutSoundEnabled}
                      onChange={(e) => handleUpdate({ checkoutSoundEnabled: e.target.checked })}
                      className="w-3.5 h-3.5 accent-emerald-600"
                    />
                  </div>
                </div>

                {/* 5. Queue / Reservation Alert */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">نوبت‌دهی و رزرو لیست انتظار</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">نغمه فراخوانی بازیکن</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTestSound('queue', playReservationAlertSound, 'حان موعد حجز اللاعب')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                        isPlayingTest === 'queue'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>تست</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={settings.reservationSoundEnabled}
                      onChange={(e) => handleUpdate({ reservationSoundEnabled: e.target.checked })}
                      className="w-3.5 h-3.5 accent-emerald-600"
                    />
                  </div>
                </div>

                {/* 6. Session Start Sound */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">آغاز بازی و ورود به دستگاه</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">نغمه صعودی گیمینگ</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTestSound('start', playSessionStartSound)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                        isPlayingTest === 'start'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>تست</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={settings.sessionStartSoundEnabled}
                      onChange={(e) => handleUpdate({ sessionStartSoundEnabled: e.target.checked })}
                      className="w-3.5 h-3.5 accent-emerald-600"
                    />
                  </div>
                </div>

                {/* 7. Snack & Buffet */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">سفارش بوفه و خوراکی</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">دینگ ثبت نوشیدنی</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestSound('snack', playSnackSound)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                      isPlayingTest === 'snack'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>تست</span>
                  </button>
                </div>

                {/* 8. Wallet Coin */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">شارژ کیف پول گیمر</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">صدای سکه ماریو</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestSound('coin', playCoinSound)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                      isPlayingTest === 'coin'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>تست</span>
                  </button>
                </div>
              </div>

              {/* Recent Audio Logs */}
              {recentLogs.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">آخرین هشدارهای صوتی پخش شده:</div>
                  <div className="max-h-24 overflow-y-auto space-y-1 text-[10px]">
                    {recentLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 px-2 py-1 rounded-lg">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">{log.type}: {log.message}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-mono font-mono-digits">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
