import { create } from 'zustand';
import { AppState, SavedVerse } from '@/types';

export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: true,
  savedVerses: [],
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  saveVerse: (verse: Omit<SavedVerse, 'savedAt'>) => {
    const exists = get().savedVerses.some((v) => v.reference === verse.reference);
    if (!exists) {
      const newEntry: SavedVerse = {
        ...verse,
        savedAt: new Date().toISOString(),
      };
      set((state) => ({ savedVerses: [newEntry, ...state.savedVerses] }));
    }
  },
  removeSavedVerse: (reference: string) => {
    set((state) => ({
      savedVerses: state.savedVerses.filter((v) => v.reference !== reference),
    }));
  },
  isVerseSaved: (reference: string) => {
    return get().savedVerses.some((v) => v.reference === reference);
  },
}));
