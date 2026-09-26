/**
 * دوال الحسابات المالية، التوقيت، وصيغ العرض لنظام صالة الألعاب dij-tiem
 * العملة المعتمدة: الدينار العراقي (IQD)
 * الأرقام: أرقام إنجليزية (Western Digits: 0, 1, 2, 3...)
 */

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 د.ع';
  const formattedNumber = Math.round(amount).toLocaleString('en-US');
  return `${formattedNumber} د.ع`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);

  if (hours > 0) {
    return `${hours} س ${remainingMins > 0 ? `و ${remainingMins} د` : ''}`;
  }
  return `${remainingMins} دقيقة ${secs > 0 ? `و ${secs} ثانية` : ''}`;
}

export function formatDurationDigital(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export function calculateElapsedSeconds(startTimeIso: string, endTimeIso?: string): number {
  const start = new Date(startTimeIso).getTime();
  const end = endTimeIso ? new Date(endTimeIso).getTime() : Date.now();
  const diff = Math.max(0, end - start);
  return Math.floor(diff / 1000);
}

export function calculatePlayCost(elapsedMinutes: number, hourlyRate: number): number {
  // احتساب التكلفة بدقة استناداً إلى دقائق اللعب وسعر الساعة بالدينار
  const cost = (elapsedMinutes / 60) * hourlyRate;
  return Math.round(cost);
}

export function formatArabicDateTime(isoString: string): string {
  if (!isoString) return '-';
  const date = new Date(isoString);
  // استخدام الترقيم الإنجليزي 'latn' مع أسماء الشهور العربية
  return date.toLocaleString('ar-IQ-u-nu-latn', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatArabicTimeOnly(isoString: string): string {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// التوافق مع التسميات السابقة
export const formatPersianDateTime = formatArabicDateTime;
export const formatPersianTimeOnly = formatArabicTimeOnly;

