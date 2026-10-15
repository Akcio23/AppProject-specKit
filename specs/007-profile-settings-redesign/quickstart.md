# Quickstart & Roteiro de Validação: Redesign da Tela de Perfil

**Feature Branch**: `007-profile-settings-redesign`  
**Date**: 2026-10-15  

---

## Roteiro de Testes Manuais (V1 a V8)

### V1. Inspeção Visual do Topo (Hero & Header)
1. Abrir a aplicação e tocar no botão de perfil.
2. **Resultado Esperado**: O avatar circular centralizado é renderizado com sombra suave, halo discreto, nome completo em negrito e subtítulo/papel devocional logo abaixo.

### V2. Alternância do Seletor Minimalista de Idioma
1. Observar o seletor em formato de pílula (`PT` | `EN` | `ES`).
2. Tocar na opção `EN`.
3. **Resultado Esperado**: Disparo de feedback tátil suave (`haptic`), a pílula ativa desliza ou transiciona para `EN`, e a preferência é salva no armazenamento local.

### V3. Inspeção das Métricas em 3 Colunas
1. Verificar os 3 blocos de métricas (`Salvos`, `Devocionais`, `Favoritos`).
2. **Resultado Esperado**: Números nítidos separados por divisores verticais finos, com alinhamento impecável e dados coerentes com o histórico do usuário.

### V4. Navegação pelas Abas Squircle
1. Observar os 3 botões em formato de pílula elevada com ícones vetoriais (`Grid`, `Heart`, `Config`).
2. Tocar na aba de Favoritos (`Heart`).
3. **Resultado Esperado**: O botão selecionado recebe realce de cor e o conteúdo abaixo atualiza instantaneamente para a lista de itens favoritos.

### V5. Interação com a Galeria de Inspiração
1. Na aba de Galeria (`Grid`), observar o card panorâmico superior e as miniaturas em carrossel horizontal.
2. Tocar no card panorâmico em destaque.
3. **Resultado Esperado**: Transição suave abrindo a passagem bíblica ou modal com o versículo associado ao tema.

### V6. Acesso às Configurações da Conta & LGPD
1. Tocar na terceira aba squircle (`Config`) ou no botão de três pontos (`...`) no canto superior direito.
2. **Resultado Esperado**: Opções de edição de nome, foto de perfil, dados de conta e modal de exclusão definitiva (LGPD com confirmação de senha) disponíveis de forma segura e elegante.

### V7. Barra Inferior com Curvatura Orgânica
1. Verificar o rodapé da tela.
2. **Resultado Esperado**: A barra inferior escura possui cantos superiores suavemente arredondados (`borderTopLeftRadius: 28`, `borderTopRightRadius: 28`), respeitando a área de segurança (`safeAreaInsets.bottom`) e destacando o ícone do Perfil como ativo.

### V8. Validação de TypeScript e Linters
1. Executar no terminal do projeto:
   ```bash
   npm run typecheck
   ```
2. **Resultado Esperado**: 0 erros de compilação TypeScript (`exit code 0`).
