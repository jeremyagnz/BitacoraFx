/**
 * Local storage implementation for entries (development mode)
 * Uses AsyncStorage for React Native or localStorage for web
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DailyEntry,
  CreateDailyEntryInput,
  UpdateDailyEntryInput,
} from '../models';
import { updateAccountLocal } from './accounts.local';

/**
 * Get entries key for an account
 */
const getEntriesKey = (accountId: string) => `@BitacoraFx:entries_${accountId}`;

/**
 * Get all entries for an account from local storage
 */
const getStoredEntries = async (accountId: string): Promise<DailyEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(getEntriesKey(accountId));
    return data ? JSON.parse(data, (key, value) => {
      if (key === 'date' || key === 'createdAt' || key === 'updatedAt') {
        return new Date(value);
      }
      return value;
    }) : [];
  } catch (error) {
    console.error('Error reading entries from storage:', error);
    return [];
  }
};

/**
 * Save entries to local storage
 */
const saveEntries = async (accountId: string, entries: DailyEntry[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(getEntriesKey(accountId), JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving entries to storage:', error);
    throw error;
  }
};

/**
 * Create a new daily entry (local)
 */
export const createEntryLocal = async (
  entry: CreateDailyEntryInput
): Promise<string> => {
  const entries = await getStoredEntries(entry.accountId);
  const now = new Date();
  const newEntry: DailyEntry = {
    id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    ...entry,
    createdAt: now,
    updatedAt: now,
  };
  entries.unshift(newEntry); // Add to beginning for chronological order
  await saveEntries(entry.accountId, entries);
  
  // Update account balance
  await updateAccountLocal(entry.accountId, {
    currentBalance: entry.balance,
  });
  
  return newEntry.id;
};

/**
 * Update an existing daily entry (local)
 */
export const updateEntryLocal = async (
  id: string,
  accountId: string,
  updates: UpdateDailyEntryInput
): Promise<void> => {
  const entries = await getStoredEntries(accountId);
  const index = entries.findIndex((entry) => entry.id === id);
  if (index === -1) {
    throw new Error(`Entry with id ${id} not found`);
  }
  entries[index] = {
    ...entries[index],
    ...updates,
    updatedAt: new Date(),
  };
  await saveEntries(accountId, entries);
  
  // If balance is updated, update account balance
  if (updates.balance !== undefined) {
    await updateAccountLocal(accountId, {
      currentBalance: updates.balance,
    });
  }
};

/**
 * Delete a daily entry (local)
 */
export const deleteEntryLocal = async (id: string, accountId: string): Promise<void> => {
  const entries = await getStoredEntries(accountId);
  const filtered = entries.filter((entry) => entry.id !== id);
  await saveEntries(accountId, filtered);
};

/**
 * Get all entries for an account (local)
 */
export const getEntriesByAccountLocal = async (
  accountId: string
): Promise<DailyEntry[]> => {
  const entries = await getStoredEntries(accountId);
  // Sort by date descending
  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
};
