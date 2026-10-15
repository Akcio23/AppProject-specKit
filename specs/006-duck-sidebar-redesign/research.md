# Research & Technical Decisions: Redesign da Sidebar no Estilo Duck UI

**Feature Branch**: `006-duck-sidebar-redesign`
**Date**: 2026-10-14
**Status**: Completed

---

## Decisões Técnicas

### R1. Biblioteca de Ícones Vetoriais: `@expo/vector-icons` (Feather & Ionicons)
- **Contexto**: A imagem de referência do Duck UI usa ícones minimalistas de traço fino (line icons), ao invés de emojis pesados.
- **Opções avaliadas**:
  1. *Emojis nativos*: visual inconsistente entre Android e iOS, perde a elegância do Duck UI.
  2. *SVGs manuais*: alto boilerplate para desenhar cada ícone na mão sem `react-native-svg`.
  3. `@expo/vector-icons` (Feather/Ionicons): nativo do ecossistema Expo, suportado no Expo Go sem rebuild, ícones idênticos aos da imagem (home, bar-chart, bell, clock, archive/bookmark, search, log-out, sun, moon).
- **Decisão**: Instalar e usar `@expo/vector-icons` (`Feather` e `Ionicons`), garantindo traços finos de 1.8–2.0px idênticos à referência visual.

---

### R2. Controle de Alternância de Tema: `ThemePillSwitch` Customizado
- **Contexto**: A Duck UI apresenta uma pílula deslizante arredondada (`pill switch`) no rodapé, exibindo o ícone de sol, o label de texto ("Light mode" / "Dark mode") e o botão de toggle com a bolinha animada contendo o ícone de lua ou sol dentro.
- **Opções avaliadas**:
  1. *Switch nativo do React Native*: estilização rígida, não aceita ícone interno na esfera (thumb) nem customização visual fiel ao design.
  2. *Componente customizado com Animated*: container com cantos redondos (`borderRadius: 20`), esfera deslizante (`translateX`) animada com `Animated.spring` e ícone vetorial interno em miniatura.
- **Decisão**: Criar componente `ThemePillSwitch.tsx` desacoplado em `src/components/ui/`, acionado por toque e com feedback tátil `Haptics.impactAsync(Light)`.

---

### R3. Arquitetura Estrutural: Modo Expandido vs. Modo Rail (Colapsado)
- **Contexto**: A imagem demonstra o sidebar tanto no modo colapsado (rail de ~64-72px apenas com ícones centralizados) quanto no modo expandido (~280-310px com ícones + labels + campo de busca expandido).
- **Abordagem**:
  - No celular (modo drawer lateral convencional), o padrão de abertura é o **Modo Expandido** com backdrop translúcido.
  - Para flexibilidade e fidelidade ao design Duck UI, o componente aceitará uma prop `variant?: 'expanded' | 'collapsed'` ou um botão de expansão rápida, animando a largura (`width`) suavemente.
  - No modo colapsado, o campo de busca vira um botão quadrado arredondado com apenas a lupa, e os itens viram botões centralizados de ícones.

---

### R4. Fidelidade Cromática ao Clean Pastel
- **Contexto**: O usuário frisou: *"pode manter as cores mais a estrutura quero igual da imagem enviada"*.
- **Mapeamento de Cores**:
  - **Fundo do Drawer**: `theme.surfaceCard` (Claro: `#FFFFFF` / Escuro: `#1F1D1B`).
  - **Fundo de Itens e Busca**: `theme.surfaceSubtle` (Claro: `#F3EFE8` / Escuro: `#292623`).
  - **Bordas e Divisores**: `theme.borderSubtle` (Claro: `#E8E1D5` / Escuro: `#36322E`).
  - **Texto Principal**: `theme.textPrimary` (Claro: `#261E19` / Escuro: `#FFFFFF`).
  - **Texto Secundário / Placeholder**: `theme.textMuted` (Claro: `#8C7E72` / Escuro: `#A3988E`).
  - **Acento e Switch Pill**: `theme.accent` (`#DFC87B` ou lavanda suave `#8B5CF6`/`#A78BFA` conforme tokens ativos) e `theme.accentSoft`.

---

### R5. Acessibilidade & Guerra aos Re-renders (Constituição III)
- Toda a barra e itens usam `React.memo` com handlers memoizados via `useCallback`.
- Itens possuem `accessibilityRole="button"` ou `accessibilityRole="tab"`, com `accessibilityState={{ selected: isActive }}`.
- O switch possui `accessibilityRole="switch"` com `accessibilityState={{ checked: isDark }}`.
