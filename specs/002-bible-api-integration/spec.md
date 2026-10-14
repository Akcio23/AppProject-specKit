# Feature Specification: Integração com a Bíblia (bible-api.com)

**Feature Branch**: `002-bible-api-integration`

**Created**: 2026-10-13

**Status**: Completed

**Input**: User description: "Minha próxima SPEC será a integração com a API bible-api.com, leia a sua documentação e faça a integração"

## Clarifications

### Session 2026-10-13

- Q: Qual o escopo de UI? → A: Versículo aleatório ("Versículo do Dia") na tela inicial + tela de busca por referência (ex.: "João 3:16").
- Q: Gerenciamento de dados remotos? → A: Usar camada com cache e retry automáticos (conforme Constituição, princípio IV).
- Q: Tradução padrão? → A: João Ferreira de Almeida (PT-BR) como padrão, com seletor opcional de tradução.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Versículo do Dia na tela inicial (Priority: P1)

Ao abrir o app, o usuário vê um versículo bíblico aleatório em português, com a referência (livro, capítulo e versículo) e o nome da tradução. Pode pedir "outro versículo" com um toque.

**Why this priority**: Entrega valor imediato sem exigir nenhuma ação do usuário e valida a integração ponta a ponta.

**Independent Test**: Abrir o app com internet → um versículo com referência aparece; tocar em "Outro versículo" → um versículo diferente aparece.

**Acceptance Scenarios**:

1. **Given** o app aberto com conexão, **When** a tela inicial carrega, **Then** um versículo aleatório é exibido com texto, referência e tradução.
2. **Given** um versículo exibido, **When** o usuário toca em "Outro versículo", **Then** um novo versículo é carregado com indicador de carregamento visível.
3. **Given** o app sem conexão, **When** a tela inicial carrega, **Then** uma mensagem amigável de erro é exibida com opção "Tentar novamente".

---

### User Story 2 - Buscar passagem por referência (Priority: P2)

O usuário acessa uma tela de busca, digita uma referência em linguagem natural (ex.: "João 3:16", "Salmos 23", "Mateus 25:31-33,46") e lê a passagem resultante, versículo a versículo.

**Why this priority**: É a principal funcionalidade ativa de leitura; depende da mesma base da P1.

**Independent Test**: Na tela de busca, digitar "João 3:16-17" e confirmar → dois versículos numerados aparecem.

**Acceptance Scenarios**:

1. **Given** a tela de busca, **When** o usuário digita "João 3:16" e confirma, **Then** o versículo é exibido com sua referência.
2. **Given** a tela de busca, **When** o usuário busca um intervalo, **Then** cada versículo é listado com seu número.
3. **Given** a tela de busca, **When** o usuário busca uma referência inexistente, **Then** é exibida a mensagem "Referência não encontrada".
4. **Given** o campo vazio, **When** o usuário tenta buscar, **Then** a busca não é disparada.

---

### User Story 3 - Escolher a tradução (Priority: P3)

O usuário pode trocar a tradução usada (ex.: Almeida, KJV, WEB). A escolha vale para o Versículo do Dia e para a busca durante a sessão.

**Why this priority**: Incremento de valor; o padrão em português já atende a maioria.

**Independent Test**: Selecionar "King James Version" e buscar "John 3:16" → texto em inglês da KJV.

**Acceptance Scenarios**:

1. **Given** a lista de traduções, **When** o usuário seleciona outra, **Then** as próximas consultas usam a tradução escolhida e o nome dela aparece no resultado.

---

### Edge Cases

- Limite de uso do serviço (15 requisições a cada 30 segundos por IP) atingido → mensagem "Muitas requisições, aguarde alguns segundos".
- Serviço externo fora do ar / tempo esgotado → mensagem de erro com "Tentar novamente".
- Livros de capítulo único (Obadias, Filemom, 2 e 3 João, Judas): "Judas 1" retorna o versículo 1 (comportamento padrão do serviço).
- Textos retornados com espaços/quebras extras no final → exibidos sem espaços sobrando.
- Nome de livro em idioma diferente da tradução escolhida pode não ser reconhecido → "Referência não encontrada".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir um versículo aleatório na tela inicial, com texto, referência e nome da tradução.
- **FR-002**: Usuários MUST poder solicitar um novo versículo aleatório.
- **FR-003**: Usuários MUST poder buscar passagens por referência textual (versículo único, intervalo e listas separadas por vírgula).
- **FR-004**: O sistema MUST listar cada versículo de uma passagem com seu número.
- **FR-005**: O sistema MUST usar "João Ferreira de Almeida" como tradução padrão.
- **FR-006**: Usuários MUST poder trocar a tradução a partir da lista oferecida pelo serviço.
- **FR-007**: O sistema MUST exibir estados de carregamento, erro (rede, não encontrado, limite de uso) e vazio de forma clara.
- **FR-008**: O sistema MUST reaproveitar resultados já consultados para evitar requisições repetidas e respeitar o limite de uso.
- **FR-009**: O sistema MUST permitir nova tentativa após falha.

### Key Entities

- **Tradução**: identificador, nome, idioma, licença.
- **Versículo**: livro (id e nome), capítulo, número, texto.
- **Passagem**: referência digitada/normalizada, lista de versículos, texto completo, tradução.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O Versículo do Dia aparece em menos de 3 segundos após abrir o app em conexão 4G.
- **SC-002**: 100% das referências do exemplo oficial ("João 3:16", "Mateus 25:31-33,46") retornam o resultado correto.
- **SC-003**: Repetir a mesma busca na mesma sessão exibe o resultado instantaneamente, sem nova espera.
- **SC-004**: Em 100% das falhas (rede, não encontrado, limite) o usuário vê uma mensagem compreensível e uma ação de recuperação.

## Assumptions

- O serviço bible-api.com é gratuito, sem autenticação e sem garantia de disponibilidade.
- Não há modo offline completo nesta versão (apenas cache em memória durante a sessão).
- A escolha de tradução não precisa persistir entre reinícios do app nesta versão.
- O app não fará download da Bíblia inteira (proibido pelos termos de uso do serviço).
