import { useQuery } from '@tanstack/react-query';
import { bibleQueryKeys } from '@/constants/bible';
import { getRandomVerse } from '@/services/bible/bibleApi';
import { BibleApiError, RandomVerse } from '@/types/bible';

/**
 * Versículo aleatório da tradução informada.
 * Não fica "stale" sozinho: um novo versículo só é buscado via `refetch()`
 * (botão "Outro versículo"), protegendo o rate limit da API.
 */
export function useRandomVerse(translationId: string) {
  return useQuery<RandomVerse, BibleApiError>({
    queryKey: bibleQueryKeys.randomVerse(translationId),
    queryFn: ({ signal }) => getRandomVerse(translationId, { signal }),
    staleTime: Infinity,
  });
}
