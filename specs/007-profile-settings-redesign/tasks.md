# Tasks: Redesign da Tela de Perfil & Configurações de Usuário

**Branch**: `007-profile-settings-redesign` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup & Primitivos Reutilizáveis (UI Primitives)

**Purpose**: Preparar tipagens, estado global de preferências de idioma e novos componentes primitivos de interface.

- [x] T001 Atualizar tipagens em `src/types/index.ts` e `src/types/auth.ts` adicionando `AppLanguage`, `ProfileMetrics`, `InspirationGalleryItem` e `ProfileTabId` conforme `data-model.md`
- [x] T002 Atualizar `src/hooks/usePreferences.ts` para suportar leitura e alteração do idioma ativo (`pt`, `en`, `es`) com mapeamento automático da tradução bíblica padrão (`almeida`, `kjv`, `valera`)
- [x] T003 [P] Criar componente primitivo `LanguagePillSelector.tsx` em `src/components/ui/` com design compacto em micro-pílula, indicador ativo suave, feedback tátil `Haptics.impactAsync(Light)` e conformidade com `contracts/profile-settings.md`
- [x] T004 [P] Criar componente `CurvedBottomNav.tsx` em `src/components/ui/` com cantos superiores arredondados (`borderTopLeftRadius: 28`, `borderTopRightRadius: 28`), suporte a Safe Area e ícones ergonômicos de navegação
- [x] T005 [P] Exportar novos componentes em `src/components/ui/index.ts` e verificar conformidade de tipagem

**Checkpoint**: Primitivos visuais do seletor de idioma e da barra inferior prontos para uso.

---

## Phase 2: Componentes da Feature de Perfil (`src/components/features/profile/`)

**Purpose**: Modularizar os blocos específicos de exibição do perfil conforme a referência visual.

- [x] T006 [P] Criar `ProfileHero.tsx` em `src/components/features/profile/` contendo avatar circular com halo/sombra suave, nome do usuário em destaque, subtítulo motivacional, tempo de membro e botão contextual (`...`)
- [x] T007 [P] Criar `ProfileMetricsRow.tsx` em `src/components/features/profile/` contendo as 3 colunas de contadores (Salvos, Devocionais e Favoritos) com divisores verticais finos e números com peso `bold`
- [x] T008 [P] Criar `ProfileSquircleTabs.tsx` em `src/components/features/profile/` contendo os 3 botões em formato de pílula elevada com ícones Feather (`grid`, `heart`, `sliders`) e destaque de aba ativa
- [x] T009 [P] Criar `InspirationGallery.tsx` em `src/components/features/profile/` contendo o card panorâmico central (imagem + texto sagrado) e carrossel horizontal de cards temáticos
- [x] T010 [P] Criar `ProfileSettingsPanel.tsx` em `src/components/features/profile/` encapsulando edição de nome, foto de perfil (galeria, câmera, remover) e modal de confirmação com senha para exclusão permanente LGPD
- [x] T011 Exportar todos os componentes em `src/components/features/profile/index.ts`

**Checkpoint**: Todos os blocos estruturais do perfil modularizados e desacoplados.

---

## Phase 3: Orquestração Principal da Tela (`ProfileScreen.tsx`) 🎯 MVP

**Goal**: Unificar todos os componentes na nova tela de perfil e configurações de usuário, mantendo 100% das regras de negócio existentes.

**Independent Test**: Abrir a tela de perfil e conferir o visual idêntico ao modelo de referência com avatar, seletor de idioma funcional, métricas, abas squircle, galeria e painel de ajustes.

- [x] T012 Reestruturar `src/screens/ProfileScreen.tsx` substituindo o formulário vertical pela composição com `ProfileHero`, `LanguagePillSelector`, `ProfileMetricsRow`, `ProfileSquircleTabs`, `InspirationGallery`, `ProfileSettingsPanel` e `CurvedBottomNav`
- [x] T013 Conectar a alternância de abas dos squircles para exibir dinamicamente:
  - Aba 1 (`grid`): Galeria de inspiração com cards temáticos
  - Aba 2 (`heart`): Lista filtrada de versículos favoritos
  - Aba 3 (`sliders`): Painel de edição de nome, foto e privacidade LGPD
- [x] T014 Conectar o menu de opções (`...`) no canto superior direito para disparar opções rápidas (Editar Perfil, Privacidade LGPD, Sair da Conta)
- [x] T015 Conectar o toque nos cards da galeria para abrir a passagem correspondente em `BibleSearchScreen`

**Checkpoint**: A tela de perfil está completamente transformada, responsiva e alinhada à referência visual.

---

## Phase 4: Polimento, Acessibilidade & Portões de Qualidade (Priority: P3)

**Purpose**: Garantir fidelidade de contraste, acessibilidade e ausência total de regressões.

- [x] T016 Validar conformidade de contraste e renderização suave tanto no Modo Claro (`linen`/`parchment`) quanto no Modo Escuro (`charcoalDark`)
- [x] T017 Adicionar propriedades de acessibilidade (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`) em todos os novos botões e controles interativos
- [x] T018 Executar o roteiro de testes visuais manuais em `quickstart.md` (cenários V1 a V8)
- [x] T019 Rodar `npm run typecheck` (`tsc --noEmit`) e certificar-se de que não há nenhum erro de TypeScript

