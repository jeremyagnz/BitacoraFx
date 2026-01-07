import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DailyEntry } from '../types';
import { formatCurrency } from '../utils/helpers';

interface StatisticsProps {
  entries: DailyEntry[];
  currency?: string;
  darkMode?: boolean;
}

interface Stats {
  totalProfit: number;
  totalLoss: number;
  winDays: number;
  lossDays: number;
  averageDailyPnL: number;
  winRate: number;
}

const Statistics: React.FC<StatisticsProps> = ({ entries, currency = 'USD', darkMode = false }) => {
  const stats: Stats = useMemo(() => {
    if (entries.length === 0) {
      return {
        totalProfit: 0,
        totalLoss: 0,
        winDays: 0,
        lossDays: 0,
        averageDailyPnL: 0,
        winRate: 0,
      };
    }

    let totalProfit = 0;
    let totalLoss = 0;
    let winDays = 0;
    let lossDays = 0;

    entries.forEach((entry) => {
      if (entry.profitLoss > 0) {
        totalProfit += entry.profitLoss;
        winDays++;
      } else if (entry.profitLoss < 0) {
        totalLoss += entry.profitLoss;
        lossDays++;
      }
    });

    const totalPnL = entries.reduce((sum, entry) => sum + entry.profitLoss, 0);
    const averageDailyPnL = totalPnL / entries.length;
    const winRate = entries.length > 0 ? (winDays / entries.length) * 100 : 0;

    return {
      totalProfit,
      totalLoss,
      winDays,
      lossDays,
      averageDailyPnL,
      winRate,
    };
  }, [entries]);

  const containerStyle = [styles.container, darkMode && styles.darkContainer];
  const textStyle = [styles.text, darkMode && styles.darkText];
  const valueStyle = [styles.value, darkMode && styles.darkText];
  const statCardStyle = [styles.statCard, darkMode && styles.darkStatCard];
  const headerStyle = [styles.header, darkMode && styles.darkHeader];
  const separatorStyle = [styles.separator, darkMode && styles.darkSeparator];

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        <MaterialIcons 
          name="analytics" 
          size={24} 
          color={darkMode ? '#FFFFFF' : '#007AFF'} 
        />
        <Text style={[styles.title, darkMode && styles.darkText]}>Statistics</Text>
      </View>

      <View style={styles.statsGrid}>
        {/* Total Profit */}
        <View style={statCardStyle}>
          <View style={styles.statRow}>
            <MaterialIcons name="trending-up" size={20} color="#34C759" />
            <Text style={textStyle}>Total Profit</Text>
          </View>
          <Text style={[valueStyle, styles.profit]}>
            +{formatCurrency(stats.totalProfit, currency)}
          </Text>
        </View>

        {/* Total Loss */}
        <View style={statCardStyle}>
          <View style={styles.statRow}>
            <MaterialIcons name="trending-down" size={20} color="#FF3B30" />
            <Text style={textStyle}>Total Loss</Text>
          </View>
          <Text style={[valueStyle, styles.loss]}>
            {formatCurrency(stats.totalLoss, currency)}
          </Text>
        </View>

        {/* Win Days vs Loss Days */}
        <View style={[statCardStyle, styles.wideCard]}>
          <Text style={textStyle}>Win/Loss Days</Text>
          <View style={styles.daysRow}>
            <View style={styles.daysItem}>
              <Text style={[valueStyle, styles.profit]}>{stats.winDays}</Text>
              <Text style={[textStyle, { fontSize: 12 }]}>Win Days</Text>
            </View>
            <View style={separatorStyle} />
            <View style={styles.daysItem}>
              <Text style={[valueStyle, styles.loss]}>{stats.lossDays}</Text>
              <Text style={[textStyle, { fontSize: 12 }]}>Loss Days</Text>
            </View>
          </View>
        </View>

        {/* Average Daily P/L */}
        <View style={statCardStyle}>
          <View style={styles.statRow}>
            <MaterialIcons 
              name="show-chart" 
              size={20} 
              color={darkMode ? '#8E8E93' : '#007AFF'} 
            />
            <Text style={textStyle}>Avg Daily P/L</Text>
          </View>
          <Text
            style={[
              valueStyle,
              stats.averageDailyPnL >= 0 ? styles.profit : styles.loss,
            ]}
          >
            {stats.averageDailyPnL >= 0 ? '+' : ''}
            {formatCurrency(stats.averageDailyPnL, currency)}
          </Text>
        </View>

        {/* Win Rate */}
        <View style={statCardStyle}>
          <View style={styles.statRow}>
            <MaterialIcons 
              name="percent" 
              size={20} 
              color={darkMode ? '#8E8E93' : '#007AFF'} 
            />
            <Text style={textStyle}>Win Rate</Text>
          </View>
          <Text style={[valueStyle, stats.winRate >= 50 ? styles.profit : styles.loss]}>
            {stats.winRate.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  darkContainer: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  darkHeader: {
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 8,
  },
  darkText: {
    color: '#FFFFFF',
  },
  text: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
  },
  profit: {
    color: '#34C759',
  },
  loss: {
    color: '#FF3B30',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
  },
  darkStatCard: {
    backgroundColor: '#2C2C2E',
  },
  wideCard: {
    minWidth: '100%',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 12,
  },
  daysItem: {
    alignItems: 'center',
    flex: 1,
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: '#C7C7CC',
  },
  darkSeparator: {
    backgroundColor: '#48484A',
  },
});

export default Statistics;
