import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

/**
 * Cria um adaptador StateStorage para o Zustand persist com prefixo de namespace.
 * Isso garante que dados de visitante (ex: "guest-data") fiquem totalmente isolados
 * de caches de usuários autenticados (ex: "account-cache:UUID").
 */
export function createNamespacedStorage(namespace: string): StateStorage {
  const prefix = `@biblia:${namespace}:`;

  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        return await AsyncStorage.getItem(`${prefix}${name}`);
      } catch (error) {
        console.warn(`[storage] Erro ao ler "${prefix}${name}":`, error);
        return null;
      }
    },
    setItem: async (name: string, value: string): Promise<void> => {
      try {
        await AsyncStorage.setItem(`${prefix}${name}`, value);
      } catch (error) {
        console.warn(`[storage] Erro ao gravar "${prefix}${name}":`, error);
      }
    },
    removeItem: async (name: string): Promise<void> => {
      try {
        await AsyncStorage.removeItem(`${prefix}${name}`);
      } catch (error) {
        console.warn(`[storage] Erro ao remover "${prefix}${name}":`, error);
      }
    },
  };
}

/** Storage padrão para dados do modo visitante (Q1 = B). */
export const guestStorage = createNamespacedStorage('guest-data');
