import { StyleSheet } from 'react-native';

// Dark Trading Theme Colors
export const DARK_THEME_COLORS = {
  // Background colors
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  
  // Trading colors
  profit: '#34C759',
  loss: '#FF3B30',
  
  // Border colors
  border: '#2C2C2E',
  separator: '#38383A',
  
  // Accent colors
  primary: '#007AFF',
  primaryDark: '#0051D5',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.6)',
} as const;

// Reusable styled component styles for dark theme
export const darkThemeStyles = StyleSheet.create({
  container: {
    backgroundColor: DARK_THEME_COLORS.background,
  },
  card: {
    backgroundColor: DARK_THEME_COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: DARK_THEME_COLORS.text,
  },
  textSecondary: {
    color: DARK_THEME_COLORS.textSecondary,
  },
  textTertiary: {
    color: DARK_THEME_COLORS.textTertiary,
  },
  profit: {
    color: DARK_THEME_COLORS.profit,
  },
  loss: {
    color: DARK_THEME_COLORS.loss,
  },
  input: {
    backgroundColor: DARK_THEME_COLORS.backgroundTertiary,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: DARK_THEME_COLORS.text,
    borderWidth: 1,
    borderColor: DARK_THEME_COLORS.border,
  },
  button: {
    backgroundColor: DARK_THEME_COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: DARK_THEME_COLORS.separator,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: DARK_THEME_COLORS.text,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK_THEME_COLORS.text,
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
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

// Reusable Card Component Style Function
export const createCardStyle = (darkMode: boolean) => ({
  backgroundColor: darkMode ? DARK_THEME_COLORS.backgroundSecondary : '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: darkMode ? 0.3 : 0.1,
  shadowRadius: 4,
  elevation: 3,
});

// Reusable Text Style Function
export const createTextStyle = (darkMode: boolean, variant: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
  const colorMap = {
    primary: darkMode ? DARK_THEME_COLORS.text : '#000000',
    secondary: DARK_THEME_COLORS.textSecondary,
    tertiary: DARK_THEME_COLORS.textTertiary,
  };
  
  return {
    color: colorMap[variant],
  };
};

// Reusable Input Style Function
export const createInputStyle = (darkMode: boolean) => ({
  backgroundColor: darkMode ? DARK_THEME_COLORS.backgroundTertiary : '#F2F2F7',
  borderRadius: 8,
  padding: 16,
  fontSize: 16,
  color: darkMode ? DARK_THEME_COLORS.text : '#000000',
  borderWidth: darkMode ? 1 : 0,
  borderColor: darkMode ? DARK_THEME_COLORS.border : 'transparent',
});

export type DarkThemeColors = typeof DARK_THEME_COLORS;
