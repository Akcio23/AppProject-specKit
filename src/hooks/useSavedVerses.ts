import { useCallback } from 'react';
import { useGuestStore } from '@/stores/useGuestStore';
import { NewSavedVerse, SavedVerse } from '@/types';

/**
 * Hook de fachada para gerenciamento de versículos salvos (favoritos).
 * No MVP 1 (modo visitante), lê e persiste os dados localmente no aparelho.
 * Nas fases seguintes, alternará dinamicamente entre visitante e conta sincronizada.
 */
export function useSavedVerses() {
  const savedVerses = useGuestStore((s) => s.savedVerses);
  const saveVerseAction = useGuestStore((s) => s.saveVerse);
  const removeSavedVerseAction = useGuestStore((s) => s.removeSavedVerse);
  const isVerseSavedAction = useGuestStore((s) => s.isVerseSaved);

  const saveVerse = useCallback(
    (verse: NewSavedVerse): SavedVerse => {
      return saveVerseAction(verse);
    },
    [saveVerseAction],
  );

  const removeSavedVerse = useCallback(
    (idOrReference: string) => {
      removeSavedVerseAction(idOrReference);
    },
    [removeSavedVerseAction],
  );

  const isVerseSaved = useCallback(
    (reference: string, translation?: string) => {
      return isVerseSavedAction(reference, translation);
    },
    [isVerseSavedAction],
  );

  return {
    savedVerses,
    saveVerse,
    removeSavedVerse,
    isVerseSaved,
    savedCount: savedVerses.length,
  };
}
