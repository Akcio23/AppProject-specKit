export type Testament = 'ALL' | 'OT' | 'NT';

export interface BibleBook {
  id: string;
  name: string;
  testament: 'OT' | 'NT';
  order: number;
}

/**
 * Lista canônica dos 66 livros da Bíblia na tradução João Ferreira de Almeida (PT-BR).
 * 39 no Antigo Testamento (OT) e 27 no Novo Testamento (NT).
 */
export const BIBLE_BOOKS_PT: BibleBook[] = [
  { id: "GEN", name: "Gênesis", testament: "OT", order: 1 },
  { id: "EXO", name: "Êxodo", testament: "OT", order: 2 },
  { id: "LEV", name: "Levítico", testament: "OT", order: 3 },
  { id: "NUM", name: "Números", testament: "OT", order: 4 },
  { id: "DEU", name: "Deuteronômio", testament: "OT", order: 5 },
  { id: "JOS", name: "Josué", testament: "OT", order: 6 },
  { id: "JDG", name: "Juízes", testament: "OT", order: 7 },
  { id: "RUT", name: "Rute", testament: "OT", order: 8 },
  { id: "1SA", name: "1 Samuel", testament: "OT", order: 9 },
  { id: "2SA", name: "2 Samuel", testament: "OT", order: 10 },
  { id: "1KI", name: "1 Reis", testament: "OT", order: 11 },
  { id: "2KI", name: "2 Reis", testament: "OT", order: 12 },
  { id: "1CH", name: "1 Crônicas", testament: "OT", order: 13 },
  { id: "2CH", name: "2 Crônicas", testament: "OT", order: 14 },
  { id: "EZR", name: "Esdras", testament: "OT", order: 15 },
  { id: "NEH", name: "Neemias", testament: "OT", order: 16 },
  { id: "EST", name: "Ester", testament: "OT", order: 17 },
  { id: "JOB", name: "Jó", testament: "OT", order: 18 },
  { id: "PSA", name: "Salmos", testament: "OT", order: 19 },
  { id: "PRO", name: "Provérbios", testament: "OT", order: 20 },
  { id: "ECC", name: "Eclesiastes", testament: "OT", order: 21 },
  { id: "SNG", name: "Cânticos", testament: "OT", order: 22 },
  { id: "ISA", name: "Isaías", testament: "OT", order: 23 },
  { id: "JER", name: "Jeremias", testament: "OT", order: 24 },
  { id: "LAM", name: "Lamentações", testament: "OT", order: 25 },
  { id: "EZK", name: "Ezequiel", testament: "OT", order: 26 },
  { id: "DAN", name: "Daniel", testament: "OT", order: 27 },
  { id: "HOS", name: "Oséias", testament: "OT", order: 28 },
  { id: "JOL", name: "Joel", testament: "OT", order: 29 },
  { id: "AMO", name: "Amós", testament: "OT", order: 30 },
  { id: "OBA", name: "Obadias", testament: "OT", order: 31 },
  { id: "JON", name: "Jonas", testament: "OT", order: 32 },
  { id: "MIC", name: "Miquéias", testament: "OT", order: 33 },
  { id: "NAM", name: "Naum", testament: "OT", order: 34 },
  { id: "HAB", name: "Habacuque", testament: "OT", order: 35 },
  { id: "ZEP", name: "Sofonias", testament: "OT", order: 36 },
  { id: "HAG", name: "Ageu", testament: "OT", order: 37 },
  { id: "ZEC", name: "Zacarias", testament: "OT", order: 38 },
  { id: "MAL", name: "Malaquias", testament: "OT", order: 39 },
  { id: "MAT", name: "Mateus", testament: "NT", order: 40 },
  { id: "MRK", name: "Marcos", testament: "NT", order: 41 },
  { id: "LUK", name: "Lucas", testament: "NT", order: 42 },
  { id: "JHN", name: "João", testament: "NT", order: 43 },
  { id: "ACT", name: "Atos", testament: "NT", order: 44 },
  { id: "ROM", name: "Romanos", testament: "NT", order: 45 },
  { id: "1CO", name: "1 Coríntios", testament: "NT", order: 46 },
  { id: "2CO", name: "2 Coríntios", testament: "NT", order: 47 },
  { id: "GAL", name: "Gálatas", testament: "NT", order: 48 },
  { id: "EPH", name: "Efésios", testament: "NT", order: 49 },
  { id: "PHP", name: "Filipenses", testament: "NT", order: 50 },
  { id: "COL", name: "Colossenses", testament: "NT", order: 51 },
  { id: "1TH", name: "1 Tessalonicenses", testament: "NT", order: 52 },
  { id: "2TH", name: "2 Tessalonicenses", testament: "NT", order: 53 },
  { id: "1TI", name: "1 Timóteo", testament: "NT", order: 54 },
  { id: "2TI", name: "2 Timóteo", testament: "NT", order: 55 },
  { id: "TIT", name: "Tito", testament: "NT", order: 56 },
  { id: "PHM", name: "Filemom", testament: "NT", order: 57 },
  { id: "HEB", name: "Hebreus", testament: "NT", order: 58 },
  { id: "JAS", name: "Tiago", testament: "NT", order: 59 },
  { id: "1PE", name: "1 Pedro", testament: "NT", order: 60 },
  { id: "2PE", name: "2 Pedro", testament: "NT", order: 61 },
  { id: "1JN", name: "1 João", testament: "NT", order: 62 },
  { id: "2JN", name: "2 João", testament: "NT", order: 63 },
  { id: "3JN", name: "3 João", testament: "NT", order: 64 },
  { id: "JUD", name: "Judas", testament: "NT", order: 65 },
  { id: "REV", name: "Apocalipse", testament: "NT", order: 66 },
];

