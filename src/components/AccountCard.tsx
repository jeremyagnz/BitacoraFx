import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { TradingAccount } from '../types';
import { formatCurrency } from '../utils/helpers';

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
        <Text style={styles.accountName}>{account.name}</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    color: '#000000',
  },
  currency: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  balanceContainer: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  balance: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
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
    color: '#34C759',
  },
  loss: {
    color: '#FF3B30',
  },
});

export default AccountCard;
