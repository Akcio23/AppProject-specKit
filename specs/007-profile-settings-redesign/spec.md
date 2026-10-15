# Feature Specification: Redesign da Tela de Perfil & Configurações de Usuário

**Feature Branch**: `007-profile-settings-redesign`  
**Created**: 2026-10-15  
**Status**: Implemented
**Input**: Redesign da tela de perfil e configurações de usuário seguindo o modelo visual de referência (avatar circular limpo, métricas em colunas, botões de ação em squircle, galeria em destaque e barra inferior moderna) com adição minimalista do seletor de idiomas (PT / EN / ES).

---

## 1. Contexto & Visão Geral

A tela atual de perfil (`ProfileScreen`) possui funcionalidades robustas (upload de foto, alteração de nome, visualização de dados de conta e exclusão LGPD), porém sua apresentação visual é um formulário vertical tradicional.

Esta especificação define o redesign completo da tela de Perfil & Configurações de Usuário inspirado na interface mobile moderna de alta fidelidade apresentada pelo usuário:
1. **Header Superior Minimalista**: Acesso a voltar/menu à esquerda e menu de opções contextuais (`...`) à direita (ações de privacidade LGPD e logout).
2. **Hero de Identidade Visual**: Avatar circular destacado com halo sutil, tipografia moderna e hierárquica (Nome completo em destaque, papel/subtítulo devocional e data de ingresso).
3. **Barra de Métricas do Usuário**: Três colunas separadas por divisores finos com contadores reais e motivacionais da jornada espiritual:
   - *Salvos*: Versículos guardados pelo usuário.
   - *Devocionais*: Dias ou leituras realizadas.
   - *Favoritos*: Reflexões marcadas com coração.
4. **Seletor de Idioma Minimalista**: Switcher em formato de pílula compacta e sutil (`PT` | `EN` | `ES`), integrando perfeitamente a preferência linguística do usuário sem poluir o visual.
5. **Barra de Ações Rápidas (Squircles)**: Três botões em formato de pílula suave:
   - *Galeria / Versículos*: Exibição dos cartões salvos e destaques visuais.
   - *Favoritos*: Filtro direto de passagens amadas.
   - *Ajustes*: Edição rápida de nome, foto e dados da conta.
6. **Seção de Galeria & Inspirações Visuais**:
   - Card principal panorâmico com imagem e texto em destaque.
   - Carrossel horizontal ou grid de cards inspiracionais em miniaturas estilizadas.
7. **Barra de Navegação Inferior Curva**: Rodapé escuro integrado com cantos superiores arredondados e ícones refinados para navegação entre as seções do app.

---

## 2. User Scenarios & Testing *(mandatory)*

### User Story 1 - Perfil Visual Elegante com Métricas & Avatar (Priority: P1)

Como usuário autenticado ou visitante com perfil, desejo visualizar minha foto, nome, tempo de membro e indicadores da minha caminhada (versículos salvos e devocionais) em uma interface limpa e inspiradora.

**Why this priority**: É a primeira impressão do usuário ao acessar sua área pessoal; precisa transmitir sensação premium, paz e conexão imediata.

**Independent Test**: Pode ser testado abrindo a tela de perfil e conferindo a renderização do avatar, nome, subtítulo e contadores reais extraídos da base local/remota.

**Acceptance Scenarios**:
1. **Given** que o usuário está logado com foto cadastrada, **When** ele abre o perfil, **Then** o avatar circular é renderizado com alta nitidez, sombra suave, nome completo e métricas corretas (Salvos, Devocionais, Favoritos).
2. **Given** que o usuário não possui foto personalizada, **When** ele acessa o perfil, **Then** um avatar elegante de iniciais em paleta pastel é apresentado com indicador para upload.
3. **Given** que o usuário toca no botão de opções (`...`) no canto superior direito, **When** o menu abre, **Then** opções de editar perfil, privacidade (LGPD) e sair da conta são disponibilizadas com segurança.

---

### User Story 2 - Seletor Minimalista de Idioma (Priority: P1)

Como usuário bilíngue ou internacional, desejo alternar facilmente o idioma do app e das passagens bíblicas através de um controle discreto e elegante, sem precisar navegar por menus labirínticos.

**Why this priority**: Requisito explícito e central do usuário para acessibilidade e internacionalização direta na própria tela de perfil.

**Independent Test**: Pode ser testado tocando nas opções de idioma (`PT`, `EN`, `ES`) e verificando a alternância instantânea de estado com micro-animação e persistência em cache e perfil.

**Acceptance Scenarios**:
1. **Given** que a tela de perfil está visível, **When** o usuário visualiza o seletor de idiomas, **Then** um componente pílula minimalista exibe as opções (`PT` | `EN` | `ES`) com a opção ativa destacada com fundo suave e contraste nítido.
2. **Given** que o idioma atual é `PT`, **When** o usuário toca em `EN`, **Then** o app aplica feedback tátil leve (haptic), altera o indicador visual da pílula e atualiza a preferência de tradução/idioma persistida no dispositivo.
3. **Given** que o usuário está desconectado da internet, **When** ele altera o idioma, **Then** a alteração é gravada localmente de forma resiliente para sincronização posterior.

