import { useState, useCallback } from 'react';
import { useSessionStore } from '@/stores/useSessionStore';
import { usersApi } from '@/services/api/usersApi';
import { User } from '@/types/auth';

export function useCurrentUser() {
  const user = useSessionStore((s) => s.user);
  const setUser = useSessionStore((s) => s.setUser);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateName = useCallback(
    async (newName: string): Promise<User | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await usersApi.updateProfile(newName);
        setUser(updated);
        return updated;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Falha ao atualizar nome.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser],
  );

  const uploadPhoto = useCallback(
    async (fileUri: string, mimeType?: string): Promise<User | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await usersApi.uploadPhoto(fileUri, mimeType);
        setUser(updated);
        return updated;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Falha ao enviar foto.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser],
  );

  const deletePhoto = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await usersApi.deletePhoto();
      setUser(updated);
      return updated;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao remover foto.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const refreshProfile = useCallback(async (): Promise<User | null> => {
    try {
      const fresh = await usersApi.getProfile();
      setUser(fresh);
      return fresh;
    } catch {
      return null;
    }
  }, [setUser]);

  const deleteAccount = useCallback(async (password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await usersApi.deleteAccount(password);
      await useSessionStore.getState().signOut('Sua conta foi excluída com sucesso.');
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir conta.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    updateName,
    uploadPhoto,
    deletePhoto,
    refreshProfile,
    deleteAccount,
  };
}
