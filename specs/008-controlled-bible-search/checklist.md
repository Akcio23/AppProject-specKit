# Quality & Acceptance Checklist: Motor de Busca Bíblica Controlado

**Feature**: `008-controlled-bible-search` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

---

## 1. Critérios de Aceitação da Funcionalidade

- [x] **C1 - Catálogo de Livros em Português**:
  - Os 66 livros bíblicos da tradução Almeida estão cadastrados com seus IDs canônicos (ex: `GEN`, `PSA`, `JHN`, `REV`).
  - Cada livro possui a classificação correta em Antigo Testamento (39) ou Novo Testamento (27).
- [x] **C2 - Modal Seletor de Livro**:
  - Abre de forma rápida e suave ao tocar no botão de seleção de livro.
  - Possui busca instantânea que filtra por nome do livro (ignorando maiúsculas/minúsculas e acentuação).
  - Possui abas de filtro: `[Todos (66)]`, `[Antigo Testamento (39)]` e `[Novo Testamento (27)]`.
  - Destaca o livro atualmente selecionado com indicador visual.
  - Ao selecionar um livro, fecha o modal com micro-vibração háptica e atualiza o estado da tela.
- [x] **C3 - Entrada Livre de Capítulo / Versículo**:
  - Permite digitar livremente o número do capítulo (ex: `"1"`, `"23"`) ou com versículo (ex: `"3:16"`, `"1:1-5"`).
  - Teclado apropriado com números e pontuação.
  - Exibe pré-visualização em tempo real da referência que será consultada (ex: `📖 João 3:16`).
- [x] **C4 - Execução da Busca**:
  - Ao clicar em "Buscar", monta a consulta correta para a API (`${livro} ${capitulo}`).
  - Desabilita o botão ou emite aviso sutil se o livro ou capítulo não estiverem preenchidos.
  - Exibe indicador de loading durante a busca.
  - Renderiza o texto sagrado via `PassageView` com êxito.
- [x] **C5 - Sugestões Rápidas & Retrocompatibilidade**:
  - Ao tocar nas passagens sugeridas (ex: `"João 3:16"` ou `"Salmos 23"`), o seletor preenche o livro correspondente e o capítulo automaticamente.

---

## 2. Critérios de Qualidade de Código & Design System

- [x] **Q1 - TypeScript Estrito**: Zero `any`, tipos estritos para `BibleBook`, `Testament` e props de componentes.
- [x] **Q2 - Design System Clean Pastel**: Utilização exclusiva dos tokens de `theme.ts` (`spacing`, `typography`, `borderRadius`, paleta pastel).
- [x] **Q3 - Acessibilidade & Dark Mode**: Labels semânticos de acessibilidade e contraste perfeito em tema claro e escuro.
- [x] **Q4 - Portão de Tipos**: Sucesso total em `npm run typecheck` sem qualquer erro ou warning.
