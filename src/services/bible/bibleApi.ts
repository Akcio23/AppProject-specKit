import { BIBLE_API_BASE_URL, BIBLE_API_TIMEOUT_MS } from '@/constants/bible';
import { getJson } from '@/services/http/httpClient';
import {
  BibleApiError,
  Passage,
  RandomVerse,
  RawPassageResponse,
  RawPassageVerse,
  RawRandomVerse,
  RawRandomVerseResponse,
  RawTranslation,
  RawTranslationsResponse,
  Translation,
} from '@/types/bible';

/* ------------------------------------------------------------------ */
/* Type guards (validação em runtime do payload, sem `any`)           */
/* ------------------------------------------------------------------ */

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number';

const isRawPassageVerse = (v: unknown): v is RawPassageVerse =>
  isRecord(v) &&
  isString(v.book_id) &&
  isString(v.book_name) &&
  isNumber(v.chapter) &&
  isNumber(v.verse) &&
  isString(v.text);

const isRawPassageResponse = (v: unknown): v is RawPassageResponse =>
  isRecord(v) &&
  isString(v.reference) &&
  Array.isArray(v.verses) &&
  v.verses.every(isRawPassageVerse) &&
  isString(v.text) &&
  isString(v.translation_id) &&
  isString(v.translation_name);

const isRawTranslation = (v: unknown): v is RawTranslation =>
  isRecord(v) &&
  isString(v.identifier) &&
  isString(v.name) &&
  isString(v.language) &&
  isString(v.license);

const isRawRandomVerse = (v: unknown): v is RawRandomVerse =>
  isRecord(v) &&
  isString(v.book_id) &&
  isString(v.book) &&
  isNumber(v.chapter) &&
  isNumber(v.verse) &&
  isString(v.text);

const isRawRandomVerseResponse = (v: unknown): v is RawRandomVerseResponse =>
  isRecord(v) && isRawTranslation(v.translation) && isRawRandomVerse(v.random_verse);

const isRawTranslationsResponse = (v: unknown): v is RawTranslationsResponse =>
  isRecord(v) && Array.isArray(v.translations) && v.translations.every(isRawTranslation);

const invalidResponse = (): BibleApiError =>
  new BibleApiError('INVALID_RESPONSE', 'Resposta inesperada do serviço da Bíblia.');

/* ------------------------------------------------------------------ */
/* Mappers Raw → Domínio                                              */
/* ------------------------------------------------------------------ */

/** A API devolve textos com espaços/quebras extras (inclusive NBSP) — normaliza. */
const cleanText = (text: string): string => text.replace(/\s+/g, ' ').trim();

const toTranslation = (raw: RawTranslation): Translation => ({
  id: raw.identifier,
  name: raw.name,
  language: raw.language,
  license: raw.license,
});

const toPassage = (raw: RawPassageResponse): Passage => ({
  reference: raw.reference,
  verses: raw.verses.map((v) => ({
    bookId: v.book_id,
    bookName: v.book_name,
    chapter: v.chapter,
    verse: v.verse,
    text: cleanText(v.text),
  })),
  text: cleanText(raw.text),
  translationId: raw.translation_id,
  translationName: raw.translation_name,
});

const toRandomVerse = (raw: RawRandomVerseResponse): RandomVerse => {
  const v = raw.random_verse;
  return {
    reference: `${v.book} ${v.chapter}:${v.verse}`,
    verse: {
      bookId: v.book_id,
      bookName: v.book,
      chapter: v.chapter,
      verse: v.verse,
      text: cleanText(v.text),
    },
    translationId: raw.translation.identifier,
    translationName: raw.translation.name,
  };
};

/* ------------------------------------------------------------------ */
/* Endpoints públicos                                                 */
/* ------------------------------------------------------------------ */

const buildUrl = (path: string, query?: Record<string, string>): string => {
  const qs = query
    ? `?${Object.entries(query)
        .map(([k, val]) => `${encodeURIComponent(k)}=${encodeURIComponent(val)}`)
        .join('&')}`
    : '';
  return `${BIBLE_API_BASE_URL}${path}${qs}`;
};

/**
 * Busca uma passagem por referência em texto livre.
 * Ex.: "João 3:16", "Salmos 23", "Mateus 25:31-33,46".
 */
export async function getPassage(
  reference: string,
  translationId: string,
  signal?: AbortSignal,
): Promise<Passage> {
  const normalized = reference.trim();
  if (normalized.length === 0) {
    throw new BibleApiError('NOT_FOUND', 'Informe uma referência para buscar.');
  }

  const data = await getJson(
    buildUrl(`/${encodeURIComponent(normalized)}`, { translation: translationId }),
    { timeoutMs: BIBLE_API_TIMEOUT_MS, signal },
  );
  if (!isRawPassageResponse(data)) throw invalidResponse();
  if (data.verses.length === 0) {
    throw new BibleApiError('NOT_FOUND', 'Referência não encontrada.');
  }
  return toPassage(data);
}

/** Versículo aleatório. `bookIds` aceita IDs ("JHN,MAT") ou "OT"/"NT". */
export async function getRandomVerse(
  translationId: string,
  options?: { bookIds?: string; signal?: AbortSignal },
): Promise<RandomVerse> {
  const suffix = options?.bookIds ? `/${encodeURIComponent(options.bookIds)}` : '';
  const data = await getJson(
    buildUrl(`/data/${encodeURIComponent(translationId)}/random${suffix}`),
    { timeoutMs: BIBLE_API_TIMEOUT_MS, signal: options?.signal },
  );
  if (!isRawRandomVerseResponse(data)) throw invalidResponse();
  return toRandomVerse(data);
}

/** Lista as traduções disponíveis no serviço. */
export async function getTranslations(signal?: AbortSignal): Promise<Translation[]> {
  const data = await getJson(buildUrl('/data'), { timeoutMs: BIBLE_API_TIMEOUT_MS, signal });
  if (!isRawTranslationsResponse(data)) throw invalidResponse();
  return data.translations.map(toTranslation);
}

export const bibleApi = { getPassage, getRandomVerse, getTranslations };
