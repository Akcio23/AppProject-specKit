# Feature Specification: Autenticação de Usuário & Dados Salvos por Conta

**Feature Branch**: `005-user-auth`
**Created**: 2026-10-14
**Status**: Ready for Planning (clarificações Q1–Q3 resolvidas em 2026-10-14)
**Input**: "a proxima SPEC quero adicionar a parte de autenticação e salvamento de dados por usuario. A entidade usuario por enquanto tera nome, email, senha e foto. A foto não precisa ser solicitada no ato da criação da conta. O banco de dados pode ser gerado via docker, PostgreSQL. O restante cria a spec para eu avaliar cada ponto."

---

## Contexto

Hoje o app guarda tudo apenas na memória do aparelho: versículos salvos (favoritos), tema claro/escuro e tradução bíblica preferida. Se o app for reinstalado ou o usuário trocar de celular, tudo se perde — um verdadeiro "Êxodo" de dados. 🏜️

Esta feature introduz **contas de usuário** para que cada pessoa tenha seus dados pessoais guardados com segurança e recuperáveis em qualquer aparelho.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar Conta (Priority: P1)

Como novo leitor, quero criar minha conta informando apenas **nome, e-mail e senha**, para começar a guardar meus versículos sem burocracia. A foto de perfil fica para depois.

**Why this priority**: Sem conta não existe autenticação nem dados por usuário. É a porta de entrada de toda a feature.

**Independent Test**: Abrir o app sem conta → tela de cadastro → preencher nome, e-mail e senha válidos → confirmar → usuário é levado à tela inicial já autenticado.

**Acceptance Scenarios**:

1. **Given** um visitante na tela de cadastro, **When** preencher nome, e-mail e senha válidos e confirmar, **Then** a conta é criada, o usuário entra automaticamente e vê sua saudação personalizada com o nome.
2. **Given** um e-mail já cadastrado, **When** o visitante tentar criar conta com ele, **Then** recebe a mensagem "Este e-mail já está em uso" e nenhuma conta nova é criada.
3. **Given** uma senha fora da política mínima, **When** o visitante tentar confirmar, **Then** vê, antes do envio, quais regras não foram atendidas.
4. **Given** o formulário de cadastro, **When** exibido, **Then** NÃO existe campo obrigatório de foto.

---

### User Story 2 - Entrar e Sair (Login / Logout) (Priority: P1)

Como usuário cadastrado, quero entrar com e-mail e senha e permanecer conectado entre aberturas do app, e poder sair quando quiser.

**Why this priority**: Complementa o cadastro; sem login, a conta não pode ser usada em outro aparelho.

**Independent Test**: Com uma conta existente → login → fechar e reabrir o app (continua logado) → sair → app volta ao modo visitante.

**Acceptance Scenarios**:

1. **Given** credenciais corretas, **When** o usuário entrar, **Then** acessa a tela inicial com seus dados.
2. **Given** credenciais incorretas, **When** o usuário tentar entrar, **Then** vê a mensagem genérica "E-mail ou senha inválidos" (sem revelar qual dos dois está errado).
3. **Given** muitas tentativas falhas seguidas, **When** o limite for atingido, **Then** novas tentativas para aquela conta são temporariamente bloqueadas com aviso de tempo de espera.
4. **Given** um usuário logado, **When** fechar e reabrir o app — mesmo após semanas ou meses sem uso — **Then** continua autenticado sem digitar a senha (sessão só termina por logout manual ou revogação).
5. **Given** um usuário logado, **When** tocar em "Sair", **Then** a sessão é encerrada no aparelho, os dados da conta deixam de ser exibidos e o app volta ao modo visitante.

---

### User Story 3 - Dados Salvos por Usuário (Priority: P1)

Como usuário logado, quero que meus **versículos salvos**, meu **tema (claro/escuro)** e minha **tradução preferida** fiquem vinculados à minha conta, para recuperá-los em qualquer aparelho.

**Why this priority**: É o principal valor percebido da feature — o motivo de existir conta.

**Independent Test**: Logar no aparelho A → salvar 2 versículos, trocar tema e tradução → logar com a mesma conta no aparelho B (ou após reinstalar) → os 3 dados aparecem iguais.

