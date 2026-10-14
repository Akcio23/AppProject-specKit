export const colors = {
  primary: '#D4AF37', // Ouro Celestial Nobre
  primaryDark: '#B48C28',
  primaryLight: '#F3E5AB',
  secondary: '#0D9488', // Verde Oliva / Serenidade
  secondaryLight: '#14B8A6',
  gold: '#D4AF37',
  goldLight: '#FDF6E2',
  goldDark: '#997300',
  accentGoldGlow: 'rgba(212, 175, 55, 0.20)',
  accentTeal: '#2DD4BF',
  accentRose: '#FB7185',

  // Fundos & Superfícies Sólidas
  backgroundDark: '#080B11', // Preto obsidiana profundo (sem cinza lavado)
  backgroundLight: '#F8F9FA', // Alabastro suave
  backgroundSecondaryDark: '#0F1523',
  backgroundSecondaryLight: '#EEF2F6',
  surfaceDark: '#111726',
  surfaceLight: '#FFFFFF',
  surfaceSubtleDark: '#182032',
  surfaceSubtleLight: '#F1EFEA',

  // Superfícies de Vidro (Glassmorphism)
  surfaceGlassDark: 'rgba(17, 23, 38, 0.72)',
  surfaceGlassLight: 'rgba(255, 255, 255, 0.82)',
  surfaceGlassHoverDark: 'rgba(28, 36, 56, 0.85)',
  surfaceGlassHoverLight: 'rgba(255, 255, 255, 0.95)',

  // Bordas Sutis & Translúcidas de 1px
  borderDark: '#1E293B',
  borderLight: '#E2E8F0',
  borderGlassDark: 'rgba(255, 255, 255, 0.085)', // Reflexo de luz sutil no escuro
  borderGlassLight: 'rgba(0, 0, 0, 0.06)',
  borderGold: 'rgba(212, 175, 55, 0.40)',

  // Tipografia
  textPrimaryDark: '#F8FAFC',
  textPrimaryLight: '#0F172A',
  textSecondaryDark: '#94A3B8',
  textSecondaryLight: '#475569',
  textMutedDark: '#64748B',
  textMutedLight: '#94A3B8',

  // Feedback do Sistema
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
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24, // Generoso para cards e painéis
  xl: 32, // Para modais e bottom sheets
  full: 9999, // Pílulas e botões ovais
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    huge: 40,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    extraWide: 1.5,
  },
} as const;

export const shadows = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  glassGlow: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 12,
  },
} as const;

