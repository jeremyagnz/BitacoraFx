export interface TradingAccount {
  id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTradingAccountInput = Omit<
  TradingAccount,
  'id' | 'createdAt' | 'updatedAt' | 'currentBalance'
>;

export type UpdateTradingAccountInput = Partial<
  Omit<TradingAccount, 'id' | 'createdAt' | 'updatedAt'>
>;
