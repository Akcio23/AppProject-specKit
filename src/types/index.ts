import { ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  hapticFeedback?: boolean;
}

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  testID?: string;
  glass?: boolean;
  glow?: boolean;
}

export interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  maxLength?: number;
}

export type StateMessageVariant = 'loading' | 'error' | 'empty';

export interface StateMessageProps {
  variant: StateMessageVariant;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  testID?: string;
}

export interface SavedVerse {
  id: string;
  reference: string;
  text: string;
  translation: string;
  savedAt: string;
}

export type NewSavedVerse = Omit<SavedVerse, 'id' | 'savedAt'>;

export interface AppState {
  isDarkMode: boolean;
  savedVerses: SavedVerse[];
  toggleDarkMode: () => void;
  saveVerse: (verse: NewSavedVerse) => void;
  removeSavedVerse: (idOrReference: string) => void;
  isVerseSaved: (reference: string, translation?: string) => boolean;
}
