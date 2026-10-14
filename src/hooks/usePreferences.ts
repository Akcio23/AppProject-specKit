import { useCallback } from 'react';
import { useGuestStore } from '@/stores/useGuestStore';

/**
 * Hook de fachada para preferências do usuário (tema e tradução).
 * No MVP 1 (modo visitante), lê e grava no `useGuestStore`.
 * Nas fases seguintes, alternará dinamicamente com a conta autenticada.
 */
export function usePreferences() {
  const isDarkMode = useGuestStore((s) => s.isDarkMode);
  const toggleDarkMode = useGuestStore((s) => s.toggleDarkMode);
  const setDarkMode = useGuestStore((s) => s.setDarkMode);
  const translationId = useGuestStore((s) => s.translationId);
  const setTranslationId = useGuestStore((s) => s.setTranslationId);

  const setTranslation = useCallback(
    (id: string) => {
      setTranslationId(id);
    },
    [setTranslationId],
  );

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
    translationId,
    setTranslationId: setTranslation,
  };
}
