/**
 * API layer with automatic fallback to local storage
 * Uses Firebase when configured, otherwise uses AsyncStorage for development
 */

import { db } from '../config/firebase.config';
import {
  DailyEntry,
  CreateDailyEntryInput,
  UpdateDailyEntryInput,
} from '../models';

// Import Firebase implementations
import * as FirebaseEntries from './entries.api';

// Import local implementations
import * as LocalEntries from './entries.local';

/**
 * Check if Firebase is properly configured
 */
const isFirebaseConfigured = (): boolean => {
  try {
    const isDemoConfig = db.app.options.projectId === 'demo-project' || 
                        db.app.options.apiKey === 'demo-api-key';
    return !isDemoConfig;
  } catch (error) {
    return false;
  }
};

const useLocal = !isFirebaseConfigured();

/**
 * Create a new daily entry
 */
export const createEntry = async (
  entry: CreateDailyEntryInput
): Promise<string> => {
  if (useLocal) {
    return LocalEntries.createEntryLocal(entry);
  }
  return FirebaseEntries.createEntry(entry);
};

/**
 * Update an existing daily entry
 */
export const updateEntry = async (
  id: string,
  updates: UpdateDailyEntryInput
): Promise<void> => {
  if (useLocal) {
    // For local, we need accountId to update
    if (!updates.accountId) {
      throw new Error('accountId is required for local updates');
    }
    return LocalEntries.updateEntryLocal(id, updates.accountId, updates);
  }
  return FirebaseEntries.updateEntry(id, updates);
};

/**
 * Delete a daily entry
 */
export const deleteEntry = async (id: string, accountId?: string): Promise<void> => {
  if (useLocal) {
    if (!accountId) {
      throw new Error('accountId is required for local deletes');
    }
    return LocalEntries.deleteEntryLocal(id, accountId);
  }
  return FirebaseEntries.deleteEntry(id);
};

/**
 * Get all entries for a specific account
 */
export const getEntriesByAccount = async (
  accountId: string
): Promise<DailyEntry[]> => {
  if (useLocal) {
    return LocalEntries.getEntriesByAccountLocal(accountId);
  }
  return FirebaseEntries.getEntriesByAccount(accountId);
};
