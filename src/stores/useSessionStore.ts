import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResult, User } from '@/types/auth';
import {
  deleteRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from '@/services/storage/secureTokenStorage';
import { configureApiClient } from '@/services/api/apiClient';
import { authApi } from '@/services/api/authApi';
import { useAccountCacheStore } from './useAccountCacheStore';
import { accountApi } from '@/services/api/accountApi';

export type SessionStatus = 'booting' | 'guest' | 'authenticated';

export interface SessionState {
  status: SessionStatus;
  user: User | null;
  accessToken: string | null;
  revocationMessage: string | null;

  // Ações
  signIn: (result: AuthResult) => Promise<void>;
  signOut: (reason?: string) => Promise<void>;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User) => void;
  clearRevocationMessage: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      status: 'booting',
      user: null,
      accessToken: null,
      revocationMessage: null,

      signIn: async (result) => {
        await saveRefreshToken(result.refreshToken);
        set({
          status: 'authenticated',
          user: result.user,
          accessToken: result.accessToken,
          revocationMessage: null,
        });
      },

      signOut: async (reason) => {
        // Tenta enviar qualquer item pendente na outbox antes de revogar a sessão
        try {
          const outbox = useAccountCacheStore.getState().outbox;
          for (const action of outbox) {
            if (action.type === 'save_verse') {
              const p = action.payload as {
                id: string;
                reference: string;
                text: string;
                translation: string;
                savedAt: string;
              };
              await accountApi.saveVerse(p.id, {
                reference: p.reference,
                text: p.text,
                translation: p.translation,
                savedAt: p.savedAt,
              });
              useAccountCacheStore.getState().dequeueAction(action.id);
            } else if (action.type === 'delete_verse') {
              const p = action.payload as { id: string };
              await accountApi.deleteSavedVerse(p.id);
              useAccountCacheStore.getState().dequeueAction(action.id);
            }
          }
        } catch {
          // Ignora falhas de rede no logout
        }

        const token = await getRefreshToken();
        if (token) {
          try {
            await authApi.logout(token);
          } catch {
            // Ignora erro de rede no logout
          }
        }
        await deleteRefreshToken();

        set({
          status: 'guest',
          user: null,
          accessToken: null,
          revocationMessage: reason ?? null,
        });
      },

      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      clearRevocationMessage: () => set({ revocationMessage: null }),
    }),
    {
      name: '@biblia:session-user',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

// Conecta o apiClient aos métodos da store para auto-refresh e injeção de token
configureApiClient({
  getToken: () => useSessionStore.getState().accessToken,
  refreshToken: async () => {
    const currentRefresh = await getRefreshToken();
    if (!currentRefresh) return null;

    try {
      const tokens = await authApi.refresh(currentRefresh);
      await saveRefreshToken(tokens.refreshToken);
      useSessionStore.getState().setAccessToken(tokens.accessToken);
      return tokens.accessToken;
    } catch {
      await deleteRefreshToken();
      useSessionStore.getState().signOut('Sua sessão foi encerrada em outro aparelho.');
      return null;
    }
  },
  onRevoked: (reason) => {
    void useSessionStore.getState().signOut(reason);
  },
});
