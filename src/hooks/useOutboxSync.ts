import { useEffect, useRef, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useSessionStore } from '@/stores/useSessionStore';
import { useAccountCacheStore } from '@/stores/useAccountCacheStore';
import { accountApi } from '@/services/api/accountApi';

export function useOutboxSync() {
  const status = useSessionStore((s) => s.status);
  const user = useSessionStore((s) => s.user);

  const userId = useAccountCacheStore((s) => s.userId);
  const outbox = useAccountCacheStore((s) => s.outbox);
  const isSyncing = useAccountCacheStore((s) => s.isSyncing);

  const initUserCache = useAccountCacheStore((s) => s.initUserCache);
  const clearUserCache = useAccountCacheStore((s) => s.clearUserCache);
  const setSyncing = useAccountCacheStore((s) => s.setSyncing);
  const dequeueAction = useAccountCacheStore((s) => s.dequeueAction);
  const replaceVerseId = useAccountCacheStore((s) => s.replaceVerseId);
  const incrementAttempts = useAccountCacheStore((s) => s.incrementAttempts);
  const setPreferencesFromRemote = useAccountCacheStore((s) => s.setPreferencesFromRemote);
  const setSavedVersesFromRemote = useAccountCacheStore((s) => s.setSavedVersesFromRemote);

  const syncingRef = useRef<boolean>(false);

  // Inicializa ou limpa o cache conforme a sessão
  useEffect(() => {
    if (status === 'authenticated' && user) {
      if (userId !== user.id) {
        initUserCache(user.id);
      }
    } else if (status === 'guest') {
      clearUserCache();
    }
  }, [status, user, userId, initUserCache, clearUserCache]);

  const processOutboxAndPull = useCallback(async () => {
    if (status !== 'authenticated' || !user || syncingRef.current) {
      return;
    }

    const netState = await NetInfo.fetch();
    if (netState.isConnected === false) {
      return;
    }

    syncingRef.current = true;
    setSyncing(true);

    try {
      // 1. Processar itens pendentes na fila Outbox
      const currentOutbox = useAccountCacheStore.getState().outbox;
      for (const action of currentOutbox) {
        try {
          if (action.type === 'save_verse') {
            const p = action.payload as {
              id: string;
              reference: string;
              text: string;
              translation: string;
              savedAt: string;
            };
            const result = await accountApi.saveVerse(p.id, {
              reference: p.reference,
              text: p.text,
              translation: p.translation,
              savedAt: p.savedAt,
            });

            // Se o servidor retornou um id existente diferente, atualiza no cache local
            if (result.id && result.id !== p.id) {
              replaceVerseId(p.id, result.id);
            }
            dequeueAction(action.id);
          } else if (action.type === 'delete_verse') {
            const p = action.payload as { id: string };
            await accountApi.deleteSavedVerse(p.id);
            dequeueAction(action.id);
          } else if (action.type === 'update_preferences') {
            const p = action.payload as { theme?: 'dark' | 'light'; translationId?: string };
            await accountApi.updatePreferences(p);
            dequeueAction(action.id);
          }
        } catch (err: unknown) {
          const isBadRequest =
            err && typeof err === 'object' && 'statusCode' in err && (err as { statusCode: number }).statusCode === 400;

          if (isBadRequest || action.attempts >= 4) {
            dequeueAction(action.id);
          } else {
            incrementAttempts(action.id);
            break;
          }
        }
      }

      // 2. Puxar dados atualizados do servidor (Pull)
      const [remotePrefs, remoteVerses] = await Promise.all([
        accountApi.getPreferences().catch(() => null),
        accountApi.getSavedVerses().catch(() => null),
      ]);

      if (remotePrefs) {
        setPreferencesFromRemote(remotePrefs.theme, remotePrefs.translationId);
      }

      if (remoteVerses && Array.isArray(remoteVerses.items)) {
        setSavedVersesFromRemote(remoteVerses.items);
      }
    } catch {
      // Erro geral de sincronização silencioso
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, [
    status,
    user,
    setSyncing,
    dequeueAction,
    replaceVerseId,
    incrementAttempts,
    setPreferencesFromRemote,
    setSavedVersesFromRemote,
  ]);

  // Listener para sincronização automática ao mudar status ou quando novos itens entram na outbox
  useEffect(() => {
    if (status === 'authenticated') {
      void processOutboxAndPull();
    }
  }, [status, outbox.length, processOutboxAndPull]);

  // Listener para quando a conexão de rede for restabelecida
  useEffect(() => {
    if (status !== 'authenticated') return;

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        void processOutboxAndPull();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [status, processOutboxAndPull]);

  return {
    isSyncing,
    outboxCount: outbox.length,
    syncNow: processOutboxAndPull,
  };
}
