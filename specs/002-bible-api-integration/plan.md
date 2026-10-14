# Implementation Plan: Integração com a Bíblia (bible-api.com)

**Branch**: `002-bible-api-integration` | **Date**: 2026-10-13 | **Spec**: [spec.md](./spec.md)

## Summary

Integrar o app ao serviço público `https://bible-api.com` para (P1) exibir um Versículo do Dia aleatório na Welcome, (P2) buscar passagens por referência numa nova tela e (P3) trocar a tradução (padrão: `almeida`). Camada HTTP tipada sobre `fetch` + TanStack Query para server state e Zustand para a tradução selecionada.

## Technical Context

| Item | Decisão |
|---|---|
| Linguagem | TypeScript strict (sem `any`) |
| Runtime | Expo SDK 57 / React Native 0.86 / React 19 |
| HTTP | `fetch` nativo + wrapper com timeout (`AbortController`) e erros tipados |
| Server state | `@tanstack/react-query` v5 |
| Client state | Zustand (`useBibleStore` → tradução selecionada) |
| Navegação | `@react-navigation/native` + `native-stack` (Welcome → BibleSearch) |
| Validação de payload | Type guards manuais (sem nova dependência) |
| Testes | `tsc --noEmit` + verificação manual em Expo (sem runner de testes no projeto ainda) |

## API Contract (bible-api.com)

| Uso | Endpoint | Resposta relevante |
|---|---|---|
| Busca por referência | `GET /{referência}?translation={id}` | `{ reference, verses[{book_id, book_name, chapter, verse, text}], text, translation_id, translation_name, translation_note }` |
| Versículo aleatório | `GET /data/{id}/random` | `{ translation{identifier,name,language,language_code,license}, random_verse{book_id, book, chapter, verse, text} }` |
| Traduções | `GET /data` | `{ translations[{identifier, name, language, language_code, license, url}] }` |
| Erro | 404 | `{ "error": "not found" }` |

- Rate limit: **15 req / 30 s por IP** → 429 tratado como `RATE_LIMITED`, sem retry automático.
- Textos vêm com espaços/quebras sobrando → `trim()` no mapper.
- Referência deve ser codificada com `encodeURIComponent` (acentos: "João").

## Constitution Check

| Princípio | Atendimento |
|---|---|
| I. TS estrito | Contratos `Raw*` + modelos de domínio; type guards em vez de casts |
| II. Modular | `services/` (HTTP), `hooks/` (queries), `stores/`, `components/features/bible/`, `types/` |
| III. Performance | Passagens em `FlatList` com `keyExtractor` estável; itens `memo`; callbacks `useCallback` |
| IV. Estado | Server → TanStack Query; Client → Zustand |
| V. Resiliência | Estados loading/erro/vazio + "Tentar novamente"; timeout 10 s |
| UI tokens | Só `colors/spacing/typography/borderRadius` do `theme.ts` |

## Project Structure (arquivos afetados)

```text
.env.example                                   # [MOD] EXPO_PUBLIC_BIBLE_API_URL
App.tsx                                        # [MOD] QueryClientProvider + NavigationContainer
src/
├── constants/bible.ts                         # [NEW] base URL, tradução padrão, timeouts, query keys
├── types/bible.ts                             # [NEW] contratos Raw* + domínio + BibleApiError
├── services/
│   ├── http/httpClient.ts                     # [NEW] getJson<T>() c/ timeout e erros tipados
│   └── bible/bibleApi.ts                      # [NEW] getPassage, getRandomVerse, getTranslations + mappers
├── lib/queryClient.ts                         # [NEW] QueryClient (retry inteligente, staleTime)
├── hooks/
│   ├── useRandomVerse.ts                      # [NEW]
│   ├── usePassage.ts                          # [NEW]
│   └── useTranslations.ts                     # [NEW]
├── stores/useBibleStore.ts                    # [NEW] translationId selecionada
├── navigation/
│   ├── types.ts                               # [NEW] RootStackParamList
│   └── RootNavigator.tsx                      # [NEW]
├── components/
│   ├── ui/TextField.tsx                       # [NEW] primitivo de input
│   ├── ui/StateMessage.tsx                    # [NEW] loading/erro/vazio + retry
│   └── features/bible/
│       ├── VerseOfTheDayCard.tsx              # [NEW] P1
│       ├── PassageView.tsx                    # [NEW] P2 (FlatList)
│       └── TranslationPicker.tsx              # [NEW] P3 (chips horizontais)
└── screens/
    ├── WelcomeScreen.tsx                      # [MOD] card Versículo do Dia + botão "Buscar na Bíblia"
    └── BibleSearchScreen.tsx                  # [NEW] P2/P3
```

## Key Design Decisions

1. **`fetch` em vez de Axios** — API simples, só GET; evita dependência extra.
2. **Retry**: até 2 tentativas apenas para `NETWORK`/`TIMEOUT`/`SERVER`; nunca para `NOT_FOUND`/`RATE_LIMITED` (economiza cota).
3. **Cache**: passagens `staleTime: Infinity` (texto bíblico não muda); traduções `staleTime: 24h`; versículo aleatório só refaz sob demanda (`refetch`).
4. **Busca disparada no submit**, não a cada tecla → protege o rate limit.
5. **Tradução em Zustand** sem persistência (fora de escopo nesta versão).
