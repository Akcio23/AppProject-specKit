# Tasks: Barra de Busca Bíblica Retrátil ao Rolar (Collapsible Bible Search Bar)

**Feature Branch**: `009-collapsible-bible-search`  
**Spec Reference**: `specs/009-collapsible-bible-search/spec.md`  

---

## Sequência de Tarefas de Implementação

### Fase 1: Props e Estrutura Colapsável em `ControlledBibleSearch`
- [x] **T01**: Atualizar a interface `ControlledBibleSearchProps` para incluir `isCollapsed?: boolean` e callback opcional `onExpandRequest?: () => void`.
- [x] **T02**: Configurar transição de layout fluida (`LayoutAnimation`) ao alternar `isCollapsed`.
- [x] **T03**: Ocultar condicionalmente a linha de "Livros Populares" (`quickBooksRow`) e a linha de rodapé com ações (`footerRow`) quando `isCollapsed` for verdadeiro, ajustando margens e paddings do card.

### Fase 2: Detecção de Scroll em `PassageView`
- [x] **T04**: Adicionar prop `onScrollDirectionChange?: (direction: 'up' | 'down') => void` à interface de `PassageViewProps`.
- [x] **T05**: Implementar listener `onScroll` na `FlatList` com `scrollEventThrottle={16}` e limiar de sensibilidade (`delta > 15px`), detectando quando o usuário rola para baixo (down) ou para cima/topo (up).

### Fase 3: Integração na Tela `BibleSearchScreen`
- [x] **T06**: Adicionar estado `isCollapsed` em `BibleSearchScreen` e conectá-lo ao `ControlledBibleSearch` e `PassageView`.
- [x] **T07**: Garantir que o estado resete ou permaneça consistente ao carregar novas referências ou limpar a consulta.

### Fase 4: Validação & Polimento
- [x] **T08**: Executar `npm run typecheck` (`tsc --noEmit`) para assegurar 100% de conformidade com TypeScript estrito.
- [x] **T09**: Testar comportamento tátil, rolagem e visual nos modos claro e escuro.
