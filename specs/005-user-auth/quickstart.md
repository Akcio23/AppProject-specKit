# Quickstart & Validação: 005-user-auth

Guia para subir o ambiente e **provar que a feature funciona de ponta a ponta**. Contratos: [api.md](./contracts/api.md) · [app-ui.md](./contracts/app-ui.md) · Modelo: [data-model.md](./data-model.md).

## Pré-requisitos

- Docker Desktop rodando (testado com Docker 28)
- Node.js 22 LTS
- Celular com Expo Go **na mesma rede Wi-Fi** do PC (ou emulador)

## 1. Infraestrutura (Postgres + Mailpit)

```powershell
copy .env.docker.example .env.docker        # credenciais locais do Postgres
docker compose up -d                        # postgres:17-alpine + mailpit
docker compose ps                           # postgres = healthy
```
- Postgres: `localhost:5432` · Mailpit (caixa de e-mails falsa): http://localhost:8025

## 2. API

```powershell
cd api
copy .env.example .env      # gerar JWT_SECRET e RESET_CODE_PEPPER com: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
npm install
npx prisma migrate dev      # cria as tabelas
npm run start:dev           # http://localhost:3000/api/v1
```
✅ `curl http://localhost:3000/api/v1/health` → `{"status":"ok","db":"up"}`

## 3. App

No `.env` da raiz: `EXPO_PUBLIC_API_URL=http://<IP-DO-PC>:3000/api/v1` (descobrir com `ipconfig`; **não use localhost** no celular).
```powershell
npx expo start -c
```

## 4. Testes automatizados

```powershell
cd api; npm test; npm run test:e2e     # unit + e2e (banco app_test)
cd ..; npm run typecheck               # portão da Constituição
```

---

## Cenários de validação manual

| # | Cenário | Passos | Esperado | Spec |
|---|---|---|---|---|
| V1 | Visitante | Abrir o app novo → salvar 2 versículos → trocar tema → fechar e reabrir | Tudo mantido, sem pedir login | US 3.1, SC-009 |
| V2 | Cadastro | Menu → Criar conta → nome/e-mail/senha | Aviso de favoritos aparece; entra logado; saudação com o nome; **lista de favoritos vazia** | US1, FR-022a/b |
| V3 | Validação | Senha `abc`; e-mail repetido | Checklist em vermelho; "Este e-mail já está em uso" | FR-003/005 |
| V4 | Dados na conta | Logado: salvar 2 versículos, mudar tema e tradução → logar em outro aparelho/emulador | Os 3 dados idênticos | US3, SC-003 |
| V5 | Logout | Perfil → Sair | Volta ao visitante e **os 2 favoritos de V1 reaparecem** | FR-022a |
| V6 | Persistência | Logar → fechar o app → reabrir (dias depois / matar o processo) | Continua logado | Q3, SC-006 |
| V7 | Força bruta | Errar a senha 6× | 6ª tentativa: bloqueio com tempo de espera | FR-009, SC-008 |
| V8 | Offline | Logado, modo avião → salvar versículo → religar a rede | Aparece na hora; em ≤ 30 s está no servidor (`GET /me/saved-verses`) | FR-020, SC-005 |
| V9 | Foto | Perfil → adicionar foto da galeria → remover | Foto no drawer e na saudação → volta às iniciais | US4 |
| V10 | Foto inválida | Enviar arquivo > 5 MB (via curl) | 413, foto anterior mantida | FR-025 |
| V11 | Recuperar senha | Esqueci a senha → código no Mailpit → nova senha | Entra com a nova senha; **o outro aparelho é deslogado** com aviso | US5, SC-010/011 |
| V12 | Anti-enumeração | Esqueci a senha com e-mail inexistente | Mesma mensagem neutra; nenhum e-mail no Mailpit | FR-028 |
| V13 | Isolamento | Com o token do usuário A, `PUT /me/saved-verses/<id-do-B>` | 404; nada do B é alterado | FR-018, SC-004 |
| V14 | Excluir conta | Perfil → Excluir → senha | Volta ao visitante; login com a conta falha; linhas apagadas do banco | US6, FR-029 |

### Inspecionar o banco
```powershell
docker compose exec postgres psql -U app -d app -c "select email, created_at from users;"
```
