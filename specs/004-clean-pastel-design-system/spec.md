# Feature Specification: Design System Clean Pastel & Redesign Minimalista (Claro / Escuro)

**Feature Branch**: `004-clean-pastel-design-system`  
**Created**: 2026-10-14  
**Status**: Ready for Planning  
**Input**: "na proxima SPEC, eu quero que você repasse em todas as telas com o desginer Senior, deixa elas mais cleans estão sobre carregadas, altere as cores, para tons pasteis ex: ( branco, marron, preto, amarelo mais opaco) faça tambem a opção de alterações de tema para escuro e claro"

---

## 🎨 Parecer do Designer Sênior & Diagnóstico de UX

### O Diagnóstico: O "Efeito Catedral Barroca Exagerada"
Ao auditar as telas atuais (`WelcomeScreen`, `BibleSearchScreen`, `SideDrawer`, `VerseOfTheDayCard`, `DevotionalTopics`, `SettingsTranslationList`), nosso time de design identificou os seguintes pontos críticos de sobrecarga cognitiva:
1. **Poluição por Badges e Elementos Flutuantes**: Muitos chips, tags ("✨ PALAVRA DO DIA", "BÍBLIA SAGRADA"), aspas gigantes e botões sobrepostos disputando a atenção com o texto bíblico.
2. **Bordas Douradas e Contrastes Agressivos**: O uso excessivo de bordas douradas intensas (`rgba(212, 175, 55, 0.40)`) sobre fundos pretos absolutos gera cansaço visual e estética "gamer/neon", distante da paz e serenidade de um livro de oração.
3. **Falta de Espaço Negativo (Respiro)**: Os componentes estavam colados e empilhados com densidade excessiva, sem permitir que a Palavra seja o centro absoluto da experiência.
4. **Ausência de Suporte Real a Tema Claro/Escuro Dinâmico**: As telas possuíam estilos e cores escuras fixas no código, impedindo que o leitor alternasse suavemente entre modos de leitura diurna e noturna.

### A Solução: Design Editorial Monástico Minimalista & Tons Pastéis Orgânicos
Inspirado na tipografia nobre de editoriais escandinavos e nos tons acolhedores de pergaminhos clássicos:
- **Cores Pastéis Terrosas**:
  - **Branco Suave / Alabastro / Linho**: `#FAF8F5` (fundo diurno acolhedor, não agride a vista) e `#FFFFFF` (superfícies limpas).
  - **Marrom Suave / Taupe / Café Quente**: `#433422` (acentos elegantes no claro), `#7D6B5D` (subtítulos e detalhes), `#261E19` (superfícies escuras aveludadas).
  - **Preto Fosco / Carvão Suave**: `#181716` (modo escuro sereno, sem contraste agressivo) e `#22201E` (cards escuros).
  - **Amarelo Opaco Pastel / Manteiga / Trigo Suave**: `#DFCA86` / `#EBDDB2` (destaques, ícones e estados ativos com sutileza, aposentando o dourado espalhafatoso).
- **Redução Radical de Ruído Visual**:
  - Remoção de badges desnecessários e linhas pesadas.
  - Divisores minimalistas quase imperceptíveis (0.5px com opacidade delicada).
  - Tipografia com respiração ampla (letter-spacing elegante, line-height confortável).
- **Alternância de Tema Claro ☀️ e Escuro 🌙 Totalmente Integrada**:
  - Toggle intuitivo, acessível e prazeroso com feedback tátil (Haptics).
  - Adaptação instantânea de todas as telas, cards, gaveta de navegação, modais e barra de busca.

---

## User Scenarios & Testing

### User Story 1 - Alternância Dinâmica de Tema Claro / Escuro (Priority: P1)
Como pessoa que lê a Bíblia pela manhã na luz do sol e à noite antes de dormir, quero alternar entre os temas Claro (tons de alabastro, linho e marrom suave) e Escuro (tons de carvão aveludado e sépia profundo) com um simples toque, para que meus olhos não se cansem independente da iluminação do ambiente.

**Why this priority**: É uma exigência central da especificação e o pilar da nova arquitetura de temas do app.

**Independent Test**:
1. Abrir o app e localizar o botão de alternância de tema no cabeçalho ou menu lateral.
2. Tocar no botão de alternância.
3. Constatar a transição imediata e harmoniosa entre o modo Claro pastel e o modo Escuro aveludado em todas as seções (cabeçalho, versículo do dia, temas, oração, drawer e busca).
4. Fechar e reabrir o app para confirmar que a preferência do usuário é mantida via store.

**Acceptance Scenarios**:
1. **Given** o aplicativo em modo escuro, **When** o usuário tocar no botão de alternância de tema, **Then** a interface inteira deve mudar para a paleta clara pastel imediatamente sem piscar ou quebrar contrastes.
2. **Given** o aplicativo em modo claro, **When** o usuário navegar para a tela de busca ou abrir o SideDrawer, **Then** todos os componentes devem refletir as cores claras pastéis com legibilidade AAA.

---

### User Story 2 - Tela Inicial (WelcomeScreen) Minimalista e Descomplicada (Priority: P1)
Como devoto que busca tranquilidade, quero abrir o aplicativo e me deparar com uma tela inicial limpa, arejada e sem excessos decorativos, onde a mensagem bíblica e a oração brilhem naturalmente com cores pastéis confortáveis.

