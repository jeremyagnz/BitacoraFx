import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { TradingAccount } from '../models';
import { getAllAccounts, createAccount, deleteAccount } from '../api';
import { STRINGS } from '../constants';

interface UseAccountsReturn {
  accounts: TradingAccount[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addAccount: (account: Omit<TradingAccount, 'id' | 'createdAt' | 'updatedAt' | 'currentBalance'>) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
}

/**
 * Custom hook for managing trading accounts
 */
export const useAccounts = (): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAccounts = await getAllAccounts();
      setAccounts(fetchedAccounts);
    } catch (err) {
      console.error('Error loading accounts:', err);
      setError(STRINGS.ERROR_LOADING_ACCOUNTS);
      Alert.alert('Error', STRINGS.ERROR_LOADING_ACCOUNTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const addAccount = async (
    account: Omit<TradingAccount, 'id' | 'createdAt' | 'updatedAt' | 'currentBalance'>
  ) => {
    try {
      await createAccount(account);
      await loadAccounts();
    } catch (err) {
      console.error('Error creating account:', err);
      Alert.alert('Error', STRINGS.ERROR_CREATING_ACCOUNT);
      throw err;
    }
  };

  const removeAccount = async (id: string) => {
    try {
      await deleteAccount(id);
      await loadAccounts();
    } catch (err) {
      console.error('Error deleting account:', err);
      Alert.alert('Error', STRINGS.ERROR_DELETING_ACCOUNT);
      throw err;
    }
  };

  return {
    accounts,
    loading,
    error,
    refresh: loadAccounts,
    addAccount,
    removeAccount,
  };
};
