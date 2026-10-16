# Quality Checklist: Barra de Busca Bíblica Retrátil ao Rolar

**Feature Branch**: `009-collapsible-bible-search`  
**Spec Reference**: `specs/009-collapsible-bible-search/spec.md`  

---

## 1. Critérios de Aceitação da Interface (UI/UX)

- [x] **Modo Expandido Padrão**: Na inicialização ou no topo da página, a barra exibe todos os elementos (Livro, Capítulo, Livros Populares, Consulta, Limpar e Ler Texto).
- [x] **Ocultação Suave ao Rolar para Baixo**: Ao rolar a lista de versículos para baixo, a linha de "Livros Populares" e a linha de rodapé (Consulta/Limpar/Ler Texto) somem suavemente.
- [x] **Persistência dos Campos Primários**: Os campos de "Livro Sagrado" e "Capítulo / Versículo" continuam 100% visíveis e operáveis no modo compacto.
- [x] **Re-expansão ao Rolar para Cima**: Ao rolar o conteúdo para cima ou voltar ao topo (`offsetY <= 15`), os controles ocultos reaparecem com transição natural.
- [x] **Busca de Livro Inteiro sem Capítulo**: Ao escolher o livro e não preencher capítulo, o botão habilita como "Ler Livro" e a busca retorna o livro a partir do início.
- [x] **Livros Monocapitulares**: Para livros de 1 capítulo só (Judas, 2 João, 3 João, Filemom, Obadias), a busca retorna 100% dos versículos do livro de ponta a ponta.
- [x] **Navegação de Capítulos**: No final da passagem, botões "Capítulo Anterior" e "Próximo Capítulo" permitem avançar e voltar na leitura do livro sem esforço.
- [x] **Ausência de Trepidação (Jitter)**: A rolagem possui limiar/threshold de sensibilidade que impede que a barra fique piscando/alternando rapidamente com pequenos toques estáticos.

---

## 2. Robustez Técnica & Performance

- [x] **TypeScript Estrito**: Tipagem rigorosa em todas as props (`isCollapsed?: boolean`, callbacks de scroll), sem `any`.
- [x] **Guerra aos Re-renders**: O callback de scroll não dispara re-renders a cada pixel; apenas quando o estado de colapso efetivamente muda.
- [x] **Interação no Teclado**: No modo colapsado, alterar o capítulo e pressionar a tecla de busca/enter no teclado envia a consulta sem quebras.
- [x] **Compatibilidade com Dark & Light Theme**: A barra preserva as cores e contraste em ambos os temas tanto no estado expandido quanto no compacto.
- [x] **Passagem Curta / Sem Scroll**: Em passagens com 1 ou 2 versículos onde não há espaço para rolagem, a interface permanece estável e funcional.

---

## 3. Validação do Código

- [x] Executar checagem de tipos: `npm run typecheck` (`tsc --noEmit`) sem erros.
- [x] Verificar integridade do Metro Bundler e ausência de avisos no console do app.
