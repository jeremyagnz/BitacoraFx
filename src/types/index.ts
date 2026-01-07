export interface TradingAccount {
  id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface ChartDataPoint {
  date: string;
  value: number;
}

export type RootStackParamList = {
  Main: undefined;
  Dashboard: { account: TradingAccount };
};

export type RootTabParamList = {
  Accounts: undefined;
  Analytics: undefined;
};
