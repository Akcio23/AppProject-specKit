# Feature Specification: Motor de Busca Bíblica Controlado (Seleção Pré-definida de Livros + Capítulo Livre)

**Feature Branch**: `008-controlled-bible-search`  
**Created**: 2026-10-15  
**Status**: Specified  
**Input**: Criação de um motor de busca bíblica mais controlado na versão em português (Almeida), permitindo ao usuário selecionar o livro desejado de forma prática e pré-definida (a partir da lista canônica dos 66 livros presente em `Untitled-1`), e preencher o capítulo de forma livre e flexível.

---

## 1. Contexto & Visão Geral

Atualmente, na tela `BibleSearchScreen`, a busca de passagens bíblicas depende 100% de o usuário digitar manualmente toda a referência em texto livre (ex.: `"1 Coríntios 13:4-7"`, `"Habacuque 2:4"`). 

Embora funcione para usuários experientes com teclado afiado, na prática mobile isso gera atritos constantes:
1. **Erros de digitação (typos)**: Digitar `"Colossences"`, `"Salmo"` (no singular), `"Hebreus"` sem maiúscula ou com acentuação inconsistente resulta em erro `NOT_FOUND` retornado pela API.
2. **Fadiga no teclado**: No celular, alternar entre letras, números e pontuação (`:`, `-`, espaço) para montar uma referência inteira cansa e desacelera o devocional.
3. **Descoberta limitada**: Usuários que não lembram de cabeça a ordem ou o nome exato dos livros ficam desamparados.

Esta especificação define o **Motor de Busca Bíblica Controlado**:
- **Seleção Assistida & Pré-definida do Livro**: O usuário seleciona o livro bíblico através de uma interface dedicada, visual e rápida (com suporte a busca por texto/filtro instantâneo e separação entre *Antigo Testamento* - 39 livros e *Novo Testamento* - 27 livros).
- **Entrada Livre do Capítulo / Versículo**: Uma vez selecionado o livro (ex.: `"João"`), um campo de texto livre e dinâmico permite ao usuário digitar o capítulo (ex.: `"3"`) ou capítulo com versículos (ex.: `"3:16"`, `"1:1-5"`).
- **Foco Inicial no Idioma Português**: Baseado na lista oficial de 66 livros da tradução João Ferreira de Almeida (`almeida`), extraída e validada em `specs/008-controlled-bible-search/books-pt.json`.
- **Feedback & Preview em Tempo Real**: Uma pílula ou cartão de resumo visual mostra a referência canônica final montada antes e durante a submissão.

---

## 2. User Scenarios & Testing *(mandatory)*

### User Story 1 - Seleção Prática & Pré-definida de Livro Bíblico (Priority: P1)

Como leitor da Bíblia, desejo selecionar o livro bíblico desejado a partir de uma lista pré-definida organizada e pesquisável, para nunca mais receber erro por errar o nome do livro no teclado.

**Why this priority**: É o cerne do novo motor de busca controlado solicitado pelo usuário. Garante assertividade de 100% no identificador do livro.

**Independent Test**: Pode ser testado abrindo o seletor de livros, filtrando por letras (ex: `"rom"` para achar Romanos) ou alternando entre Antigo/Novo Testamento e tocando no livro para confirmar.

**Acceptance Scenarios**:
1. **Given** que o usuário está na tela de busca, **When** ele toca no campo/botão de seleção de livro, **Then** abre-se uma gaveta ou modal com os 66 livros canônicos em português da tradução Almeida.
2. **Given** o seletor aberto, **When** o usuário digita no filtro de busca rápido (ex: `"jo"`), **Then** a lista exibe instantaneamente apenas os livros correspondentes (ex: *Josué, Jó, Joel, Jonas, João, 1 João, 2 João, 3 João*).
3. **Given** o seletor aberto, **When** o usuário alterna entre os filtros *"Todos"*, *"Antigo Testamento (39)"* e *"Novo Testamento (27)"*, **Then** a lista agrupa e exibe os livros de acordo com a categoria selecionada.
4. **Given** que o usuário toca em um livro (ex: `"Salmos"`), **Then** o livro é selecionado, o seletor fecha suavemente e o foco é automaticamente transferido para o campo de capítulo.

---

### User Story 2 - Entrada Livre e Flexível de Capítulo e Versículo (Priority: P1)

Como leitor da Bíblia, após selecionar o livro, desejo preencher livremente o capítulo (e opcionalmente versículos), sem bloqueios chatos ou validações excessivamente burocráticas, para poder ler tanto o capítulo inteiro quanto um versículo específico.

**Why this priority**: Complementa a seleção do livro permitindo liberdade total para ler `"3"`, `"23"`, `"3:16"`, `"1:1-4"` ou `"14:1-6"`.

**Independent Test**: Pode ser testado selecionando um livro, preenchendo `"1"` ou `"3:16"` e submetendo a busca, verificando se a passagem é carregada corretamente da API.

