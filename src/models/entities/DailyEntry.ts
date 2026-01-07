export interface DailyEntry {
  id: string;
  accountId: string;
  date: Date;
  profitLoss: number;
  balance: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDailyEntryInput = Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateDailyEntryInput = Partial<Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>>;
