/**
 * API layer with automatic fallback to local storage
 * Uses Firebase when configured, otherwise uses AsyncStorage for development
 */

import { db } from '../config/firebase.config';
import {
  TradingAccount,
  CreateTradingAccountInput,
  UpdateTradingAccountInput,
} from '../models';

// Import Firebase implementations
import * as FirebaseAccounts from './accounts.api';

// Import local implementations
import * as LocalAccounts from './accounts.local';

/**
 * Check if Firebase is properly configured
 */
const isFirebaseConfigured = (): boolean => {
  try {
    // Check if we're using demo/placeholder values
    const isDemoConfig = db.app.options.projectId === 'demo-project' || 
                        db.app.options.apiKey === 'demo-api-key';
    return !isDemoConfig;
  } catch (error) {
    return false;
  }
};

// Determine which implementation to use
const useLocal = !isFirebaseConfigured();

if (useLocal) {
  console.log('🔧 Development Mode: Using local storage (AsyncStorage)');
} else {
  console.log('☁️  Production Mode: Using Firebase Firestore');
}

/**
 * Create a new trading account
 */
export const createAccount = async (
  account: CreateTradingAccountInput
): Promise<string> => {
  if (useLocal) {
    return LocalAccounts.createAccountLocal(account);
  }
  return FirebaseAccounts.createAccount(account);
};

/**
 * Update an existing trading account
 */
export const updateAccount = async (
  id: string,
  updates: UpdateTradingAccountInput
): Promise<void> => {
  if (useLocal) {
    return LocalAccounts.updateAccountLocal(id, updates);
  }
  return FirebaseAccounts.updateAccount(id, updates);
};

/**
 * Delete a trading account
 */
export const deleteAccount = async (id: string): Promise<void> => {
  if (useLocal) {
    return LocalAccounts.deleteAccountLocal(id);
  }
  return FirebaseAccounts.deleteAccount(id);
};

/**
 * Get all trading accounts
 */
export const getAllAccounts = async (): Promise<TradingAccount[]> => {
  if (useLocal) {
    return LocalAccounts.getAllAccountsLocal();
  }
  return FirebaseAccounts.getAllAccounts();
};

/**
 * Get a single trading account by ID
 */
export const getAccountById = async (
  id: string
): Promise<TradingAccount | null> => {
  if (useLocal) {
    return LocalAccounts.getAccountByIdLocal(id);
  }
  return FirebaseAccounts.getAccountById(id);
};
