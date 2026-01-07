import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import EntryCard from '../components/EntryCard';
import Button from '../components/Button';
import BalanceChart from '../components/BalanceChart';
import PnLChart from '../components/PnLChart';
import Statistics from '../components/Statistics';
import { DailyEntry, RootStackParamList } from '../types';
import { getEntriesByAccount, createEntry, updateEntry, deleteEntry } from '../api';
import { updateAccount } from '../api';
import { formatCurrency, sanitizeNumericInput } from '../utils/helpers';
import { DARK_THEME_COLORS } from '../theme/darkTheme';

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const { account } = route.params;
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [currentBalance, setCurrentBalance] = useState(account.initialBalance);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    profitLoss: '',
    notes: '',
  });
  const [editEntry, setEditEntry] = useState({
    profitLoss: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleNewProfitLossChange = useCallback((text: string) => {
    setNewEntry(prev => ({ ...prev, profitLoss: sanitizeNumericInput(text) }));
  }, []);

  const handleEditProfitLossChange = useCallback((text: string) => {
    setEditEntry(prev => ({ ...prev, profitLoss: sanitizeNumericInput(text) }));
  }, []);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEntries = await getEntriesByAccount(account.id);
      setEntries(fetchedEntries);
      // Update current balance from the most recent entry
      if (fetchedEntries.length > 0) {
        setCurrentBalance(fetchedEntries[0].balance);
      } else {
        setCurrentBalance(account.initialBalance);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
      Alert.alert('Error', 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, [account.id, account.initialBalance]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
  };

  const handleCreateEntry = async () => {
    if (!newEntry.profitLoss) {
      Alert.alert('Error', 'Please enter profit/loss amount');
      return;
    }

    const profitLoss = parseFloat(newEntry.profitLoss);
    if (isNaN(profitLoss)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    try {
      setSaving(true);
      
      const newBalance = currentBalance + profitLoss;

      await createEntry({
        accountId: account.id,
        date: new Date(),
        profitLoss,
        balance: newBalance,
        notes: newEntry.notes || undefined,
      });

      setModalVisible(false);
      setNewEntry({ profitLoss: '', notes: '' });
      await loadEntries();
      showSuccessMessage('Entry added successfully!');
    } catch (error) {
      console.error('Error creating entry:', error);
      Alert.alert('Error', 'Failed to create entry');
    } finally {
      setSaving(false);
    }
  };

  const handleEditEntry = (entry: DailyEntry) => {
    setSelectedEntry(entry);
    setEditEntry({
      profitLoss: entry.profitLoss.toString(),
      notes: entry.notes || '',
    });
    setEditModalVisible(true);
  };

  const handleUpdateEntry = async () => {
    if (!selectedEntry) return;

    if (!editEntry.profitLoss) {
      Alert.alert('Error', 'Please enter profit/loss amount');
      return;
    }

    const profitLoss = parseFloat(editEntry.profitLoss);
    if (isNaN(profitLoss)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    try {
      setSaving(true);
      
      // Find the previous entry balance to calculate the new balance correctly
      const entryIndex = entries.findIndex(e => e.id === selectedEntry.id);
      const previousBalance = entryIndex < entries.length - 1 
        ? entries[entryIndex + 1].balance 
        : account.initialBalance;
      const newBalance = previousBalance + profitLoss;

      await updateEntry(selectedEntry.id, {
        accountId: account.id,
        profitLoss,
        balance: newBalance,
        notes: editEntry.notes || undefined,
      });

      setEditModalVisible(false);
      setSelectedEntry(null);
      setEditEntry({ profitLoss: '', notes: '' });
      await loadEntries();
      showSuccessMessage('Entry updated successfully!');
    } catch (error) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', 'Failed to update entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = (entry: DailyEntry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entry.id, account.id);
              
              // Reload entries to get updated list
              const updatedEntries = await getEntriesByAccount(account.id);
              setEntries(updatedEntries);
              
              // Update account balance to the most recent entry's balance or initial balance
              const newCurrentBalance = updatedEntries.length > 0 
                ? updatedEntries[0].balance 
                : account.initialBalance;
              
              await updateAccount(account.id, {
                currentBalance: newCurrentBalance,
              });
              
              showSuccessMessage('Entry deleted successfully!');
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const renderHeader = () => {
    const totalPL = entries.reduce((sum, entry) => sum + entry.profitLoss, 0);
    const isProfit = totalPL >= 0;

    return (
      <View style={styles.accountInfo}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={styles.accountName}>{account.name}</Text>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balance}>
            {formatCurrency(currentBalance, account.currency)}
          </Text>
          
          <View style={styles.plContainer}>
            <Text style={styles.plLabel}>Total P/L</Text>
            <Text style={[styles.plValue, isProfit ? styles.profit : styles.loss]}>
              {isProfit ? '+' : ''}
              {formatCurrency(totalPL, account.currency)}
            </Text>
          </View>
        </View>

        {entries.length > 0 && (
          <>
            <PnLChart entries={entries} currency={account.currency} darkMode={true} />
            <Statistics entries={entries} currency={account.currency} darkMode={true} />
            <BalanceChart entries={entries} currency={account.currency} darkMode={true} />
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Entries</Text>
          <TouchableOpacity
            style={styles.addEntryButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
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
      {successMessage && (
        <View style={styles.successBanner}>
          <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
      
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryCard 
            entry={item} 
            currency={account.currency}
            onPress={() => handleEditEntry(item)}
            onLongPress={() => handleDeleteEntry(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="note-add" size={64} color="#E5E5EA" />
            <Text style={styles.emptyText}>No entries yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first daily entry
            </Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Entry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDate}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Profit/Loss (e.g., 100 or -50)"
              value={newEntry.profitLoss}
              onChangeText={handleNewProfitLossChange}
              keyboardType="default"
            />

            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Notes (optional)"
              value={newEntry.notes}
              onChangeText={(text) =>
                setNewEntry({ ...newEntry, notes: text })
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Button
              title="Add Entry"
              onPress={handleCreateEntry}
              loading={saving}
              style={styles.createButton}
            />
          </View>
        </View>
      </Modal>

      {/* Edit Entry Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Entry</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDate}>
              {selectedEntry && new Date(selectedEntry.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Profit/Loss (e.g., 100 or -50)"
              value={editEntry.profitLoss}
              onChangeText={handleEditProfitLossChange}
              keyboardType="default"
            />

            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Notes (optional)"
              value={editEntry.notes}
              onChangeText={(text) =>
                setEditEntry({ ...editEntry, notes: text })
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Button
              title="Update Entry"
              onPress={handleUpdateEntry}
              loading={saving}
              style={styles.createButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_THEME_COLORS.background,
  },
  successBanner: {
    backgroundColor: '#34C759',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DARK_THEME_COLORS.background,
  },
  listContent: {
    padding: 16,
  },
  accountInfo: {
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 12,
  },
  accountName: {
    fontSize: 28,
    fontWeight: '700',
    color: DARK_THEME_COLORS.text,
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: DARK_THEME_COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: DARK_THEME_COLORS.textSecondary,
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: DARK_THEME_COLORS.text,
    marginBottom: 16,
  },
  plContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: DARK_THEME_COLORS.border,
  },
  plLabel: {
    fontSize: 16,
    color: DARK_THEME_COLORS.textSecondary,
  },
  plValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  profit: {
    color: DARK_THEME_COLORS.profit,
  },
  loss: {
    color: DARK_THEME_COLORS.loss,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK_THEME_COLORS.text,
  },
  addEntryButton: {
    backgroundColor: DARK_THEME_COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK_THEME_COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: DARK_THEME_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: DARK_THEME_COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: DARK_THEME_COLORS.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DARK_THEME_COLORS.text,
  },
  modalDate: {
    fontSize: 14,
    color: DARK_THEME_COLORS.textSecondary,
    marginBottom: 24,
  },
  input: {
    backgroundColor: DARK_THEME_COLORS.backgroundTertiary,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: DARK_THEME_COLORS.text,
    borderWidth: 1,
    borderColor: DARK_THEME_COLORS.border,
  },
  notesInput: {
    height: 100,
  },
  createButton: {
    marginTop: 8,
  },
});

export default DashboardScreen;
