import { useQuery } from '@tanstack/react-query';
import { bibleQueryKeys } from '@/constants/bible';
import { getPassage } from '@/services/bible/bibleApi';
import { BibleApiError, Passage } from '@/types/bible';

/**
 * Busca uma passagem por referência. Desabilitado enquanto `reference` estiver vazia.
 * Texto bíblico não muda → cache infinito na sessão (busca repetida é instantânea).
 */
export function usePassage(reference: string, translationId: string) {
  const normalized = reference.trim();

  return useQuery<Passage, BibleApiError>({
    queryKey: bibleQueryKeys.passage(normalized.toLowerCase(), translationId),
    queryFn: ({ signal }) => getPassage(normalized, translationId, signal),
    enabled: normalized.length > 0,
    staleTime: Infinity,
  });
}
