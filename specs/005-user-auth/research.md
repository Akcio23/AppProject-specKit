# Research: Autenticação de Usuário & Dados Salvos por Conta

**Feature**: `005-user-auth` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

Formato: **Decisão** · **Por quê** · **Alternativas descartadas**.

---

## R1. Framework do backend

- **Decisão**: **NestJS 11** + TypeScript strict + Node.js 22 LTS, em pasta `api/` na raiz do repositório.
- **Por quê**: Organização por módulos com injeção de dependência (`auth`, `users`, `saved-verses`, `preferences`, `mail`, `storage`). Tem Guards, Pipes e Throttler nativos, que cobrem os FR de segurança com pouco código. A skill `nodejs-expert-antigravity` recomenda esse stack para apps com auth.
- **Alternativas**: Fastify puro (mais rápido, mas exige montar a estrutura na mão); Express (sem estrutura); BaaS como Supabase/Firebase (descartado: o usuário pediu Postgres via Docker e controle próprio).

## R2. ORM / Migrações

- **Decisão**: **Prisma** (schema declarativo + `prisma migrate`).
- **Por quê**: Tipos gerados a partir do schema, sem `any`, o que atende a Constituição I. Migrações versionadas e fáceis de revisar. `@db.Uuid` e `@db.Timestamptz` são nativos do Postgres.
- **Alternativas**: TypeORM (decorators bons, mas a tipagem das queries é mais fraca e as migrações dão mais trabalho); Drizzle (ótimo, mas ainda menos padronizado no ecossistema Nest).

## R3. Banco de dados e infraestrutura local

- **Decisão**: **PostgreSQL 17 (alpine)** + **Mailpit** via `docker-compose.yml` na raiz. Volume nomeado para o banco, healthcheck `pg_isready`. Perfil opcional `full` sobe também a API em container (Dockerfile multi-stage, usuário não-root).
- **Por quê**: Pedido do usuário + skill `docker-expert-antigravity`. No dia a dia a API roda fora do container (`npm run start:dev`, hot reload) e só os serviços de infraestrutura ficam no Docker.
- **Alternativas**: Postgres instalado no Windows (pouco reproduzível); subir tudo em container sempre (hot reload lento no Windows).

## R4. Hash de senha

- **Decisão**: **Argon2id** (`argon2`), parâmetros: memória 19 MiB, 2 iterações, paralelismo 1 (mínimo recomendado pela OWASP).
- **Por quê**: Algoritmo preferido pela OWASP e pela skill `security-expert-antigravity` (FR-014).
- **Alternativas**: bcrypt (aceitável, mas trunca senhas acima de 72 bytes); scrypt.

## R5. Modelo de sessão (Q3 = C: logado até sair)

- **Decisão**: **Access token JWT curto (15 min) + refresh token opaco rotativo, sem expiração absoluta**.
  - Access JWT (HS256, `sub`, `sid`, `exp`) fica **só em memória** no app.
  - Refresh token: 32 bytes aleatórios (base64url). O servidor guarda **apenas o hash SHA-256** na tabela `sessions`.
  - A cada `/auth/refresh` o token é **rotacionado**: o servidor emite um novo e o anterior deixa de valer.
  - **Detecção de reuso**: se chegar um refresh token já rotacionado, a sessão inteira é revogada (sinal de roubo).
  - Sessão revogada por: logout, reset de senha (todas), exclusão de conta (todas), detecção de reuso.
- **Por quê**: Atende FR-010 e FR-011. O usuário nunca é deslogado por inatividade, mas o token que trafega a cada requisição vive só 15 min. A revogação é possível porque a sessão existe no servidor. É o padrão recomendado pela skill de segurança (refresh + rotação).
- **Alternativas**: JWT de vida longa sem estado (impossível revogar no reset de senha, viola FR-028a); sessão só no servidor com cookie (cookies são ruins no React Native).

## R6. Armazenamento de credenciais no app

- **Decisão**: **`expo-secure-store`** para o refresh token (Keychain no iOS, Keystore no Android). Access token só em memória (Zustand sem persistência).
- **Por quê**: Constituição V e FR-013. Funciona no Expo Go, que é como o projeto roda hoje (`npx expo start`).
- **Alternativas**: MMKV criptografado (exige development build, sai do Expo Go); AsyncStorage (texto puro, proibido para credenciais).

## R7. Persistência local (modo visitante + cache da conta)

- **Decisão**: **`@react-native-async-storage/async-storage`** + middleware `persist` do Zustand, com **namespaces separados**:
  - `guest-data`: favoritos, tema e tradução do visitante (Q1 = B: nunca enviados ao servidor).
  - `account-cache:<userId>`: espelho local dos dados da conta + fila offline (outbox). Apagado no logout (FR-019).
- **Por quê**: Os dados de visitante não são sensíveis (versículos públicos). AsyncStorage funciona no Expo Go. Separar por namespace garante FR-022a: os dados de visitante "reaparecem" ao sair porque nunca foram tocados.
- **Alternativas**: MMKV (mais rápido, mas exige dev build); SQLite (exagero para poucos registros).

## R8. Sincronização offline (FR-020, SC-005)

