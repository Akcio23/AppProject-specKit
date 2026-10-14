/* ------------------------------------------------------------------ */
/* Contratos crus da API bible-api.com (snake_case, como no payload)  */
/* ------------------------------------------------------------------ */

export interface RawPassageVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

/** GET /{reference}?translation={id} */
export interface RawPassageResponse {
  reference: string;
  verses: RawPassageVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

export interface RawTranslation {
  identifier: string;
  name: string;
  language: string;
  language_code: string;
  license: string;
}

export interface RawRandomVerse {
  book_id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

/** GET /data/{id}/random */
export interface RawRandomVerseResponse {
  translation: RawTranslation;
  random_verse: RawRandomVerse;
}

/** GET /data */
export interface RawTranslationsResponse {
  translations: RawTranslation[];
}

/* ------------------------------------------------------------------ */
/* Modelos de domínio (usados pela UI)                                */
/* ------------------------------------------------------------------ */

export interface Translation {
  id: string;
  name: string;
  language: string;
  license: string;
}

export interface Verse {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Passage {
  reference: string;
  verses: Verse[];
  text: string;
  translationId: string;
  translationName: string;
}

export interface RandomVerse {
  reference: string;
  verse: Verse;
  translationId: string;
  translationName: string;
}

/* ------------------------------------------------------------------ */
/* Erros                                                              */
/* ------------------------------------------------------------------ */

export type BibleApiErrorCode =
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'SERVER'
  | 'INVALID_RESPONSE';

export class BibleApiError extends Error {
  readonly code: BibleApiErrorCode;
  readonly status?: number;

  constructor(code: BibleApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'BibleApiError';
    this.code = code;
    this.status = status;
  }
}

/* ------------------------------------------------------------------ */
/* Client state                                                       */
/* ------------------------------------------------------------------ */

export interface BibleState {
  translationId: string;
  setTranslationId: (translationId: string) => void;
}
