# AGENTS.md — Backend API Rules (NestJS)

## Stack
- Runtime: Node.js 22+ (LTS)
- Framework: NestJS 11
- Linguagem: TypeScript (strict mode: true)
- ORM: Prisma 6+
- Banco de Dados: PostgreSQL 17
- Hashing: Argon2id
- Autenticação: JWT curto (15min) + Refresh Token opaco rotativo em banco com detecção de reuso

## Regras de Código
- Sempre usar `import/export` (ESM) — nunca `require`
- Camadas bem definidas: Controller (apenas HTTP) → Service (regras de negócio) → PrismaService (acesso a dados)
- DI nativo do NestJS — nunca instanciar classes manualmente com `new`
- DTOs validados na entrada com `class-validator` e `class-transformer`
- Proibido o uso de `any`
- Respostas padronizadas via interceptor `{ data: T }` e filtro de exceção `{ error: { code, message, details } }`
- Rotas protegidas por padrão com `JwtAuthGuard` global (liberar públicas apenas com decorator `@Public()`)
- Identificação do usuário via token JWT (`@CurrentUser('id')`), nunca por query param ou body (prevenção de IDOR)
