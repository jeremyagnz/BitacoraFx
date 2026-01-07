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
