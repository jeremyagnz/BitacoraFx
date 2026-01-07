import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DailyEntry } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { DARK_THEME_COLORS } from '../theme/darkTheme';

interface EntryCardProps {
  entry: DailyEntry;
  currency: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, currency, onPress, onLongPress }) => {
  const isProfit = entry.profitLoss >= 0;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DARK_THEME_COLORS.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
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
    color: DARK_THEME_COLORS.text,
  },
  profitLoss: {
    fontSize: 18,
    fontWeight: '700',
  },
  profit: {
    color: DARK_THEME_COLORS.profit,
  },
  loss: {
    color: DARK_THEME_COLORS.loss,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: DARK_THEME_COLORS.textSecondary,
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_THEME_COLORS.text,
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DARK_THEME_COLORS.border,
  },
  notesLabel: {
    fontSize: 12,
    color: DARK_THEME_COLORS.textSecondary,
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: DARK_THEME_COLORS.text,
  },
});

export default EntryCard;
