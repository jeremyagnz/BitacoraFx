# Project Structure

This document describes the scalable folder structure of the BitacoraFx application.

## Directory Overview

```
src/
├── api/                    # API layer - Firebase service abstractions
├── components/             # Reusable UI components
├── config/                 # Configuration files (Firebase, etc.)
├── constants/              # App-wide constants (colors, strings, sizes)
├── hooks/                  # Custom React hooks
├── models/                 # Data models and TypeScript types
│   └── entities/          # Entity definitions
├── navigation/             # Navigation configuration
├── screens/                # App screens/pages
├── services/              # Legacy services (deprecated, use api/)
├── theme/                  # Theme configuration
├── types/                  # Legacy types (deprecated, use models/)
└── utils/                  # Utility functions
```

## Detailed Structure

### `/api` - API Layer
Abstraction layer over Firebase services. Provides clean, reusable functions for data operations.

**Files:**
- `accounts.api.ts` - Trading account CRUD operations
- `entries.api.ts` - Daily entry CRUD operations
- `index.ts` - Barrel export

**Usage:**
```typescript
import { getAllAccounts, createEntry } from '../api';
```

### `/components` - Reusable UI Components
Stateless, reusable UI components used across multiple screens.

**Files:**
- `AccountCard.tsx` - Display trading account information
- `BalanceChart.tsx` - Chart visualization for balance history
- `Button.tsx` - Custom button component
- `EntryCard.tsx` - Display daily entry information

**Best Practices:**
- Keep components small and focused
- Use TypeScript interfaces for props
- Export components as default
- Co-locate styles with components

### `/config` - Configuration
Centralized configuration files for external services and app settings.

**Files:**
- `firebase.config.ts` - Firebase initialization and configuration
- `index.ts` - Barrel export

**Usage:**
```typescript
import { app, db } from '../config';
```

### `/constants` - Constants
App-wide constants for colors, strings, sizes, and other fixed values.

**Files:**
- `colors.ts` - Color palette (COLORS object)
- `app.constants.ts` - Strings, sizes, collections, defaults
- `index.ts` - Barrel export

**Usage:**
```typescript
import { COLORS, STRINGS, SIZES, COLLECTIONS } from '../constants';
```

**Benefits:**
- Single source of truth for values
- Easy theming and customization
- Type-safe constants
- Prevents magic strings/numbers

### `/hooks` - Custom Hooks
Reusable React hooks for business logic and state management.

**Files:**
- `useAccounts.ts` - Manage trading accounts state
- `useEntries.ts` - Manage daily entries state
- `index.ts` - Barrel export

**Usage:**
```typescript
import { useAccounts, useEntries } from '../hooks';

const { accounts, loading, addAccount } = useAccounts();
const { entries, refresh, addEntry } = useEntries(accountId);
```

**Benefits:**
- Encapsulates business logic
- Reduces code duplication
- Improves testability
- Cleaner components

### `/models` - Data Models
TypeScript interfaces, types, and data structures.

**Structure:**
```
models/
├── entities/
│   ├── TradingAccount.ts    # Account model and types
│   ├── DailyEntry.ts        # Entry model and types
│   ├── Navigation.ts        # Navigation types
│   └── index.ts             # Entity exports
└── index.ts                 # All model exports
```

**Usage:**
```typescript
import { TradingAccount, DailyEntry, CreateDailyEntryInput } from '../models';
```

**Benefits:**
- Organized by domain entity
- Includes input/output types
- Type-safe data structures
- Easier to maintain

### `/navigation` - Navigation
React Navigation configuration and navigators.

**Files:**
- `RootNavigator.tsx` - Main stack navigator
- `TabNavigator.tsx` - Bottom tab navigator

### `/screens` - Screens
Main application screens/pages.

**Files:**
- `AccountsScreen.tsx` - List and manage accounts
- `AnalyticsScreen.tsx` - Analytics and statistics
- `DashboardScreen.tsx` - Account dashboard with entries

