import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import { AppState, NewSavedVerse, SavedVerse } from '@/types';

export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: true,
  savedVerses: [],
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  saveVerse: (verse: NewSavedVerse) => {
    const exists = get().savedVerses.some((v) => v.reference === verse.reference);
    if (!exists) {
      const newEntry: SavedVerse = {
        ...verse,
        id: Crypto.randomUUID(),
        savedAt: new Date().toISOString(),
      };
      set((state) => ({ savedVerses: [newEntry, ...state.savedVerses] }));
    }
  },
  removeSavedVerse: (idOrReference: string) => {
    set((state) => ({
      savedVerses: state.savedVerses.filter(
        (v) => v.id !== idOrReference && v.reference !== idOrReference,
      ),
    }));
  },
  isVerseSaved: (reference: string) => {
    return get().savedVerses.some((v) => v.reference === reference);
  },
}));
