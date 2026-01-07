import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
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
    if (entries.length === 0) return { labels: [], data: [], totalPnL: 0 };

    // Sort entries by date (oldest first)
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Take last 10 entries for better visualization
    const recentEntries = sortedEntries.slice(-10);

    // Calculate cumulative P/L
    let cumulativePnL = 0;
    const labels: string[] = [];
    const data: number[] = [];

    recentEntries.forEach((entry) => {
      cumulativePnL += entry.profitLoss;
      const date = new Date(entry.date);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
      data.push(cumulativePnL);
    });

    return {
      labels,
      data,
      totalPnL: cumulativePnL,
    };
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

  const isProfit = chartData.totalPnL >= 0;

  const chartConfig = {
    backgroundColor: darkMode ? '#1C1C1E' : '#ffffff',
    backgroundGradientFrom: darkMode ? '#1C1C1E' : '#ffffff',
    backgroundGradientTo: darkMode ? '#1C1C1E' : '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => isProfit 
      ? `rgba(52, 199, 89, ${opacity})` 
      : `rgba(255, 59, 48, ${opacity})`,
    labelColor: (opacity = 1) => darkMode 
      ? `rgba(142, 142, 147, ${opacity})` 
      : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: isProfit ? '#34C759' : '#FF3B30',
    },
  };

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
          {formatCurrency(chartData.totalPnL, currency)}
        </Text>
      </View>

      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [{ data: chartData.data }],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        yAxisSuffix=""
        yAxisInterval={1}
      />
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
    shadowOpacity: 0.3,
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
