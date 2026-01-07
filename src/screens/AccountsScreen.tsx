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
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import AccountCard from '../components/AccountCard';
import Button from '../components/Button';
import { TradingAccount, RootStackParamList, RootTabParamList } from '../types';
import { getAccounts, createAccount, deleteAccount } from '../services/firestore';

type AccountsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Accounts'>,
  NativeStackScreenProps<RootStackParamList>
>;

const AccountsScreen: React.FC<AccountsScreenProps> = ({ navigation }) => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    broker: '',
    initialBalance: '',
    currency: 'USD',
  });
  const [saving, setSaving] = useState(false);

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
      Alert.alert('Error', 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleCreateAccount = async () => {
    if (!newAccount.name || !newAccount.broker || !newAccount.initialBalance) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const balance = parseFloat(newAccount.initialBalance);
    if (isNaN(balance) || balance < 0) {
      Alert.alert('Error', 'Please enter a valid balance');
      return;
    }

    try {
      setSaving(true);
      await createAccount({
        name: newAccount.name,
        broker: newAccount.broker,
        initialBalance: balance,
        currency: newAccount.currency,
      });
      setModalVisible(false);
      setNewAccount({ name: '', broker: '', initialBalance: '', currency: 'USD' });
      await loadAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = (account: TradingAccount) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"? This will also delete all associated entries.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(account.id);
              await loadAccounts();
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const handleAccountPress = (account: TradingAccount) => {
    navigation.navigate('Dashboard', { account });
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
      <View style={styles.header}>
        <Text style={styles.title}>Trading Accounts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {accounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="account-balance-wallet" size={64} color="#E5E5EA" />
          <Text style={styles.emptyText}>No accounts yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to create your first trading account
          </Text>
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AccountCard
              account={item}
              onPress={() => handleAccountPress(item)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Account</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Account Name"
              value={newAccount.name}
              onChangeText={(text) =>
                setNewAccount({ ...newAccount, name: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Broker"
              value={newAccount.broker}
              onChangeText={(text) =>
                setNewAccount({ ...newAccount, broker: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Initial Balance"
              value={newAccount.initialBalance}
              onChangeText={(text) =>
                setNewAccount({ ...newAccount, initialBalance: text })
              }
              keyboardType="numeric"
            />

            <View style={styles.currencyContainer}>
              <Text style={styles.label}>Currency</Text>
              <View style={styles.currencyButtons}>
                {['USD', 'EUR', 'GBP'].map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    style={[
                      styles.currencyButton,
                      newAccount.currency === curr &&
                        styles.currencyButtonActive,
                    ]}
                    onPress={() =>
                      setNewAccount({ ...newAccount, currency: curr })
                    }
                  >
                    <Text
                      style={[
                        styles.currencyButtonText,
                        newAccount.currency === curr &&
                          styles.currencyButtonTextActive,
                      ]}
                    >
                      {curr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Create Account"
              onPress={handleCreateAccount}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
  },
  addButton: {
    padding: 8,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  currencyContainer: {
    marginBottom: 24,
  },
  currencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  currencyButtonActive: {
    backgroundColor: '#007AFF',
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  currencyButtonTextActive: {
    color: '#FFFFFF',
  },
  createButton: {
    marginTop: 8,
  },
});

export default AccountsScreen;
