# Implementation Plan: Redesign da Sidebar no Estilo Duck UI

**Branch**: `006-duck-sidebar-redesign` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-duck-sidebar-redesign/spec.md`

---

## Summary

Refatoração da arquitetura e layout do menu lateral (`SideDrawer.tsx`) para replicar a estética e a estrutura minimalista da referência **Duck UI** (cabeçalho integrado com avatar/logo + subtítulo, campo de busca em pílula arredondada, lista vertical com ícones vetoriais de traço fino, rodapé com logout e controle de tema com switch pill animado contendo ícones de sol e lua), preservando rigorosamente todas as cores do **Design System Clean Pastel** e as diretrizes da **Constituição do Projeto**.

A abordagem inclui:
1. Instalação e uso de `@expo/vector-icons` (`Feather` e `Ionicons`) para eliminar emojis e trazer traços vetoriais idênticos ao design Duck UI.
2. Criação do componente reutilizável `ThemePillSwitch.tsx` em `src/components/ui/` para a alternância fluida de tema com feedback tátil e animação nativa.
3. Reestruturação completa do `SideDrawer.tsx` com suporte aos modos **Expandido** e **Compacto/Rail**.
4. Integração fluida com as stores `useTheme` e `useSessionStore` existentes.

---

## Technical Context

**Language/Version**: TypeScript 5.9+ em modo estrito (`strict: true`) · React Native 0.86 / Expo SDK 57 / React 19.2

**Primary Dependencies**:
- `@expo/vector-icons`: Ícones minimalistas Feather e Ionicons.
- `expo-haptics`: Feedback sensorial suave em toques e alternância de tema.
- `react-native-safe-area-context`: Posicionamento seguro considerando notch e barras de navegação do sistema.
- `zustand`: Consumo das stores `useTheme` e `useSessionStore`.

**Storage**: N/A (Consumo dos estados locais e tokens existentes).

**Testing**: `npm run typecheck` (`tsc --noEmit`) + Roteiro manual do [quickstart.md](./quickstart.md) (V1 a V8).

**Target Platform**: Android e iOS via Expo Go e Web.

**Project Type**: Mobile App Component (`src/components/ui/`).

**Performance Goals**: 60 FPS estáveis na abertura/fechamento do drawer e na animação do toggle pill (`useNativeDriver: true`).

**Constraints**: Preservar 100% da paleta Clean Pastel (`theme.ts`); zero `any`; total conformidade com a Constituição.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio da Constituição | Como o plano atende | Status |
|---|---|---|
| **I. TypeScript Estrito** | Todas as props de componentes, tipos de menus e variantes tipados em `contracts/duck-sidebar.md`. Zero `any`. | ✅ |
| **II. Arquitetura Modular** | Componentes desacoplados em `src/components/ui/` (`ThemePillSwitch.tsx`, `SideDrawer.tsx`). Separação limpa de tokens de estilo. | ✅ |
| **III. Performance Mobile (Guerra aos Re-renders)** | Uso de `React.memo`, `useCallback` para handlers, e `Animated` com `useNativeDriver: true`. | ✅ |
| **IV. Gestão de Estado Previsível** | Consumo atômico das stores Zustand existentes (`useSessionStore`, `useTheme`). | ✅ |
| **V. Segurança & Resiliência** | Fallbacks silenciosos para haptics em plataformas não suportadas; truncamento seguro de strings longas de usuário. | ✅ |
| **Padrões de Estilização** | Consumo obrigatório de `src/constants/theme.ts` (`colors`, `spacing`, `borderRadius`, `typography`). Proibidas cores soltas. | ✅ |
| **Portões de Qualidade** | Validação estrita via `npm run typecheck`. | ✅ |

---

## Project Structure

### Documentation (this feature)

```text
specs/006-duck-sidebar-redesign/
├── spec.md              # Especificação formal da feature
├── plan.md              # Este plano de implementação
├── research.md          # Decisões técnicas R1–R5
├── quickstart.md        # Roteiro de testes de validação visual
├── contracts/
│   └── duck-sidebar.md  # Interfaces TypeScript e contratos visuais
└── tasks.md             # Tarefas atômicas de implementação (/speckit.tasks)
```

### Source Code Modificado e Novo

```text
package.json                     # Adição de @expo/vector-icons
src/components/ui/
├── ThemePillSwitch.tsx          # NOVO — Controle de tema animado no padrão Duck UI
├── SideDrawer.tsx               # REFATORADO — Estrutura completa alinhada à Duck UI
└── index.ts                     # Exportação do ThemePillSwitch
```

---

## Complexity Tracking

Nenhuma violação aos princípios da Constituição foi detectada. A refatoração simplifica e desacopla a interface.
