# Contrato REST: API de Autenticação & Conta

**Base URL**: `${EXPO_PUBLIC_API_URL}` → ex.: `http://192.168.0.10:3000/api/v1`
**Formato**: JSON (exceto upload de foto: `multipart/form-data`)
**Auth**: `Authorization: Bearer <accessToken>` nas rotas marcadas com 🔒. **Todas as rotas são bloqueadas por padrão**; as públicas são liberadas explicitamente com `@Public()`.

## Envelope de respostas

```jsonc
// Sucesso
{ "data": { ... } }

// Erro (nunca expõe stack trace)
{ "error": { "code": "INVALID_CREDENTIALS", "message": "E-mail ou senha inválidos.", "details": { } } }
```

### Códigos de erro

| HTTP | `code` | Quando |
|---|---|---|
| 400 | `VALIDATION_ERROR` | DTO inválido. `details.fields: { campo: [mensagens] }` |
| 401 | `UNAUTHORIZED` | Access token ausente, inválido ou expirado → app tenta `/auth/refresh` |
| 401 | `INVALID_CREDENTIALS` | Login ou senha atual errada (mensagem genérica, FR-008) |
| 401 | `SESSION_REVOKED` | Refresh token inválido, revogado ou reutilizado → app volta ao modo visitante |
| 400 | `INVALID_RESET_CODE` | Código errado, expirado, usado ou esgotado |
| 409 | `EMAIL_IN_USE` | Cadastro com e-mail existente |
| 413 | `FILE_TOO_LARGE` | Foto > 5 MB |
| 415 | `UNSUPPORTED_FILE_TYPE` | Foto que não é JPEG, PNG nem WEBP (checagem por magic bytes) |
| 429 | `TOO_MANY_ATTEMPTS` | Bloqueio de login ou excesso de pedidos de código. `details.retryAfterSeconds` |
| 500 | `INTERNAL_ERROR` | Genérico |

---

## Tipos compartilhados

```ts
interface UserDto        { id: string; name: string; email: string; photoUrl: string | null; createdAt: string }
interface PreferencesDto { theme: 'light' | 'dark' | 'system'; translationId: string; updatedAt: string }
interface SavedVerseDto  { id: string; reference: string; text: string; translation: string; savedAt: string }
interface AuthTokensDto  { accessToken: string; accessTokenExpiresIn: number /* s */; refreshToken: string }
interface AuthResultDto  extends AuthTokensDto { user: UserDto; preferences: PreferencesDto }
```

---

## Auth (`/auth`) — públicas, com throttle por IP

### `POST /auth/register` → 201 `AuthResultDto`
```json
{ "name": "Pedro", "email": "pedro@email.com", "password": "senha1234", "deviceName": "Pixel 8" }
```
- `name` 2–80 · `email` válido (normalizado) · `password` 8–128, ≥1 letra e ≥1 número · `deviceName` opcional ≤100.
- Cria usuário + preferências padrão + sessão na mesma transação (FR-006). **Sem foto** (FR-002).
- Erros: 400, 409 `EMAIL_IN_USE`.

### `POST /auth/login` → 200 `AuthResultDto`
```json
{ "email": "pedro@email.com", "password": "senha1234", "deviceName": "Pixel 8" }
```
- Erros: 401 `INVALID_CREDENTIALS` (genérico, tempo constante); 429 `TOO_MANY_ATTEMPTS` (5 falhas / 15 min por conta).

### `POST /auth/refresh` → 200 `AuthTokensDto`
```json
{ "refreshToken": "<opaco>" }
```
- **Rotação**: devolve um novo refresh token; o anterior deixa de valer.
- Token anterior reapresentado → revoga a sessão (`token_reuse`) → 401 `SESSION_REVOKED`.

### `POST /auth/logout` → 204
```json
{ "refreshToken": "<opaco>" }
```
- Revoga a sessão correspondente (`logout`). Idempotente: token desconhecido também responde 204.

