# Quickstart & Validation Guide: Base React Native

**Feature**: `001-setup-react-native-base`  
**Date**: 2026-10-13

## Pré-requisitos
- Node.js >= 20.x instalado
- Gerenciador de pacotes `npm` ou `yarn`
- Dispositivo físico com o app **Expo Go** (Android/iOS) OU emulador Android Studio / Simulador iOS instalado.

## Comandos de Inicialização do Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Executar validação estática de tipos (TypeScript)
npm run typecheck

# 3. Executar o linter
npm run lint

# 4. Iniciar o servidor de desenvolvimento Metro Bundler
npx expo start
```

## Cenários de Validação

1. **Validação Estática**:
   - Rodar `npm run typecheck` e assegurar que o compilador TypeScript retorna código de saída `0` sem erros.
2. **Validação de Interface**:
   - Escanear o QR Code gerado pelo Metro Bundler com o Expo Go ou pressionar `a` (para Android) ou `i` (para iOS) ou `w` (para Web).
   - A tela inicial deve exibir os componentes primitivos (`Button`, `Card`, `Typography`) com suporte a Safe Area e tokens visuais.
3. **Validação de Reatividade**:
   - Tocar no botão de interação e confirmar atualização de estado imediata sem engasgos de frame.
