# Tasks: Motor de Busca Bíblica Controlado

**Branch**: `008-controlled-bible-search` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Catálogo Canônico de Livros (`src/constants/bibleBooksPt.ts`)

**Purpose**: Estruturar os 66 livros da Bíblia em português (Almeida) com tipagem estrita e utilitários de filtro.

- [x] T001 Criar `src/constants/bibleBooksPt.ts` contendo a interface `BibleBook`, a lista canônica dos 66 livros extraídos de `Untitled-1` (`books-pt.json`) classificados em `OT` (39) e `NT` (27), e a função de busca/normalização `filterBibleBooks(search, testament)`.
- [x] T002 Exportar os novos tipos e constantes em `src/constants/index.ts` ou diretamente pelo caminho de constantes.

**Checkpoint**: Dataset dos livros em português tipado e testado.

---

## Phase 2: Componentes da Feature de Busca Controlada

**Purpose**: Modularizar o modal seletor de livros e o bloco de busca interativo.

- [x] T003 [P] Criar `BookPickerModal.tsx` em `src/components/features/bible/` com cabeçalho, campo de busca com filtro instantâneo, abas de filtro por testamento (`Todos`, `Antigo`, `Novo`), lista rolável com indicador do livro ativo e micro-vibração háptica.
- [x] T004 [P] Criar `ControlledBibleSearch.tsx` em `src/components/features/bible/` contendo o botão disparador de seleção do livro, campo livre para capítulo/versículo, preview em tempo real da referência e botão de busca com estado de loading.
- [x] T005 Exportar os novos componentes em `src/components/features/bible/index.ts`.

**Checkpoint**: Componentes visuais do novo motor prontos e desacoplados.

---

## Phase 3: Integração na Tela Principal (`BibleSearchScreen.tsx`) 🎯 MVP

**Purpose**: Orquestrar o motor controlado na tela de busca da Bíblia.

- [x] T006 Atualizar `src/screens/BibleSearchScreen.tsx` substituindo a entrada de texto bruta pelo componente `ControlledBibleSearch`, mantendo a execução de queries com `usePassage`.
- [x] T007 Adaptar o toque nos exemplos sugeridos (ex: `"João 3:16"`, `"Salmos 23"`) para pré-preencher o livro e capítulo no motor controlado e disparar a busca automaticamente.
- [x] T008 Validar suporte completo a Dark Mode e alternância de temas via `useTheme`.

**Checkpoint**: O novo motor de busca controlado está ativo e totalmente funcional no aplicativo!

---

## Phase 4: Portões de Qualidade & Verificação

**Purpose**: Garantir ausência de erros de tipagem e alta estabilidade.

- [x] T009 Executar `npm run typecheck` (`tsc --noEmit`) para verificar tipagem estrita de todos os arquivos.
- [x] T010 Marcar itens do `checklist.md` e validar os cenários de aceitação.
