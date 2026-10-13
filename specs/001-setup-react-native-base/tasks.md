# Tasks: Base do Aplicativo Mobile React Native

**Branch**: `001-setup-react-native-base` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configuração da raiz do projeto, dependências e ferramentas de análise estática.

- [ ] T001 Criar `package.json` com dependências do Expo SDK 52, React Native 0.76+, React 18, Zustand, SafeAreaContext e scripts de build/typecheck
- [ ] T002 [P] Configurar `tsconfig.json` em modo estrito (`strict: true`) com mapeamento de caminhos (`@/*` -> `src/*`)
- [ ] T003 [P] Configurar `app.json` com metadados do aplicativo Expo (nome, slug, orientação, ícone e configurações iOS/Android)
- [ ] T004 [P] Criar `.env.example` para parametrização limpa de variáveis de ambiente

---

## Phase 2: Foundational (Tokens, Tipos e Estado Global)

**Purpose**: Fundação de design system e estado global compartilhado exigidos pela Constituição.

- [ ] T005 Implementar tokens de design em `src/constants/theme.ts` (cores claras/escuras, espaçamentos, tipografia, bordas)
- [ ] T006 [P] Definir tipos e contratos globais em `src/types/index.ts`
- [ ] T007 [P] Implementar store de estado do cliente com Zustand em `src/stores/useAppStore.ts`

---

## Phase 3: User Story 1 & 2 - Componentes Primitivos e Tela Inicial (Priority: P1) 🎯 MVP

**Goal**: Entregar uma base funcional e modular com primitivos de UI desacoplados e tela inicial executável.

- [ ] T008 [P] [US2] Criar componente primitivo `Button` em `src/components/ui/Button.tsx` com variantes de estilo e suporte a toques
- [ ] T009 [P] [US2] Criar componente primitivo `Card` em `src/components/ui/Card.tsx` com design tokens
- [ ] T010 [US2] Criar arquivo de exportação unificada em `src/components/ui/index.ts`
- [ ] T011 [US1] Implementar tela de boas-vindas em `src/screens/WelcomeScreen.tsx` integrando os tokens, botões e estado reativo
- [ ] T012 [US1] Configurar entrada raiz `App.tsx` encapsulada com `SafeAreaProvider` e `StatusBar`

---

## Phase 4: Polish & Quality Gates (Constitution Gates)

**Purpose**: Verificação de integridade, instalação de pacotes e compilação sem erros.

- [ ] T013 Instalar dependências com `npm install` e verificar integridade
- [ ] T014 Validar compilação estrita do TypeScript via `npm run typecheck` (`tsc --noEmit`)
- [ ] T015 Executar checklist final de conformidade com a Constituição e `quickstart.md`
