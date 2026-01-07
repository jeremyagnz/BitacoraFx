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
import { DailyEntry, RootStackParamList } from '../types';
import { getEntriesByAccount, createEntry } from '../services/firestore';
import { formatCurrency } from '../utils/helpers';

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const { account } = route.params;
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntry, setNewEntry] = useState({
    profitLoss: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEntries = await getEntriesByAccount(account.id);
      setEntries(fetchedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      Alert.alert('Error', 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, [account.id]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

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
      
      const currentBalance = entries.length > 0 
        ? entries[0].balance 
        : account.initialBalance;
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
    } catch (error) {
      console.error('Error creating entry:', error);
      Alert.alert('Error', 'Failed to create entry');
    } finally {
      setSaving(false);
    }
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
            {formatCurrency(
              entries.length > 0 ? entries[0].balance : account.initialBalance,
              account.currency
            )}
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
          <BalanceChart entries={entries} currency={account.currency} />
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
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryCard entry={item} currency={account.currency} />
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
              onChangeText={(text) =>
                setNewEntry({ ...newEntry, profitLoss: text })
              }
              keyboardType="numeric"
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
    color: '#000000',
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  plContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  plLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  plValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  profit: {
    color: '#34C759',
  },
  loss: {
    color: '#FF3B30',
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
    color: '#000000',
  },
  addEntryButton: {
    backgroundColor: '#007AFF',
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
    color: '#8E8E93',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
  },
  modalDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  notesInput: {
    height: 100,
  },
  createButton: {
    marginTop: 8,
  },
});

export default DashboardScreen;