**Best Practices:**
- One screen per file
- Use custom hooks for data fetching
- Keep business logic in hooks
- Focus on UI composition

### `/theme` - Theme
Centralized theme configuration with colors, spacing, typography.

**Files:**
- `index.ts` - Theme object with colors, spacing, fontSize, shadows

**Usage:**
```typescript
import { theme } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
});
```

### `/utils` - Utilities
Helper functions and utilities.

**Files:**
- `helpers.ts` - Formatting, calculations, date utilities

**Usage:**
```typescript
import { formatCurrency, formatDate, calculateWinRate } from '../utils/helpers';
```

## Migration Guide

### Old vs New Structure

**Old (Deprecated):**
```typescript
// ❌ Old way
import { db } from '../services/firebase';
import { TradingAccount } from '../types';
import { getAccounts } from '../services/firestore';
```

**New (Recommended):**
```typescript
// ✅ New way
import { db } from '../config';
import { TradingAccount } from '../models';
import { getAllAccounts } from '../api';
import { useAccounts } from '../hooks';
import { COLORS, STRINGS } from '../constants';
```

### Benefits of New Structure

1. **Scalability**: Organized by domain and responsibility
2. **Maintainability**: Easy to find and update code
3. **Reusability**: Hooks and API layer reduce duplication
4. **Type Safety**: Better TypeScript support
5. **Performance**: Cleaner imports and code splitting
6. **Developer Experience**: Consistent patterns
7. **Testing**: Easier to test isolated modules

## Import Path Patterns

```typescript
// Config
import { db, app } from '../config';

// Models/Types
import { TradingAccount, DailyEntry } from '../models';

// API
import { getAllAccounts, createEntry } from '../api';

// Hooks
import { useAccounts, useEntries } from '../hooks';

// Constants
import { COLORS, STRINGS, SIZES } from '../constants';

// Theme
import { theme } from '../theme';

// Utils
import { formatCurrency, formatDate } from '../utils/helpers';

// Components
import AccountCard from '../components/AccountCard';
import Button from '../components/Button';
```

## Adding New Features

### Adding a New Entity

1. Create model in `models/entities/NewEntity.ts`
2. Export from `models/entities/index.ts`
3. Create API functions in `api/newEntity.api.ts`
4. Export from `api/index.ts`
5. Create custom hook in `hooks/useNewEntity.ts`
6. Export from `hooks/index.ts`

### Adding a New Screen

1. Create screen in `screens/NewScreen.tsx`
2. Add to navigation in `navigation/`
3. Use existing hooks and API
4. Follow component patterns

### Adding Constants

1. Add to appropriate file in `constants/`
2. Use throughout the app
3. Update theme if needed

## Code Style Guidelines

1. **Barrel Exports**: Use `index.ts` files to re-export
2. **Named Exports**: Prefer named exports for utilities
3. **Default Exports**: Use for components and screens
4. **Type Safety**: Always use TypeScript types
5. **Comments**: Add JSDoc comments to public APIs
6. **Consistency**: Follow existing patterns

## Performance Considerations

1. **Code Splitting**: Organized structure enables better splitting
2. **Tree Shaking**: Named exports improve tree shaking
3. **Memoization**: Use React.memo for expensive components
4. **Custom Hooks**: Encapsulate expensive operations
5. **Lazy Loading**: Load screens on demand

## Future Improvements

Potential additions as the app grows:

- `/features` - Feature-based organization (accounts, entries, analytics)
- `/store` - State management (Redux, Zustand, etc.)
- `/middleware` - API middleware and interceptors
- `/validators` - Input validation schemas
- `/contexts` - React contexts
- `/hoc` - Higher-order components
- `/assets` - Images, fonts (currently in root)
- `/tests` - Test utilities and mocks

## Backward Compatibility

The old structure is maintained for backward compatibility:

- `/services` - Deprecated, use `/api` and `/config`
- `/types` - Deprecated, use `/models`

These will re-export from new locations to prevent breaking changes.
