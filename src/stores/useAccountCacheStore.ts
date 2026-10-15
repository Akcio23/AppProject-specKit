import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_TRANSLATION_ID } from '@/constants/bible';
import { NewSavedVerse, SavedVerse } from '@/types';
import { Preferences } from '@/types/auth';

export type OutboxActionType = 'save_verse' | 'delete_verse' | 'update_preferences';

export interface OutboxAction {
  id: string;
  type: OutboxActionType;
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
}

export interface AccountCacheState {
  userId: string | null;
  isDarkMode: boolean;
  translationId: string;
  savedVerses: SavedVerse[];
  outbox: OutboxAction[];
  isSyncing: boolean;

  // Ações de gerenciamento de cache
  initUserCache: (userId: string, initialPreferences?: Preferences | null) => void;
  clearUserCache: () => void;
  setSyncing: (isSyncing: boolean) => void;

  // Ações de tema e tradução
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  setTranslationId: (translationId: string) => void;
  setPreferencesFromRemote: (theme: string, translationId: string) => void;

  // Ações de versículos salvos
  saveVerse: (verse: NewSavedVerse) => SavedVerse;
  removeSavedVerse: (idOrReference: string) => void;
  replaceVerseId: (oldId: string, newId: string) => void;
  isVerseSaved: (reference: string, translation?: string) => boolean;
  setSavedVersesFromRemote: (items: SavedVerse[]) => void;

  // Ações da fila outbox
  enqueueAction: (type: OutboxActionType, payload: Record<string, unknown>) => void;
  dequeueAction: (actionId: string) => void;
  incrementAttempts: (actionId: string) => void;
}

export const useAccountCacheStore = create<AccountCacheState>()(
  persist(
    (set, get) => ({
      userId: null,
      isDarkMode: true,
      translationId: DEFAULT_TRANSLATION_ID,
      savedVerses: [],
      outbox: [],
      isSyncing: false,

      initUserCache: (userId, initialPreferences) => {
        const currentUserId = get().userId;
        if (currentUserId !== userId) {
          // Se for um novo usuário logando, limpa os dados do anterior
          set({
            userId,
            isDarkMode: initialPreferences?.theme === 'light' ? false : true,
            translationId: initialPreferences?.translationId ?? DEFAULT_TRANSLATION_ID,
            savedVerses: [],
            outbox: [],
            isSyncing: false,
          });
        } else if (initialPreferences) {
          set({
            isDarkMode: initialPreferences.theme === 'light' ? false : true,
            translationId: initialPreferences.translationId,
          });
        }
      },

      clearUserCache: () => {
        set({
          userId: null,
          isDarkMode: true,
          translationId: DEFAULT_TRANSLATION_ID,
          savedVerses: [],
          outbox: [],
          isSyncing: false,
        });
      },

      setSyncing: (isSyncing) => set({ isSyncing }),

      toggleDarkMode: () => {
        const nextDark = !get().isDarkMode;
        set({ isDarkMode: nextDark });
        get().enqueueAction('update_preferences', {
          theme: nextDark ? 'dark' : 'light',
          translationId: get().translationId,
        });
      },

      setDarkMode: (isDarkMode) => {
        set({ isDarkMode });
        get().enqueueAction('update_preferences', {
          theme: isDarkMode ? 'dark' : 'light',
          translationId: get().translationId,
        });
      },

      setTranslationId: (translationId) => {
        set({ translationId });
        get().enqueueAction('update_preferences', {
          theme: get().isDarkMode ? 'dark' : 'light',
          translationId,
        });
      },

      setPreferencesFromRemote: (theme, translationId) => {
        set({
          isDarkMode: theme === 'light' ? false : true,
          translationId: translationId || DEFAULT_TRANSLATION_ID,
        });
      },

      saveVerse: (verse) => {
        const current = get().savedVerses;
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

        // Enfileira sincronização para a nuvem
        get().enqueueAction('save_verse', {
          id: newEntry.id,
          reference: newEntry.reference,
          text: newEntry.text,
          translation: newEntry.translation,
          savedAt: newEntry.savedAt,
        });

        return newEntry;
      },

      removeSavedVerse: (idOrReference) => {
        const current = get().savedVerses;
        const target = current.find(
          (v) => v.id === idOrReference || v.reference.toLowerCase().trim() === idOrReference.toLowerCase().trim(),
        );

        set({
          savedVerses: current.filter(
            (v) => v.id !== idOrReference && v.reference.toLowerCase().trim() !== idOrReference.toLowerCase().trim(),
          ),
        });

        if (target) {
          get().enqueueAction('delete_verse', { id: target.id });
        }
      },

      replaceVerseId: (oldId, newId) => {
        set((state) => ({
          savedVerses: state.savedVerses.map((v) => (v.id === oldId ? { ...v, id: newId } : v)),
        }));
      },

      isVerseSaved: (reference, translation) => {
        const normRef = reference.toLowerCase().trim();
        const normTrans = translation?.toLowerCase().trim();
        return get().savedVerses.some((v) => {
          const matchRef = v.reference.toLowerCase().trim() === normRef;
          if (!matchRef) return false;
          if (!normTrans) return true;
          return v.translation.toLowerCase().trim() === normTrans;
        });
      },

      setSavedVersesFromRemote: (items) => {
        set({ savedVerses: items });
      },

      enqueueAction: (type, payload) => {
        const action: OutboxAction = {
          id: Crypto.randomUUID(),
          type,
          payload,
          createdAt: new Date().toISOString(),
          attempts: 0,
        };

        set((state) => ({
          outbox: [...state.outbox, action],
        }));
      },

      dequeueAction: (actionId) => {
        set((state) => ({
          outbox: state.outbox.filter((a) => a.id !== actionId),
        }));
      },

      incrementAttempts: (actionId) => {
        set((state) => ({
          outbox: state.outbox.map((a) => (a.id === actionId ? { ...a, attempts: a.attempts + 1 } : a)),
        }));
      },
    }),
    {
      name: '@biblia:account-cache',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userId: state.userId,
        isDarkMode: state.isDarkMode,
        translationId: state.translationId,
        savedVerses: state.savedVerses,
        outbox: state.outbox,
      }),
    },
  ),
);