**Acceptance Scenarios**:

1. **Given** um usuário logado, **When** salvar um versículo, **Then** ele fica registrado na conta e aparece em outro aparelho após login.
2. **Given** um usuário logado, **When** remover um versículo salvo, **Then** ele some da conta em todos os aparelhos após sincronizar.
3. **Given** dois usuários diferentes no mesmo aparelho (um sai, outro entra), **When** o segundo entrar, **Then** ele vê APENAS os próprios dados, nunca os do anterior.
4. **Given** um usuário tentando acessar dados de outra conta, **When** a requisição for feita, **Then** o acesso é negado.
5. **Given** um versículo já salvo, **When** o usuário tentar salvá-lo de novo, **Then** não é duplicado.

---

### User Story 3.1 - Modo Visitante (Priority: P1)

Como leitor que ainda não quer criar conta, quero continuar usando o app normalmente (ler, buscar, salvar versículos, trocar tema e tradução), sabendo que meus dados ficam apenas neste aparelho.

**Why this priority**: Decisão Q1 = B. Mantém a experiência atual sem barreira de entrada; a conta é um convite, não uma obrigação.

**Independent Test**: Instalar o app → usar sem login → salvar versículos e trocar tema → fechar e reabrir → dados continuam no aparelho → criar conta → conta começa vazia (sem migração) → sair → dados de visitante reaparecem.

**Acceptance Scenarios**:

1. **Given** um visitante, **When** abrir o app, **Then** acessa a tela inicial diretamente, com opção visível de "Entrar / Criar conta" (no menu lateral e/ou cabeçalho).
2. **Given** um visitante, **When** salvar versículos ou trocar tema/tradução, **Then** os dados ficam guardados no aparelho e sobrevivem ao fechamento do app.
3. **Given** um visitante com versículos salvos, **When** iniciar login ou cadastro, **Then** vê um aviso claro: "Seus favoritos de visitante ficam neste aparelho e não serão transferidos para a conta."
4. **Given** um visitante que entrou na conta, **When** visualizar seus favoritos, **Then** vê APENAS os da conta (os de visitante não são misturados nem migrados).
5. **Given** um usuário que sai da conta, **When** o app volta ao modo visitante, **Then** os dados de visitante anteriores reaparecem intactos.

---

### User Story 4 - Perfil e Foto (Priority: P2)

Como usuário logado, quero ver e editar meu perfil (nome e foto) a qualquer momento, adicionando uma foto da galeria ou câmera quando quiser.

**Why this priority**: Personalização importante, mas o app funciona plenamente sem ela.

**Independent Test**: Logado → abrir Perfil → adicionar foto → foto aparece no menu lateral/cabeçalho → reabrir o app em outro aparelho → mesma foto.

**Acceptance Scenarios**:

1. **Given** usuário sem foto, **When** abrir o perfil, **Then** vê um avatar padrão com as iniciais do nome.
2. **Given** usuário no perfil, **When** escolher uma imagem válida, **Then** a foto é salva e exibida no app.
3. **Given** uma imagem acima do tamanho máximo ou de formato não suportado, **When** o usuário tentar enviá-la, **Then** vê mensagem clara e a foto anterior é mantida.
4. **Given** usuário com foto, **When** escolher "Remover foto", **Then** volta ao avatar de iniciais.
5. **Given** usuário no perfil, **When** alterar o nome, **Then** a saudação da tela inicial reflete o novo nome.

---

### User Story 5 - Recuperação de Senha (Priority: P2)

Como usuário que esqueceu a senha, quero redefini-la recebendo um código no meu e-mail para não perder minha conta.

**Why this priority**: Decisão Q2 = A. Como a sessão não expira (Q3 = C), esquecer a senha é comum ao trocar de aparelho — sem recuperação, a conta estaria perdida. Verificação de e-mail no cadastro fica FORA do escopo.

**Independent Test**: Tela de login → "Esqueci minha senha" → informar e-mail → receber código de 6 dígitos → digitar código e nova senha → entrar com a nova senha.

**Acceptance Scenarios**:

