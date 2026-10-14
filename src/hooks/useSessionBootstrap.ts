import { useEffect } from 'react';
import { getRefreshToken, deleteRefreshToken, saveRefreshToken } from '@/services/storage/secureTokenStorage';
import { useSessionStore } from '@/stores/useSessionStore';
import { authApi } from '@/services/api/authApi';

/**
 * Hook de inicialização de sessão. Executado no topo da árvore de componentes (App.tsx).
 * Tenta restaurar a sessão do usuário de forma transparente.
 */
export function useSessionBootstrap() {
  const status = useSessionStore((s) => s.status);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        if (isMounted) {
          useSessionStore.setState({ status: 'guest' });
        }
        return;
      }

      try {
        const tokens = await authApi.refresh(refreshToken);
        await saveRefreshToken(tokens.refreshToken);

        if (isMounted) {
          useSessionStore.setState({
            accessToken: tokens.accessToken,
            status: 'authenticated',
          });
        }
      } catch (error: unknown) {
        // Se for erro de rede, mantém a sessão se já tiver dados em cache
        // Se for erro de autenticação (401), invalida o token
        const isNetworkError =
          error && typeof error === 'object' && 'code' in error && error.code === 'NETWORK_ERROR';

        if (!isNetworkError) {
          await deleteRefreshToken();
          if (isMounted) {
            useSessionStore.setState({ status: 'guest' });
          }
        } else {
          // Em caso de falha de conexão na abertura, entra como autenticado offline se havia token
          if (isMounted) {
            useSessionStore.setState({ status: 'authenticated' });
          }
        }
      }
    }

    if (status === 'booting') {
      void bootstrap();
    }

    return () => {
      isMounted = false;
    };
  }, [status]);
}
