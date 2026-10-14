# Tasks: Implementação do Design System Clean Pastel & Temas Claro/Escuro

**Feature**: `004-clean-pastel-design-system`  
**Spec**: [spec.md](file:///c:/Users/Pedro%20PC/Desktop/App/specs/004-clean-pastel-design-system/spec.md)  
**Plan**: [plan.md](file:///c:/Users/Pedro%20PC/Desktop/App/specs/004-clean-pastel-design-system/plan.md)  
**Status**: Concluído ✅  

---

## Tarefas do Ciclo de Implementação

### Fase 1: Fundações do Design System & Tokens
- [x] **T001**: Atualizar `src/constants/theme.ts` com a paleta de cores pastéis (branco suave, marrom terroso, preto aveludado, amarelo opaco) estruturada em `lightTheme` e `darkTheme`.
- [x] **T002**: Criar `src/hooks/useTheme.ts` para prover o tema dinâmico atual, helpers de alternância e tokens reativos para os componentes.

### Fase 2: Componentes Base de UI
- [x] **T003**: Atualizar `src/components/ui/Card.tsx`, `Button.tsx`, `TextField.tsx`, `TopicMenu.tsx` e `StateMessage.tsx` para adotar `useTheme` e os novos estilos limpos e pastéis.
- [x] **T004**: Redesenhar `src/components/ui/SideDrawer.tsx` com visual leve e adicionar o botão seletor de tema (☀️ Modo Claro / 🌙 Modo Escuro).

### Fase 3: Componentes Devocionais & Bíblicos
- [x] **T005**: Redesenhar `src/components/features/bible/VerseOfTheDayCard.tsx` eliminando sobrecargas (badges gigantes, sombras agressivas, dourado neon) e aplicando o estilo editorial devocional sereno.
- [x] **T006**: Atualizar `src/components/features/bible/DevotionalTopics.tsx`, `PassageView.tsx`, `TranslationPicker.tsx` e `SettingsTranslationList.tsx` para suportar tema dinâmico e paleta pastel.

### Fase 4: Telas Principais
- [x] **T007**: Redesenhar `src/screens/WelcomeScreen.tsx` com cabeçalho arejado, alternador rápido de tema, respiração visual e seções descomplicadas.
- [x] **T008**: Atualizar `src/screens/BibleSearchScreen.tsx` para garantir leitura e pesquisa bíblica límpida em ambos os modos.

### Fase 5: Validação & Polimento
- [x] **T009**: Executar verificação de tipos TypeScript (`npm run typecheck`) e validar ausência de regressões na navegação e nos recursos do app.
