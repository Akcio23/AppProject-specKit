# Implementation Plan: UI Devocional Religiosa Moderna e Limpa

**Branch**: `003-religious-ui` | **Date**: 2026-10-13 | **Spec**: [specs/003-religious-ui/spec.md](file:///c:/Users/Pedro%20PC/Desktop/App/specs/003-religious-ui/spec.md)

**Input**: Feature specification from `specs/003-religious-ui/spec.md`

## Summary

Transformar a interface do aplicativo mobile em uma experiência devocional bíblica moderna, acolhedora e espiritualmente serena. Remover completamente os resquícios da SPEC 001 (contadores de demonstração do Zustand, cartões de arquitetura e badges técnicos), redefinir o Design System para tons nobres e litúrgicos (Dourado Celestial, Noite Contemplativa e Pergaminho Suave), e estruturar componentes ricos para o Versículo do Dia, Temas de Meditação Bíblica e Leitura das Escrituras consumindo a API da SPEC 002.

## Technical Context

**Language/Version**: TypeScript 5.3+ (Strict Mode sem `any`)  
**Target Platform**: React Native 0.76+ / Expo SDK 52+ (iOS & Android)  
**Primary Dependencies**:
- `@tanstack/react-query` (Server state & cache da Bible API)
- `@react-navigation/native` & `@react-navigation/native-stack` (Navegação de telas)
- `react-native-safe-area-context` (Adaptação para entalhes/notches)
- `zustand` (Armazenamento de favoritos/versículos guardados e preferências de leitura)
- `expo-status-bar`, `expo-clipboard` (ou fallback seguro do React Native Clipboard)

**Storage**: Zustand Client State (com interface preparada para favoritos)  
**Performance Goals**: 60 FPS contínuos, Fast Refresh instantâneo, renderização otimizada de versículos  
**Constraints**: Zero referências de protótipo técnico visíveis na interface do usuário final

## Constitution Check

- [x] **I. TypeScript Estrito**: Tipagem 100% explícita para novos componentes, temas devocionais e favoritos.
- [x] **II. Arquitetura Modular**: Primitivos visuais em `src/components/ui/`, componentes bíblicos em `src/components/features/bible/`, estado em `src/stores/`.
- [x] **III. Performance Mobile-First**: Memoização de cartões e itens de lista com `React.memo` e `useCallback`.
- [x] **IV. Gestão de Estado Previsível**: Server State (Bible API via React Query) e Client State (favoritos e tema via Zustand) totalmente desacoplados.
- [x] **V. Design System Consistente**: Cores e espaçamentos centralizados em `src/constants/theme.ts`.

## Project Structure & Changes

### Arquivos Modificados / Criados:

1. **`src/constants/theme.ts`**:
   - Evolução da paleta de cores para estética sagrada e acolhedora:
     - `gold` (`#D4AF37`, `#F59E0B`, `#B48C36`)
     - `backgroundDark` (`#0B0F19`), `surfaceDark` (`#111827`), `surfaceSubtleDark` (`#1F2937`)
     - `parchment` / `sacredLight`
     - Ajustes na tipografia e bordas suaves.

2. **`src/stores/useAppStore.ts`**:
   - Limpeza do contador de demonstração da Spec 001.
   - Adição do estado devocional: versículos favoritos (`savedVerses`), função para favoritar/desfavoritar (`toggleSaveVerse`), e preferência de tamanho de fonte de leitura (`fontSizePreference`).

3. **`src/components/features/bible/`**:
   - Refatoração do `VerseOfTheDayCard.tsx` para estilo devocional nobre:
     - Aspas tipográficas sagradas.
     - Botão de favoritar/guardar no coração com ícone dinâmico.
     - Botão de copiar versículo para compartilhamento.
     - Botão de ler capítulo completo.
     - Estado de loading e erro com mensagens acolhedoras de fé.
   - Novo componente `DevotionalTopics.tsx`:
     - Pílulas temáticas de conforto (Paz, Esperança, Amor, Fé, Gratidão, Coragem, Sabedoria) que disparam a leitura imediata da passagem correspondente.

4. **`src/screens/WelcomeScreen.tsx`**:
   - Remoção total dos resquícios da Spec 001:
     - Exclusão do badge "React Native + Spec Kit".
     - Exclusão do Card do contador Zustand ("⚡ Estado Reativo").
     - Exclusão do Card de Pilares da Arquitetura ("🛡️ Pilares da Arquitetura").
   - Nova experiência de Home Devocional:
     - Saudação acolhedora dinâmica ("Graça e Paz", ajustada pelo horário do dia: manhã, tarde, noite).
     - Versículo do Dia em posição de honra.
     - Seção de "Temas & Orações" (pílulas bíblicas rápidas).
     - Seção de Versículos Guardados (quando houver favoritos).
     - Barra de busca / atalho direto para Leitura da Bíblia.

5. **`src/screens/BibleSearchScreen.tsx` & `src/components/features/bible/PassageView.tsx`**:
   - Ajustes de estilo para harmonizar com a nova identidade visual sagrada: numeração dos versículos em dourado, contraste relaxante e leitura confortável.
