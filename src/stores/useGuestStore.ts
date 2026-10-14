import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Crypto from 'expo-crypto';
import { guestStorage } from '@/services/storage/asyncStorage';
import { DEFAULT_TRANSLATION_ID } from '@/constants/bible';
import { NewSavedVerse, SavedVerse } from '@/types';

export interface GuestState {
  isDarkMode: boolean;
  translationId: string;
  savedVerses: SavedVerse[];

  // Ações de tema e tradução
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  setTranslationId: (translationId: string) => void;

  // Ações de versículos salvos
  saveVerse: (verse: NewSavedVerse) => SavedVerse;
  removeSavedVerse: (idOrReference: string) => void;
  isVerseSaved: (reference: string, translation?: string) => boolean;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set, get) => ({
      isDarkMode: true,
      translationId: DEFAULT_TRANSLATION_ID,
      savedVerses: [],

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (isDarkMode) => set({ isDarkMode }),
      setTranslationId: (translationId) => set({ translationId }),

      saveVerse: (verse) => {
        const current = get().savedVerses;
        // Evita duplicar mesma referência + mesma tradução
        const existing = current.find(
          (v) =>
            v.reference.toLowerCase().trim() === verse.reference.toLowerCase().trim() &&
            (!verse.translation || v.translation.toLowerCase() === verse.translation.toLowerCase()),
        );

        if (existing) {
          return existing;
        }

        const newEntry: SavedVerse = {
          ...verse,
          id: Crypto.randomUUID(),
          savedAt: new Date().toISOString(),
        };

        set({ savedVerses: [newEntry, ...current] });
        return newEntry;
      },

      removeSavedVerse: (idOrReference) => {
        set((state) => ({
          savedVerses: state.savedVerses.filter(
            (v) => v.id !== idOrReference && v.reference !== idOrReference,
          ),
        }));
      },

      isVerseSaved: (reference, translation) => {
        const refNormalized = reference.toLowerCase().trim();
        return get().savedVerses.some((v) => {
          const matchRef = v.reference.toLowerCase().trim() === refNormalized;
          if (!matchRef) return false;
          if (!translation) return true;
          return v.translation.toLowerCase() === translation.toLowerCase();
        });
      },
    }),
    {
      name: 'preferences',
      storage: createJSONStorage(() => guestStorage),
    },
  ),
);
