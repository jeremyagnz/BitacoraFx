import { TradingAccount } from './TradingAccount';

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
