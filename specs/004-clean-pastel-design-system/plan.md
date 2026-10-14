# Technical Plan: Implementação do Design System Clean Pastel & Temas Claro/Escuro

**Feature**: `004-clean-pastel-design-system`  
**Spec**: [spec.md](file:///c:/Users/Pedro%20PC/Desktop/App/specs/004-clean-pastel-design-system/spec.md)  
**Status**: Ready  

---

## 1. Visão Geral da Arquitetura

O objetivo é transformar a interface do app Bíblia Sagrada Mobile de um visual escuro/carregado com dourado neon para uma experiência minimalista, clean e acolhedora em tons pastéis (branco suave, marrom terroso, preto aveludado e amarelo opaco suave), com suporte de primeira classe à alternância entre modo claro e escuro.

### Diagrama de Fluxo do Tema
```
                +----------------------------+
                |     useAppStore            |
                |  isDarkMode: boolean       |
                |  toggleDarkMode()          |
                +--------------+-------------+
                               |
                               v
                +----------------------------+
                |         useTheme()         |
                |  Retorna tokens calculados |
                |  (cores pastéis, bordas,   |
                |   sombras e contrastes)    |
                +--------------+-------------+
                               |
      +------------------------+------------------------+
      |                        |                        |
      v                        v                        v
+------------------+   +-------------------+   +--------------------+
|  WelcomeScreen   |   | BibleSearchScreen |   | SideDrawer &       |
|  - Header limpo  |   | - Input pastel    |   | Componentes UI:    |
|  - Card versículo|   | - Chips clean     |   | - Button / Card    |
|  - Oração serena |   | - Leitura arejada |   | - Topics / Picker  |
+------------------+   +-------------------+   +--------------------+
```

---

## 2. Mapa de Arquivos Afetados

1. **`src/constants/theme.ts`**:
   - Definição dos tokens estáticos e das paletas dinâmicas `lightTheme` e `darkTheme`.
   - Inclusão dos novos tons pastéis:
     - Branco linho/alabastro (`#FAF8F5`, `#FFFFFF`)
     - Tons marrons/taupe acolhedores (`#433422`, `#7D6B5D`, `#261E19`)
     - Preto carvão aveludado (`#181716`, `#22201E`)
     - Amarelo opaco suave/manteiga (`#DFCA86`, `#EBDDB2`)
   - Ajuste de espaçamentos e raios de borda para linguagem mais clean e minimalista.

2. **`src/hooks/useTheme.ts`** *(Novo)*:
   - Hook ergonômico que conecta `useAppStore((s) => s.isDarkMode)` e retorna o conjunto de cores ativo (`theme`), além de helpers rápidos como `isDark`, `toggleTheme`.

3. **`src/components/ui/`**:
   - `Card.tsx`: Remoção de bordas pesadas e sombras agressivas; estilo de card limpo pastel.
   - `Button.tsx`: Botões primários, secundários e contornados usando a paleta pastel e respeitando o tema.
   - `TextField.tsx`: Fundo neutro suave (`surfaceSubtle`), foco discreto em amarelo opaco pastel.
   - `SideDrawer.tsx`: Redesenho leve da gaveta com botão de alternância de tema integrado (☀️ Claro / 🌙 Escuro).

4. **`src/components/features/bible/`**:
   - `VerseOfTheDayCard.tsx`: Redução radical de ruído visual (remoção de badges colossais, aspas astronômicas e reflexos dourados neon). Foco na tipografia e no acolhimento devocional.
   - `DevotionalTopics.tsx`: Chips e cards de temas devocionais com fundo pastel suave e ícones elegantes.
   - `PassageView.tsx`: Leitura bíblica com tipografia editorial limpa e numerais de versículo discretos em amarelo opaco.
   - `SettingsTranslationList.tsx`: Lista de versões bíblicas limpa e fluida.

5. **`src/screens/`**:
   - `WelcomeScreen.tsx`: Cabeçalho arejado, botão toggle de tema rápido e visível, remoção de poluição visual, seções com respiração e ritmo de leitura relaxante.
   - `BibleSearchScreen.tsx`: Barra de busca minimalista, lista de sugestões de passagens em pílulas pastéis neutras e contêiner de leitura responsivo ao tema.

---

## 3. Critérios de Não-Regressão
- Nenhuma funcionalidade bíblica (busca, leitura, alternância de versão, favoritar versículo, compartilhar) pode ser quebrada.
- O app deve continuar com performance fluida (60 FPS) e suporte haptic nos toques interativos.
- Os contrastes em ambos os modos (Claro e Escuro) devem atender aos critérios de acessibilidade de leitura.
