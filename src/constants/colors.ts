// Color palette based on iOS design system
export const COLORS = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0051D5',
  
  // Semantic colors
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  
  // Background colors
  background: '#F2F2F7',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#E5E5EA',
  
  // Text colors
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  
  // Border colors
  border: '#E5E5EA',
  separator: '#C6C6C8',
  
  // Status colors
  profit: '#34C759',
  loss: '#FF3B30',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

// Type for color keys
export type ColorKey = keyof typeof COLORS;
