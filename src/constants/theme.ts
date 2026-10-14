/**
 * Design System Clean Pastel - Bíblia Sagrada Mobile
 * Paleta serena em tons pastéis: branco suave, marrom terroso, preto aveludado e amarelo opaco suave.
 */

export const pastelPalette = {
  // Brancos & Alabastro
  white: '#FFFFFF',
  linen: '#FAF8F5', // Fundo diurno suave como página de livro pólen
  parchment: '#F3EFE8', // Superfície sutil para cards claros
  cream: '#ECE6DC', // Borda e divisores claros

  // Marrons & Taupe
  brownDark: '#261E19', // Café profundo (para texto e acentos)
  brownMedium: '#5C4E43', // Marrom suave editorial
  brownMuted: '#8C7E72', // Taupe delicado para subtítulos
  brownSurface: '#24201D', // Superfície de card escuro com matiz marrom quente

  // Pretos Foscos & Carvão
  charcoalDark: '#161514', // Fundo noturno aveludado (preto suave, não estourado)
  charcoalSurface: '#1F1D1B', // Card escuro acolhedor
  charcoalSubtle: '#292623', // Pílulas e chips noturnos
  charcoalBorder: '#36322E', // Borda noturna sutil

  // Amarelo Opaco Pastel (Manteiga & Trigo Dourado Suave - sem neon)
  yellowPastel: '#DFC87B', // Amarelo opaco nobre para destaques
  yellowPastelLight: '#F5EBC7', // Amarelo manteiga suave para fundos de badges
  yellowPastelDark: '#3A3420', // Amarelo opaco profundo para modo escuro
  yellowPastelMuted: '#8A7A48',

  // Tons de Feedback Suaves
  successPastel: '#4E937A',
  errorPastel: '#C25953',
  warningPastel: '#C98A4B',
} as const;

export interface AppTheme {
  isDark: boolean;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSubtle: string;
  surfaceCard: string;
  surfaceFloat: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  border: string;
  borderSubtle: string;
  divider: string;
  quoteBorder: string;
  statusBar: 'light-content' | 'dark-content';
}

export const lightTheme: AppTheme = {
  isDark: false,
  background: pastelPalette.linen,
  backgroundSecondary: pastelPalette.parchment,
  surface: pastelPalette.white,
  surfaceSubtle: pastelPalette.parchment,
  surfaceCard: pastelPalette.white,
  surfaceFloat: 'rgba(255, 255, 255, 0.94)',
  textPrimary: pastelPalette.brownDark,
  textSecondary: pastelPalette.brownMedium,
  textMuted: pastelPalette.brownMuted,
  accent: pastelPalette.yellowPastel,
  accentSoft: pastelPalette.yellowPastelLight,
  accentText: '#594612',
  border: pastelPalette.cream,
  borderSubtle: '#E8E1D5',
  divider: 'rgba(92, 78, 67, 0.08)',
  quoteBorder: pastelPalette.yellowPastel,
  statusBar: 'dark-content',
};

export const darkTheme: AppTheme = {
  isDark: true,
  background: pastelPalette.charcoalDark,
  backgroundSecondary: pastelPalette.charcoalSurface,
  surface: pastelPalette.charcoalSurface,
  surfaceSubtle: pastelPalette.charcoalSubtle,
  surfaceCard: pastelPalette.charcoalSurface,
  surfaceFloat: 'rgba(31, 29, 27, 0.94)',
  textPrimary: '#F6F3EE',
  textSecondary: '#BDB3A6',
  textMuted: '#7D756C',
  accent: pastelPalette.yellowPastel,
  accentSoft: pastelPalette.yellowPastelDark,
  accentText: '#F7EDCA',
  border: pastelPalette.charcoalBorder,
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  divider: 'rgba(255, 255, 255, 0.06)',
  quoteBorder: pastelPalette.yellowPastel,
  statusBar: 'light-content',
};

/** Compatibilidade retroativa */
export const colors = {
  primary: pastelPalette.yellowPastel,
  primaryDark: '#BCA14F',
  primaryLight: pastelPalette.yellowPastelLight,
  secondary: pastelPalette.brownMedium,
  secondaryLight: pastelPalette.brownMuted,
  gold: pastelPalette.yellowPastel,
  goldLight: pastelPalette.yellowPastelLight,
  goldDark: '#8A7A48',
  accentGoldGlow: 'rgba(223, 200, 123, 0.15)',
  accentTeal: '#4E937A',
  accentRose: '#C25953',

  backgroundDark: pastelPalette.charcoalDark,
  backgroundLight: pastelPalette.linen,
  backgroundSecondaryDark: pastelPalette.charcoalSurface,
  backgroundSecondaryLight: pastelPalette.parchment,
  surfaceDark: pastelPalette.charcoalSurface,
  surfaceLight: pastelPalette.white,
  surfaceSubtleDark: pastelPalette.charcoalSubtle,
  surfaceSubtleLight: pastelPalette.parchment,

  surfaceGlassDark: 'rgba(31, 29, 27, 0.88)',
  surfaceGlassLight: 'rgba(255, 255, 255, 0.92)',
  surfaceGlassHoverDark: 'rgba(41, 38, 35, 0.95)',
  surfaceGlassHoverLight: 'rgba(250, 248, 245, 0.98)',

  borderDark: pastelPalette.charcoalBorder,
  borderLight: pastelPalette.cream,
  borderGlassDark: 'rgba(255, 255, 255, 0.06)',
  borderGlassLight: 'rgba(92, 78, 67, 0.06)',
  borderGold: 'rgba(223, 200, 123, 0.35)',

  textPrimaryDark: '#F6F3EE',
  textPrimaryLight: pastelPalette.brownDark,
  textSecondaryDark: '#BDB3A6',
  textSecondaryLight: pastelPalette.brownMedium,
  textMutedDark: '#7D756C',
  textMutedLight: pastelPalette.brownMuted,

  success: pastelPalette.successPastel,
  warning: pastelPalette.warningPastel,
  error: pastelPalette.errorPastel,
  sacredAccent: pastelPalette.yellowPastel,
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
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  full: 9999,
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 19,
    xl: 22,
    xxl: 28,
    huge: 34,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  letterSpacing: {
    tight: -0.3,
    normal: 0,
    wide: 0.4,
    extraWide: 1.0,
  },
} as const;

export const shadows = {
  soft: {
    shadowColor: '#161514',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  glassGlow: {
    shadowColor: '#161514',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  modal: {
    shadowColor: '#161514',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;
