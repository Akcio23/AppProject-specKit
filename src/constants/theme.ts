export const colors = {
  primary: '#D4AF37', // Ouro Celestial Nobre
  primaryDark: '#B48C28',
  primaryLight: '#F3E5AB',
  secondary: '#0D9488', // Verde Oliva / Serenidade
  secondaryLight: '#14B8A6',
  gold: '#D4AF37',
  goldLight: '#FDF6E2',
  goldDark: '#997300',
  backgroundDark: '#090D16', // Noite contemplativa
  backgroundLight: '#FBF9F5', // Pergaminho suave
  surfaceDark: '#111726',
  surfaceLight: '#FFFFFF',
  surfaceSubtleDark: '#1A2338',
  surfaceSubtleLight: '#F3EFE7',
  borderDark: '#202D45',
  borderLight: '#E5DED3',
  borderGold: 'rgba(212, 175, 55, 0.35)',
  textPrimaryDark: '#F8FAFC',
  textPrimaryLight: '#1E1B18',
  textMutedDark: '#94A3B8',
  textMutedLight: '#6B655C',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  sacredAccent: '#E11D48',
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
