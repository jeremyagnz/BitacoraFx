import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getAccounts, getEntriesByAccount } from '../services/firestore';
import { TradingAccount, DailyEntry } from '../types';
import {
  formatCurrency,
  calculateTotalProfitLoss,
  calculateWinRate,
} from '../utils/helpers';

const AnalyticsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [allEntries, setAllEntries] = useState<DailyEntry[]>([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalProfitLoss: 0,
    totalTrades: 0,
    winRate: 0,
    bestDay: 0,
    worstDay: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);

      const entriesPromises = fetchedAccounts.map((account) =>
        getEntriesByAccount(account.id)
      );
      const entriesResults = await Promise.all(entriesPromises);
      const combined = entriesResults.flat();
      setAllEntries(combined);

      const totalBalance = fetchedAccounts.reduce(
        (sum, account) => sum + account.currentBalance,
        0
      );
      const totalPL = calculateTotalProfitLoss(combined);
      const winRate = calculateWinRate(combined);
      
      const profitLosses = combined.map((entry) => entry.profitLoss);
      const bestDay = profitLosses.length > 0 ? Math.max(...profitLosses) : 0;
      const worstDay = profitLosses.length > 0 ? Math.min(...profitLosses) : 0;

      setStats({
        totalBalance,
        totalProfitLoss: totalPL,
        totalTrades: combined.length,
        winRate,
        bestDay,
        worstDay,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Analytics</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="account-balance" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Portfolio Overview</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Balance</Text>
            <Text style={styles.statValue}>
              {formatCurrency(stats.totalBalance)}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total P/L</Text>
            <Text
              style={[
                styles.statValue,
                stats.totalProfitLoss >= 0 ? styles.profit : styles.loss,
              ]}
            >
              {stats.totalProfitLoss >= 0 ? '+' : ''}
              {formatCurrency(stats.totalProfitLoss)}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Active Accounts</Text>
            <Text style={styles.statValue}>{accounts.length}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="show-chart" size={24} color="#34C759" />
            <Text style={styles.cardTitle}>Trading Performance</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Trades</Text>
            <Text style={styles.statValue}>{stats.totalTrades}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Win Rate</Text>
            <Text style={[styles.statValue, styles.profit]}>
              {stats.winRate.toFixed(1)}%
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Best Day</Text>
            <Text style={[styles.statValue, styles.profit]}>
              +{formatCurrency(stats.bestDay)}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Worst Day</Text>
            <Text style={[styles.statValue, styles.loss]}>
              {formatCurrency(stats.worstDay)}
            </Text>
          </View>
        </View>

        {accounts.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#FF9500" />
              <Text style={styles.cardTitle}>Accounts Summary</Text>
            </View>

            {accounts.map((account) => {
              const accountPL = account.currentBalance - account.initialBalance;
              const accountPLPercent = ((accountPL / account.initialBalance) * 100).toFixed(2);
              
              return (
                <View key={account.id} style={styles.accountRow}>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountBalance}>
                      {formatCurrency(account.currentBalance, account.currency)}
                    </Text>
                  </View>
                  <View style={styles.accountPL}>
                    <Text
                      style={[
                        styles.accountPLValue,
                        accountPL >= 0 ? styles.profit : styles.loss,
                      ]}
                    >
                      {accountPL >= 0 ? '+' : ''}
                      {formatCurrency(accountPL, account.currency)}
                    </Text>
                    <Text
                      style={[
                        styles.accountPLPercent,
                        accountPL >= 0 ? styles.profit : styles.loss,
                      ]}
                    >
                      ({accountPL >= 0 ? '+' : ''}{accountPLPercent}%)
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {accounts.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="analytics" size={64} color="#E5E5EA" />
            <Text style={styles.emptyText}>No data yet</Text>
            <Text style={styles.emptySubtext}>
              Create an account and start tracking your trades to see analytics
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  profit: {
    color: '#34C759',
  },
  loss: {
    color: '#FF3B30',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
    color: '#8E8E93',
  },
  accountPL: {
    alignItems: 'flex-end',
  },
  accountPLValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  accountPLPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

export default AnalyticsScreen;
