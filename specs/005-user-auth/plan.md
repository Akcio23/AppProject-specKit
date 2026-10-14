# Implementation Plan: Autenticação de Usuário & Dados Salvos por Conta

**Branch**: `005-user-auth` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-user-auth/spec.md`

## Summary

Adicionar contas de usuário (nome, e-mail, senha, foto opcional) com os dados pessoais (versículos salvos, tema, tradução) guardados por conta. O app continua utilizável **sem conta** (modo visitante, sem migração), tem **recuperação de senha por código no e-mail** e mantém o usuário **logado até sair manualmente**.

Abordagem técnica: um backend novo em **NestJS + Prisma + PostgreSQL** (Postgres e Mailpit via **Docker Compose**). Sessões usam **JWT curto + refresh token opaco rotativo** com detecção de reuso. No app entram uma **store de sessão**, **hooks-fachada** (visitante ↔ conta), **AsyncStorage por namespace**, **SecureStore** para credenciais e uma **fila offline idempotente** para sincronizar. Detalhes e justificativas em [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript strict em tudo · Node.js 22 LTS (API) · React Native 0.86 / Expo SDK 57 / React 19.2 (app)

**Primary Dependencies**:
- **API (`api/`)**: NestJS 11, `@nestjs/config` (+ validação de env), `@nestjs/jwt`, `@nestjs/passport` + `passport-jwt`, `@nestjs/throttler`, Prisma, `argon2`, `class-validator`/`class-transformer`, `helmet`, `nodemailer`, `sharp`, `file-type`, `pino` (`nestjs-pino`)
- **App (novas)**: `expo-secure-store`, `@react-native-async-storage/async-storage`, `@react-native-community/netinfo`, `expo-image-picker`, `expo-image-manipulator`, `expo-crypto`, `expo-image` (avatar com cache)

**Storage**: PostgreSQL 17 (Docker, volume nomeado) · disco local `api/uploads/` para avatares (atrás de `StorageService`) · AsyncStorage + SecureStore no aparelho

**Testing**: API: Jest (unit) + Supertest (e2e em `app_test`) · App: `tsc --noEmit` + roteiro manual do [quickstart.md](./quickstart.md) (V1–V14)

**Target Platform**: Android e iOS via Expo Go (dev) · API Linux container / Node local

**Project Type**: Mobile app + API REST (Mobile + API)

**Performance Goals**: login/cadastro < 1 s no servidor (Argon2 ≈ 50–100 ms); app a 60 FPS (Constituição III); sync offline ≤ 30 s após reconexão (SC-005)

**Constraints**: funcionar no **Expo Go** (sem módulos que exijam dev build); offline-first para dados da conta; zero `any`; segredos só em `.env` (fora do git)

**Scale/Scope**: v1 para até ~10 mil usuários, < 1.000 versículos/usuário · 5 telas novas, 5 telas/componentes adaptados, 6 módulos de API

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Como o plano atende | Status |
|---|---|---|
| **I. TypeScript estrito** | API e app em `strict`. Prisma gera os tipos do banco. DTOs com class-validator. Respostas da API validadas com type guards no app. Proibido `any`/`as unknown as` | ✅ |
| **II. Arquitetura modular** | App: `services/api/` (HTTP), `stores/` (sessão, visitante, cache), `hooks/` (fachadas), `components/ui/` (Avatar, PasswordField), `screens/`. API em feature modules Nest (Controller → Service → Prisma) | ✅ |
| **III. Performance mobile** | Lista de favoritos já usa FlatList; `useCallback`/`memo` nos componentes novos; compressão de imagem fora da UI thread (módulo nativo do image-manipulator) | ✅ |
| **IV. Estado previsível** | **Server state** (perfil, favoritos, preferências da conta) com TanStack Query. **Client state** (sessão, dados de visitante, outbox) com Zustand. Stores pequenas e separadas | ✅ |
| **V. Segurança & resiliência** | Refresh token no **SecureStore**, access token só em memória; Argon2id; rate limit; anti-enumeração; feedback de offline e erro em todas as telas | ✅ |
| **Estilização** | Telas novas usam somente os tokens Clean Pastel (`useTheme`); sem cores ou margens soltas | ✅ |
| **Portões de qualidade** | `tsc --noEmit` nos dois projetos. ESLint + Prettier configurados na `api/` | ⚠️ ver nota |

> **Nota (pré-existente, não é violação desta feature)**: o app ainda **não tem ESLint/Prettier configurado**, embora a Constituição exija. Proponho incluir uma tarefa de setup do ESLint no app em `tasks.md` (baixo risco), ou tratar numa SPEC de qualidade separada. **Decisão do usuário.**

**Re-check pós-design (Fase 1)**: ✅ O modelo de dados, os contratos e a fachada de hooks não introduzem violações. A pasta `api/` é um segundo projeto, justificado em *Complexity Tracking*.

## Project Structure

### Documentation (this feature)

```text
specs/005-user-auth/
├── spec.md              # Especificação (clarificada)
├── plan.md              # Este arquivo
├── research.md          # Fase 0 — decisões técnicas R1–R15
├── data-model.md        # Fase 1 — tabelas Postgres + modelo local
├── quickstart.md        # Fase 1 — setup + roteiro de validação V1–V14
├── contracts/
│   ├── api.md           # Contrato REST
│   └── app-ui.md        # Navegação, stores, hooks-fachada e telas
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit.tasks — ainda não criado)
```

### Source Code (repository root)

```text
docker-compose.yml               # NOVO — postgres:17-alpine + mailpit (+ perfil "full" com a API)
.env.docker.example              # NOVO — credenciais locais do Postgres
metro.config.js                  # NOVO — blockList para ignorar api/ (R13)
.env.example                     # ALTERADO — EXPO_PUBLIC_API_URL documentada

