import { ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

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

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  testID?: string;
}

export interface AppState {
  counter: number;
  isDarkMode: boolean;
  incrementCounter: () => void;
  toggleDarkMode: () => void;
  resetCounter: () => void;
}
