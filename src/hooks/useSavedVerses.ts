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

  const accountVerses = useAccountCacheStore((s) => s.savedVerses);
  const accountSaveVerse = useAccountCacheStore((s) => s.saveVerse);
  const accountRemoveVerse = useAccountCacheStore((s) => s.removeSavedVerse);

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
      const normRef = reference.toLowerCase().trim();
      const normTrans = translation?.toLowerCase().trim();
      return savedVerses.some((v) => {
        const matchRef = v.reference.toLowerCase().trim() === normRef;
        if (!matchRef) return false;
        if (!normTrans) return true;
        return v.translation.toLowerCase().trim() === normTrans;
      });
    },
    [savedVerses],
  );

  return {
    savedVerses,
    saveVerse,
    removeSavedVerse,
    isVerseSaved,
  };
}
