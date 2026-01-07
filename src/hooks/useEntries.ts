import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { DailyEntry } from '../models';
import { getEntriesByAccount, createEntry } from '../api';
import { STRINGS } from '../constants';

interface UseEntriesReturn {
  entries: DailyEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addEntry: (entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

/**
 * Custom hook for managing daily entries for a specific account
 */
export const useEntries = (accountId: string): UseEntriesReturn => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedEntries = await getEntriesByAccount(accountId);
      setEntries(fetchedEntries);
    } catch (err) {
      console.error('Error loading entries:', err);
      setError(STRINGS.ERROR_LOADING_ENTRIES);
      Alert.alert('Error', STRINGS.ERROR_LOADING_ENTRIES);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const addEntry = async (entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createEntry(entry);
      await loadEntries();
    } catch (err) {
      console.error('Error creating entry:', err);
      Alert.alert('Error', STRINGS.ERROR_CREATING_ENTRY);
      throw err;
    }
  };

  return {
    entries,
    loading,
    error,
    refresh: loadEntries,
    addEntry,
  };
};
