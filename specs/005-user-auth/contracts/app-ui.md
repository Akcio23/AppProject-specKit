# Contrato de UI & Estado no App

**Feature**: `005-user-auth` — como o app expõe autenticação e dados às telas.

## Navegação (`src/navigation/types.ts`)

```ts
export type RootStackParamList = {
  Welcome: undefined;
  BibleSearch: { initialReference?: string } | undefined;
  // novas
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: { email?: string } | undefined;
  ResetPassword: { email: string };
  Profile: undefined;            // só acessível logado
};
```

- O app **abre sempre em `Welcome`**, logado ou não (modo visitante, Q1 = B).
- `SignIn`/`SignUp`/`ForgotPassword`/`ResetPassword` são apresentadas como `modal`.
- `Profile` só aparece no menu se `status === 'authenticated'`.
- Entradas: botão "Entrar / Criar conta" no `SideDrawer` (visitante) ou avatar + nome (logado).

## Estado de sessão (`src/stores/useSessionStore.ts`)

```ts
type SessionStatus = 'booting' | 'guest' | 'authenticated';

interface SessionState {
  status: SessionStatus;
  user: UserDto | null;
  accessToken: string | null;        // só em memória
  signIn(result: AuthResultDto): Promise<void>;
  signOut(reason?: 'manual' | 'revoked'): Promise<void>;
  setUser(user: UserDto): void;
}
```

- `booting`: lê o refresh token do SecureStore. Se existir, faz `/auth/refresh` + `GET /me` → `authenticated`. Se der 401 `SESSION_REVOKED` → `guest`. **Sem rede** → `authenticated` com o cache local (`account-cache:<userId>`), porque a sessão não expira (Q3 = C).
- `signOut('revoked')` mostra o aviso "Sua sessão foi encerrada, entre novamente".

## Fachada de dados (as telas não sabem se é visitante ou conta)

Hooks consumidos pelas telas e componentes atuais, substituindo `useAppStore`/`useBibleStore` diretos:

| Hook | Retorno | Visitante | Logado |
|---|---|---|---|
| `useSavedVerses()` | `{ items, save(v), remove(id), isSaved(ref, tr) }` | `guest-data` | cache da conta + outbox → API |
| `usePreferences()` | `{ theme, translationId, setTheme, setTranslationId }` | `guest-data` | cache da conta + outbox → API |
| `useCurrentUser()` | `{ user, isGuest }` | `null` | `UserDto` |

- `useTheme()` passa a ler o tema de `usePreferences()` (sem mudar a assinatura pública).
- Telas afetadas: `WelcomeScreen`, `VerseOfTheDayCard`, `SettingsTranslationList`, `BibleSearchScreen`, `SideDrawer`.

## HTTP autenticado (`src/services/api/apiClient.ts`)

- Injeta o `Bearer`. No 401 `UNAUTHORIZED`, faz **um único** `/auth/refresh` (single-flight: requisições simultâneas esperam o mesmo refresh) e repete a requisição.
- Refresh falhou com `SESSION_REVOKED` → `signOut('revoked')`.
- Mapeia `error.code` para mensagens em PT-BR (`ApiError`), no mesmo padrão de `BibleApiError`.

## Telas novas

| Tela | Campos / Ações | Regras de UX |
|---|---|---|
| `SignInScreen` | e-mail, senha (mostrar/ocultar), "Entrar", "Esqueci minha senha", "Criar conta" | Aviso de favoritos de visitante (FR-022b); bloqueio mostra contagem regressiva |
| `SignUpScreen` | nome, e-mail, senha | Checklist da senha em tempo real (FR-005); **sem campo de foto** |
| `ForgotPasswordScreen` | e-mail | Mensagem neutra sempre; segue para `ResetPassword` |
| `ResetPasswordScreen` | código (6 dígitos, `textContentType="oneTimeCode"`), nova senha | "Reenviar código" respeitando o limite |
| `ProfileScreen` | avatar (iniciais ou foto), nome editável, trocar/remover foto, "Sair", "Excluir conta" | Exclusão exige senha + confirmação dupla |

Componentes UI novos (`src/components/ui/`): `Avatar` (iniciais ou foto), `PasswordField`, `FormError`. Todos seguem os tokens Clean Pastel (SPEC 004) nos dois temas.