### `POST /auth/password/forgot` → 202
```json
{ "email": "pedro@email.com" }
```
- **Sempre 202** com `{ "data": { "message": "Se o e-mail existir, enviaremos um código." } }`, exista a conta ou não.
- Gera um código de 6 dígitos (15 min), invalida os anteriores e envia o e-mail. Mais de 3 pedidos em 15 min → 429 (FR-028b).

### `POST /auth/password/reset` → 204
```json
{ "email": "pedro@email.com", "code": "482913", "newPassword": "novaSenha99" }
```
- Sucesso: troca o hash, marca o código como usado, **revoga TODAS as sessões** (`password_reset`) (FR-028a) e zera o bloqueio de login.
- Erro: 400 `INVALID_RESET_CODE` (incrementa `attempts`; com 5 tentativas o código é invalidado).
- O app redireciona para o login (o usuário entra com a nova senha).

---

## Conta (`/me`) — 🔒

> O `userId` vem **sempre** do token (`@CurrentUser('id')`), nunca da URL ou do body. Isso elimina IDOR por construção (FR-018, SC-004).

### `GET /me` → 200 `{ user: UserDto, preferences: PreferencesDto }`
Bootstrap do app ao abrir já logado.

### `PATCH /me` → 200 `UserDto`
```json
{ "name": "Pedro Henrique" }
```

### `PUT /me/photo` → 200 `UserDto` · `multipart/form-data`, campo `photo`
- ≤ 5 MB, JPEG/PNG/WEBP (magic bytes), reprocessada para WEBP 512×512 sem EXIF. Remove o arquivo anterior.
- Erros: 413, 415.

### `DELETE /me/photo` → 200 `UserDto` (`photoUrl: null`)

### `DELETE /me` → 204
```json
{ "password": "senha1234" }
```
- Confirma a senha → apaga usuário (cascade) + arquivo de foto (FR-029). Erro: 401 `INVALID_CREDENTIALS`.

---

## Preferências — 🔒

### `GET /me/preferences` → 200 `PreferencesDto`

### `PUT /me/preferences` → 200 `PreferencesDto`
```json
{ "theme": "light", "translationId": "almeida" }
```
- Campos opcionais (parcial). Última escrita vence, com `updatedAt` definido pelo servidor.

---

## Versículos salvos — 🔒

### `GET /me/saved-verses` → 200 `{ items: SavedVerseDto[] }`
- Ordenado por `savedAt DESC`. Sem paginação na v1: volume esperado < 1.000 por usuário. O contrato já reserva `?cursor=` para o futuro.

### `PUT /me/saved-verses/:id` → 201 (criado) | 200 (já existia) · `SavedVerseDto`
```json
{ "reference": "João 3:16", "text": "Porque Deus amou o mundo...", "translation": "almeida", "savedAt": "2026-10-14T16:00:00.000Z" }
```
- `:id` = UUID gerado pelo app (`ParseUUIDPipe`). **Idempotente**.
- Se já existe outro registro com a mesma (referência, tradução) para o usuário → **200 com o registro existente** (id do servidor). O app troca o id local por esse (FR-021).
- `:id` pertencente a outro usuário → 404 (não revela que existe).

### `DELETE /me/saved-verses/:id` → 204
- Idempotente: 204 mesmo se não existir ou já tiver sido removido.

---

## Arquivos

### `GET /files/avatars/:file` → 200 `image/webp` (público)
- Nome do arquivo = UUID (não dá para adivinhar). `Cache-Control: public, max-age=31536000, immutable`: cada troca de foto gera um novo nome.

## Saúde

### `GET /health` → 200 `{ "status": "ok", "db": "up" }` (público, sem throttle)

---

## Rate limits (resumo)

| Rota | Limite |
|---|---|
| `/auth/login`, `/auth/register` | 10 req/min por IP + bloqueio por conta (5 falhas / 15 min) |
| `/auth/password/forgot` | 3 pedidos / 15 min por conta + 10 req/min por IP |
| `/auth/password/reset` | 10 req/min por IP + 5 tentativas por código |
| `/auth/refresh` | 30 req/min por IP |
| Rotas 🔒 | 120 req/min por usuário |
