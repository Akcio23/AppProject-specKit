# Quickstart & Roteiro de Validação Visual: Duck Sidebar

**Feature Branch**: `006-duck-sidebar-redesign`
**Date**: 2026-10-14

---

## Roteiro de Testes Manuais (V1 a V8)

### V1. Inspeção Visual do Cabeçalho (Header)
1. Abrir a aplicação e tocar no botão de menu lateral.
2. **Resultado Esperado**: O cabeçalho exibe o Avatar arredondado (`borderRadius: 14px`) à esquerda, com o Título ("Bíblia Sagrada" ou nome do usuário) e o Subtítulo/E-mail logo abaixo, exatamente com o espaçamento e alinhamento do Duck UI.

### V2. Inspeção e Ação da Barra de Busca (`Search...`)
1. Observar a barra de busca em formato pílula posicionada logo abaixo do header.
2. Tocar no campo `[ 🔍 Search... ]`.
3. **Resultado Esperado**: Feedback háptico suave, fechamento automático da sidebar e abertura imediata do modal de pesquisa de versículos.

### V3. Lista de Navegação com Ícones Minimalistas
1. Verificar os 5 itens de navegação (Início, Devocional, Notificações, Meditações, Guardados).
2. **Resultado Esperado**: Ícones vetoriais de traço fino limpos, alinhados com tipografia sem emojis, espaçamento vertical generoso e fundo ativo sutil no item selecionado.

### V4. Switch de Tema Customizado (Sol/Lua)
1. Observar o rodapé com o toggle pill de tema.
2. Tocar na pílula.
3. **Resultado Esperado**: A bolinha interna desliza suavemente com efeito de mola (`Animated.spring`), o ícone interno transiciona entre sol e lua, o texto alterna ("Light mode" ↔ "Dark mode") e o app muda para a paleta escura/clara instantaneamente.

### V5. Botão de Logout / Sair
1. Com uma conta autenticada, observar o botão `Logout` no rodapé.
2. Tocar em `Logout`.
3. **Resultado Esperado**: O usuário é deslogado, a sidebar fecha e a interface reflete o estado de visitante.

### V6. Usuário Visitante (Sem Conta)
1. No modo visitante, abrir a sidebar.
2. **Resultado Esperado**: O rodapé exibe `Entrar / Cadastrar` em vez de `Logout`, permitindo acesso direto à tela de login.

### V7. Modo Compacto / Rail (Validação de Estrutura)
1. Alternar a prop ou estado de exibição para `collapsed`.
2. **Resultado Esperado**: A largura do painel reduz para ~68px, ocultando rótulos de texto e mantendo apenas a coluna de ícones centralizados (Logo, Busca, Ícones, Logout e Switch compacto).

### V8. Validação de TypeScript e Linters
1. Executar no terminal:
   ```bash
   npm run typecheck
   ```
2. **Resultado Esperado**: 0 erros de compilação TypeScript (`exit code 0`).
