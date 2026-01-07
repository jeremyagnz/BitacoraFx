export interface ChartDataPoint {
  date: string;
  value: number;
}

export type RootStackParamList = {
  Main: undefined;
  Dashboard: { account: import('./TradingAccount').TradingAccount };
};

export type RootTabParamList = {
  Accounts: undefined;
  Analytics: undefined;
};
