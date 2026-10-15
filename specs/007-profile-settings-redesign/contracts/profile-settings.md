# Component Contracts: Redesign da Tela de Perfil

**Feature Branch**: `007-profile-settings-redesign`  
**Date**: 2026-10-15  
**Status**: Stable  

---

## 1. Contrato do Seletor de Idioma: `LanguagePillSelectorProps`

```typescript
import { AppLanguage } from '@/types';

export interface LanguagePillSelectorProps {
  /** Idioma atualmente ativo ('pt' | 'en' | 'es') */
  currentLanguage: AppLanguage;
  /** Callback acionado ao tocar em um idioma */
  onSelectLanguage: (lang: AppLanguage) => void;
  /** Variante compacta (pílulas menores) */
  compact?: boolean;
}
```

---

## 2. Contrato das Métricas: `ProfileMetricsRowProps`

```typescript
export interface ProfileMetricsRowProps {
  /** Quantidade total de versículos guardados */
  savedCount: number;
  /** Dias consecutivos de leitura ou devocionais concluídos */
  streakDays: number;
  /** Quantidade de itens marcados como favoritos */
  favoritesCount: number;
  /** Callback ao tocar na métrica de salvos */
  onPressSaved?: () => void;
  /** Callback ao tocar na métrica de devocionais */
  onPressDevotionals?: () => void;
  /** Callback ao tocar na métrica de favoritos */
  onPressFavorites?: () => void;
}
```

---

## 3. Contrato das Abas Squircle: `ProfileSquircleTabsProps`

```typescript
import { ProfileTabId } from '@/types';

export interface ProfileSquircleTabsProps {
  /** Aba atualmente selecionada */
  activeTab: ProfileTabId;
  /** Callback ao selecionar uma aba */
  onSelectTab: (tab: ProfileTabId) => void;
}
```

---

## 4. Contrato da Galeria de Inspiração: `InspirationGalleryProps`

```typescript
import { InspirationGalleryItem } from '@/types';

export interface InspirationGalleryProps {
  /** Lista de itens para compor a galeria */
  items: InspirationGalleryItem[];
  /** Callback ao tocar no card principal em destaque */
  onPressFeatured: (item: InspirationGalleryItem) => void;
  /** Callback ao tocar em uma miniatura da lista */
  onPressItem: (item: InspirationGalleryItem) => void;
}
```

---

## 5. Contrato do Rodapé Curvo: `CurvedBottomNavProps`

```typescript
export type BottomNavRoute = 'home' | 'search' | 'create' | 'inbox' | 'profile';

export interface CurvedBottomNavProps {
  /** Rota atualmente ativa */
  activeRoute: BottomNavRoute;
  /** Callback ao tocar em um ícone de navegação */
  onSelectRoute: (route: BottomNavRoute) => void;
}
```
