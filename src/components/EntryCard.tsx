import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyEntry } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';

interface EntryCardProps {
  entry: DailyEntry;
  currency: string;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, currency }) => {
  const isProfit = entry.profitLoss >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(entry.date)}</Text>
        <Text
          style={[
            styles.profitLoss,
            isProfit ? styles.profit : styles.loss,
          ]}
        >
          {isProfit ? '+' : ''}
          {formatCurrency(entry.profitLoss, currency)}
        </Text>
      </View>

      <View style={styles.balanceRow}>
        <Text style={styles.label}>Balance</Text>
        <Text style={styles.balance}>
          {formatCurrency(entry.balance, currency)}
        </Text>
      </View>

      {entry.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notes}>{entry.notes}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  profitLoss: {
    fontSize: 18,
    fontWeight: '700',
  },
  profit: {
    color: '#34C759',
  },
  loss: {
    color: '#FF3B30',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  notesLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#000000',
  },
});

export default EntryCard;