1. **Given** a tela de login, **When** o usuário tocar em "Esqueci minha senha" e informar o e-mail, **Then** vê sempre a mesma mensagem ("Se o e-mail existir, enviaremos um código"), sem revelar se a conta existe.
2. **Given** um código válido (até 15 minutos após o envio), **When** o usuário o informar junto com uma nova senha válida, **Then** a senha é trocada e TODAS as sessões ativas da conta (em todos os aparelhos) são encerradas.
3. **Given** um código expirado, já usado ou incorreto, **When** utilizado, **Then** é rejeitado com mensagem clara.
4. **Given** 5 códigos incorretos seguidos, **When** o limite for atingido, **Then** o código atual é invalidado e o usuário precisa solicitar outro.
5. **Given** pedidos repetidos de código, **When** o usuário solicitar mais de 3 códigos em 15 minutos, **Then** novos envios são temporariamente bloqueados.

---

### User Story 6 - Excluir Conta (Priority: P3)

Como usuário, quero excluir minha conta e todos os meus dados, conforme meu direito de privacidade (LGPD).

**Acceptance Scenarios**:

1. **Given** um usuário logado no perfil, **When** confirmar a exclusão digitando a senha, **Then** conta, foto e dados salvos são apagados permanentemente e ele volta à tela de entrada.

---

### Edge Cases

- **Sem internet no login/cadastro**: mensagem clara de "sem conexão" com opção de tentar novamente; nada é perdido do formulário.
- **Sem internet ao salvar versículo (logado)**: o versículo aparece salvo localmente e é sincronizado quando a conexão voltar.
- **Sessão revogada no meio do uso** (ex.: senha redefinida em outro aparelho ou conta excluída): o app avisa "Sua sessão foi encerrada, entre novamente" e volta ao modo visitante.
- **Longo período offline (logado)**: o usuário continua logado e usando os dados em cache; a sincronização ocorre quando a conexão voltar.
- **E-mail com maiúsculas/espaços** (`Pedro@Email.com `): tratado como o mesmo e-mail que `pedro@email.com`.
- **Nome com emojis/acentos** ("João 🙏"): aceito e exibido corretamente.
- **Upload de foto interrompido**: foto anterior permanece; usuário pode tentar de novo.
- **Mesma conta em dois aparelhos ao mesmo tempo**: ambos funcionam; última alteração prevalece para tema/tradução; versículos salvos são somados (sem duplicar).
- **Dados de visitante ao criar conta / logar**: permanecem no aparelho, separados; NÃO são migrados nem mesclados com a conta (Q1 = B).
- **Celular perdido/roubado com sessão ativa**: o usuário pode redefinir a senha em outro aparelho, o que encerra todas as sessões (mitigação para Q3 = C).

---

## Requirements *(mandatory)*

### Functional Requirements

**Cadastro**
- **FR-001**: O sistema DEVE permitir criar conta com nome, e-mail e senha.
- **FR-002**: A foto de perfil NÃO DEVE ser exigida no cadastro.
- **FR-003**: O sistema DEVE validar formato do e-mail e garantir que seja único (sem diferenciar maiúsculas/minúsculas).
- **FR-004**: O nome DEVE ter entre 2 e 80 caracteres.
- **FR-005**: A senha DEVE ter no mínimo 8 caracteres, contendo ao menos uma letra e um número; o app DEVE mostrar as regras em tempo real.
- **FR-006**: O usuário DEVE ser autenticado automaticamente após cadastro bem-sucedido.

**Autenticação & Sessão**
- **FR-007**: O sistema DEVE permitir login com e-mail e senha.
- **FR-008**: Mensagens de erro de login DEVEM ser genéricas, sem indicar se o e-mail existe.
- **FR-009**: O sistema DEVE limitar tentativas de login falhas (ex.: 5 tentativas em 15 minutos por conta/origem) com bloqueio temporário.
- **FR-010**: O usuário DEVE permanecer logado indefinidamente entre aberturas do app, sem expiração por inatividade, até sair manualmente (Q3 = C).
- **FR-011**: A sessão DEVE ser encerrada apenas por: logout manual, redefinição de senha (encerra todas as sessões), ou exclusão da conta. As credenciais técnicas de acesso DEVEM ser renovadas de forma transparente e rotativa, sem impacto para o usuário.
- **FR-012**: O usuário DEVE poder sair (logout), invalidando a sessão daquele aparelho.
- **FR-013**: Credenciais de sessão DEVEM ser guardadas no aparelho de forma criptografada (Constituição, Princípio V).
- **FR-014**: Senhas NUNCA DEVEM ser armazenadas ou registradas em logs em texto legível.

