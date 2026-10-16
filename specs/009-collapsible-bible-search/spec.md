# Feature Specification: Barra de Busca Bíblica Retrátil ao Rolar (Collapsible Bible Search Bar)

**Feature Branch**: `009-collapsible-bible-search`  
**Created**: 2026-10-15  
**Status**: Specified  
**Input**: Ajustar a barra de pesquisa bíblica (`ControlledBibleSearch`) para que toda a barra de pesquisa suma suavemente quando o usuário rolar a leitura para baixo, mantendo fixo no topo apenas o título do livro atual (ex: "📖 Atos 11"), e fazendo a barra de pesquisa completa reaparecer quando o usuário rolar a tela para cima.

---

## 1. Contexto & Visão Geral

Na tela principal de leitura e pesquisa bíblica (`BibleSearchScreen`), o leitor utiliza o componente `ControlledBibleSearch` para selecionar o livro canônico e informar o capítulo ou versículo desejado.

Atualmente, o card de busca ocupa uma área vertical considerável da tela (aproximadamente 200px a 240px de altura), exibindo:
1. **Linha Principal de Entradas**: Seletor do Livro Sagrado + Campo de Capítulo/Versículo.
2. **Linha de Atalhos Rápidos**: Rótulo "Livros Populares:" e chips de atalhos (*Salmos, João, Mateus, Romanos, Gênesis*).
3. **Linha de Ações/Rodapé**: Pílula de visualização da consulta ("Consulta: Atos 11"), botão textual "Limpar" e botão de ação primária "Ler Texto".

### O Problema
Ao carregar uma passagem extensa (por exemplo, um capítulo de 30 a 50 versículos) e iniciar a leitura, esse card volumoso consome cerca de 30% a 40% da área útil de visualização em dispositivos móveis. O leitor precisa de imersão total no texto sagrado, sem caixas de digitação ou botões roubando a atenção.

### A Solução
Implementar o comportamento refinado de **Barra de Busca Totalmente Retrátil (Ultra-Compact Sticky Title)**:
- **Ao rolar o texto para baixo (scroll down)**: A barra de pesquisa inteira desaparece, dando lugar a uma barra fixa, minimalista e elegante contendo **apenas o título do livro e capítulo atual** (ex.: `📖 Atos 11`), liberando 100% da tela para os versículos.
- **Ao rolar para cima (scroll up) ou retornar ao topo**: A barra de pesquisa completa reaparece com transição suave, trazendo de volta todos os campos de seleção, atalhos populares e ações.
- **Toque de Acesso Rápido**: Tocar no título do livro fixo também re-expande a barra instantaneamente caso o usuário queira buscar sem precisar rolar até o topo.

---

## 2. User Scenarios & Testing *(mandatory)*

### User Story 1 - Colapso Automático ao Rolar para Leitura (Priority: P1)

Como leitor da Bíblia no aplicativo móvel, desejo que os controles secundários de busca (livros populares e botões de ação) sumam suavemente quando eu rolar a lista de versículos para baixo, para que eu tenha muito mais espaço na tela focado exclusivamente na leitura dos versículos.

**Why this priority**: É o objetivo central da especificação solicitada pelo usuário. Proporciona ganho imediato de usabilidade e leitura imersiva.

**Independent Test**: Pode ser testado carregando qualquer passagem (ex: Atos 11 ou Salmos 23), deslizando a lista para baixo e verificando visualmente que o card colapsa, escondendo os livros populares e a linha inferior ("Consulta: ...", "Limpar", "Ler Texto").

**Acceptance Scenarios**:
1. **Given** que o usuário está visualizando uma passagem bíblica com versículos carregados, **When** ele arrasta/rola a tela para baixo (scroll vertical descendente > 15px), **Then** a seção de livros populares e o rodapé de consulta/ações desaparecem com uma animação de recolhimento suave.
2. **Given** a barra em modo colapsado, **When** o usuário observa o topo da tela, **Then** apenas os campos "Livro Sagrado" e "Capítulo / Versículo" permanecem visíveis e operáveis.
3. **Given** que o usuário está no modo colapsado e edita o número do capítulo pelo teclado e clica em "Buscar/Ir" no teclado, **Then** a busca da nova referência é disparada normalmente.

---

### User Story 2 - Re-expansão ao Rolar para Cima ou Retornar ao Topo (Priority: P1)

Como leitor da Bíblia, desejo que a barra volte ao seu estado expandido com facilidade quando eu puxar a tela para cima ou voltar ao topo da lista, para que eu possa selecionar novos livros populares ou limpar a consulta sem esforço.

**Why this priority**: Garante que o usuário nunca fique preso no modo compacto ou tenha que adivinhar como recuperar as opções originais.

