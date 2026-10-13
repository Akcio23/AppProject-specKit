# React Native Mobile Constitution

## Core Principles

### I. TypeScript Estrito & Tipagem Rigorosa (NON-NEGOTIABLE)
O uso de TypeScript em modo estrito (`strict: true`) é inegociável. É expressamente proibido o uso de `any` ou `as unknown as X` para mascarar erros. Todas as props de componentes, rotas de navegação, contratos de API e estados devem possuir interfaces e tipos explícitos, documentados e validados.

### II. Arquitetura Modular & Separação de Responsabilidades
A aplicação deve seguir uma estrutura limpa e desacoplada:
- `src/components/ui/`: Primitivos reutilizáveis de interface (Button, Input, Card, Modal, Typography) agnósticos de regra de negócio.
- `src/components/features/`: Componentes específicos de domínio de negócio.
- `src/hooks/`: Lógica de comportamento e consumo de APIs encapsulada em hooks customizados.
- `src/stores/`: Gerenciamento de estado global focado e atômico (Zustand).
- `src/services/`: Clientes HTTP, integrações de APIs e tratamento de payloads.
- `src/types/`: Tipagens globais e contratos compartilhados.
- `src/constants/`: Tokens de design (cores, tipografia, espaçamentos).

### III. Performance Mobile-First (Guerra aos Re-renders)
A interface deve manter taxas de quadros fluidas (60/120 FPS):
- Listas longas devem obrigatoriamente usar virtualização otimizada (FlashList ou FlatList com `getItemLayout`, `keyExtractor` estável e `maxToRenderPerBatch` ajustado).
- Funções passadas via props para componentes filhos devem usar `useCallback` e componentes de lista devem ser memoizados com `React.memo`.
- Operações de processamento pesado ou parsing de dados complexos nunca devem bloquear a UI thread.

### IV. Gestão de Estado Previsível & Desacoplada
Separação estrita entre Estado do Cliente e Estado do Servidor:
- **Server State**: Gerenciado preferencialmente com TanStack Query (React Query) para cache, retry e sincronização automática.
- **Client State**: Gerenciado com Zustand para estados locais compartilhados de forma leve e sem boilerplate.
- Evitar stores monolíticas gigantescas ou prop drilling descontrolado.

### V. Segurança, Armazenamento Seguro & Resiliência
- Dados sensíveis e tokens de autenticação (JWT) devem ser armazenados de forma criptografada usando SecureStore / MMKV criptografado. Nunca salvar credenciais em texto puro.
- Tratamento resiliente de conectividade com feedback visual claro para estados de loading, erros de rede e ausência de conexão (offline-first onde aplicável).

## Padrões de Estilização & UI
- Design System consistente baseado em tokens centralizados (`colors`, `spacing`, `typography`, `borderRadius`).
- Proibido o uso de valores "mágicos" soltos de cores e margens no código.
- Estilização realizada via `StyleSheet.create` nativo ou NativeWind/Tailwind configurado, garantindo alta performance de compilação de estilos.

## Governança & Portões de Qualidade
- Qualquer pull request ou código integrado deve compilar sem erros de TypeScript (`tsc --noEmit`).
- Linters e formatadores (ESLint e Prettier) devem passar sem avisos ou erros.
- A Constituição tem precedência sobre opiniões individuais de código e só pode ser alterada mediante revisão documentada.

**Version**: 1.0.0 | **Ratified**: 2026-10-13 | **Last Amended**: 2026-10-13