/** Remove acentos e converte para minúsculas para comparação flexível. */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Filtra livros por texto de busca e/ou testamento.
 */
export function filterBibleBooks(
  books: BibleBook[] = BIBLE_BOOKS_PT,
  query: string = '',
  testament: Testament = 'ALL',
): BibleBook[] {
  const normalizedQuery = normalizeSearchText(query);
  return books.filter((book) => {
    const matchesTestament =
      testament === 'ALL' || book.testament === testament;
    if (!matchesTestament) return false;
    if (!normalizedQuery) return true;
    const normalizedName = normalizeSearchText(book.name);
    const normalizedId = normalizeSearchText(book.id);
    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedId.includes(normalizedQuery)
    );
  });
}

/** Tenta encontrar um livro pelo nome, abreviação ou ID. */
export function findBibleBook(nameOrId: string): BibleBook | undefined {
  const normalized = normalizeSearchText(nameOrId);
  if (!normalized) return undefined;
  return BIBLE_BOOKS_PT.find(
    (b) =>
      normalizeSearchText(b.name) === normalized ||
      normalizeSearchText(b.id) === normalized ||
      normalizeSearchText(b.name).startsWith(normalized)
  );
}

/**
 * Decompõe uma string de referência bíblica em livro e capítulo/versículo.
 * Exemplo: "1 Coríntios 13:4-7" -> { book: <1 Coríntios>, chapter: "13:4-7" }
 */
export function parseBibleReference(reference: string): {
  book: BibleBook | null;
  chapter: string;
} {
  const trimmed = reference.trim();
  if (!trimmed) return { book: null, chapter: '' };

  // Ordena por tamanho decrescente do nome para casar "1 João" antes de "João"
  const sorted = [...BIBLE_BOOKS_PT].sort((a, b) => b.name.length - a.name.length);

  for (const b of sorted) {
    const normBook = normalizeSearchText(b.name);
    const normRef = normalizeSearchText(trimmed);
    if (normRef.startsWith(normBook)) {
      const rest = trimmed.slice(b.name.length).trim();
      return { book: b, chapter: rest };
    }
    if (trimmed.toUpperCase().startsWith(b.id)) {
      const rest = trimmed.slice(b.id.length).trim();
      return { book: b, chapter: rest };
    }
  }

  return { book: null, chapter: trimmed };
}

