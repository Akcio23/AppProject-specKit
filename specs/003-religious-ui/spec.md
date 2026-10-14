# Feature Specification: UI Devocional Religiosa Moderna e Limpa

**Feature Branch**: `003-religious-ui`  
**Created**: 2026-10-13  
**Status**: Draft  
**Input**: "Minha proxima SPEC, sera focado na UI, remova toda referencia criada na primeira SPEC, agora o importante e criar uma UI utilizava, moderna e limpa focada no tema religioso. Consumindo os dados na API implementada na 2 spec"

---

## Contexto & Justificativa

A primeira especificação (`001-setup-react-native-base`) estabeleceu os alicerces técnicos do projeto com elementos de demonstração interna (contador Zustand genérico, badges de framework e cards de arquitetura). A segunda especificação (`002-bible-api-integration`) construiu com sucesso o serviço de dados conectado à `bible-api.com`.

Agora, esta especificação (`003-religious-ui`) eleva a aplicação do patamar de "template técnico de engenharia" para um **aplicativo devocional e bíblico real, moderno, sereno e visualmente inspirador**. Toda e qualquer referência crua à Spec 001 (contadores de teste, jargões de setup e blocos técnicos) é purgada da interface do usuário, dando lugar a uma experiência focada na Palavra Sagrada, com paleta litúrgica acolhedora, leitura confortável e navegação intuitiva.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Santuário Inicial & Versículo Devocional do Dia (Priority: P1)

Como uma pessoa em busca de inspiração e momento de fé diário, quero abrir o aplicativo e ser imediatamente recebido(a) por uma saudação acolhedora ("Graça e Paz" / "Pão Diário") e pelo Versículo do Dia em destaque editorial nobre (com texto bíblico fluido, referência dourada e tradução ativa), sem nenhum ruído visual técnico de desenvolvimento, para que eu possa meditar na Palavra em paz.

**Why this priority**: É o coração do app e a primeira impressão visual. Um app religioso precisa transmitir paz, reverência e beleza logo nos primeiros segundos, substituindo de vez a antiga tela de teste.

**Independent Test**:
Abrir o aplicativo e constatar:
1. Nenhuma menção a contadores, Zustand demo ou jargões de infraestrutura.
2. Presença de um cabeçalho acolhedor com saudação temporal dinâmica ("Que a paz esteja convosco", "Bom dia", "Boa tarde", "Boa noite").
3. Cartão devocional do "Versículo do Dia" estilizado com visual sagrado/elegante (tipografia requintada, aspas decorativas, referência destacada).
4. Botões de ação devocional: "Novo Versículo", "Copiar / Compartilhar Versículo" e "Ler Capítulo Completo".

**Acceptance Scenarios**:
1. **Given** o aplicativo aberto, **When** a tela principal for exibida, **Then** não deve conter nenhum componente remanescente da Spec 001 (contador, cards de arquitetura, badges técnicos).
2. **Given** o cartão de Versículo do Dia, **When** o usuário tocar em "Outro Versículo", **Then** um novo versículo deve ser requisitado via `useRandomVerse` exibindo animação de feedback/esqueleto sutil e elegante.
3. **Given** o versículo exibido, **When** o usuário tocar em "Copiar / Compartilhar", **Then** o texto e a referência devem ser copiados para a área de transferência do sistema com confirmação visual discreta ("Versículo copiado").
4. **Given** um erro de conexão com a API, **When** a tela carregar, **Then** deve exibir um estado de erro espiritual acolhedor ("Não foi possível buscar a Palavra no momento. Tentar novamente").

---

### User Story 2 - Pílulas Temáticas & Acesso Rápido à Sabedoria Bíblica (Priority: P2)

Como leitor da Bíblia que busca conforto para momentos específicos da vida, quero explorar temas espirituais rápidos (ex.: *Paz & Ansiedade*, *Esperança*, *Fé*, *Amor*, *Salmos de Louvor*, *Sabedoria em Provérbios*) e passagens emblemáticas com um único toque, para que eu encontre orientação bíblica sem precisar digitar referências complexas de memória.