**Why this priority**: A tela inicial dita o tom da experiência do usuário; precisa transmitir alívio e paz, não sobrecarga mental.

**Independent Test**:
1. Observar o cabeçalho: saudação leve, botão hamburger sutil e alternador de tema minimalista.
2. Observar o Cartão do Versículo do Dia: fundo sem reflexos pesados, tipografia límpida, ações discretas (favoritar, compartilhar e ler).
3. Observar a seção de oração e temas: visual plano/editorial com divisores sutis e espaçamentos equilibrados.

**Acceptance Scenarios**:
1. **Given** a tela inicial, **When** renderizada, **Then** não devem existir mais bordas espessas douradas reflexivas ou sombras pesadas de neon.
2. **Given** o cartão de oração e versículo do dia, **When** visualizados, **Then** as cores de fundo devem ser harmoniosas (marrom suave / alabastro suave / amarelo opaco nos acentos).

---

### User Story 3 - Busca e Leitura Bíblica Focada e Arejada (Priority: P2)
Como estudante da Bíblia, quero que a tela de busca e leitura ofereça um campo de texto limpo, sugestões elegantes em chips neutros e uma renderização de capítulos que lembre um livro de alta qualidade impresso em papel pólen.

**Why this priority**: A leitura de textos sagrados longos exige o mais alto nível de conforto visual e ausência total de distrações.

**Independent Test**:
1. Acessar a tela de busca `BibleSearchScreen`.
2. Verificar o campo de pesquisa com estilo minimalista (fundo sutil, borda fina, sem brilho agressivo).
3. Testar a leitura de uma passagem longa (ex.: Salmos 23 ou 1 Coríntios 13) e verificar o alinhamento, espaçamento e numerais de versículo discretos em amarelo opaco pastel.

**Acceptance Scenarios**:
1. **Given** a tela de busca, **When** os exemplos de passagens forem exibidos, **Then** eles devem se parecer com etiquetas editoriais limpas em tons pastéis.
2. **Given** uma passagem carregada, **When** visualizada no modo claro ou escuro, **Then** o contraste do texto deve ser suave, legível e livre de ofuscamento.

---

### User Story 4 - SideDrawer e Menus Redesenhados com Elegância Leve (Priority: P2)
Como usuário navegando pelos recursos do app, quero que a gaveta lateral de navegação seja suave, com opções bem espaçadas, ícones discretos e um seletor de tema rápido e charmoso no rodapé ou cabeçalho.

**Why this priority**: A navegação lateral deve integrar perfeitamente a nova identidade visual sem parecer um bloco escuro isolado.

**Acceptance Scenarios**:
1. **Given** o menu lateral aberto, **When** visualizado, **Then** o fundo e os itens ativos devem respeitar o tema atual (marrom pastel + amarelo opaco no ativo).
2. **Given** o seletor de tema na gaveta, **When** acionado, **Then** deve alternar o tema do app com resposta tátil instantânea.

---

## Requisitos de Sistema & Design Tokens

### Paleta de Cores Pastéis

| Token | Modo Claro (Light Pastel) | Modo Escuro (Dark Velvet) | Finalidade |
|---|---|---|---|
| `bg` | `#FAF8F5` (Linho / Alabastro) | `#181716` (Carvão Aveludado) | Fundo principal da aplicação |
| `surface` | `#FFFFFF` (Branco Puro) | `#22201E` (Moca Escuro Profundo) | Superfície de cards e painéis |
| `surfaceSubtle` | `#F2ECE4` (Pergaminho Neutro) | `#2A2724` (Sépia Escuro Sutil) | Inputs, chips e fundos secundários |
| `textPrimary` | `#262320` (Café Profundo) | `#F5F2EB` (Marfim Suave) | Títulos e versículos |
| `textSecondary` | `#736B63` (Taupe Médio) | `#A8A199` (Areia Suave) | Subtítulos e metadados |
| `textMuted` | `#A69E95` (Cinza Areia) | `#6B655E` (Taupe Escuro) | Placeholders e notas de rodapé |
| `accent` | `#DFCA86` (Amarelo Pastel Opaco) | `#E5D396` (Amarelo Manteiga Fosco) | Destaques nobres e numerais |
| `accentMuted` | `#F5EECD` (Manteiga Suave) | `#3D3624` (Ocre Sombra) | Badges e pílulas ativas |
| `border` | `#E8E2D8` (Linho Sutil 1px) | `#332F2B` (Borda Carvão Suave) | Divisores e contornos leves |
| `cardBorder` | `#EFE9DF` (Quase imperceptível) | `#2E2A26` (Delicada) | Contorno estrutural de cards |

### Tipografia e Espaçamento
- **Bordas**: Redução dos cantos exagerados para raios mais elegantes e modernos (8px a 16px para cards, 9999px apenas para chips de ação rápida).
- **Sombras**: Eliminação de sombras coloridas ou reflexivas; substituição por elevações suaves e neutras (`elevation: 1` a `2` no Android, sombras suaves no iOS).
- **Espaço para Respirar**: Aumento dos paddings internos e margens verticais entre seções para um ritmo de leitura natural e repousante.
