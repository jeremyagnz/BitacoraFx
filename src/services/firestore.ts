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
import { db } from './firebase';
import { TradingAccount, DailyEntry } from '../types';

// Collection names
const ACCOUNTS_COLLECTION = 'accounts';
const ENTRIES_COLLECTION = 'entries';

// Account operations
export const createAccount = async (
  account: Omit<TradingAccount, 'id' | 'createdAt' | 'updatedAt' | 'currentBalance'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, ACCOUNTS_COLLECTION), {
    ...account,
    currentBalance: account.initialBalance,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateAccount = async (
  id: string,
  updates: Partial<Omit<TradingAccount, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  const accountRef = doc(db, ACCOUNTS_COLLECTION, id);
  await updateDoc(accountRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteAccount = async (id: string): Promise<void> => {
  // Delete account
  await deleteDoc(doc(db, ACCOUNTS_COLLECTION, id));
  
  // Delete all entries associated with this account
  const entriesQuery = query(
    collection(db, ENTRIES_COLLECTION),
    where('accountId', '==', id)
  );
  const entriesSnapshot = await getDocs(entriesQuery);
  const deletePromises = entriesSnapshot.docs.map((doc) =>
    deleteDoc(doc.ref)
  );
  await Promise.all(deletePromises);
};

export const getAccounts = async (): Promise<TradingAccount[]> => {
  const querySnapshot = await getDocs(collection(db, ACCOUNTS_COLLECTION));
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

// Daily entry operations
export const createEntry = async (
  entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
    ...entry,
    date: Timestamp.fromDate(entry.date),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  // Update account balance
  const account = await getAccountById(entry.accountId);
  if (account) {
    await updateAccount(entry.accountId, {
      currentBalance: entry.balance,
    });
  }
  
  return docRef.id;
};

export const updateEntry = async (
  id: string,
  updates: Partial<Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  const entryRef = doc(db, ENTRIES_COLLECTION, id);
  const updateData: Record<string, any> = {
    ...updates,
    updatedAt: Timestamp.now(),
  };
  
  if (updates.date) {
    updateData.date = Timestamp.fromDate(updates.date);
  }
  
  await updateDoc(entryRef, updateData);
  
  // If balance is updated, update account balance
  if (updates.balance !== undefined && updates.accountId) {
    await updateAccount(updates.accountId, {
      currentBalance: updates.balance,
    });
  }
};

export const deleteEntry = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, ENTRIES_COLLECTION, id));
};

export const getEntriesByAccount = async (
  accountId: string
): Promise<DailyEntry[]> => {
  const q = query(
    collection(db, ENTRIES_COLLECTION),
    where('accountId', '==', accountId),
    orderBy('date', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      accountId: data.accountId,
      date: data.date?.toDate() || new Date(),
      profitLoss: data.profitLoss,
      balance: data.balance,
      notes: data.notes,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  });
};

// Helper function
const getAccountById = async (id: string): Promise<TradingAccount | null> => {
  try {
    const accountDoc = await getDoc(doc(db, ACCOUNTS_COLLECTION, id));
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
