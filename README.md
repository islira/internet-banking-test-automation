# 🏦 Internet Banking Test Automation

> Projeto de automação de testes end-to-end para sistema de Internet Banking, cobrindo fluxos críticos de negócio como cadastro, autenticação, abertura de contas e transferências financeiras.

## 📋 Sobre o Projeto

Este projeto implementa testes automatizados para validar funcionalidades essenciais de um sistema bancário digital, garantindo qualidade e confiabilidade nas operações financeiras. Utiliza as melhores práticas de automação com TypeScript, Playwright e Jest

### 🎯 Funcionalidades Testadas

- ✅ **Cadastro de Usuários** - Validação do fluxo completo de registro
- ✅ **Autenticação** - Testes de login e gerenciamento de sessão
- ✅ **Abertura de Contas** - Criação e validação de novas contas bancárias
- ✅ **Transferências** - Operações de transferência entre contas

## 🛠️ Tecnologias Utilizadas

- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem principal do projeto
- **[Jest](https://jestjs.io/)** - Framework de testes unitários e de integração
- **[Playwright](https://playwright.dev/)** - Framework para testes end-to-end
- **Node.js** - Ambiente de execução JavaScript

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 16.x ou superior)
  - [Download Node.js](https://nodejs.org/)
  - Verifique a instalação: `node --version`

- **npm** (normalmente instalado com Node.js)
  - Verifique a instalação: `npm --version`

- **Git** (para clonar o repositório)
  - [Download Git](https://git-scm.com/)
  - Verifique a instalação: `git --version`

## 🚀 Instalação e Configuração

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/islira/internet-banking-test-automation.git
cd internet-banking-test-automation
```

### 2️⃣ Instale as Dependências

```bash
npm install
```

Este comando irá instalar todas as dependências listadas no `package.json`:
- <span lang="en">Jest e suas tipagens</span>
- <span lang="en">Playwright </span>
- <span lang="en">TypeScript</span>
- <span lang="en">ts-jest (para executar TypeScript com Jest)</span>

### 3️⃣ Instale os Navegadores do Playwright

```bash
npx playwright install
```

Este comando baixa os navegadores (Chromium, Firefox, WebKit) necessários para os testes do Playwright.

## 🧪 Executando os Testes

### Executar Todos os Testes

```bash
npm test
```

### Executar Teste Específico

```bash
npm test -- login.test.ts
npm test -- register.test.ts
npm test -- newAccount.test.ts
npm test -- transferFunds.test.ts
```

### Executar Testes com Playwright

```bash
npx playwright test
```

### Visualizar Relatório do Playwright

```bash
npx playwright show-report
```

## 📂 Estrutura do Projeto

```
internet-banking-test-automation/
├── 📄 login.test.ts           # Testes de autenticação
├── 📄 register.test.ts         # Testes de cadastro
├── 📄 newAccount.test.ts       # Testes de abertura de conta
├── 📄 transferFunds.test.ts    # Testes de transferência
├── ⚙️ jest.config.js           # Configuração do Jest
├── ⚙️ playwright.config.ts     # Configuração do Playwright
├── ⚙️ tsconfig.json            # Configuração do TypeScript
├── 📦 package.json             # Dependências e scripts
├── 📊 playwright-report/       # Relatórios gerados
└── 📊 test-results/            # Resultados dos testes
```

## ⚙️ Configuração

### Jest

O Jest está configurado para trabalhar com TypeScript através do `ts-jest`. As configurações podem ser encontradas em [jest.config.js](jest.config.js).

### Playwright

As configurações do Playwright, incluindo timeouts, navegadores e opções de execução, estão em [playwright.config.ts](playwright.config.ts).

### TypeScript

As configurações do compilador TypeScript estão definidas em [tsconfig.json](tsconfig.json).

## 📊 Relatórios

Após a execução dos testes:

- <span lang="en">**Jest**</span>: Exibe resultados no terminal com cobertura de testes
- <span lang="en">**Playwright**</span>: Gera relatório HTML em `playwright-report/index.html`


## 📝 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Islira**

- GitHub: [@islira](https://github.com/islira)

---