api/                             # NOVO — backend NestJS
├── AGENTS.md                    # regras do projeto (skill node-nest)
├── Dockerfile                   # multi-stage, USER node
├── .dockerignore / .env.example / package.json / tsconfig.json / nest-cli.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── main.ts                  # helmet, ValidationPipe, filtros, prefixo /api/v1
│   ├── app.module.ts
│   ├── config/env.validation.ts
│   ├── common/
│   │   ├── decorators/          # @Public, @CurrentUser
│   │   ├── filters/             # envelope de erro { error: {...} }
│   │   ├── guards/              # JwtAuthGuard global (default deny)
│   │   └── interceptors/        # envelope { data }
│   ├── prisma/                  # PrismaService
│   ├── auth/                    # register, login, refresh, logout, forgot, reset
│   │   ├── sessions.service.ts  # rotação + detecção de reuso
│   │   ├── password.service.ts  # argon2
│   │   └── reset-codes.service.ts
│   ├── users/                   # GET/PATCH/DELETE /me, foto
│   ├── preferences/
│   ├── saved-verses/
│   ├── storage/                 # StorageService (driver local)
│   ├── mail/                    # MailService (nodemailer → Mailpit)
│   └── health/
└── test/                        # e2e (auth, isolamento, reset, sessões)

src/                             # APP (existente)
├── services/api/
│   ├── apiClient.ts             # NOVO — fetch + Bearer + refresh single-flight
│   ├── authApi.ts               # NOVO
│   └── accountApi.ts            # NOVO — me, foto, preferências, favoritos
├── services/storage/
│   ├── secureTokenStorage.ts    # NOVO — SecureStore
│   └── asyncStorage.ts          # NOVO — adapter do persist do Zustand
├── stores/
│   ├── useSessionStore.ts       # NOVO
│   ├── useGuestStore.ts         # NOVO — substitui o estado de useAppStore/useBibleStore (persistido)
│   ├── useAccountCacheStore.ts  # NOVO — cache da conta + outbox
│   ├── useAppStore.ts           # ALTERADO/REMOVIDO — conteúdo migra para as stores acima
│   └── useBibleStore.ts         # ALTERADO/REMOVIDO — idem
├── hooks/
│   ├── useSavedVerses.ts        # NOVO — fachada visitante/conta
│   ├── usePreferences.ts        # NOVO — fachada
│   ├── useCurrentUser.ts        # NOVO
│   ├── useOutboxSync.ts         # NOVO — envia a fila ao reconectar
│   ├── useSessionBootstrap.ts   # NOVO — booting → guest/authenticated
│   └── useTheme.ts              # ALTERADO — lê de usePreferences
├── types/
│   ├── auth.ts / account.ts     # NOVOS — DTOs + type guards
│   └── index.ts                 # ALTERADO — SavedVerse ganha id
├── components/ui/
│   ├── Avatar.tsx / PasswordField.tsx / FormError.tsx   # NOVOS
│   └── SideDrawer.tsx           # ALTERADO — entrar/criar conta ou avatar+nome
├── components/features/bible/
│   ├── VerseOfTheDayCard.tsx    # ALTERADO — usa useSavedVerses/usePreferences
│   └── SettingsTranslationList.tsx # ALTERADO — usa usePreferences
├── screens/
│   ├── auth/SignInScreen.tsx, SignUpScreen.tsx, ForgotPasswordScreen.tsx, ResetPasswordScreen.tsx  # NOVOS
│   ├── ProfileScreen.tsx        # NOVO
│   ├── WelcomeScreen.tsx        # ALTERADO — saudação com nome, fachadas
│   └── BibleSearchScreen.tsx    # ALTERADO — usePreferences
├── navigation/RootNavigator.tsx, types.ts   # ALTERADOS — novas rotas
└── App.tsx                      # ALTERADO — bootstrap da sessão + sync
```

**Structure Decision**: **Mobile + API no mesmo repositório**. O app continua na raiz (sem mover nada da estrutura Expo existente) e o backend fica em `api/`, com dependências próprias e isolado do Metro pelo `metro.config.js`. Assim as specs, a Constituição e o histórico ficam juntos, sem a reestruturação que um monorepo com workspaces exigiria.

## Fases de implementação (prévia para `/speckit.tasks`)

| Fase | Entrega | Histórias |
|---|---|---|
| **0. Infra** | `docker-compose.yml`, scaffold Nest, Prisma schema + migração, health, `metro.config.js` | — |
| **1. Persistência de visitante** | `useGuestStore` persistido + fachadas `useSavedVerses`/`usePreferences` + `SavedVerse.id`. **O app já fica melhor sem nenhum backend** | US 3.1 |
| **2. Auth core (API)** | register/login/refresh/logout, sessões rotativas, bloqueio, guard global, e2e | US1, US2 |
| **3. Auth (App)** | apiClient, SecureStore, sessão, telas SignIn/SignUp, SideDrawer | US1, US2 |
| **4. Dados da conta** | endpoints `/me/preferences`, `/me/saved-verses`, cache da conta, outbox + NetInfo | US3 |
| **5. Perfil & foto** | `/me`, foto (sharp/file-type), ProfileScreen, Avatar | US4 |
| **6. Recuperação de senha** | forgot/reset, Mailpit, telas, revogação total | US5 |
| **7. Excluir conta + polimento** | `DELETE /me`, estados de erro/offline, roteiro V1–V14 | US6 |

## Riscos & Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Celular não alcança a API (`localhost`) | Alto (bloqueia testes) | Usar o IP da LAN em `EXPO_PUBLIC_API_URL`; liberar a porta 3000 no firewall do Windows (quickstart) |
| Sessão eterna + aparelho perdido (Q3 = C) | Médio | Reset de senha revoga todas as sessões; detecção de reuso do refresh token. "Sair de todos os aparelhos" como SPEC futura |
| `sharp` com binários nativos no Windows/Alpine | Baixo | Instalação prebuilt; no Docker usar `node:22-alpine` com `sharp` compatível com musl |
| Migração dos dados em memória atuais | Nenhum | Hoje nada é persistido, então não há dados a migrar |
| Metro indexando `api/node_modules` | Médio | `metro.config.js` com blockList (R13) |

## Complexity Tracking

| Violação / Complexidade | Por que é necessária | Alternativa mais simples rejeitada porque |
|---|---|---|
| Segundo projeto (`api/`) no repositório | A spec exige dados por conta no servidor; hoje só existe o app | BaaS (Supabase/Firebase) contraria a decisão do usuário (Postgres via Docker, controle próprio) |
| Fila offline (outbox) | FR-020 e SC-005 exigem salvar offline e sincronizar depois | Só online quebraria um requisito explícito e a Constituição V (offline-first onde aplicável) |
| Refresh token com estado no servidor | Q3 = C (sem expiração) + FR-028a (revogar no reset) | JWT de longa duração sem estado não pode ser revogado |
