import { useQuery } from '@tanstack/react-query';
import { bibleQueryKeys, ONE_DAY_MS } from '@/constants/bible';
import { getTranslations } from '@/services/bible/bibleApi';
import { BibleApiError, Translation } from '@/types/bible';

/** Lista de traduções disponíveis (muda raramente → cache de 24h). */
export function useTranslations() {
  return useQuery<Translation[], BibleApiError>({
    queryKey: bibleQueryKeys.translations(),
    queryFn: ({ signal }) => getTranslations(signal),
    staleTime: ONE_DAY_MS,
    gcTime: ONE_DAY_MS,
  });
}
