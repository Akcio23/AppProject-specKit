# Tasks: Base do Aplicativo Mobile React Native

**Branch**: `001-setup-react-native-base` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configuração da raiz do projeto, dependências e ferramentas de análise estática.

- [x] T001 Criar `package.json` com dependências do Expo SDK 52, React Native 0.76+, React 18, Zustand, SafeAreaContext e scripts de build/typecheck
- [x] T002 [P] Configurar `tsconfig.json` em modo estrito (`strict: true`) com mapeamento de caminhos (`@/*` -> `src/*`)
- [x] T003 [P] Configurar `app.json` com metadados do aplicativo Expo (nome, slug, orientação, ícone e configurações iOS/Android)
- [x] T004 [P] Criar `.env.example` para parametrização limpa de variáveis de ambiente

---

## Phase 2: Foundational (Tokens, Tipos e Estado Global)

**Purpose**: Fundação de design system e estado global compartilhado exigidos pela Constituição.

- [x] T005 Implementar tokens de design em `src/constants/theme.ts` (cores claras/escuras, espaçamentos, tipografia, bordas)
- [x] T006 [P] Definir tipos e contratos globais em `src/types/index.ts`
- [x] T007 [P] Implementar store de estado do cliente com Zustand em `src/stores/useAppStore.ts`

---

## Phase 3: User Story 1 & 2 - Componentes Primitivos e Tela Inicial (Priority: P1) 🎯 MVP

**Goal**: Entregar uma base funcional e modular com primitivos de UI desacoplados e tela inicial executável.

- [x] T008 [P] [US2] Criar componente primitivo `Button` em `src/components/ui/Button.tsx` com variantes de estilo e suporte a toques
- [x] T009 [P] [US2] Criar componente primitivo `Card` em `src/components/ui/Card.tsx` com design tokens
- [x] T010 [US2] Criar arquivo de exportação unificada em `src/components/ui/index.ts`
- [x] T011 [US1] Implementar tela de boas-vindas em `src/screens/WelcomeScreen.tsx` integrando os tokens, botões e estado reativo
- [x] T012 [US1] Configurar entrada raiz `App.tsx` encapsulada com `SafeAreaProvider` e `StatusBar`

---

## Phase 4: Polish & Quality Gates (Constitution Gates)

**Purpose**: Verificação de integridade, instalação de pacotes e compilação sem erros.

- [x] T013 Instalar dependências com `npm install` e verificar integridade
- [x] T014 Validar compilação estrita do TypeScript via `npm run typecheck` (`tsc --noEmit`)
- [x] T015 Executar checklist final de conformidade com a Constituição e `quickstart.md`
