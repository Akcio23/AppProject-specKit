import { useMemo, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/stores/useAppStore';
import { lightTheme, darkTheme, AppTheme } from '@/constants/theme';

export interface UseThemeReturn {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

/**
 * Hook reativo para acesso ao tema atual (Claro Pastel ou Escuro Aveludado).
 * Oferece feedback tátil na alternância.
 */
export function useTheme(): UseThemeReturn {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  const theme = useMemo<AppTheme>(() => {
    return isDarkMode ? darkTheme : lightTheme;
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    toggleDarkMode();
  }, [toggleDarkMode]);

  return {
    theme,
    isDark: isDarkMode,
    toggleTheme,
  };
}
