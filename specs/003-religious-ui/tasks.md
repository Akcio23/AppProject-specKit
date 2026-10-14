# Tasks: UI Devocional Religiosa Moderna e Limpa

**Branch**: `003-religious-ui` | **Spec**: [specs/003-religious-ui/spec.md](file:///c:/Users/Pedro%20PC/Desktop/App/specs/003-religious-ui/spec.md) | **Plan**: [specs/003-religious-ui/plan.md](file:///c:/Users/Pedro%20PC/Desktop/App/specs/003-religious-ui/plan.md)

---

## Phase 1: Design Tokens & Base Temática (Foundational)

- [x] T001 **Evoluir paleta de cores litúrgica e serena** em `src/constants/theme.ts` (dourado celestial `#D4AF37`, noite contemplativa `#0A0F1D`, superfícies suaves e tipografia de leitura bíblica).
- [x] T002 **Atualizar Client Store** em `src/stores/useAppStore.ts` (remover contador da Spec 001, adicionar gerenciamento de versículos favoritos/guardados `savedVerses` e preferências de leitura).

---

## Phase 2: User Story 1 - Santuário Inicial & Versículo do Dia (P1 - MVP)

- [x] T003 **Remover totalmente referências da Spec 001** em `src/screens/WelcomeScreen.tsx` (excluir contador Zustand, excluir card de pilares de arquitetura técnica, excluir badge "React Native + Spec Kit").
- [x] T004 **Refatorar o Cartão do Versículo do Dia** em `src/components/features/bible/VerseOfTheDayCard.tsx` com estética editorial sagrada (aspas decorativas douradas, tipografia acolhedora, ação de copiar com feedback e ação de favoritar).
- [x] T005 **Criar Cabeçalho Acolhedor Espiritual** em `src/screens/WelcomeScreen.tsx` com saudação dinâmica baseada no período do dia ("Graça e Paz", "Abençoada Manhã", "Boa Tarde em Cristo", "Serena Noite de Paz").

---

## Phase 3: User Story 2 - Pílulas Temáticas & Acesso Rápido (P2)

- [x] T006 **Criar componente `DevotionalTopics.tsx`** em `src/components/features/bible/DevotionalTopics.tsx` com pílulas de temas bíblicos (Paz, Salmos de Conforto, Esperança, Amor, Sabedoria, Gratidão, Fé) que disparam a leitura do capítulo/passagem correspondente.
- [x] T007 **Integrar pílulas temáticas na tela principal** (`WelcomeScreen.tsx`) conectando ao fluxo de navegação para `BibleSearchScreen`.

---

## Phase 4: User Story 3 & 4 - Leitura Bíblica Focada e Versículos Guardados (P2/P3)

- [x] T008 **Aprimorar estilo e experiência visual** em `src/components/features/bible/PassageView.tsx` e `src/screens/BibleSearchScreen.tsx` para leitura serena das Escrituras (numerais dourados discretos, quebras confortáveis e botão de busca harmonioso).
- [x] T009 **Integrar seção de Versículos Guardados no Coração** na tela principal, exibindo versículos favoritados para meditação rápida.

---

## Phase 5: Validação de Qualidade & Constituição

- [x] T010 Executar verificação de tipos (`npx tsc --noEmit`) garantindo zero regressões e conformidade total com a Constituição.

---

## Phase 6: Descompressão da UI & Segmentação por Menu de Tópicos (Novo Feedback)

- [x] T011 **Criar Menu de Navegação por Tópicos** (`src/components/ui/TopicMenu.tsx`) com abas interativas nobres ("🕊️ Devocional", "✨ Temas", "❤️ Guardados").
- [x] T012 **Modularizar visões de conteúdo em componentes de tópicos**:
  - Visão Devocional: Palavra do dia com ampla respiração e meditação.
  - Visão Temas: Grade organizada de temas e meditações bíblicas categorizadas.
  - Visão Guardados: Coleção espaçosa de versículos favoritos com ações individuais.
- [x] T013 **Integrar Menu e Visões na `WelcomeScreen`** com atalho de busca rápida no cabeçalho.
- [x] T014 **Validar compilação TypeScript** (`npm run typecheck`).

---

## Phase 7: Remoção da Barra Deformada & Aba de Configurações (Novo Feedback)

- [x] T015 **Remover a barra de linguagens da `BibleSearchScreen`**, mantendo apenas o campo de busca, exemplos rápidos e a leitura fluida.
- [x] T016 **Criar componente `SettingsTranslationList`** em `src/components/features/bible/` com design de lista de configurações (cartões com rádio seletor dourado, nome e idioma).
- [x] T017 **Adicionar aba "⚙️ Ajustes" em `WelcomeScreen.tsx`**, permitindo ao usuário gerenciar a tradução ativa da Bíblia e detalhes do app.
- [x] T018 **Validar compilação TypeScript** (`npm run typecheck`).
