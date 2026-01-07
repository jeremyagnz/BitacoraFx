/**
 * AccountsScreen - Optimized version using new hooks
 * 
 * This is an example of how to use the new structure.
 * The code is significantly cleaner with the useAccounts hook handling all data logic.
 */
import React, { useState } from 'react';
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
import { TradingAccount, RootStackParamList, RootTabParamList } from '../models';
import { useAccounts } from '../hooks';
import { COLORS, STRINGS } from '../constants';

type AccountsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Accounts'>,
  NativeStackScreenProps<RootStackParamList>
>;

const AccountsScreenOptimized: React.FC<AccountsScreenProps> = ({ navigation }) => {
  // Use the custom hook - much cleaner!
  const { accounts, loading, addAccount } = useAccounts();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    initialBalance: '',
    currency: 'USD',
  });
  const [saving, setSaving] = useState(false);

  const handleCreateAccount = async () => {
    if (!newAccount.name || !newAccount.initialBalance) {
      Alert.alert('Error', STRINGS.ERROR_REQUIRED_FIELD);
      return;
    }

    const balance = parseFloat(newAccount.initialBalance);
    if (isNaN(balance) || balance < 0) {
      Alert.alert('Error', STRINGS.ERROR_INVALID_INPUT);
      return;
    }

    try {
      setSaving(true);
      await addAccount({
        name: newAccount.name,
        initialBalance: balance,
        currency: newAccount.currency,
      });
      setModalVisible(false);
      setNewAccount({ name: '', initialBalance: '', currency: 'USD' });
    } catch (error) {
      // Error already handled by the hook
    } finally {
      setSaving(false);
    }
  };

  const handleAccountPress = (account: TradingAccount) => {
    navigation.navigate('Dashboard', { account });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
          <MaterialIcons name="add" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {accounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="account-balance-wallet" size={64} color={COLORS.border} />
          <Text style={styles.emptyText}>{STRINGS.LABEL_NO_ACCOUNTS}</Text>
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
                <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={STRINGS.PLACEHOLDER_ACCOUNT_NAME}
              value={newAccount.name}
              onChangeText={(text) =>
                setNewAccount({ ...newAccount, name: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder={STRINGS.PLACEHOLDER_INITIAL_BALANCE}
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
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
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
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundSecondary,
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
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  currencyButtonActive: {
    backgroundColor: COLORS.primary,
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  currencyButtonTextActive: {
    color: COLORS.backgroundSecondary,
  },
  createButton: {
    marginTop: 8,
  },
});

export default AccountsScreenOptimized;
