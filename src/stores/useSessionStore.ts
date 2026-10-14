import { create } from 'zustand';
import { AuthResult, User } from '@/types/auth';
import {
  deleteRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from '@/services/storage/secureTokenStorage';
import { configureApiClient } from '@/services/api/apiClient';
import { authApi } from '@/services/api/authApi';

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

export const useSessionStore = create<SessionState>((set) => ({
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
}));

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
