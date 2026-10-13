# Research & Technical Decisions: Base React Native

**Feature**: `001-setup-react-native-base`  
**Date**: 2026-10-13  
**Status**: Completed

## Decisões Técnicas e Racionais

### 1. Framework Base: Expo SDK vs React Native Bare CLI
* **Decisão**: Expo SDK 52+ com suporte à New Architecture (React Native 0.76+) e TypeScript.
* **Racional**:
  - Conforme preconizado na skill `react-native-expert`: *"Comece com Expo. Ejete apenas se precisar de módulo nativo sem suporte."*
  - O Expo moderno não impõe limitações: através do comando `npx expo prebuild`, o código nativo (iOS/Android) pode ser gerado a qualquer momento sem perder compatibilidade.
  - O Expo Go e o Expo Dev Client aceleram brutalmente o ciclo de desenvolvimento, dispensando setups complexos de Xcode/Android Studio para prototipação e testes iniciais de equipe.
* **Alternativas Consideradas**:
  - *React Native Bare CLI puro*: Rejeitado para o setup inicial por exigir configuração manual extensiva de CocoaPods, Gradle, Ruby e dependências nativas no ambiente local, gerando alto atrito de onboarding.

### 2. Navegação: Expo Router vs React Navigation
* **Decisão**: React Navigation v6 / v7 com Stack e SafeAreaProvider ou Expo Router baseado em arquivos (`app/`).
* **Racional**:
  - Ambas as abordagens são suportadas com excelência. Para um app escalável com suporte claro a arquitetura limpa (`src/components/`, `src/screens/`), a estrutura padrão com `react-native-safe-area-context` e `react-native-screens` garante máxima performance nativa e tipagem rigorosa de rotas.
* **Alternativas Consideradas**:
  - *Navegação baseada em estado puro (sem lib)*: Rejeitada por não integrar com o botão voltar nativo do Android nem com animações fluidas do iOS.

### 3. Gerenciamento de Estado: Zustand vs Redux Toolkit
* **Decisão**: Zustand para estado global do cliente.
* **Racional**:
  - Zustand é extremamente leve (< 1kB), não exige `Context Providers` envolvendo a raiz do app (o que previne re-renders desnecessários), possui suporte nativo a TypeScript e integra perfeitamente com a Constituição do Projeto.
* **Alternativas Consideradas**:
  - *Redux Toolkit*: Descartado neste estágio inicial devido ao alto volume de boilerplate desnecessário.
  - *Context API puro do React*: Descartado para estados frequentes devido a re-renders em cascata na árvore de componentes.

### 4. Estilização: StyleSheet Nativo com Design System de Tokens
* **Decisão**: `StyleSheet.create` com tokens centralizados em `src/constants/theme.ts`.
* **Racional**:
  - Zero dependências extras de compilação, performance máxima com ponte C++ da New Architecture, e tipagem estrita com TypeScript.
* **Alternativas Consideradas**:
  - *Styled Components*: Descartado pelo overhead em runtime.
  - *NativeWind (Tailwind)*: Excelente opção, mas adiciona complexidade de pré-processador PostCSS/Babel no primeiro commit da base. Pode ser introduzido em fase posterior sem quebrar os tokens.

### 5. Análise Estática & Portões de Qualidade
* **Decisão**: TypeScript em modo estrito (`strict: true`), ESLint com plugin para React Native, e Prettier.
* **Racional**:
  - Alinhamento total com a Constituição (`.specify/memory/constitution.md`). Garante que qualquer membro do time rode `npm run typecheck` e tenha validação estática instantânea.
