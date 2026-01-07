import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../constants';
import {
  TradingAccount,
  CreateTradingAccountInput,
  UpdateTradingAccountInput,
} from '../models';

/**
 * Create a new trading account
 */
export const createAccount = async (
  account: CreateTradingAccountInput
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTIONS.ACCOUNTS), {
    ...account,
    currentBalance: account.initialBalance,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

/**
 * Update an existing trading account
 */
export const updateAccount = async (
  id: string,
  updates: UpdateTradingAccountInput
): Promise<void> => {
  const accountRef = doc(db, COLLECTIONS.ACCOUNTS, id);
  await updateDoc(accountRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Delete a trading account and all associated entries
 */
export const deleteAccount = async (id: string): Promise<void> => {
  // Delete account
  await deleteDoc(doc(db, COLLECTIONS.ACCOUNTS, id));

  // Delete all entries associated with this account
  const entriesQuery = query(
    collection(db, COLLECTIONS.ENTRIES),
    where('accountId', '==', id)
  );
  const entriesSnapshot = await getDocs(entriesQuery);
  const deletePromises = entriesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

/**
 * Get all trading accounts
 */
export const getAllAccounts = async (): Promise<TradingAccount[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.ACCOUNTS));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      initialBalance: data.initialBalance,
      currentBalance: data.currentBalance,
      currency: data.currency,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  });
};

/**
 * Get a single trading account by ID
 */
export const getAccountById = async (
  id: string
): Promise<TradingAccount | null> => {
  try {
    const accountDoc = await getDoc(doc(db, COLLECTIONS.ACCOUNTS, id));
    if (!accountDoc.exists()) {
      return null;
    }
    const data = accountDoc.data();
    return {
      id: accountDoc.id,
      name: data.name,
      initialBalance: data.initialBalance,
      currentBalance: data.currentBalance,
      currency: data.currency,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error fetching account by ID:', error);
    return null;
  }
};
