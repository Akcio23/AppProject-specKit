import { useCallback } from 'react';
import { useSessionStore } from '@/stores/useSessionStore';
import { useGuestStore } from '@/stores/useGuestStore';
import { useAccountCacheStore } from '@/stores/useAccountCacheStore';
import { NewSavedVerse, SavedVerse } from '@/types';

/**
 * Hook de fachada para gerenciamento de versículos salvos (favoritos).
 * Alterna dinamicamente entre visitante (useGuestStore) e conta sincronizada (useAccountCacheStore)
 * garantindo isolamento total dos dados conforme SPEC 005.
 */
export function useSavedVerses() {
  const isAuthenticated = useSessionStore((s) => s.status === 'authenticated');

  const guestVerses = useGuestStore((s) => s.savedVerses);
  const guestSaveVerse = useGuestStore((s) => s.saveVerse);
  const guestRemoveVerse = useGuestStore((s) => s.removeSavedVerse);
  const guestIsVerseSaved = useGuestStore((s) => s.isVerseSaved);

  const accountVerses = useAccountCacheStore((s) => s.savedVerses);
  const accountSaveVerse = useAccountCacheStore((s) => s.saveVerse);
  const accountRemoveVerse = useAccountCacheStore((s) => s.removeSavedVerse);
  const accountIsVerseSaved = useAccountCacheStore((s) => s.isVerseSaved);

  const savedVerses = isAuthenticated ? accountVerses : guestVerses;

  const saveVerse = useCallback(
    (verse: NewSavedVerse): SavedVerse => {
      if (isAuthenticated) {
        return accountSaveVerse(verse);
      }
      return guestSaveVerse(verse);
    },
    [isAuthenticated, accountSaveVerse, guestSaveVerse],
  );

  const removeSavedVerse = useCallback(
    (idOrReference: string) => {
      if (isAuthenticated) {
        accountRemoveVerse(idOrReference);
      } else {
        guestRemoveVerse(idOrReference);
      }
    },
    [isAuthenticated, accountRemoveVerse, guestRemoveVerse],
  );

  const isVerseSaved = useCallback(
    (reference: string, translation?: string) => {
      if (isAuthenticated) {
        return accountIsVerseSaved(reference, translation);
      }
      return guestIsVerseSaved(reference, translation);
    },
    [isAuthenticated, accountIsVerseSaved, guestIsVerseSaved],
  );

  return {
    savedVerses,
    saveVerse,
    removeSavedVerse,
    isVerseSaved,
  };
}