**Dados por Usuário**
- **FR-015**: Versículos salvos DEVEM ser vinculados à conta do usuário logado.
- **FR-016**: Preferência de tema (claro/escuro) DEVE ser vinculada à conta.
- **FR-017**: Tradução bíblica preferida DEVE ser vinculada à conta.
- **FR-018**: Cada usuário DEVE acessar somente os próprios dados; qualquer outro acesso DEVE ser negado.
- **FR-019**: Ao trocar de usuário no aparelho, os dados do usuário anterior DEVEM ser removidos da tela e do cache local.
- **FR-020**: Ações de salvar/remover versículo feitas offline DEVEM ser sincronizadas quando houver conexão.
- **FR-021**: O mesmo versículo (mesma referência + tradução) NÃO DEVE ser duplicado na conta.
- **FR-022**: O app DEVE ser plenamente utilizável sem conta (modo visitante), com versículos salvos, tema e tradução persistidos apenas no aparelho.
- **FR-022a**: Dados de visitante NÃO DEVEM ser migrados nem mesclados com a conta ao fazer login/cadastro; DEVEM permanecer no aparelho e reaparecer ao sair da conta.
- **FR-022b**: Antes de login/cadastro, um visitante com versículos salvos DEVE ser avisado de que eles não serão transferidos para a conta.

**Perfil & Foto**
- **FR-023**: O usuário DEVE poder ver e editar seu nome.
- **FR-024**: O usuário DEVE poder adicionar, trocar e remover a foto de perfil (galeria ou câmera).
- **FR-025**: A foto DEVE aceitar apenas JPEG, PNG ou WEBP, com até 5 MB; o app DEVE redimensionar/comprimir antes do envio.
- **FR-026**: Sem foto, o app DEVE exibir avatar com as iniciais do nome.
- **FR-027**: A foto e o nome DEVEM aparecer no menu lateral (SideDrawer) e na saudação da tela inicial.

**Recuperação & Exclusão**
- **FR-028**: O usuário DEVE poder redefinir a senha com um código numérico de 6 dígitos enviado ao e-mail, válido por 15 minutos e de uso único.
- **FR-028a**: A redefinição de senha DEVE encerrar todas as sessões ativas da conta.
- **FR-028b**: Solicitações de código DEVEM ser limitadas (máx. 3 em 15 minutos) e o código DEVE ser invalidado após 5 tentativas incorretas.
- **FR-028c**: Verificação de e-mail no cadastro está FORA do escopo desta SPEC (Q2 = A).
- **FR-029**: O usuário DEVE poder excluir a conta, mediante confirmação com senha, apagando permanentemente todos os seus dados e foto.

**UI / Design**
- **FR-030**: As novas telas (Entrada, Cadastro, Perfil, Recuperar Senha) DEVEM seguir o design system Clean Pastel da SPEC 004, nos temas claro e escuro.
- **FR-031**: Todos os estados de carregamento, erro e sem conexão DEVEM ter feedback visual claro.

### Clarificações (Sessão 2026-10-14)

- **Q1 (Escopo)**: O app continua utilizável sem conta? → **B**: Sim, modo visitante, **sem migração** dos dados locais para a conta.
- **Q2 (Escopo/Segurança)**: Recuperação de senha e verificação de e-mail? → **A**: Apenas **recuperação de senha** por e-mail; verificação de e-mail fica fora do escopo.
- **Q3 (Segurança/UX)**: Duração da sessão? → **C**: Usuário permanece logado **até sair manualmente** (revogável por redefinição de senha ou exclusão de conta).

### Key Entities *(include if feature involves data)*

