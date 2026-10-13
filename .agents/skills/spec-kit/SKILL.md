---
name: spec-kit
description: Workflow e comandos do GitHub Spec Kit para Spec-Driven Development (SDD) com Gemini CLI e Antigravity. Use para criar especificações, planejar features, esclarecer dúvidas e quebrar tarefas.
---

# GitHub Spec Kit - Spec-Driven Development (SDD)

Este repositório está configurado com o **GitHub Spec Kit** integrado ao **Gemini CLI** e **Antigravity**.

## Comandos do Ciclo SDD

Use os comandos abaixo na ordem recomendada para conduzir o desenvolvimento:

1. `/speckit.constitution`: Estabelece as regras fundamentais e padrões inegociáveis do projeto em `.specify/memory/constitution.md`.
2. `/speckit.specify <descrição>`: Cria a especificação formal do que deve ser construído, sem se preocupar ainda com o "como técnico". Gera o diretório em `specs/NNN-<feature>/spec.md`.
3. `/speckit.clarify`: Identifica ambiguidades, premissas implícitas e casos de borda antes de qualquer linha de código.
4. `/speckit.plan`: Desenha a arquitetura técnica, stack escolhida e arquivos afetados em `plan.md`.
5. `/speckit.checklist`: Gera critérios de aceitação e verificações de qualidade em `checklist.md`.
6. `/speckit.tasks`: Divide o plano em tarefas sequenciais e paralelas com dependências bem definidas em `tasks.md`.
7. `/speckit.implement`: Executa a implementação das tarefas de forma metódica.
8. `/speckit.converge`: Avalia o estado atual do código versus a especificação inicial e fecha lacunas remanescentes.

## Estrutura de Diretórios
- `.specify/`: Configurações, templates oficiais e scripts PowerShell do Spec Kit.
- `.gemini/commands/`: Definições TOML dos comandos do Gemini CLI.
- `specs/`: Onde ficam os artefatos de cada feature desenvolvida.