**Independent Test**: Rolar o texto para baixo (causando o colapso) e em seguida rolar para cima ou atingir o topo (`offset Y <= 5`), observando o retorno suave de todos os elementos.

**Acceptance Scenarios**:
1. **Given** a barra de busca no modo colapsado, **When** o usuário rola o conteúdo em direção ao topo (scroll up) ou atinge o topo da lista (`contentOffsetY <= 5`), **Then** a barra se expande com animação fluida, revelando novamente os livros populares e os botões inferiores.
2. **Given** a barra colapsada, **When** o usuário toca para abrir o seletor de livros (`BookPickerModal`), **Then** a seleção de livro funciona perfeitamente sem glitches visuais.

---

### User Story 3 - Comportamento com Lista Vazia ou Sugestões (Priority: P2)

Como usuário na tela inicial de busca (sem passagem carregada ou na lista de sugestões iniciais), desejo que a barra permaneça confortavelmente expandida por padrão para que eu escolha minha primeira leitura com facilidade.

**Why this priority**: Em telas sem conteúdo longo para rolar, o recolhimento não deve ocorrer desnecessariamente.

**Acceptance Scenarios**:
1. **Given** a tela inicial sem nenhuma passagem buscada, **When** o usuário observa a tela, **Then** a barra permanece totalmente expandida exibindo todos os atalhos e sugestões.
2. **Given** a lista de sugestões (ex: "Passagens Sugeridas"), **When** o usuário toca em uma sugestão, **Then** a passagem é carregada e a transição dinâmica passa a responder ao scroll dos versículos.

---

## 3. Requisitos Funcionais & Técnicos

### 3.1 Anatomia da Barra Compacta vs Expandida

| Elemento | Modo Expandido (Topo / Inicial) | Modo Compacto (Durante Leitura / Scroll) |
|---|---|---|
| **Rótulo "Livro Sagrado"** | Visível | Visível |
| **Seletor de Livro** | Visível (📖 Livro + Chevron) | Visível |
| **Rótulo "Capítulo / Versículo"** | Visível | Visível |
| **Input de Capítulo** | Visível com campo e botão limpar | Visível |
| **Linha de Livros Populares** | Visível (chips com Salmos, João, etc.) | **Oculto / Recolhido** |
| **Linha de Rodapé (Consulta / Limpar / Ler Texto)** | Visível | **Oculto / Recolhido** |
| **Altura Total Estimada** | ~210px | ~80px |

### 3.2 Gatilhos e Sensibilidade de Scroll
- Utilizar listener de scroll da `FlatList` em `PassageView` com `onScroll` e detecção de direção de rolagem (`scrollDirection: 'down' | 'up'`) ou `offsetY`.
- Adicionar uma zona morta (deadzone/threshold de 10 a 20px) para evitar jitter (trepidação visual) em pequenos toques estáticos.
- Quando `offsetY <= 10`, forçar expansão completa automática.

### 3.3 Animação e Performance
- Evitar re-renders excessivos a cada pixel de scroll. O estado de colapso deve ser binário (`isCollapsed: boolean`) ou controlado via `Animated.Value` com interpolação de altura e opacidade (`opacity: 1 -> 0`, `maxHeight` ou transição de layout fluida via `LayoutAnimation` / `Animated`).
- Respeitar estritamente o princípio **III (Guerra aos Re-renders)** da Constituição do projeto.

---

## 4. Design & Experiência do Usuário (Clean Pastel)

1. **Continuidade Estética**: O container do card mantém o acabamento pastel suave com bordas arredondadas e sombra suave (`shadows.soft`).
2. **Feedback Tátil**: Preservar o feedback háptico ao tocar nos elementos.
3. **Indicador Visual Opcional**: No modo colapsado, o card pode exibir um mini botão ou chevron discreto indicando que pode ser re-expandido com um simples toque caso o usuário não queira rolar.

---

## 5. Casos de Borda & Mitigações

1. **Teclado Ativo**: Se o usuário focar no `TextInput` de capítulo enquanto estiver lendo, a barra deve preferencialmente expandir ou acomodar o teclado sem cortar a visualização (`KeyboardAvoidingView` / `keyboardShouldPersistTaps`).
2. **Capítulo Curto (poucos versículos)**: Se a passagem tiver apenas 2 versículos (ex: Salmo 117), a lista pode não ter scroll suficiente. Nesse caso, a barra permanece visível sem travar a interface.
3. **Alternância Rápida de Direção**: Se o usuário deslizar rapidamente o dedo para cima e para baixo, o debounce/limite de sensibilidade garante que a animação não entre em loop oscilante.