- **Usuário**: Pessoa dona da conta. Atributos: identificador único não sequencial, nome, e-mail (único), senha (armazenada de forma irreversível), foto (opcional), data de criação e de atualização.
- **Sessão**: Vínculo autenticado entre um usuário e um aparelho. Atributos: usuário, aparelho/identificação, data de emissão, expiração, status (ativa/revogada). Um usuário pode ter várias sessões (vários aparelhos).
- **Versículo Salvo**: Versículo favoritado pelo usuário. Atributos: usuário, referência (ex.: "João 3:16"), texto, tradução, data em que foi salvo. Único por usuário + referência + tradução.
- **Preferências do Usuário**: Configurações pessoais. Atributos: usuário, tema (claro/escuro/sistema), tradução preferida, data de atualização. Uma por usuário.
- **Código de Redefinição de Senha**: Código de 6 dígitos, de uso único, válido por 15 minutos, vinculado a um usuário; armazenado de forma irreversível, com contador de tentativas.
- **Dados de Visitante** *(somente no aparelho)*: Versículos salvos, tema e tradução de quem usa o app sem conta. Nunca enviados ao servidor.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um novo usuário conclui o cadastro em menos de 1 minuto.
- **SC-002**: Um usuário existente entra no app em menos de 15 segundos (do toque em "Entrar" à tela inicial).
- **SC-003**: 100% dos versículos salvos, tema e tradução aparecem iguais ao logar em um segundo aparelho.
- **SC-004**: 0 casos de um usuário visualizar dados de outro em testes de acesso cruzado.
- **SC-005**: Salvamentos feitos offline são sincronizados em até 30 segundos após a conexão voltar.
- **SC-006**: Usuários com sessão válida reabrem o app já autenticados em 100% dos casos, sem digitar senha.
- **SC-007**: 90% dos usuários conseguem adicionar foto de perfil na primeira tentativa.
- **SC-008**: Ataques de força bruta são contidos: após o limite de tentativas, 100% das tentativas seguintes são bloqueadas durante a janela de espera.
- **SC-009**: Um visitante consegue usar 100% das funções de leitura, busca e favoritos sem criar conta.
- **SC-010**: Um usuário que esqueceu a senha recupera o acesso em menos de 3 minutos.
- **SC-011**: Após redefinir a senha, 100% das sessões anteriores da conta são encerradas.

---

## Assumptions

- **Decisão do usuário (restrição técnica)**: os dados serão persistidos em **PostgreSQL**, provisionado via **Docker** para desenvolvimento local. Detalhes (backend, ORM, armazenamento da foto) ficam para o `/speckit.plan`.
- Será necessário um **serviço backend próprio** (hoje o app só consome a bible-api.com); ele faz parte do escopo desta feature.
- Autenticação somente por **e-mail + senha** nesta versão. Login social (Google/Apple) e biometria ficam fora do escopo (candidatos a SPEC futura).
- Dados vinculados à conta nesta versão: **versículos salvos, tema e tradução preferida**. Futuros dados pessoais (anotações, planos de leitura, histórico) seguirão o mesmo modelo.
- A foto será armazenada em local próprio para arquivos (não dentro do registro do usuário), referenciada no perfil.
- Política de senha: mínimo 8 caracteres com letra e número (padrão de mercado, equilibrando segurança e simplicidade).
- Conflito entre aparelhos: "última alteração vence" para preferências; união sem duplicatas para versículos salvos.
- Comunicação entre app e servidor sempre criptografada (HTTPS) fora do ambiente de desenvolvimento local.
- Conformidade básica com a LGPD: exclusão de conta e dados disponível ao usuário.
- Recuperação de senha exige um **serviço de envio de e-mail** (provedor definido no `/speckit.plan`; em desenvolvimento local pode ser simulado).
- Hoje os dados do app ficam só em memória; o modo visitante passará a persisti-los no aparelho (parte desta feature).
- Sessão sem expiração (Q3 = C) é aceita conscientemente; o risco de aparelho perdido é mitigado pela redefinição de senha, que encerra todas as sessões. Encerramento remoto de sessões específicas ("sair de todos os aparelhos") é candidato a SPEC futura.
