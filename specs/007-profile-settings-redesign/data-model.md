# Data Model & Entidades: Redesign de Perfil e Configurações

**Feature Branch**: `007-profile-settings-redesign`  
**Date**: 2026-10-15  
**Status**: Stable  

---

## 1. Entidades & Tipos Principais

### 1.1 Idioma Suportado (`AppLanguage`)
```typescript
export type AppLanguage = 'pt' | 'en' | 'es';

export interface LanguageOption {
  code: AppLanguage;
  label: string; // 'Português', 'English', 'Español'
  shortLabel: string; // 'PT', 'EN', 'ES'
  defaultTranslationId: string; // 'almeida', 'kjv', 'valera'
}
```

### 1.2 Métricas do Perfil do Usuário (`ProfileMetrics`)
```typescript
export interface ProfileMetrics {
  savedCount: number; // Total de versículos salvos
  devotionalStreak: number; // Dias seguidos de oração / leitura
  favoritesCount: number; // Total de reflexões ou versículos favoritados
}
```

### 1.3 Card de Galeria de Inspiração (`InspirationGalleryItem`)
```typescript
export interface InspirationGalleryItem {
  id: string;
  title: string;
  subtitle: string;
  reference?: string; // Ex: 'Salmos 23:1'
  imageUrl: string; // URI remota ou asset local de paisagem inspiradora
  aspectRatio?: 'panoramic' | 'square';
  tag?: string; // 'Destaque', 'Oração', 'Sabedoria'
}
```

### 1.4 Abas Rápidas do Perfil (`ProfileTabId`)
```typescript
export type ProfileTabId = 'gallery' | 'favorites' | 'settings';

export interface ProfileTabItem {
  id: ProfileTabId;
  iconName: 'grid' | 'heart' | 'sliders';
  label: string;
  accessibilityLabel: string;
}
```

---

## 2. Mock Data de Inspiração (Galeria Inicial)

```typescript
export const INITIAL_GALLERY_ITEMS: InspirationGalleryItem[] = [
  {
    id: 'featured-temple',
    title: 'Santuário de Paz & Oração',
    subtitle: 'O Senhor é o meu refúgio e minha fortaleza.',
    reference: 'Salmos 91:2',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    aspectRatio: 'panoramic',
    tag: 'Destaque Diário',
  },
  {
    id: 'paris-hope',
    title: 'Alvorada de Fé',
    subtitle: 'Lâmpada para os meus pés é a tua palavra.',
    reference: 'Salmos 119:105',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop',
    aspectRatio: 'square',
    tag: 'Esperança',
  },
  {
    id: 'pagoda-serenity',
    title: 'Serenidade no Espírito',
    subtitle: 'A paz de Deus excede todo o entendimento.',
    reference: 'Filipenses 4:7',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop',
    aspectRatio: 'square',
    tag: 'Serenidade',
  },
  {
    id: 'mountain-glory',
    title: 'Montanhas da Criação',
    subtitle: 'Elevo os meus olhos para os montes.',
    reference: 'Salmos 121:1',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop',
    aspectRatio: 'square',
    tag: 'Louvor',
  },
];
```
