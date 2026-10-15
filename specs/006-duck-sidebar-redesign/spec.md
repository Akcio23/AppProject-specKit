# Feature Specification: Redesign da Sidebar no Estilo Duck UI

**Feature Branch**: `006-duck-sidebar-redesign`
**Created**: 2026-10-14
**Status**: Implemented & Refined
**Input**: Redesign da sidebar inspirado no Duck UI, com remoção do Dashboard, foco em Nome e Foto no topo (sem e-mail), ícones refinados (book-open, compass, bookmark), badge UX melhorado e atalho de configurações do perfil posicionado no rodapé.

---

## 1. Contexto & Refinamentos do Usuário

A feature substitui o menu gaveta antigo pelo design minimalista e moderno do **Duck UI**, preservando a paleta **Clean Pastel** (`linen`, `parchment`, `brownDark`, `charcoalDark`, `yellowPastel`).

Em refinamento direto com o usuário:
1. **Topo Limpo**: Exibição exclusiva do Avatar e do Nome do usuário (sem exibir e-mail).
2. **Navegação Focada**: Aba *Dashboard* removida, mantendo os 3 fluxos essenciais:
   - Devocional Diário
   - Temas & Meditações
   - Versículos Guardados
3. **Novos Ícones Vetoriais**:
   - Devocional: `book-open` (livro aberto editorial).
   - Temas: `compass` (bússola orientadora).
   - Guardados: `bookmark` (marcador).
4. **UX Aprimorado no Contador de Salvos**: Badge em formato de pílula suave com ícone de marcador, fundo pastel acolhedor e contraste nítido, além de micro-dot para o modo rail compacto.
5. **Acesso Rápido ao Perfil no Rodapé**: Botão dedicado de configurações de perfil alocado na parte inferior, agrupado com o Logout e o alternador de Modo Claro/Escuro.

---

## 2. User Scenarios & Acceptance Criteria

### User Story 1 - Header Limpo & Rodapé Ergonômico (Priority: P1)
- **Cenário**: Ao abrir a barra lateral, o usuário visualiza apenas seu Nome e Foto no topo.
- **Critério**: O e-mail não é exibido no cabeçalho.
- **Cenário**: No rodapé da sidebar, o usuário encontra o botão de Configurações do Perfil logo acima de Logout e Dark Mode.

### User Story 2 - Navegação Bíblica & Ícones Vetoriais (Priority: P1)
- **Cenário**: O menu exibe os 3 itens principais (Devocional Diário, Temas & Meditações, Versículos Guardados).
- **Critério**: Sem aba genérica de Dashboard. Ícones vetoriais Feather finos e expressivos.

### User Story 3 - Visualização Elegante dos Salvos (Priority: P2)
- **Cenário**: Quando há versículos salvos (`savedCount > 0`), o contador aparece em um chip arredondado com ícone e contraste claro, sem quebrar o layout.
- **Critério**: No modo compacto (rail), um dot sutil indica a presença de novos salvos.

---

## 3. Componentes Afetados

- `src/components/ui/SideDrawer.tsx`: Componente completo da sidebar.
- `src/components/ui/ThemePillSwitch.tsx`: Switch customizado sol/lua com física de mola.
- `src/components/ui/index.ts`: Exportações dos novos componentes.
