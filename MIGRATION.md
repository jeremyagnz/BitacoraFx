# Migration Guide

This guide explains how to migrate existing code to use the new scalable folder structure.

## Quick Reference

### Before and After

**Old Import Pattern:**
```typescript
// ❌ Old (still works but deprecated)
import { db } from '../services/firebase';
import { TradingAccount } from '../types';
import { getAccounts, createEntry } from '../services/firestore';

// Manual state management
const [accounts, setAccounts] = useState<TradingAccount[]>([]);
const [loading, setLoading] = useState(true);

const loadAccounts = async () => {
  try {
    setLoading(true);
    const data = await getAccounts();
    setAccounts(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

**New Import Pattern:**
```typescript
// ✅ New (recommended)
import { db } from '../config';
import { TradingAccount } from '../models';
import { getAllAccounts, createEntry } from '../api';
import { useAccounts } from '../hooks';
import { COLORS, STRINGS } from '../constants';

// Using the hook - automatic loading and error handling
const { accounts, loading, addAccount } = useAccounts();
```

## Step-by-Step Migration

### 1. Update Imports

Replace old service imports with new API imports:

```typescript
// Before
import { getAccounts, createAccount } from '../services/firestore';

// After
import { getAllAccounts, createAccount } from '../api';
// Note: getAccounts is now getAllAccounts for clarity
```

Replace type imports:

```typescript
// Before
import { TradingAccount, DailyEntry } from '../types';

// After
import { TradingAccount, DailyEntry } from '../models';
```

### 2. Use Custom Hooks

The biggest improvement is using custom hooks instead of manual state management.

**Before (Manual):**
```typescript
const MyComponent = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleCreate = async (account) => {
    try {
      await createAccount(account);
      await loadAccounts();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create');
    }
  };

  // ... rest of component
};
```

**After (Using Hook):**
```typescript
const MyComponent = () => {
  // All loading, error handling, and CRUD operations in one line!
  const { accounts, loading, addAccount } = useAccounts();

  const handleCreate = async (account) => {
    try {
      await addAccount(account);
      // Hook automatically refreshes the list!
    } catch (error) {
      // Error already handled by the hook
    }
  };

  // ... rest of component
};
```

### 3. Use Constants

Replace hardcoded values with constants:

**Before:**
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  title: {
    color: '#000000',
    fontSize: 24,
  },
  error: {
    color: '#FF3B30',
  },
});

Alert.alert('Error', 'Failed to load accounts');
```

**After:**
```typescript
import { COLORS, SIZES, STRINGS } from '../constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: SIZES.SPACING_LG,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.FONT_XXL,
  },
  error: {
    color: COLORS.danger,
  },
});

Alert.alert('Error', STRINGS.ERROR_LOADING_ACCOUNTS);
```

### 4. Use Theme

For more complex styling, use the theme object:

```typescript
import { theme } from '../theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
});
```

## Benefits

### Code Reduction

**Before (AccountsScreen - 346 lines):**
- Manual state management: ~30 lines
- Manual loading logic: ~15 lines
- Manual error handling: ~10 lines
- Hardcoded values: scattered throughout

**After (Using hooks and constants):**
- Hook usage: 1 line
- Centralized error handling: automatic
- Type-safe constants: imported
- **Reduction: ~50 lines of boilerplate**

### Performance Improvements

1. **Better Code Splitting**: Organized imports enable better tree shaking
2. **Memoization**: Hooks use useCallback internally
3. **Reduced Re-renders**: Better state management
4. **Lazy Loading**: Easier to implement with organized structure

### Maintainability

1. **Single Source of Truth**: Constants in one place
2. **Reusable Logic**: Hooks encapsulate business logic
3. **Type Safety**: Better TypeScript support
4. **Easier Testing**: Isolated modules
5. **Consistent Patterns**: Same structure everywhere

## Examples

### Example 1: Using useAccounts

```typescript
import { useAccounts } from '../hooks';

function AccountsList() {
  const { accounts, loading, error, addAccount, removeAccount } = useAccounts();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <FlatList
      data={accounts}
      renderItem={({ item }) => <AccountCard account={item} />}
    />
  );
}
```

### Example 2: Using useEntries

```typescript
import { useEntries } from '../hooks';

function EntriesList({ accountId }: { accountId: string }) {
  const { entries, loading, addEntry } = useEntries(accountId);

  const handleAdd = async (profitLoss: number) => {
    await addEntry({
      accountId,
      date: new Date(),
      profitLoss,
      balance: calculateNewBalance(entries, profitLoss),
    });
  };

  return (
    <FlatList
      data={entries}
      renderItem={({ item }) => <EntryCard entry={item} />}
    />
  );
}
```

### Example 3: Using Constants

```typescript
import { COLORS, STRINGS, SIZES } from '../constants';

function ErrorMessage({ message }: { message?: string }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        {message || STRINGS.ERROR_LOADING_DATA}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    padding: SIZES.SPACING_LG,
    backgroundColor: COLORS.danger,
    borderRadius: SIZES.RADIUS_MD,
  },
  errorText: {
    color: COLORS.backgroundSecondary,
    fontSize: SIZES.FONT_MD,
  },
});
```

## Backward Compatibility

The old structure still works! We've maintained backward compatibility:

```typescript
// These still work (but are deprecated):
import { db } from '../services/firebase';
import { TradingAccount } from '../types';
import { getAccounts } from '../services/firestore';

// They internally import from the new locations:
// '../services/firebase' → '../config'
// '../types' → '../models'
// '../services/firestore' → '../api'
```

## Checklist

When creating a new feature:

- [ ] Create models in `models/entities/`
- [ ] Create API functions in `api/`
- [ ] Create custom hook in `hooks/` (if needed)
- [ ] Add constants to `constants/`
- [ ] Use theme for styling
- [ ] Import from new locations
- [ ] Use TypeScript types

## Common Patterns

### Pattern 1: List Screen with CRUD

```typescript
import { useAccounts } from '../hooks';
import { COLORS, STRINGS } from '../constants';

function ListScreen() {
  const { accounts, loading, addAccount, removeAccount } = useAccounts();
  
  // Component logic here
}
```

### Pattern 2: Detail Screen with Data

```typescript
import { useEntries } from '../hooks';
import { theme } from '../theme';

function DetailScreen({ accountId }: Props) {
  const { entries, loading, addEntry } = useEntries(accountId);
  
  // Component logic here
}
```

### Pattern 3: Using API Directly (without hook)

```typescript
import { getAllAccounts, createAccount } from '../api';
import { TradingAccount, CreateTradingAccountInput } from '../models';

async function customLogic() {
  const accounts = await getAllAccounts();
  // Process accounts...
  
  const newAccount: CreateTradingAccountInput = {
    name: 'Test',
    initialBalance: 1000,
    currency: 'USD',
  };
  await createAccount(newAccount);
}
```

## Testing

The new structure makes testing easier:

```typescript
// Mock the API
jest.mock('../api', () => ({
  getAllAccounts: jest.fn(),
  createAccount: jest.fn(),
}));

// Mock the hooks
jest.mock('../hooks', () => ({
  useAccounts: () => ({
    accounts: mockAccounts,
    loading: false,
    addAccount: jest.fn(),
  }),
}));
```

## Next Steps

1. Review the example file: `AccountsScreen.optimized.example.tsx`
2. Start using hooks in new screens
3. Gradually migrate existing screens
4. Add more constants as needed
5. Create more custom hooks for new features

## Need Help?

- See [STRUCTURE.md](./STRUCTURE.md) for detailed documentation
- Check example file for patterns
- Review the hooks implementation in `src/hooks/`
