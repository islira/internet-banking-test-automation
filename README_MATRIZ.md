# Automação de Matriz de Rastreabilidade

Esta automação atualiza automaticamente uma matriz de rastreabilidade em Excel com base nos resultados dos testes do Playwright.

## 📋 Pré-requisitos

1. Python 3.8 ou superior
2. Node.js e npm (para Playwright)
3. Dependências Python instaladas

## 🚀 Instalação

1. Instale as dependências Python:
```bash
pip install -r requirements.txt
```

2. Verifique se o Playwright está configurado:
```bash
npm install
```

## 📊 Como Usar

### Opção 1: Executar testes e atualizar matriz automaticamente

```bash
python run_tests_and_update_matrix.py
```

Opções disponíveis:
```bash
# Executar em um navegador específico
python run_tests_and_update_matrix.py --project firefox

# Apenas atualizar matriz (sem executar testes)
python run_tests_and_update_matrix.py --skip-tests

# Especificar arquivo de matriz personalizado
python run_tests_and_update_matrix.py --matrix minha_matriz.xlsx
```

### Opção 2: Atualizar matriz manualmente

1. Execute os testes do Playwright:
```bash
npx playwright test --project=chromium
```

2. Atualize a matriz:
```bash
python update_traceability_matrix.py
```

Opções disponíveis:
```bash
# Especificar arquivos personalizados
python update_traceability_matrix.py --results meu-resultado.json --matrix minha_matriz.xlsx
```

## 📁 Estrutura de Arquivos

- `update_traceability_matrix.py` - Script principal de atualização
- `run_tests_and_update_matrix.py` - Script auxiliar para executar testes e atualizar
- `requirements.txt` - Dependências Python
- `matriz_rastreabilidade.xlsx` - Matriz gerada automaticamente
- `test-results.json` - Resultados dos testes em JSON (gerado pelo Playwright)

## 📈 Matriz de Rastreabilidade

A matriz contém as seguintes informações:

| Coluna | Descrição |
|--------|-----------|
| ID | Identificador único do teste |
| Suite de Teste | Nome da suíte de testes |
| Arquivo | Arquivo do teste (.test.ts) |
| Nome do Teste | Título completo do teste |
| Status | Status da execução (PASSED/FAILED/SKIPPED) |
| Duração (s) | Tempo de execução em segundos |
| Última Execução | Data e hora da última execução |
| Erro/Observação | Mensagem de erro (se houver) |

### Códigos de Cores

- 🟢 **Verde**: Teste passou (PASSED)
- 🔴 **Vermelho**: Teste falhou (FAILED)
- 🟡 **Amarelo**: Teste ignorado (SKIPPED)
- 🟠 **Laranja**: Timeout (TIMEDOUT)
- ⚪ **Cinza**: Interrompido (INTERRUPTED)

## 🔧 Configuração do Playwright

O arquivo `playwright.config.ts` foi configurado para gerar o relatório JSON:

```typescript
reporter: [
  ['html'],
  ['json', { outputFile: 'test-results.json' }]
],
```

## 💡 Exemplos de Uso

### Executar testes de login e atualizar matriz
```bash
npx playwright test login.test.ts --project=chromium
python update_traceability_matrix.py
```

### Executar todos os testes e atualizar automaticamente
```bash
python run_tests_and_update_matrix.py
```

### Executar testes em Firefox
```bash
python run_tests_and_update_matrix.py --project firefox
```

## 📝 Notas

- A matriz é criada automaticamente se não existir
- Testes existentes são atualizados; novos testes são adicionados
- O histórico de execuções é mantido (última execução)
- A matriz pode ser aberta no Excel para análise e relatórios

## 🐛 Troubleshooting

**Erro: "Arquivo test-results.json não encontrado"**
- Verifique se o playwright.config.ts está configurado corretamente
- Execute os testes pelo menos uma vez: `npx playwright test`

**Erro: "No module named 'openpyxl'"**
- Instale as dependências: `pip install -r requirements.txt`

**Erro ao abrir a matriz no Excel**
- Feche o arquivo Excel antes de executar a automação
- Verifique permissões de escrita no diretório