**Why this priority**: Muitas pessoas não lembram de cabeça capítulos e versículos exatos quando estão angustiadas ou buscando gratidão. Pílulas temáticas trazem alto valor pastoral e usabilidade imediata.

**Independent Test**:
Na tela inicial, rolar até a seção "Temas & Meditações" ou "Passagens Rápidas", tocar em uma pílula (ex.: "Paz na Ansiedade - Filipenses 4:6-7" ou "Salmo do Bom Pastor - Salmos 23") e ser levado instantaneamente para a tela de leitura com a passagem carregada.

**Acceptance Scenarios**:
1. **Given** a tela inicial, **When** o usuário visualiza a seção temática, **Then** deve ver carrossel/grade de chips com ícones temáticos e descrições claras (ex.: Paz, Esperança, Gratidão, Coragem, Amor).
2. **Given** um toque em um tema bíblico, **When** selecionado, **Then** a navegação deve encaminhar para a tela de leitura/busca carregando os versículos correspondentes da `bible-api.com`.

---

### User Story 3 - Leitura Bíblica Focada e Busca Refinada (Priority: P2)

Como estudante ou leitor das Escrituras, quero uma tela de leitura limpa, sem poluição visual, onde eu possa buscar qualquer livro/capítulo/versículo, escolher traduções (Almeida, KJV, etc.) e ler com tipografia confortável e espaçamento generoso para leitura prolongada.

**Why this priority**: A experiência de consumo do texto sagrado deve ser impecável, oferecendo legibilidade similar a uma Bíblia física nobre ou a leitores de livros digitais de alto nível.

**Independent Test**:
Navegar para a busca/leitura, pesquisar uma referência como "Salmos 23" ou "João 3:16", visualizar o texto quebrado com números de versículos elegantes, selecionar a tradução desejada e testar a legibilidade clara tanto no tema escuro sereno quanto no claro.

**Acceptance Scenarios**:
1. **Given** a barra de busca, **When** o usuário digita uma passagem bíblica, **Then** um botão de ação com visual limpo deve disparar a consulta.
2. **Given** uma passagem carregada com múltiplos versículos, **When** renderizada em tela, **Then** cada versículo deve exibir seu numeral em destaque dourado/discreto com o texto justificado/fluido em tipografia legível.
3. **Given** o seletor de tradução, **When** o usuário alterna de versão (ex.: Almeida Revista e Atualizada vs KJV), **Then** a passagem deve ser recarregada na nova língua/tradução de forma suave.

---

### User Story 4 - Versículos Guardados no Coração (Favoritos / Meditações) (Priority: P3)

Como usuário devoto, quero ter a opção de favoritar/guardar versículos que tocaram meu coração durante a leitura, podendo revisá-los a qualquer momento em uma aba ou seção dedicada da interface, sem depender de cadastro ou login complexo.

**Why this priority**: Transforma uma consulta pontual em um companheiro diário de oração e devocional pessoal.

**Independent Test**:
Ao visualizar um versículo, tocar no ícone de "Coração" / "Favoritar"; verificar o versículo armazenado na lista de "Versículos Guardados" na memória local (Zustand com persistência ou estado local reativo).

**Acceptance Scenarios**:
1. **Given** qualquer versículo renderizado na UI, **When** o usuário tocar no ícone de favorito, **Then** o estado visual deve alternar (coração preenchido em dourado) e o versículo deve ser salvo na lista de guardados.
2. **Given** a seção de favoritos, **When** aberta, **Then** exibe a lista dos versículos salvos com opção de remoção e leitura completa.

---

## Edge Cases

