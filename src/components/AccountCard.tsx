import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { TradingAccount } from '../types';
import { formatCurrency } from '../utils/helpers';
import { DARK_THEME_COLORS } from '../theme/darkTheme';

interface AccountCardProps {
  account: TradingAccount;
  onPress: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onPress }) => {
  const profitLoss = account.currentBalance - account.initialBalance;
  const profitLossPercent =
    ((profitLoss / account.initialBalance) * 100).toFixed(2);
  const isProfit = profitLoss >= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View>
          <Text style={styles.accountName}>{account.name}</Text>
          {account.broker && (
            <Text style={styles.broker}>{account.broker}</Text>
          )}
        </View>
        <Text style={styles.currency}>{account.currency}</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balance}>
          {formatCurrency(account.currentBalance, account.currency)}
        </Text>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.label}>Initial</Text>
          <Text style={styles.value}>
            {formatCurrency(account.initialBalance, account.currency)}
          </Text>
        </View>
        <View style={styles.profitLossContainer}>
          <Text style={styles.label}>P/L</Text>
          <Text
            style={[
              styles.profitLoss,
              isProfit ? styles.profit : styles.loss,
            ]}
          >
            {isProfit ? '+' : ''}
            {formatCurrency(profitLoss, account.currency)}
          </Text>
          <Text
            style={[
              styles.profitLossPercent,
              isProfit ? styles.profit : styles.loss,
            ]}
          >
            ({isProfit ? '+' : ''}
            {profitLossPercent}%)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DARK_THEME_COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_THEME_COLORS.text,
  },
  broker: {
    fontSize: 12,
    color: DARK_THEME_COLORS.textSecondary,
    marginTop: 2,
  },
  currency: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_THEME_COLORS.textSecondary,
    backgroundColor: DARK_THEME_COLORS.backgroundTertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  balanceContainer: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: DARK_THEME_COLORS.textSecondary,
    marginBottom: 4,
  },
  balance: {
    fontSize: 28,
    fontWeight: '700',
    color: DARK_THEME_COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: DARK_THEME_COLORS.border,
  },
  label: {
    fontSize: 12,
    color: DARK_THEME_COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_THEME_COLORS.text,
  },
  profitLossContainer: {
    alignItems: 'flex-end',
  },
  profitLoss: {
    fontSize: 16,
    fontWeight: '700',
  },
  profitLossPercent: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  profit: {
    color: DARK_THEME_COLORS.profit,
  },
  loss: {
    color: DARK_THEME_COLORS.loss,
  },
});

export default AccountCard;
