# Component Contracts: DuckSidebar & ThemePillSwitch

**Feature Branch**: `006-duck-sidebar-redesign`
**Date**: 2026-10-14
**Status**: Stable

---

## 1. Contrato da Sidebar: `SideDrawerProps`

```typescript
export type SidebarVariant = 'expanded' | 'collapsed';

export interface SidebarMenuItem {
  id: string;
  label: string;
  iconName: 'home' | 'bar-chart-2' | 'bell' | 'clock' | 'bookmark' | 'settings';
  badgeCount?: number;
  accessibilityLabel?: string;
}

export interface SideDrawerProps {
  /** Se o modal da sidebar está visível na tela */
  isOpen: boolean;
  /** Callback para fechar a sidebar */
  onClose: () => void;
  /** ID do item atualmente selecionado */
  activeId: string;
  /** Callback ao tocar em um item da navegação */
  onSelectMenu: (id: string) => void;
  /** Callback ao tocar no campo de busca rápida */
  onOpenSearch: () => void;
  /** Callback ao tocar em entrar (caso não autenticado) */
  onPressSignIn?: () => void;
  /** Callback ao tocar em criar conta (caso não autenticado) */
  onPressSignUp?: () => void;
  /** Callback ao tocar no avatar / card de perfil */
  onPressProfile?: () => void;
  /** Quantidade de versículos guardados (badge) */
  savedCount?: number;
  /** Modo visual: expandido (padrão) ou colapsado (rail) */
  variant?: SidebarVariant;
  /** Callback ao alternar entre expandido e colapsado */
  onToggleVariant?: () => void;
}
```

---

## 2. Contrato do Switch de Tema: `ThemePillSwitchProps`

```typescript
export interface ThemePillSwitchProps {
  /** Se o modo escuro está ativado */
  isDark: boolean;
  /** Função de alternância do tema */
  onToggle: () => void;
  /** Se deve exibir o label textual ('Light mode' / 'Dark mode') ou apenas a pílula compacta */
  compact?: boolean;
}
```

---

## 3. Estados Visuais dos Itens do Menu

| Estado | Cor de Fundo | Cor do Ícone | Cor do Texto |
|---|---|---|---|
| **Normal / Inativo** | `transparent` | `theme.textSecondary` | `theme.textSecondary` |
| **Hover / Pressionado** | `theme.surfaceSubtle` com 60% opacidade | `theme.textPrimary` | `theme.textPrimary` |
| **Ativo (Selecionado)** | `theme.surfaceSubtle` | `theme.accentText` ou `theme.textPrimary` | `theme.textPrimary` com peso `600` |
