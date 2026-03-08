// Mangwao Theme - Trustworthy Color Palette
export const colors = {
  // Primary - Deep Navy (Trust, Stability)
  primary: {
    main: '#1a3a52',
    light: '#2c5270',
    dark: '#0f2538',
    contrast: '#ffffff',
  },
  
  // Secondary - Teal (Reliability, Innovation)
  secondary: {
    main: '#20b2aa',
    light: '#4fc3bb',
    dark: '#178a84',
    contrast: '#ffffff',
  },
  
  // Accent - Warm Amber (Energy, Action)
  accent: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    contrast: '#ffffff',
  },
  
  // Background
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
    elevated: '#ffffff',
  },
  
  // Text
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    disabled: '#9ca3af',
    hint: '#d1d5db',
  },
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Order Status
  status: {
    pending: '#94a3b8',
    accepted: '#3b82f6',
    picked_up: '#8b5cf6',
    in_transit: '#f59e0b',
    delivered: '#10b981',
    cancelled: '#ef4444',
  },
  
  // Borders & Dividers
  divider: '#e5e7eb',
  border: '#d1d5db',
  
  // Shadows
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    heavy: 'rgba(0, 0, 0, 0.15)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export type Theme = typeof theme;
