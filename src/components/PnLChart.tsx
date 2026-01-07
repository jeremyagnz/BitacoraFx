import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryArea } from 'victory-native';
import { DailyEntry } from '../types';
import { formatCurrency } from '../utils/helpers';

interface PnLChartProps {
  entries: DailyEntry[];
  currency?: string;
  darkMode?: boolean;
}

const PnLChart: React.FC<PnLChartProps> = ({ entries, currency = 'USD', darkMode = false }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartData = useMemo(() => {
    if (entries.length === 0) return [];

    // Sort entries by date (oldest first)
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate cumulative P/L
    let cumulativePnL = 0;
    return sortedEntries.map((entry, index) => {
      cumulativePnL += entry.profitLoss;
      return {
        x: index + 1,
        y: cumulativePnL,
        date: entry.date,
      };
    });
  }, [entries]);

  if (entries.length === 0) {
    return (
      <View style={[styles.emptyContainer, darkMode && styles.darkContainer]}>
        <Text style={[styles.emptyText, darkMode && styles.darkText]}>
          No data to display
        </Text>
      </View>
    );
  }

  const maxPnL = Math.max(...chartData.map(d => d.y), 0);
  const minPnL = Math.min(...chartData.map(d => d.y), 0);
  const isProfit = chartData.length > 0 && chartData[chartData.length - 1].y >= 0;

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, darkMode && styles.darkText]}>Cumulative P/L</Text>
        <Text
          style={[
            styles.totalValue,
            isProfit ? styles.profit : styles.loss,
          ]}
        >
          {isProfit ? '+' : ''}
          {formatCurrency(chartData[chartData.length - 1]?.y || 0, currency)}
        </Text>
      </View>

      <VictoryChart
        width={screenWidth - 32}
        height={220}
        padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          style={{
            axis: { stroke: darkMode ? '#333' : '#E5E5EA' },
            tickLabels: { fill: darkMode ? '#8E8E93' : '#8E8E93', fontSize: 10 },
            grid: { stroke: 'transparent' },
          }}
          tickFormat={() => ''}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: darkMode ? '#333' : '#E5E5EA' },
            tickLabels: { fill: darkMode ? '#8E8E93' : '#8E8E93', fontSize: 10 },
            grid: { stroke: darkMode ? '#1C1C1E' : '#F2F2F7', strokeDasharray: '3,3' },
          }}
          tickFormat={(value) => `${value >= 0 ? '+' : ''}${(value / 1000).toFixed(0)}k`}
        />
        <VictoryArea
          data={chartData}
          style={{
            data: {
              fill: isProfit
                ? 'rgba(52, 199, 89, 0.2)'
                : 'rgba(255, 59, 48, 0.2)',
              stroke: isProfit ? '#34C759' : '#FF3B30',
              strokeWidth: 2,
            },
          }}
          interpolation="monotoneX"
        />
        <VictoryLine
          data={chartData}
          style={{
            data: {
              stroke: isProfit ? '#34C759' : '#FF3B30',
              strokeWidth: 2,
            },
          }}
          interpolation="monotoneX"
        />
      </VictoryChart>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  profit: {
    color: '#34C759',
  },
  loss: {
    color: '#FF3B30',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default PnLChart;