**Acceptance Scenarios**:
1. **Given** um livro selecionado (ex: `"Gênesis"`), **When** o usuário digita apenas o número `"1"` no campo de capítulo e clica em buscar, **Then** a busca envia a query `"Gênesis 1"` para a API e exibe o capítulo completo.
2. **Given** um livro selecionado (ex: `"João"`), **When** o usuário digita `"3:16"` ou `"3:16-17"`, **Then** a busca envia a query `"João 3:16"` para a API e exibe os versículos solicitados.
3. **Given** que nenhum livro foi selecionado, **When** o usuário tenta digitar no campo de capítulo ou submeter, **Then** a interface indica visualmente com sutileza para escolher o livro primeiro.

---

### User Story 3 - Alternância Fluida entre Modo Guiado (Controlado) e Modo Direto (Priority: P2)

Como usuário acostumado a digitar referências completas quando está com pressa, desejo a conveniência de poder usar a busca controlada por padrão, mantendo atalhos rápidos ou referências sugeridas em destaque.

**Why this priority**: Mantém a retrocompatibilidade com as passagens sugeridas que já encantam o usuário na tela atual.

**Acceptance Scenarios**:
1. **Given** a tela de busca, **When** o usuário toca em uma das passagens sugeridas (ex: `"Salmos 23"`), **Then** o motor preenche automaticamente o livro (`Salmos`) e o capítulo (`23`) e executa a busca instantaneamente.
2. **Given** uma busca executada com sucesso, **When** o usuário desejar trocar apenas o capítulo do mesmo livro, **Then** o livro permanece selecionado, bastando editar o número do capítulo.

---

## 3. Requisitos de Dados & Domínio

### 3.1 Fonte dos Livros (Tradução Almeida / PT-BR)
A lista de 66 livros foi extraída do arquivo de trabalho (`Untitled-1`) e consolidada em `specs/008-controlled-bible-search/books-pt.json`, contendo:
- **Identificador Canônico**: `id` da API (ex: `GEN`, `EXO`, `PSA`, `JHN`, `ROM`, `REV`).
- **Nome em Português**: `name` (ex: `Gênesis`, `Salmos`, `João`, `Apocalipse`).
- **Divisão Canônica**:
  - **Antigo Testamento (39 livros)**: De Gênesis (`GEN`) a Malaquias (`MAL`).
  - **Novo Testamento (27 livros)**: De Mateus (`MAT`) a Apocalipse (`REV`).

### 3.2 Formatação da Referência para a API
O motor combina os dois campos em uma string de consulta para a função `getPassage(reference, translationId)`:
```ts
const queryReference = `${selectedBook.name} ${chapterInput.trim()}`;
// Exemplos resultantes:
// "Gênesis 1"
// "João 3:16"
// "Salmos 23"
```

---

## 4. Design & Experiência do Usuário (UI/UX)

Seguindo os padrões do **Clean Pastel Design System**:
1. **Card Seletor de Livro**:
   - Botão de toque espaçoso com ícone de livro (`📖`), nome do livro selecionado em tipografia semibold (ou placeholder `"Toque para escolher o livro"` em cor secundária), e seta/chevron discreto.
2. **Campo de Capítulo / Versículo**:
   - `TextField` estilizado com teclado numérico/telefônico ou padrão, aceitando números, `:` e `-`.
   - Placeholder autoexplicativo: `"Capítulo (ex: 3 ou 3:16)"`.
3. **Modal / Bottom Sheet de Seleção de Livros**:
   - Cabeçalho com barra de pesquisa rápida (`TextField` de filtro instantâneo).
   - Segmented Control / Tabs: `[Todos]`, `[Antigo Testamento]`, `[Novo Testamento]`.
   - Lista rolante suave com feedback tátil e destaque no livro atualmente selecionado.
4. **Botão de Ação Primária**:
   - Botão `"Buscar Passagem"` com estado de loading integrado (`passage.isFetching`).
5. **Acessibilidade & Dark Mode**:
   - Suporte completo às paletas claras e escuras já estabelecidas no hook `useTheme`.

---

## 5. Casos de Borda & Tratamento de Erros

1. **Capítulo Vazio**: Se o usuário selecionar o livro mas esquecer de preencher o capítulo, o botão de busca fica desabilitado ou assume o capítulo `1` como padrão sugerido.
2. **Capítulo Inválido ou Inexistente**: Se o usuário digitar `"Salmos 999"`, a API retorna `NOT_FOUND`. O componente `StateMessage` amigável exibe mensagem orientando que o capítulo informado não existe naquele livro.
3. **Caracteres Estranhos**: Sanitização no input para remover letras acidentais se o modo for focado em capítulo/versículo.
4. **Performance da Lista**: Uso de lista otimizada (`FlatList` ou itens memoizados) para rolagem 60fps sem engasgos nos 66 livros.

---

## 6. Próximos Passos no Ciclo Spec Kit

1. `/speckit.clarify`: Validar com o usuário preferências de layout (ex.: Modal Bottom Sheet vs Seletor Dropdown em tela).
2. `/speckit.plan`: Planejar a criação do componente `BookSelectorModal`, constante `BIBLE_BOOKS_PT` e refatoração da `BibleSearchScreen`.
3. `/speckit.tasks`: Gerar lista de tarefas atômicas de implementação.
4. `/speckit.implement`: Executar código com qualidade, testes e documentação.