- **Decisão**: **Fila offline (outbox) + operações idempotentes**.
  - Cada versículo salvo recebe um **UUID gerado no app** (`expo-crypto.randomUUID()`).
  - Operações: `PUT /me/saved-verses/:id` (upsert idempotente) e `DELETE /me/saved-verses/:id` (204 mesmo se já não existir).
  - A UI aplica a mudança na hora (otimista). A operação entra na outbox persistida e é enviada quando houver rede (`@react-native-community/netinfo` + `onlineManager` do TanStack Query), com backoff.
  - Duplicata por (usuário, referência, tradução): o servidor responde com o registro **já existente** (200) e o app troca o id local pelo id do servidor (FR-021).
  - Preferências: `PUT /me/preferences` com **última escrita vence**, usando o horário do servidor.
- **Por quê**: Idempotência permite reenviar sem duplicar. É simples e cobre os casos da spec, inclusive dois aparelhos ao mesmo tempo (a união dos favoritos acontece naturalmente).
- **Alternativas**: CRDT ou sync completo com versão (exagero para 3 tipos de dado); sem offline (viola FR-020).

## R9. Foto de perfil

- **Decisão**:
  - **App**: `expo-image-picker` (galeria/câmera, recorte 1:1) → `expo-image-manipulator` (512×512, JPEG q=0.8) → upload `multipart/form-data`.
  - **API**: limite de 5 MB; checagem de **magic bytes** (`file-type`) aceitando só JPEG/PNG/WEBP; **reprocessamento com `sharp`** para WEBP 512×512, o que **remove EXIF/GPS**. Nome de arquivo aleatório (UUID).
  - **Armazenamento**: interface `StorageService` com driver **disco local** (volume `uploads/`) servido em `/files/avatars/:file`. Um driver S3 (MinIO/R2) pode entrar depois sem mudar o resto.
- **Por quê**: Atende FR-024 a FR-026 e a checklist de upload seguro da skill de segurança. Reprocessar a imagem neutraliza arquivos maliciosos e protege a privacidade (localização embutida na foto).
- **Alternativas**: MinIO no compose já agora (mais um serviço sem ganho em dev); salvar a imagem como `bytea` no Postgres (incha o banco e os backups).
- **Nota**: as URLs de avatar são públicas, mas não dá para adivinhá-las (UUID). Aceitável para foto de perfil e documentado.

## R10. E-mail de recuperação (Q2 = A)

- **Decisão**: **Nodemailer** atrás de uma interface `MailService`. Em dev aponta para o **Mailpit** (SMTP `1025`, UI `http://localhost:8025`). Em produção, qualquer SMTP (Resend, SES, Brevo) só trocando variáveis de ambiente.
- **Código**: 6 dígitos gerados com `crypto.randomInt`, guardados como **HMAC-SHA256 com pepper** (segredo do servidor). Isso impede que alguém com acesso ao banco descubra os códigos por força bruta offline. Validade de 15 min, uso único, invalidado após 5 erros, no máximo 3 pedidos a cada 15 min (FR-028 a 028b).
- **Alternativas**: link mágico (exige deep link + universal links, mais configuração); SendGrid SDK direto (prende a um fornecedor).

## R11. Rate limiting e bloqueio (FR-009, SC-008)

- **Decisão**: duas camadas.
  1. **`@nestjs/throttler`** por IP nas rotas `/auth/*` (ex.: 10 req/min). Fica em memória em dev; trocar por Redis se a API tiver várias instâncias.
  2. **Bloqueio por conta** no banco: `failed_login_count` + `locked_until` em `users`. São 5 falhas em 15 min → bloqueio de 15 min. Resposta 429 com `retryAfterSeconds`.
- **Anti-enumeração**: login com e-mail inexistente também executa um `argon2.verify` falso, para que o tempo de resposta seja igual (FR-008).

## R12. Validação e contratos compartilhados

- **Decisão**: API com `class-validator` + `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`). No app, tipos de DTO escritos à mão em `src/types/auth.ts` e `src/types/account.ts`, mais type guards na resposta (padrão já usado em `bibleApi.ts`).
- **Alternativas**: monorepo com pacote `shared` (vale no futuro, mas mexe no bundler agora); gerar o client via OpenAPI (fica para depois).

## R13. Convivência Expo × pasta `api/`

- **Decisão**: criar **`metro.config.js`** com `resolver.blockList` excluindo `api/`, e manter `tsconfig.json` da raiz incluindo só `src/`, `App.tsx`, `index.ts` (já é assim). A `api/` tem `package.json`, `tsconfig` e `node_modules` próprios.
- **Por quê**: Sem isso, o Metro pode indexar `api/node_modules` (lento e com conflitos de módulos).

## R14. URL da API no aparelho físico

- **Decisão**: `EXPO_PUBLIC_API_URL` no `.env`. Com Expo Go em celular físico, `localhost` **não funciona**; é preciso usar o IP da máquina na rede local (ex.: `http://192.168.0.10:3000/api/v1`). O CORS não se aplica a apps nativos, mas a API restringe origens para o Expo Web.

## R15. Testes

- **Decisão**:
  - **API**: Jest. Testes unitários (services com repositórios mockados) + e2e com Supertest contra um banco de teste (`app_test` no mesmo Postgres do Docker). Cobrem: cadastro, login, bloqueio, rotação/reuso de refresh token, isolamento entre usuários (SC-004), reset de senha revogando sessões (SC-011).
  - **App**: portão `npm run typecheck`, que a Constituição exige. Testes unitários das stores/outbox com `jest-expo` se for barato. Validação ponta a ponta manual pelo [quickstart.md](./quickstart.md).
