const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toPersianDigits = (value: number | string): string =>
  String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);

export const formatPercent = (value: number): string => `${toPersianDigits(Math.round(value))}٪`;

/** Seconds -> "m:ss" with Persian digits. */
export const formatDuration = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return toPersianDigits(`${minutes}:${String(seconds).padStart(2, '0')}`);
};
