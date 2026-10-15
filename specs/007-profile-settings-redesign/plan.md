# Implementation Plan: Redesign da Tela de Perfil & Configurações de Usuário

**Branch**: `007-profile-settings-redesign` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-profile-settings-redesign/spec.md`

---

## Summary

Redesign completo da tela de perfil e configurações de usuário (`ProfileScreen.tsx`) alinhado à referência visual mobile moderna enviada pelo usuário:
1. **Hero de Identidade**: Avatar circular com halo sutil, tipografia moderna e hierárquica (Nome completo, subtítulo devocional e tempo de caminhada).
2. **Métricas em Três Colunas**: Barra horizontal com contadores de Salvos, Devocionais e Favoritos separados por divisores verticais finos.
3. **Seletor Minimalista de Idioma**: Micro-pílula compacta (`PT` | `EN` | `ES`) com feedback háptico e persistência instantânea no armazenamento local/store.
4. **Abas Rápidas em Squircle**: Três botões elevados com ícones Feather (`grid`, `heart`, `sliders`) para alternar fluidamente entre Galeria, Favoritos e Ajustes de Conta/LGPD.
5. **Galeria de Inspiração**: Card panorâmico de destaque superior com carrossel de miniaturas temáticas e navegação para os textos sagrados.
6. **Barra de Navegação Curva**: Rodapé moderno com cantos arredondados contínuos e navegação ergonômica.
7. **Segurança & LGPD Preservadas**: Edição de perfil, alteração de foto e exclusão definitiva de conta mantidas com total conformidade.

---

## Technical Context

**Language/Version**: TypeScript 5.9+ em modo estrito (`strict: true`) · React Native 0.86 / Expo SDK 57 / React 19.2

**Primary Dependencies**:
- `@expo/vector-icons`: Ícones Feather (`grid`, `heart`, `sliders`, `globe`, `more-horizontal`, `home`, `search`, `plus`, `mail`, `user`).
- `expo-haptics`: Micro-feedback sensorial suave nos toques de seleção de idioma e abas.
- `react-native-safe-area-context`: Posicionamento seguro considerando notch e insets inferiores.
- `zustand`: Gerenciamento atômico de preferências e estado do usuário (`usePreferences`, `useAccountCacheStore`, `useCurrentUser`).
- `expo-image-picker`: Captura e upload de foto de perfil existentes.

**Storage**: AsyncStorage via Zustand Persist para preferências (`language`, `theme`, `translationId`) e SQLite/Cache remoto existente.

**Testing**: `npm run typecheck` (`tsc --noEmit`) + Roteiro manual do [quickstart.md](./quickstart.md) (V1 a V8).

**Target Platform**: Android e iOS via Expo Go e Web.

**Project Type**: Mobile Screen & UI Components (`src/screens/ProfileScreen.tsx`, `src/components/features/profile/`, `src/components/ui/`).

**Performance Goals**: 60 FPS estáveis na rolagem, sem engasgos nas transições de abas e sem re-renderizações desnecessárias.

**Constraints**: Paleta **Clean Pastel** (`theme.ts`), tipografia do sistema, zero `any`, total conformidade com a Constituição.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio da Constituição | Como o plano atende | Status |
|---|---|---|
| **I. TypeScript Estrito** | Interfaces completas em `contracts/profile-settings.md` e `data-model.md`. Zero uso de `any`. | ✅ |
| **II. Arquitetura Modular** | Componentes atômicos e reutilizáveis (`LanguagePillSelector`, `ProfileMetricsRow`, `ProfileSquircleTabs`, `InspirationGallery`, `CurvedBottomNav`). | ✅ |
| **III. Performance Mobile (Guerra aos Re-renders)** | Componentes memoizados com `React.memo`, callbacks com `useCallback` e virtualização ou carrossel otimizado. | ✅ |
| **IV. Gestão de Estado Previsível** | Consumo desacoplado via Zustand (`usePreferences`, `useCurrentUser`). Sem acoplamento rígido. | ✅ |
| **V. Segurança, Armazenamento & LGPD** | Manutenção do fluxo de confirmação por senha para exclusão de conta e armazenamento criptografado de credenciais. | ✅ |
| **Padrões de Estilização** | Tokens centrais de design `src/constants/theme.ts` (`spacing`, `typography`, `borderRadius`, `shadows`). Proibidas cores soltas. | ✅ |
| **Portões de Qualidade** | Validação estrita via `npm run typecheck`. | ✅ |

---

## Project Structure

### Documentation (this feature)

```text
specs/007-profile-settings-redesign/
├── spec.md              # Especificação de requisitos e histórias de usuário
├── plan.md              # Este plano de implementação técnica
├── research.md          # Decisões de arquitetura e tecnologia resolvidas
├── data-model.md        # Entidades, métricas, cartões e mock data
├── contracts/           # Contratos TypeScript de componentes e props
│   └── profile-settings.md
├── quickstart.md        # Roteiro passo a passo de validação manual (V1 a V8)
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code Impacted

```text
src/
├── components/
│   ├── ui/
│   │   ├── LanguagePillSelector.tsx      # Novo componente de seletor minimalista de idioma
│   │   ├── CurvedBottomNav.tsx           # Nova barra de navegação com curvatura ergonômica
│   │   └── index.ts                      # Exportação dos novos primitivos
│   └── features/
│       └── profile/
│           ├── ProfileHero.tsx           # Avatar circular, nome, badge e menu contextual
│           ├── ProfileMetricsRow.tsx     # 3 colunas de métricas separadas por divisores
│           ├── ProfileSquircleTabs.tsx   # 3 botões em squircle para troca de abas
│           ├── InspirationGallery.tsx    # Card panorâmico + carrossel de cartões temáticos
│           ├── ProfileSettingsPanel.tsx  # Painel de edição de nome, foto e LGPD
│           └── index.ts                  # Exportação dos componentes de perfil
├── hooks/
│   └── usePreferences.ts                 # Adição de suporte a idioma ativo (pt, en, es)
└── screens/
    └── ProfileScreen.tsx                 # Reestruturação e orquestração da nova tela
```

---

## Phases & Milestones

- **Fase 0 (Research)**: Decisões técnicas consolidadas em `research.md`.
- **Fase 1 (Design & Contratos)**: `data-model.md`, `contracts/profile-settings.md` e `quickstart.md` formalizados.
- **Fase 2 (Tarefas & Execução)**: Pronta para geração de tarefas via `/speckit.tasks` e implementação metódica.
