import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../constants';
import {
  DailyEntry,
  CreateDailyEntryInput,
  UpdateDailyEntryInput,
} from '../models';
import { updateAccount } from './accounts.api';

/**
 * Create a new daily entry and update account balance
 */
export const createEntry = async (
  entry: CreateDailyEntryInput
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTIONS.ENTRIES), {
    ...entry,
    date: Timestamp.fromDate(entry.date),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  // Update account balance
  await updateAccount(entry.accountId, {
    currentBalance: entry.balance,
  });

  return docRef.id;
};

/**
 * Update an existing daily entry
 */
export const updateEntry = async (
  id: string,
  updates: UpdateDailyEntryInput
): Promise<void> => {
  const entryRef = doc(db, COLLECTIONS.ENTRIES, id);
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

/**
 * Delete a daily entry
 * Note: This function does not automatically update the account balance.
 * The caller is responsible for recalculating and updating the account balance
 * based on the remaining entries after deletion.
 */
export const deleteEntry = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.ENTRIES, id));
};

/**
 * Get all entries for a specific account
 */
export const getEntriesByAccount = async (
  accountId: string
): Promise<DailyEntry[]> => {
  const q = query(
    collection(db, COLLECTIONS.ENTRIES),
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
