import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'biblia_refresh_token';

/**
 * Armazena o refresh token no SecureStore (Keychain no iOS / Keystore criptografado no Android).
 * Atende ao Princípio V da Constituição (nunca salvar credenciais em texto puro).
 */
export async function saveRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.warn('[SecureStore] Erro ao salvar refresh token:', error);
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.warn('[SecureStore] Erro ao obter refresh token:', error);
    return null;
  }
}

export async function deleteRefreshToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.warn('[SecureStore] Erro ao remover refresh token:', error);
  }
}
