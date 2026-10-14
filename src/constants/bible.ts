/**
 * Configurações da integração com https://bible-api.com
 * Docs: https://bible-api.com/ (rate limit: 15 req / 30s por IP)
 */
export const BIBLE_API_BASE_URL: string =
  process.env.EXPO_PUBLIC_BIBLE_API_URL ?? 'https://bible-api.com';

/** Tradução padrão: João Ferreira de Almeida (PT-BR, domínio público). */
export const DEFAULT_TRANSLATION_ID = 'almeida';

/** Tempo máximo de espera por requisição (ms). */
export const BIBLE_API_TIMEOUT_MS = 10_000;

/** Número máximo de tentativas automáticas para falhas transitórias. */
export const BIBLE_API_MAX_RETRIES = 2;

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** Chaves de cache do TanStack Query. */
export const bibleQueryKeys = {
  all: ['bible'] as const,
  translations: () => [...bibleQueryKeys.all, 'translations'] as const,
  randomVerse: (translationId: string) =>
    [...bibleQueryKeys.all, 'random', translationId] as const,
  passage: (reference: string, translationId: string) =>
    [...bibleQueryKeys.all, 'passage', translationId, reference] as const,
};
