# Tasks: Redesign da Sidebar no Estilo Duck UI

**Branch**: `006-duck-sidebar-redesign` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Dependências & Infraestrutura)

**Purpose**: Preparar ambiente e instalar pacotes necessários sem quebrar o Expo Go.

- [x] T001 Instalar `@expo/vector-icons` no projeto mobile usando `npx expo install @expo/vector-icons` em `package.json`
- [x] T002 Verificar compilação TypeScript com `npm run typecheck` para garantir integridade do ambiente

---

## Phase 2: Foundational (Blocos Base Reutilizáveis)

**Purpose**: Construir os primitivos visuais essenciais que o novo sidebar exige.

- [x] T003 Criar o componente primitivo `ThemePillSwitch.tsx` em `src/components/ui/` com container pill, thumb deslizante animado com `Animated.spring`, ícones de sol e lua e feedback háptico
- [x] T004 [P] Exportar `ThemePillSwitch` em `src/components/ui/index.ts` e validar conformidade com `contracts/duck-sidebar.md`

**Checkpoint**: Primitivo de alternância de tema pronto e testável isoladamente.

---

## Phase 3: User Story 1 - Estrutura Completa Duck UI Expandida (Priority: P1) 🎯 MVP

**Goal**: Transformar a estrutura principal do `SideDrawer.tsx` para replicar o design Duck UI mantendo a paleta Clean Pastel.

**Independent Test**: Abrir o drawer lateral → validar Header com Avatar + Busca cápsula + Itens com ícones vetoriais + Rodapé com Logout e ThemePillSwitch.

- [x] T005 [US1] Refatorar cabeçalho em `src/components/ui/SideDrawer.tsx` substituindo o badge de cruz pelo layout integrado Avatar arredondado (`borderRadius: 14`) + Título do Usuário/App + E-mail/Subtítulo
- [x] T006 [US1] Implementar cápsula de busca arredondada (`Search...`) com ícone de lupa logo abaixo do cabeçalho disparando `onOpenSearch`
- [x] T007 [US1] Atualizar lista vertical de navegação substituindo emojis por ícones vetoriais Feather (`home`, `bar-chart-2`, `bell`, `clock`, `bookmark`), com estilo minimalista e destaque no item ativo
- [x] T008 [US1] Reestruturar rodapé com botão de `Logout` (com ícone `log-out`) e o novo `ThemePillSwitch` integrado consumindo `useTheme`
- [x] T009 [US1] Adaptar comportamentos para visitante (exibir opção de Entrar/Criar conta no rodapé com o mesmo padrão visual elegante)

**Checkpoint**: A nova barra lateral expandida no estilo Duck UI está 100% funcional, bonita e testável.

---

## Phase 4: User Story 2 - Suporte ao Modo Compacto / Rail (Priority: P2)

**Goal**: Permitir exibição em coluna fina (rail) apenas com ícones centralizados.

**Independent Test**: Alternar para `variant="collapsed"` → a largura reduz para ~68px e oculta labels, mantendo apenas ícones verticais centralizados.

- [x] T010 [US2] Adicionar prop `variant?: 'expanded' | 'collapsed'` em `SideDrawer.tsx`
- [x] T011 [US2] Implementar renderização condicional/estilos de rail para busca compacta, ícones centralizados e switch compacto

---

## Phase 5: Polish, Acessibilidade & Portões de Qualidade (Priority: P3)

**Purpose**: Verificação de contraste, testes de usabilidade e garantia de zero erros.

- [x] T012 Validar acessibilidade (`accessibilityLabel`, `accessibilityRole`) em todos os botões e no switch
- [x] T013 Executar roteiro completo de validação manual de [quickstart.md](./quickstart.md) (V1 a V8)
- [x] T014 Rodar `npm run typecheck` (`tsc --noEmit`) e garantir zero erros de tipagem

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: Concluída com sucesso (`@expo/vector-icons` instalado).
- **Phase 2 (Foundational)**: Concluída com sucesso (`ThemePillSwitch.tsx` criado e exportado).
- **Phase 3 (User Story 1 - MVP)**: Concluída com sucesso (`SideDrawer.tsx` refatorado no estilo Duck UI).
- **Phase 4 (User Story 2)**: Concluída com sucesso (suporte a `expanded` e `collapsed` com transição fluida).
- **Phase 5 (Polish)**: Concluída com sucesso (`tsc --noEmit` passou com 0 erros).
