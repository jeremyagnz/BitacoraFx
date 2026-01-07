/**
 * Local storage implementation for accounts (development mode)
 * Uses AsyncStorage for React Native or localStorage for web
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TradingAccount,
  CreateTradingAccountInput,
  UpdateTradingAccountInput,
} from '../models';

const ACCOUNTS_KEY = '@BitacoraFx:accounts';

/**
 * Get all accounts from local storage
 */
const getStoredAccounts = async (): Promise<TradingAccount[]> => {
  try {
    const data = await AsyncStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return new Date(value);
      }
      return value;
    }) : [];
  } catch (error) {
    console.error('Error reading accounts from storage:', error);
    return [];
  }
};

/**
 * Save accounts to local storage
 */
const saveAccounts = async (accounts: TradingAccount[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Error saving accounts to storage:', error);
    throw error;
  }
};

/**
 * Create a new trading account (local)
 */
export const createAccountLocal = async (
  account: CreateTradingAccountInput
): Promise<string> => {
  const accounts = await getStoredAccounts();
  const now = new Date();
  const newAccount: TradingAccount = {
    id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    ...account,
    currentBalance: account.initialBalance,
    createdAt: now,
    updatedAt: now,
  };
  accounts.push(newAccount);
  await saveAccounts(accounts);
  return newAccount.id;
};

/**
 * Update an existing trading account (local)
 */
export const updateAccountLocal = async (
  id: string,
  updates: UpdateTradingAccountInput
): Promise<void> => {
  const accounts = await getStoredAccounts();
  const index = accounts.findIndex((acc) => acc.id === id);
  if (index === -1) {
    throw new Error(`Account with id ${id} not found`);
  }
  accounts[index] = {
    ...accounts[index],
    ...updates,
    updatedAt: new Date(),
  };
  await saveAccounts(accounts);
};

/**
 * Delete a trading account (local)
 */
export const deleteAccountLocal = async (id: string): Promise<void> => {
  const accounts = await getStoredAccounts();
  const filtered = accounts.filter((acc) => acc.id !== id);
  await saveAccounts(filtered);
  
  // Also delete associated entries
  try {
    const entriesKey = `@BitacoraFx:entries_${id}`;
    await AsyncStorage.removeItem(entriesKey);
  } catch (error) {
    console.error('Error deleting entries:', error);
  }
};

/**
 * Get all trading accounts (local)
 */
export const getAllAccountsLocal = async (): Promise<TradingAccount[]> => {
  return getStoredAccounts();
};

/**
 * Get a single trading account by ID (local)
 */
export const getAccountByIdLocal = async (
  id: string
): Promise<TradingAccount | null> => {
  const accounts = await getStoredAccounts();
  return accounts.find((acc) => acc.id === id) || null;
};
