import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Coins, 
  Clock, 
  Coffee, 
  Gamepad2, 
  Globe2, 
  WifiOff, 
  CreditCard, 
  Wallet, 
  Banknote,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Session, Station, SnackItem } from '../types';
import { formatCurrency, formatDuration } from '../utils/formatters';

interface FinancialReportProps {
  sessions: Session[];
  stations: Station[];
  snacks: SnackItem[];
}

export const FinancialReport: React.FC<FinancialReportProps> = ({
  sessions,
  stations,
  snacks,
}) => {
  const totalRevenue = sessions.reduce((sum, s) => sum + s.finalAmount, 0);
  const timeRevenue = sessions.reduce((sum, s) => sum + s.timeCost, 0);
  const snacksRevenue = sessions.reduce((sum, s) => sum + s.snacksCost, 0);

  // حساب الألعاب الأكثر طلباً
  const gameStatsMap: Record<string, { name: string; count: number; onlineCount: number; offlineCount: number }> = {};
  sessions.forEach((s) => {
    s.gamesPlayed.forEach((g) => {
      if (!gameStatsMap[g.gameName]) {
        gameStatsMap[g.gameName] = { name: g.gameName, count: 0, onlineCount: 0, offlineCount: 0 };
      }
      gameStatsMap[g.gameName].count += 1;
      if (g.mode === 'online') gameStatsMap[g.gameName].onlineCount += 1;
      else gameStatsMap[g.gameName].offlineCount += 1;
    });
  });
  const topGames = Object.values(gameStatsMap).sort((a, b) => b.count - a.count);

  // أصناف البوفيه الأكثر مبيعاً
  const snackSalesMap: Record<string, { name: string; qty: number; totalRev: number }> = {};
  sessions.forEach((s) => {
    s.snacks.forEach((item) => {
      if (!snackSalesMap[item.name]) {
        snackSalesMap[item.name] = { name: item.name, qty: 0, totalRev: 0 };
      }
      snackSalesMap[item.name].qty += item.quantity;
      snackSalesMap[item.name].totalRev += item.totalPrice;
    });
  });
  const topSnacks = Object.values(snackSalesMap).sort((a, b) => b.qty - a.qty);

  // طرق الدفع بالدينار
  const paymentMethodStats: Record<string, number> = {
    'نقداً': 0,
    'بطاقة مصرفية / إلكتروني': 0,
    'محفظة اللاعب': 0,
  };
  sessions.forEach((s) => {
    const rawMethod = s.paymentMethod || 'كاش';
    const mapped = (rawMethod === 'كاش') 
      ? 'نقداً' 
      : (rawMethod === 'شبكة / مدى' || rawMethod === 'تحويل') 
      ? 'بطاقة مصرفية / إلكتروني' 
      : 'محفظة اللاعب';
    paymentMethodStats[mapped] = (paymentMethodStats[mapped] || 0) + s.finalAmount;
  });

  return (
    <div className="space-y-5">
      
      {/* رأس تقرير الحسابات المالية */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#10121b]/95 rounded-2xl p-5 border border-amber-500/25 shadow-xl backdrop-blur-md"
      >
        <h2 className="text-lg font-black text-zinc-100 flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20"
          >
            <BarChart3 className="w-5 h-5 stroke-[2.5]" />
          </motion.div>
          <span>گزارش‌های آماری و بیلان مالی کلوپ (به دینار)</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          تحلیل تفصیلی درآمدهای نشست‌ها، مقایسه بازی‌های آنلاین و آفلاین، فروش بوفه، و تفکیک روش‌های پرداخت
        </p>
      </motion.div>

      {/* ۳ بطاقات رئيسية للدخل بالدينار */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* إجمالي الإيرادات */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -3 }}
          className="bg-[#10121b]/95 border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">کل درآمد ناخالص (دینار)</span>
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950">
              <Coins className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden flex border border-zinc-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
              style={{ width: `${(timeRevenue / (totalRevenue || 1)) * 100}%` }}
              title="درآمد تایم بازی"
            ></div>
            <div
              className="bg-cyan-400 h-full transition-all duration-500"
              style={{ width: `${(snacksRevenue / (totalRevenue || 1)) * 100}%` }}
              title="درآمد بوفه"
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> تایم بازی ({Math.round((timeRevenue / (totalRevenue || 1)) * 100)}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> بوفه ({Math.round((snacksRevenue / (totalRevenue || 1)) * 100)}%)
            </span>
          </div>
        </motion.div>

        {/* إيرادات ساعات اللعب */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="bg-[#10121b]/95 border border-amber-500/20 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">درآمد ساعات بازی</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-zinc-100">
            {formatCurrency(timeRevenue)}
          </div>
          <p className="text-xs text-zinc-500">
            محاسبه هوشمند بر مبنای تعرفه ساعتی سیستم‌های PC گیمینگ و پلی‌استیشن
          </p>
        </motion.div>

        {/* إيرادات البوفيه */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -3 }}
          className="bg-[#10121b]/95 border border-amber-500/20 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">فروش بوفه و اسنک</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Coffee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-zinc-100">
            {formatCurrency(snacksRevenue)}
          </div>
          <p className="text-xs text-zinc-500">
            نوشیدنی‌های انرژی‌زا، قهوه اسپرسو، چیپس و تنقلات گیمرها
          </p>
        </motion.div>

      </div>

      {/* عمودين: الألعاب المفضلة وأصناف البوفيه الأكثر مبيعاً */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* الألعاب الأكثر طلباً */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#10121b]/95 border border-amber-500/25 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>محبوب‌ترین بازی‌ها (آنلاین / آفلاین)</span>
            </h3>
            <span className="text-xs text-zinc-400">تعداد نشست‌ها</span>
          </div>

          <div className="space-y-2">
            {topGames.slice(0, 5).map((g, idx) => (
              <motion.div 
                whileHover={{ x: -2 }}
                key={idx} 
                className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/35 text-xs font-black flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-zinc-100 text-sm">{g.name}</span>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                      <span className="text-cyan-400 flex items-center gap-0.5">
                        <Globe2 className="w-3 h-3" /> آنلاین: {g.onlineCount}
                      </span>
                      {g.offlineCount > 0 && (
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <WifiOff className="w-3 h-3" /> آفلاین: {g.offlineCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-left font-mono font-bold text-amber-300 text-sm">
                  {g.count} <span className="text-xs font-normal text-zinc-500">نشست</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* أصناف البوفيه الأكثر طلباً */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#10121b]/95 border border-amber-500/25 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>پرفروش‌ترین‌های بوفه کلوپ</span>
            </h3>
            <span className="text-xs text-zinc-400">تعداد و درآمد کل</span>
          </div>

          <div className="space-y-2">
            {topSnacks.slice(0, 5).map((item, idx) => (
              <motion.div 
                whileHover={{ x: -2 }}
                key={idx} 
                className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/35 text-xs font-black flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-zinc-100 text-sm">{item.name}</span>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      فروش {item.qty} عدد
                    </div>
                  </div>
                </div>

                <div className="font-mono font-bold text-amber-400 text-sm text-left">
                  {formatCurrency(item.totalRev)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* طرق الدفع والتسديد */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#10121b]/95 border border-amber-500/25 rounded-2xl p-5 shadow-xl backdrop-blur-md"
      >
        <h3 className="text-sm font-black text-zinc-100 mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>توزیع روش‌های تسویه حساب بازیکنان به دینار</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-400">نقدی (کاش به دینار)</span>
              <div className="text-base font-black font-mono text-zinc-100">
                {formatCurrency(paymentMethodStats['نقداً'] || 0)}
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-400">کارت‌خوان بانکی / پرداخت دیجیتال</span>
              <div className="text-base font-black font-mono text-zinc-100">
                {formatCurrency(paymentMethodStats['بطاقة مصرفية / إلكتروني'] || 0)}
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-400">کسر از کیف پول بازیکن</span>
              <div className="text-base font-black font-mono text-zinc-100">
                {formatCurrency(paymentMethodStats['محفظة اللاعب'] || 0)}
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>

    </div>
  );
};

