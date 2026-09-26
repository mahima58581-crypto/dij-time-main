import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Coffee, 
  Flame, 
  Sparkles, 
  UtensilsCrossed, 
  Droplets,
  ShoppingBag
} from 'lucide-react';

interface SnackVisualProps {
  id?: string;
  name: string;
  category?: string;
  emoji?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

// تخصيص الألوان والتأثيرات حسب نوع الوجبة أو المشروب
export const getSnackTheme = (name: string, category?: string) => {
  const n = name.toLowerCase();
  
  if (n.includes('red bull') || n.includes('ريد بول') || n.includes('monster') || n.includes('مونستر') || n.includes('طاقة') || n.includes('rockstar')) {
    return {
      gradient: 'from-amber-400 via-orange-500 to-red-600',
      glow: 'shadow-orange-500/30 text-amber-300',
      badgeBg: 'bg-gradient-to-r from-red-600 to-amber-500 text-white',
      badgeLabel: 'طاقة عالية ⚡',
      icon: <Zap className="w-full h-full text-amber-200 fill-amber-300" />,
      emoji: '⚡'
    };
  }
  
  if (n.includes('شيبس') || n.includes('دوريتوس') || n.includes('برينجلز') || n.includes('حار') || n.includes('كرانشي')) {
    return {
      gradient: 'from-amber-500 via-red-500 to-rose-600',
      glow: 'shadow-red-500/25 text-amber-200',
      badgeBg: 'bg-gradient-to-r from-amber-600 to-red-600 text-white',
      badgeLabel: 'مقرمش حار 🔥',
      icon: <Flame className="w-full h-full text-red-200 fill-red-400" />,
      emoji: '🔥'
    };
  }

  if (n.includes('قهوة') || n.includes('اسبريسو') || n.includes('كابتشينو') || n.includes('أمريكانو') || n.includes('كرك') || n.includes('شاي')) {
    return {
      gradient: 'from-amber-700 via-stone-700 to-amber-950',
      glow: 'shadow-amber-800/30 text-amber-200',
      badgeBg: 'bg-gradient-to-r from-amber-800 to-stone-800 text-amber-100',
      badgeLabel: 'قهوة مختصة ☕',
      icon: <Coffee className="w-full h-full text-amber-200" />,
      emoji: '☕'
    };
  }

  if (n.includes('بيبسي') || n.includes('كولا') || n.includes('ماونتن') || n.includes('سفن') || n.includes('مياه') || n.includes('عصير')) {
    return {
      gradient: 'from-blue-500 via-sky-500 to-cyan-600',
      glow: 'shadow-blue-500/30 text-sky-200',
      badgeBg: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
      badgeLabel: 'منعش ومثلج ❄️',
      icon: <Droplets className="w-full h-full text-sky-200" />,
      emoji: '🥤'
    };
  }

  if (n.includes('برجر') || n.includes('زنجر') || n.includes('شطيرة') || n.includes('سندويش') || n.includes('ناشوز') || n.includes('بيتزا')) {
    return {
      gradient: 'from-amber-500 via-orange-600 to-red-700',
      glow: 'shadow-orange-600/30 text-amber-200',
      badgeBg: 'bg-gradient-to-r from-amber-600 to-orange-700 text-white',
      badgeLabel: 'وجبة ساخنة 🍔',
      icon: <UtensilsCrossed className="w-full h-full text-amber-200" />,
      emoji: '🍔'
    };
  }

  // حلويات وسكاكر
  return {
    gradient: 'from-pink-500 via-purple-600 to-indigo-700',
    glow: 'shadow-purple-500/30 text-pink-200',
    badgeBg: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white',
    badgeLabel: 'حلويات فاخرة ✨',
    icon: <Sparkles className="w-full h-full text-pink-200" />,
    emoji: '🍫'
  };
};

export const SnackVisual: React.FC<SnackVisualProps> = ({
  name,
  category,
  emoji,
  size = 'md',
  showBadge = false,
}) => {
  const theme = getSnackTheme(name, category);

  const sizeClasses = {
    sm: 'w-8 h-8 text-base rounded-xl',
    md: 'w-11 h-11 text-xl rounded-2xl',
    lg: 'w-14 h-14 text-2xl rounded-2xl',
    xl: 'w-20 h-20 text-4xl rounded-3xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-9 h-9',
  };

  return (
    <div className="relative inline-flex flex-col items-center justify-center group select-none">
      <motion.div
        whileHover={{ scale: 1.08, rotate: 4 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`relative flex items-center justify-center bg-gradient-to-br ${theme.gradient} shadow-lg ${theme.glow} ${sizeClasses[size]} border border-white/20 overflow-hidden cursor-pointer`}
      >
        {/* خلفية ضوئية براقة متحركة */}
        <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {/* حلقة وهج علوية */}
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-white/30 rounded-full blur-xs pointer-events-none" />

        {/* عرض الأيقونة أو الإيموجي الجذاب */}
        <div className="relative z-10 flex items-center justify-center">
          {emoji ? (
            <span className="drop-shadow-md filter">{emoji}</span>
          ) : (
            <div className={`${iconSizes[size]} drop-shadow-md`}>
              {theme.icon}
            </div>
          )}
        </div>
      </motion.div>

      {/* شارة مميزة اختيارية */}
      {showBadge && (
        <span className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${theme.badgeBg}`}>
          {theme.badgeLabel}
        </span>
      )}
    </div>
  );
};
