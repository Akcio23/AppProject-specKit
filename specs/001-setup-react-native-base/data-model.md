# Data Model & Interface Contracts: Base React Native

**Feature**: `001-setup-react-native-base`  
**Date**: 2026-10-13  
**Status**: Completed

## Entidades e Modelagem de Tipos

### 1. Design Tokens (Theme Entity)
Representa a identidade visual e parâmetros de estilo do aplicativo móvel.

```typescript
export interface ColorTokens {
  primary: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  text: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface SpacingTokens {
  xs: number;  // 4
  sm: number;  // 8
  md: number;  // 16
  lg: number;  // 24
  xl: number;  // 32
  xxl: number; // 48
}

export interface TypographyTokens {
  fontSize: {
    xs: number;  // 12
    sm: number;  // 14
    md: number;  // 16
    lg: number;  // 20
    xl: number;  // 24
    xxl: number; // 32
  };
  fontWeight: {
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
  };
}

export interface AppTheme {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
}
```

### 2. Contratos de Componentes UI Primitivos

#### `ButtonProps` (`src/components/ui/Button.tsx`)
```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}
```

#### `CardProps` (`src/components/ui/Card.tsx`)
```typescript
export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  testID?: string;
}
```

### 3. Store de Estado Global (`src/stores/useAppStore.ts`)
```typescript
export interface AppState {
  themeMode: 'light' | 'dark' | 'system';
  isInitialized: boolean;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setInitialized: (initialized: boolean) => void;
}
```
