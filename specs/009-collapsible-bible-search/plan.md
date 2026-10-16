# Technical Plan: Barra de Busca Bíblica Retrátil ao Rolar (Collapsible Bible Search Bar)

**Feature Branch**: `009-collapsible-bible-search`  
**Spec Reference**: `specs/009-collapsible-bible-search/spec.md`  
**Constitution**: Validado contra `.specify/memory/constitution.md` (TypeScript estrito, Guerra aos Re-renders, Componentes Modulares).

---

## 1. Arquitetura e Engenharia de Componentes

### 1.1 Diagrama de Fluxo de Comunicação de Scroll

```
┌────────────────────────────────────────────────────────┐
│                   BibleSearchScreen                    │
│                                                        │
│  State: isCollapsed (boolean)                          │
│                                                        │
│  ┌───────────────────────────┐                         │
│  │   ControlledBibleSearch   │  Props: isCollapsed     │
│  │   - Livro + Capítulo      │                         │
│  │   - [Animado] Populares   │  (oculta quando         │
│  │   - [Animado] Rodapé/Ação │   isCollapsed = true)   │
│  └───────────────────────────┘                         │
│                                                        │
│  ┌───────────────────────────┐                         │
│  │        PassageView        │  onScroll / onDirection │
│  │   - FlatList (versículos) ├─────────────────────────┤
│  │   - Detecta direção scroll│  (emite 'down' / 'up')  │
│  └───────────────────────────┘                         │
└────────────────────────────────────────────────────────┘
```

### 1.2 Responsabilidades de Cada Módulo

1. **`ControlledBibleSearch.tsx`**:
   - Recebe a prop opcional `isCollapsed?: boolean` (ou gerencia com transição animada).
   - Envolve as seções colapsáveis (`quickBooksRow` e `footerRow`) em um container animado (`Animated.View` com opacidade e altura interpolada, ou renderização condicional suave com `LayoutAnimation`).
   - Mantém as entradas superiores (`inputsRow`) sempre disponíveis e acessíveis.
   - Adiciona propensa interação de toque: ao tocar no card quando colapsado ou focar no input, pode disparar `onExpandRequest?: () => void`.

2. **`PassageView.tsx`**:
   - Expõe uma prop de callback: `onScrollDirectionChange?: (direction: 'up' | 'down', offsetY: number) => void`.
   - Utiliza uma referência `lastOffsetY = useRef(0)` para comparar a direção do deslocamento com um limiar seguro (`delta > 15px`).
   - Dispara `'down'` apenas quando o usuário rolar para baixo com conteúdo além do topo (`offsetY > 40`).
   - Dispara `'up'` quando o usuário rolar para cima ou atingir o topo (`offsetY <= 15`).

3. **`BibleSearchScreen.tsx`**:
   - Mantém o estado `isCollapsed` (inicializado como `false`).
   - Passa `isCollapsed={isCollapsed}` para `ControlledBibleSearch`.
   - Passa `onScrollDirectionChange` para `PassageView`.
   - Garante que ao trocar de livro/capítulo ou submeter uma nova busca, o estado volte ou se ajuste naturalmente.

---

## 2. Abordagem de Animação e Performance (Guerra aos Re-renders)

- **LayoutAnimation / Animated**: No React Native puro (sem reanimated externa instalada), `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)` oferece transição a 60 FPS nativa de altura e layout sem complexidade de driver em Android/iOS.
- **Evitar re-render a cada evento de scroll**: O evento `onScroll` da `FlatList` é filtrado com `scrollEventThrottle={16}` e só atualiza o estado React quando a direção **efetivamente mudar** (`direction !== currentDirection`), evitando renderizações contínuas de 60fps no componente pai.

---

## 3. Arquivos Afetados

| Arquivo | Mudança Planejada |
|---|---|
| `src/components/features/bible/ControlledBibleSearch.tsx` | Adicionar prop `isCollapsed`, animação/ocultação suave dos blocos de livros populares e rodapé de ações |
| `src/components/features/bible/PassageView.tsx` | Adicionar listener de direção de scroll na `FlatList` com limiar seguro |
| `src/screens/BibleSearchScreen.tsx` | Orquestrar o estado `isCollapsed` conectando o scroll da passagem ao colapso do cabeçalho de busca |
| `src/components/features/bible/ControlledBibleSearch.test.tsx` (se aplicável) | Testes unitários para o modo colapsado e expandido |

---

## 4. Plano de Verificação e Rollback

1. **TypeScript Validation**: `npm run typecheck` (`tsc --noEmit`) deve passar com 0 erros.
2. **Teste Visual e Interativo**:
   - Abrir a aplicação com `npx expo start`.
   - Carregar um capítulo longo (ex: `Romanos 8` ou `Salmos 119`).
   - Rolar para baixo: confirmar que Livros Populares e Footer somem e sobra apenas o Livro + Capítulo.
   - Rolar para cima: confirmar que eles reaparecem fluidamente.
   - Trocar de livro ou capítulo enquanto colapsado: confirmar que a busca e a submissão continuam funcionando perfeitamente.
