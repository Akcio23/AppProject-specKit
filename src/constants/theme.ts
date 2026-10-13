export const colors = {
  primary: '#6366F1', // Indigo vibrante
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  secondary: '#10B981', // Esmeralda
  backgroundDark: '#090D16',
  backgroundLight: '#F8FAFC',
  surfaceDark: '#131B2E',
  surfaceLight: '#FFFFFF',
  surfaceSubtleDark: '#1E293B',
  surfaceSubtleLight: '#F1F5F9',
  borderDark: '#223049',
  borderLight: '#E2E8F0',
  textPrimaryDark: '#F8FAFC',
  textPrimaryLight: '#0F172A',
  textMutedDark: '#94A3B8',
  textMutedLight: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;
