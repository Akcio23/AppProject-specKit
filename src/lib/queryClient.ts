import { QueryClient } from '@tanstack/react-query';
import { BIBLE_API_MAX_RETRIES } from '@/constants/bible';
import { BibleApiError } from '@/types/bible';

/** Só re-tenta falhas transitórias; 404 e 429 nunca (economiza o rate limit). */
const shouldRetry = (failureCount: number, error: Error): boolean => {
  if (error instanceof BibleApiError) {
    const transient = error.code === 'NETWORK' || error.code === 'TIMEOUT' || error.code === 'SERVER';
    return transient && failureCount < BIBLE_API_MAX_RETRIES;
  }
  return false;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