- **Ausência de Conexão (Modo Avião / Sem Internet)**: O app não deve quebrar com telas brancas; deve exibir um card ilustrativo de oração com versículo offline de contingência (versículo bíblico de conforto em cache) e botão "Reconectar".
- **Passagens muito longas (ex.: Salmo 119 com 176 versículos)**: A lista deve usar renderização virtualizada com performance suave (`ScrollView` / `FlatList` otimizada), sem travamentos na UI thread.
- **Telas com notch / SafeArea**: Garantir que as barras superiores e inferiores respeitem os insets em todos os aparelhos (iOS e Android com gestos).
- **Contraste de acessibilidade**: Textos bíblicos devem possuir contraste mínimo WCAG AA sobre o fundo escuro sereno (azul noite/carvão sagrado) e sobre o fundo claro (pergaminho/marfim).

---

## Requirements *(mandatory)*

### Design & Identidade Visual
- **FR-001**: O sistema DEVE adotar uma paleta de cores temática sagrada e moderna:
  - Dourado Celestial / Âmbar Quente (`#D4AF37` / `#F59E0B` / `#D97706`) para destaques, numerais e ícones nobres.
  - Noite Sagrada Profunda (`#0A0F1D` / `#111827` / `#1F293D`) para fundo e superfícies no modo noturno relaxante.
  - Pergaminho Nobre / Luz Divina (`#FAF8F5` / `#F3EFEA`) para superfícies claras ou citações iluminadas.
- **FR-002**: O sistema DEVE remover integralmente qualquer resquício visual de protótipo de desenvolvimento criado na Spec 001 (contador numérico genérico, menção a ferramentas de setup, cards explicativos de TypeScript/arquitetura).
- **FR-003**: O sistema DEVE fornecer tipografia elegante para textos bíblicos com entrelinha arejada, aspas decorativas para versículos e hierarquia visual clara (Título do Livro > Capítulo e Versículo > Texto da Palavra > Tradução).

### Funcionalidades & Integração com a API (Spec 002)
- **FR-004**: A tela principal DEVE renderizar o "Versículo do Dia" consumindo o hook `useRandomVerse` e permitindo trocar de versículo com toque único.
- **FR-005**: O sistema DEVE permitir copiar o versículo atual com referência formatada para compartilhamento via WhatsApp, redes ou anotações pessoais.
- **FR-006**: A tela principal DEVE conter atalhos para temas devocionais populares (Paz, Esperança, Amor, Fé, Gratidão, Força) pré-configurados que levam à leitura imediata.
- **FR-007**: A tela de leitura/busca DEVE consumir `usePassage` e `useTranslations` da Spec 002 com interface de busca amigável, permitindo explorar capítulos inteiros ou versículos individuais.
- **FR-008**: O sistema DEVE fornecer suporte a favoritar versículos (salvar na memória local da aplicação usando Zustand).

---

## Key Entities

- **DevotionalVerse**: Representa um versículo destacado para meditação (texto, livro, capítulo, versículo, referência canônica, tradução e timestamp).
- **DevotionalTopic**: Categoria temática de conforto e inspiração (título, descrição, ícone bíblico, referência canônica recomendada).
- **SavedVerse**: Versículo guardado no coração pelo usuário para leitura posterior.

---

## Success Criteria *(mandatory)*

- **SC-001**: 100% dos resquícios e referências da SPEC 001 eliminados da UI final.
- **SC-002**: Abertura do app em menos de 1 segundo direto para o Versículo do Dia e ambiente devocional limpo.
- **SC-003**: Feedback tátil e visual ao copiar ou favoritar um versículo em menos de 100ms.
- **SC-004**: Conformidade estrita com TypeScript (`strict: true`, zero erros com `tsc --noEmit`) e princípios da Constituição do Projeto.
- **SC-005**: Experiência visual que inspire paz, contemplação e clareza, condizente com os melhores apps bíblicos contemporâneos.

---

## Assumptions

- A `bible-api.com` integrada na Spec 002 permanece funcional e como fonte primária dos dados bíblicos.
- O padrão idiomático preferencial do usuário continua sendo Português do Brasil (tradução Almeida).
- A persistência de favoritos pode operar via client-state com Zustand (com opção de expansão para storage permanente).
