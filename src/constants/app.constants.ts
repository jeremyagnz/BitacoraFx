// Firebase collection names
export const COLLECTIONS = {
  ACCOUNTS: 'accounts',
  ENTRIES: 'entries',
} as const;

// App-wide string constants
export const STRINGS = {
  APP_NAME: 'BitacoraFx',
  
  // Error messages
  ERROR_LOADING_DATA: 'Failed to load data',
  ERROR_LOADING_ACCOUNTS: 'Failed to load accounts',
  ERROR_LOADING_ENTRIES: 'Failed to load entries',
  ERROR_CREATING_ACCOUNT: 'Failed to create account',
  ERROR_CREATING_ENTRY: 'Failed to create entry',
  ERROR_UPDATING_ACCOUNT: 'Failed to update account',
  ERROR_DELETING_ACCOUNT: 'Failed to delete account',
  ERROR_INVALID_INPUT: 'Please enter a valid number',
  ERROR_REQUIRED_FIELD: 'This field is required',
  
  // Success messages
  SUCCESS_ACCOUNT_CREATED: 'Account created successfully',
  SUCCESS_ENTRY_CREATED: 'Entry added successfully',
  
  // Placeholders
  PLACEHOLDER_ACCOUNT_NAME: 'Account name',
  PLACEHOLDER_INITIAL_BALANCE: 'Initial balance',
  PLACEHOLDER_PROFIT_LOSS: 'Profit/Loss (e.g., 100 or -50)',
  PLACEHOLDER_NOTES: 'Notes (optional)',
  
  // Labels
  LABEL_CURRENT_BALANCE: 'Current Balance',
  LABEL_TOTAL_PL: 'Total P/L',
  LABEL_DAILY_ENTRIES: 'Daily Entries',
  LABEL_NO_ENTRIES: 'No entries yet',
  LABEL_NO_ACCOUNTS: 'No accounts yet',
} as const;

// Size constants
export const SIZES = {
  // Spacing
  SPACING_XS: 4,
  SPACING_SM: 8,
  SPACING_MD: 12,
  SPACING_LG: 16,
  SPACING_XL: 20,
  SPACING_XXL: 24,
  SPACING_XXXL: 32,
  
  // Border radius
  RADIUS_SM: 8,
  RADIUS_MD: 12,
  RADIUS_LG: 16,
  RADIUS_XL: 20,
  RADIUS_ROUND: 999,
  
  // Font sizes
  FONT_XS: 12,
  FONT_SM: 14,
  FONT_MD: 16,
  FONT_LG: 18,
  FONT_XL: 20,
  FONT_XXL: 24,
  FONT_XXXL: 28,
  FONT_TITLE: 36,
} as const;

// Default values
export const DEFAULTS = {
  CURRENCY: 'USD',
  PAGE_SIZE: 20,
  DEBOUNCE_DELAY: 300,
} as const;
