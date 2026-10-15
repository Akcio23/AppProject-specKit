import { useCallback, useMemo } from 'react';
import { useSessionStore } from '@/stores/useSessionStore';
import { useGuestStore } from '@/stores/useGuestStore';
import { useAccountCacheStore } from '@/stores/useAccountCacheStore';
import { AppLanguage } from '@/types';

export const LANGUAGE_TO_DEFAULT_TRANSLATION: Record<AppLanguage, string> = {
  pt: 'almeida',
  en: 'kjv',
  es: 'valera',
};

export const TRANSLATION_TO_LANGUAGE: Record<string, AppLanguage> = {
  almeida: 'pt',
  kjv: 'en',
  web: 'en',
  bbe: 'en',
  valera: 'es',
};

/**
 * Hook de fachada para preferências do usuário (tema, tradução e idioma).
 * Alterna dinamicamente entre visitante (useGuestStore) e conta autenticada (useAccountCacheStore).
 */
export function usePreferences() {
  const isAuthenticated = useSessionStore((s) => s.status === 'authenticated');

  const guestDarkMode = useGuestStore((s) => s.isDarkMode);
  const guestToggleDark = useGuestStore((s) => s.toggleDarkMode);
  const guestSetDark = useGuestStore((s) => s.setDarkMode);
  const guestTranslation = useGuestStore((s) => s.translationId);
  const guestSetTranslation = useGuestStore((s) => s.setTranslationId);

  const accountDarkMode = useAccountCacheStore((s) => s.isDarkMode);
  const accountToggleDark = useAccountCacheStore((s) => s.toggleDarkMode);
  const accountSetDark = useAccountCacheStore((s) => s.setDarkMode);
  const accountTranslation = useAccountCacheStore((s) => s.translationId);
  const accountSetTranslation = useAccountCacheStore((s) => s.setTranslationId);

  const isDarkMode = isAuthenticated ? accountDarkMode : guestDarkMode;
  const translationId = isAuthenticated ? accountTranslation : guestTranslation;

  const currentLanguage: AppLanguage = useMemo(() => {
    return TRANSLATION_TO_LANGUAGE[translationId.toLowerCase()] ?? 'pt';
  }, [translationId]);

  const toggleDarkMode = useCallback(() => {
    if (isAuthenticated) {
      accountToggleDark();
    } else {
      guestToggleDark();
    }
  }, [isAuthenticated, accountToggleDark, guestToggleDark]);

  const setDarkMode = useCallback(
    (isDark: boolean) => {
      if (isAuthenticated) {
        accountSetDark(isDark);
      } else {
        guestSetDark(isDark);
      }
    },
    [isAuthenticated, accountSetDark, guestSetDark],
  );

  const setTranslationId = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        accountSetTranslation(id);
      } else {
        guestSetTranslation(id);
      }
    },
    [isAuthenticated, accountSetTranslation, guestSetTranslation],
  );

  const setLanguage = useCallback(
    (lang: AppLanguage) => {
      const targetTranslation = LANGUAGE_TO_DEFAULT_TRANSLATION[lang] ?? 'almeida';
      setTranslationId(targetTranslation);
    },
    [setTranslationId],
  );

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
    translationId,
    setTranslationId,
    currentLanguage,
    setLanguage,
  };
}

