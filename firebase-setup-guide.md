# Firebase Setup Guide

This guide explains how Firebase Firestore is configured for the BitacoraFx React Native Expo app.

## Firebase Configuration File

**Location:** `src/config/firebase.config.ts`

This file contains:
- Firebase configuration interface
- Firebase app initialization
- Firestore database initialization
- Environment variable support

### Configuration

The Firebase configuration is read from environment variables or uses demo values for development:

```typescript
// Environment variables (from .env file or Expo config):
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
```

### Setting Up Firebase

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your Firebase credentials to `.env`:**
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. **Get Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing
   - Go to Project Settings
   - Under "Your apps", add a web app
   - Copy the configuration values

## Firestore Collection Structure

### Collections

The app uses two main Firestore collections:

#### 1. `accounts` Collection
Stores trading account information.

**Document Structure:**
```typescript
{
  name: string;              // Account name
  broker: string;            // Broker name
  initialBalance: number;    // Starting balance
  currentBalance: number;    // Current balance
  currency: string;          // Currency code (USD, EUR, GBP)
  createdAt: Timestamp;      // Creation timestamp
  updatedAt: Timestamp;      // Last update timestamp
}
```

#### 2. `entries` Collection
Stores daily trading entries/trades.

**Document Structure:**
```typescript
{
  accountId: string;         // Reference to account ID
  date: Timestamp;           // Entry date
  profitLoss: number;        // Profit or loss amount
  balance: number;           // Balance after this entry
  notes?: string;            // Optional notes
  createdAt: Timestamp;      // Creation timestamp
  updatedAt: Timestamp;      // Last update timestamp
}
```

## API Functions

### Account Operations

**Location:** `src/api/accounts.api.ts`

- `createAccount(account)` - Create a new trading account
- `getAllAccounts()` - Retrieve all accounts
- `getAccountById(id)` - Get a specific account
- `updateAccount(id, updates)` - Update account details
- `deleteAccount(id)` - Delete account and all associated entries

### Entry Operations

**Location:** `src/api/entries.api.ts`

- `createEntry(entry)` - Add a new daily entry
- `getEntriesByAccount(accountId)` - Get all entries for an account
- `updateEntry(id, updates)` - Update an entry
- `deleteEntry(id)` - Delete an entry

## Helper Functions

**Location:** `src/utils/helpers.ts`

- `calculateBalance(initialBalance, entries)` - Calculate account balance
- `calculateTotalProfitLoss(entries)` - Calculate total P/L
- `formatCurrency(amount, currency)` - Format currency display
- `formatDate(date)` - Format date display

## Usage Example

```typescript
import { createAccount, getAllAccounts } from './api';
import { calculateTotalProfitLoss } from './utils/helpers';

// Create a new account
const accountId = await createAccount({
  name: 'My Trading Account',
  broker: 'Interactive Brokers',
  initialBalance: 10000,
  currency: 'USD'
});

// Get all accounts
const accounts = await getAllAccounts();

// Calculate total P/L for an account
const totalPL = calculateTotalProfitLoss(entries);
```

## Security Rules (Recommended)

For production, add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users only
    match /accounts/{accountId} {
      allow read, write: if request.auth != null;
    }
    
    match /entries/{entryId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Real-time Updates (Optional)

To enable real-time updates, you can use Firestore's `onSnapshot`:

```typescript
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './config';

// Listen to account changes
const unsubscribe = onSnapshot(
  collection(db, 'accounts'),
  (snapshot) => {
    const accounts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Update UI with new data
  }
);

// Cleanup when component unmounts
unsubscribe();
```

## Error Handling

All API functions include proper error handling:

```typescript
try {
  await createAccount(accountData);
} catch (error) {
  console.error('Error creating account:', error);
  Alert.alert('Error', 'Failed to create account');
}
```

## TypeScript Interfaces

**Location:** `src/models/entities/`

- `TradingAccount.ts` - Account interface and types
- `DailyEntry.ts` - Entry interface and types

These provide full TypeScript support and type safety throughout the app.
