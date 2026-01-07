import { DailyEntry } from '../types';

export const calculateBalance = (
  initialBalance: number,
  entries: DailyEntry[]
): number => {
  return entries.reduce((acc, entry) => acc + entry.profitLoss, initialBalance);
};

export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const calculateTotalProfitLoss = (entries: DailyEntry[]): number => {
  return entries.reduce((acc, entry) => acc + entry.profitLoss, 0);
};

export const calculateWinRate = (entries: DailyEntry[]): number => {
  if (entries.length === 0) return 0;
  const wins = entries.filter((entry) => entry.profitLoss > 0).length;
  return (wins / entries.length) * 100;
};

export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Sanitize numeric input to allow only valid decimal numbers (including negative)
 * Allows: -123.45, 123, -123, 123.45
 * Prevents: --123, 12.34.56, abc, etc.
 */
export const sanitizeNumericInput = (value: string): string => {
  // Remove all characters except digits, minus, and decimal point
  let cleaned = value.replace(/[^0-9.-]/g, '');
  
  // Allow only one minus sign at the beginning
  const minusCount = (cleaned.match(/-/g) || []).length;
  if (minusCount > 1) {
    // Keep only the first minus if at the start, otherwise remove all
    if (cleaned[0] === '-') {
      cleaned = '-' + cleaned.slice(1).replace(/-/g, '');
    } else {
      cleaned = cleaned.replace(/-/g, '');
    }
  } else if (minusCount === 1 && cleaned[0] !== '-') {
    // If minus exists but not at the start, remove it
    cleaned = cleaned.replace('-', '');
  }
  
  // Allow only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleaned;
};
