# Implementation Plan: Motor de Busca Bíblica Controlado (Seleção Pré-definida de Livros + Capítulo Livre)

**Branch**: `008-controlled-bible-search` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification de `/specs/008-controlled-bible-search/spec.md`

---

## Summary

Implementação de um motor de busca bíblica mais controlado, intuitivo e à prova de erros ortográficos na tela `BibleSearchScreen`, focado inicialmente no idioma português (Almeida):
1. **Dataset Canônico de Livros (`bibleBooksPt.ts`)**: Mapeamento dos 66 livros da tradução Almeida extraídos de `Untitled-1` (`books-pt.json`), classificados por Antigo Testamento (39) e Novo Testamento (27) com busca e filtro instantâneos.
2. **Modal Seletor de Livro (`BookPickerModal.tsx`)**: Modal/Bottom-Sheet deslizante, fluido, com campo de busca rápida instantânea, abas por testamento e feedback tátil háptico ao selecionar.
3. **Caixa de Busca Controlada (`ControlledBibleSearch.tsx`)**: Card interativo contendo:
   - Botão de seleção do livro com ícone e chevron.
   - Campo de entrada livre de capítulo e versículo (ex: `"3"`, `"23"`, `"3:16"`, `"1:1-5"`).
   - Preview visual da referência gerada em tempo real.
   - Botão de busca integrado com estado de carregamento.
4. **Integração na Tela Principal (`BibleSearchScreen.tsx`)**: Atualização ergonômica da tela de busca, mantendo compatibilidade com as passagens sugeridas e suporte total ao modo claro e escuro.

---

## Technical Context

**Language/Version**: TypeScript 5.9+ em modo estrito (`strict: true`) · React Native 0.86 / Expo SDK 57 / React 19.2

**Primary Dependencies**:
- `@expo/vector-icons`: Ícones Feather (`book`, `chevron-down`, `search`, `x`, `check`, `arrow-right`).
- `expo-haptics`: Micro-feedback sensorial no toque de seleção de livros e filtros.
- `react-native-safe-area-context`: Posicionamento seguro de modais e inputs.
- `@tanstack/react-query`: Cache e queries assíncronas já integradas via `usePassage`.

**Storage/State**:
- Estado local atômico da busca (`selectedBook`, `chapterText`).
- Persistência e hooks de tema existentes (`useTheme`, `usePreferences`).

**Testing**:
- `npm run typecheck` (`tsc --noEmit`).
- Teste manual em Expo no dispositivo/emulador.

**Constraints**:
- Paleta **Clean Pastel** (`theme.ts`), tipografia do sistema, sem cores arbitrárias (hardcoded).
- Zero uso de `any` (TypeScript estrito).
- Respeito integral à Constituição do projeto.

---

## Constitution Check

| Princípio da Constituição | Como o plano atende | Status |
|---|---|---|
| **I. TypeScript Estrito** | Tipagens estritas para `BibleBook`, `Testament`, `BookPickerProps`. Zero `any`. | ✅ |
| **II. Arquitetura Modular** | Componentes desacoplados em `src/constants/bibleBooksPt.ts`, `src/components/features/bible/BookPickerModal.tsx` e `ControlledBibleSearch.tsx`. | ✅ |
| **III. Performance Mobile** | Lista memoizada (`FlatList` ou memo de itens), filtro de busca sem re-renders desnecessários e 60 FPS nas transições. | ✅ |
| **IV. Gestão de Estado Previsível** | Estado local síncrono para os inputs da tela, consumindo `usePassage` de forma declarativa. | ✅ |
| **Padrões de Estilização** | Tokens de `src/constants/theme.ts` (`spacing`, `typography`, `borderRadius`, `colors`). | ✅ |
| **Portões de Qualidade** | Validação estrita via `npm run typecheck`. | ✅ |

---

## Arquitetura de Componentes

```
src/
├── constants/
│   └── bibleBooksPt.ts          # 66 livros tipados, divisão OT/NT e utilitários de filtro
├── components/
│   └── features/
│       └── bible/
│           ├── BookPickerModal.tsx       # Bottom Sheet / Modal de seleção de livros
│           ├── ControlledBibleSearch.tsx # Bloco de busca (Seletor Livro + Input Capítulo + Botão)
│           └── index.ts                  # Exportação dos novos componentes
└── screens/
    └── BibleSearchScreen.tsx    # Orquestração do novo motor de busca controlado
```

---

## Next Steps

1. Criar `checklist.md` e `tasks.md`.
2. Executar as tarefas sequencialmente com validação de tipos via `npm run typecheck`.
