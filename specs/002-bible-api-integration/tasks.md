# Tasks: Integração com a Bíblia (bible-api.com)

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)

## Phase 1: Setup

- [x] T001 Instalar dependências: `@tanstack/react-query`, `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens` (via `npx expo install`)
- [x] T002 [P] Adicionar `EXPO_PUBLIC_BIBLE_API_URL` em `.env.example`
- [x] T003 [P] Criar `src/constants/bible.ts`

## Phase 2: Foundational (bloqueia todas as stories)

- [x] T004 Criar contratos e tipos de domínio em `src/types/bible.ts`
- [x] T005 Criar `src/services/http/httpClient.ts` (timeout + `BibleApiError`)
- [x] T006 Criar `src/services/bible/bibleApi.ts` (type guards + mappers)
- [x] T007 Criar `src/lib/queryClient.ts`
- [x] T008 Criar `src/stores/useBibleStore.ts`
- [x] T009 [P] Criar primitivos `src/components/ui/StateMessage.tsx` e `TextField.tsx`
- [x] T010 Criar navegação `src/navigation/` e atualizar `App.tsx` com providers

## Phase 3: User Story 1 - Versículo do Dia (P1) 🎯 MVP

- [x] T011 [US1] Criar `src/hooks/useRandomVerse.ts`
- [x] T012 [US1] Criar `src/components/features/bible/VerseOfTheDayCard.tsx`
- [x] T013 [US1] Integrar card em `src/screens/WelcomeScreen.tsx`

## Phase 4: User Story 2 - Busca por referência (P2)

- [x] T014 [US2] Criar `src/hooks/usePassage.ts`
- [x] T015 [US2] Criar `src/components/features/bible/PassageView.tsx`
- [x] T016 [US2] Criar `src/screens/BibleSearchScreen.tsx` + botão de acesso na Welcome

## Phase 5: User Story 3 - Tradução (P3)

- [x] T017 [US3] Criar `src/hooks/useTranslations.ts`
- [x] T018 [US3] Criar `src/components/features/bible/TranslationPicker.tsx` e usar na busca

## Phase 6: Polish & Verification

- [x] T019 Rodar `npm run typecheck` sem erros
- [x] T020 Validar contra a API real bible-api.com (passagens simples, compostas, randômicas, traduções e 404)