---

### User Story 3 - Galeria Visual & Cards de Inspiração (Priority: P2)

Como usuário do aplicativo bíblico, desejo explorar uma galeria com um card em destaque e coleções de miniaturas visuais dos temas sagrados e passagens favoritas.

**Why this priority**: Traz o componente estético e visual do design original (paisagens e monumentos transformados em cenários de oração e meditação bíblica).

**Independent Test**: Pode ser testado rolando até a seção "Galeria", verificando a exibição do card panorâmico e miniaturas clicáveis que abrem a passagem bíblica correspondente.

**Acceptance Scenarios**:
1. **Given** que o usuário está na aba Galeria, **When** ele visualiza a tela, **Then** um card panorâmico com imagem suave e tipografia legível apresenta o "Tema em Destaque".
2. **Given** a linha de cards inferiores, **When** o usuário desliza horizontalmente ou toca em um card, **Then** a visualização detalhada daquele tema/versículo é aberta com transição fluida.

---

### User Story 4 - Abas Rápidas e Edição de Perfil (Priority: P2)

Como usuário, desejo alternar entre minha galeria, meus favoritos e configurações de conta utilizando os botões de ação em formato squircle.

**Why this priority**: Garante que todas as funcionalidades essenciais do app (troca de nome, troca de foto e LGPD) permaneçam 100% acessíveis e intuitivas no novo layout.

**Independent Test**: Pode ser testado clicando no ícone de ajustes/cadeado para abrir a edição de nome e opções de conta.

**Acceptance Scenarios**:
1. **Given** os 3 botões em squircle, **When** o usuário clica no terceiro botão (Ajustes/Segurança), **Then** o painel de gerenciamento de dados, edição de nome e privacidade LGPD é exibido.
2. **Given** a edição de nome acionada, **When** o usuário digita um novo nome e salva, **Then** o novo nome é refletido imediatamente no topo da tela com mensagem de sucesso.

---

### Edge Cases

- **Nome longo do usuário**: Se o usuário tiver um nome extenso, o texto deve usar elipse ou quebra harmoniosa sem sobrepor os botões laterais do header.
- **Falha de carregamento de imagens na galeria**: Se a internet oscilar, os cards devem exibir cores pastel sólidas e elegantes com placeholders de texto legíveis.
- **Transição rápida de idiomas**: Caso o usuário toque repetidamente no seletor de idiomas, as atualizações devem ser tratadas sem disparar requisições concorrentes indesejadas (debounce/otimismo local).
- **Tema Claro vs Escuro**: O visual da tela de perfil (incluindo a barra curva inferior) deve manter harmonia cromática impecável tanto no modo escuro quanto claro.

---

## 3. Requisitos Funcionais (FR)

- **FR-001**: O sistema DEVE exibir o avatar do usuário com formato circular centralizado, tamanho generoso e suporte a toque para substituição/foto.
- **FR-002**: O sistema DEVE exibir o Nome do Usuário em tipografia proeminente e subtítulo contextual (ex.: "Leitor em Busca da Paz", data de membro).
- **FR-003**: O sistema DEVE disponibilizar uma barra com três contadores métricos (Salvos, Devocionais, Favoritos) alinhados e separados visualmente.
- **FR-004**: O sistema DEVE incluir um Seletor de Idioma Minimalista (chips em pílula ou segmented control) com suporte a pelo menos Português (`PT`), Inglês (`EN`) e Espanhol (`ES`).
- **FR-005**: O sistema DEVE disparar feedback tátil (`Haptics.impactAsync`) na alternância do idioma e nos botões de ação rápida.
- **FR-006**: O sistema DEVE renderizar 3 botões de ação rápida (squircles) com cantos arredondados contendo ícones vetoriais suaves para alternância de conteúdo.
- **FR-007**: O sistema DEVE apresentar a seção "Galeria" contendo um card principal com cantos arredondados e uma lista horizontal com miniaturas temáticas.
- **FR-008**: O sistema DEVE manter integradas as opções de exclusão de conta e LGPD através de menu de configurações acessível e seguro.
- **FR-009**: O sistema DEVE renderizar uma barra inferior de navegação ergonômica com acabamento curvado moderno e destaque da rota ativa.

---

## 4. Critérios de Sucesso

1. **Aderência Visual Fiel**: A tela deve espelhar a sofisticação, espaçamentos e ritmo visual do modelo de referência da imagem.
2. **Performance 60 FPS**: Rolagem macia sem engasgos, transições de aba e seleção de idioma instantâneas sem re-renderizações supérfluas.
3. **Simplicidade no Seletor de Idioma**: A troca de idioma deve exigir no máximo 1 único toque na tela, sem sobrecarregar a hierarquia visual.
4. **Respeito à Constituição do Projeto**: 100% TypeScript estrito, zero `any`, persistência via Zustand e respeito aos tokens de design `constants/theme`.
