# Research & Technical Decisions: Redesign da Tela de Perfil & Configurações de Usuário

**Feature Branch**: `007-profile-settings-redesign`  
**Date**: 2026-10-15  
**Status**: Completed  

---

## 1. Decisões Técnicas Principais

### R1. Seletor Minimalista de Idioma: `LanguagePillSelector`
- **Contexto**: O usuário solicitou explicitamente: *"lembre de adicionar de forma minimalista a opção para alterar a linguagem nesta tela também"*.
- **Opções avaliadas**:
  1. *Menu Dropdown / Picker nativo*: Quebra a fluidez visual, exige múltiplos cliques e abre caixas de diálogo modais pesadas do sistema operacional.
  2. *Lista vertical longa*: Ocupa espaço excessivo na tela de perfil e compete visualmente com as métricas e a galeria.
  3. *Segmented Control em Micro-Pílula (`PT` | `EN` | `ES`)*: Design ultra-compacto, discreto, com cantos arredondados (`borderRadius: 20`), indicador animado suave de fundo e feedback háptico instantâneo.
- **Decisão**: Criar o componente `LanguagePillSelector.tsx` em `src/components/ui/` ou `src/components/features/profile/`.
  - Posição: Integrado discretamente abaixo do subtítulo de perfil ou na barra de ações rápidas.
  - Integração: Conecta-se à store de preferências (`usePreferences` / `useAccountCacheStore`), persistindo o idioma escolhido e sincronizando a tradução bíblica padrão correspondente (`pt` → `almeida`, `en` → `kjv`, `es` → `valera`).

---

### R2. Métricas Dinâmicas do Usuário (`ProfileMetricsRow`)
- **Contexto**: A imagem de referência apresenta uma barra de três métricas (`44 Following` | `4 Followers` | `0 Likes`) separadas por divisores finos. Em nosso aplicativo de fé e leitura, métricas sociais frias não agregam valor espiritual.
- **Adaptação Semântica**:
  - Coluna 1: **Salvos** (Contador real de versículos guardados via `useSavedVerses`).
  - Coluna 2: **Devocionais** (Dias seguidos de leitura ou devocionais concluídos).
  - Coluna 3: **Favoritos** (Passagens marcadas com amor).
- **Decisão**: Criar `ProfileMetricsRow.tsx` com divisores verticais sutis (`theme.borderSubtle`), números com peso forte (`fontWeight: bold`) e legendas compactas em caixa alta discreta.

---

### R3. Barra de Ações Rápidas em Squircle (`ProfileSquircleTabs`)
- **Contexto**: A referência possui 3 botões em formato squircle/pílula elevada com ícones centrais (`Grid`, `Heart`, `Eye/Config`).
- **Arquitetura de Abas**:
  - **Aba 1 (Grid / Galeria)**: Exibe a galeria de inspirações e cartões bíblicos temáticos.
  - **Aba 2 (Heart / Favoritos)**: Filtra e exibe os versículos guardados com tags de coração.
  - **Aba 3 (Config / Ajustes & LGPD)**: Abre as configurações completas da conta (edição de nome, foto de perfil, e-mail e exclusão permanente de conta LGPD).
- **Decisão**: Usar `@expo/vector-icons` (`Feather` com `grid`, `heart`, `sliders` ou `shield`) com fundo elevado (`theme.surfaceCard` com sombra suave `shadows.soft`), oferecendo feedback de toque e estado ativo destacado.

---

### R4. Galeria de Inspiração & Cartões Visuais (`InspirationGallery`)
- **Contexto**: A tela de referência destaca a seção "Gallery" com um card panorâmico central (templo) e miniaturas inferiores (Torre Eiffel, Pagoda, Montanha).
- **Adaptação para o App**:
  - Título da seção: *"Galeria de Inspiração"* ou *"Momentos Sagrados"*.
  - **Card Destaque**: Card horizontal com imagem panorâmica suave (ex: paisagens de montanhas, templos históricos ou céus abençoados), com versículo do dia ou tema inspiracional sobreposto com gradiente suave.
  - **Linha de Miniaturas**: Carrossel horizontal com cards quadrados arredondados com temas bíblicos (ex: *"Salmos da Criação"*, *"Paz no Vale"*, *"Luz do Alvorecer"*).
  - Ao tocar em qualquer card, navega para a busca ou abre o versículo em tela cheia.

---

### R5. Barra Inferior com Curvatura Orgânica (`CurvedBottomNav`)
- **Contexto**: O rodapé da imagem possui uma barra escura contínua com cantos superiores pronunciadamente arredondados (`borderTopLeftRadius: 28`, `borderTopRightRadius: 28`).
- **Abordagem**:
  - Implementar um componente de rodapé com elevação, cantos arredondados e suporte aos insets de tela (`useSafeAreaInsets().bottom`), exibindo os ícones ergonômicos (`home`, `search`, `plus`, `mail`, `user`).
  - No perfil, o ícone de usuário aparece selecionado com destaque.

---

### R6. Preservação Total de Segurança & LGPD
- **Contexto**: A tela atual de perfil possui regras críticas de LGPD (exclusão de conta com confirmação por senha) e edição de perfil.
- **Decisão**:
  - O botão de opções superiores (`...`) abre um menu de ações rápidas ("Editar Dados", "Privacidade & LGPD", "Sair da Conta").
  - A terceira aba de squircle ("Ajustes") dá acesso direto a esses mesmos formulários, preservando 100% da segurança sem poluir o visual principal do perfil.
