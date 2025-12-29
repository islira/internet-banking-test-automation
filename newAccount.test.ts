import { test, expect, Page } from '@playwright/test';

// New Account Page
class NewAccountPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  get openNewAccountLink() {
    return this.page.getByRole('link', { name: 'Open New Account' });
  }

  get accountTypeSelect() {
    return this.page.locator('#type');
  }

  get fromAccountSelect() {
    return this.page.locator('#fromAccountId');
  }

  get openAccountButton() {
    return this.page.getByRole('button', { name: 'Open New Account' });
  }

  get successMessage() {
    return this.page.locator('#openAccountResult');
  }

  get newAccountNumber() {
    return this.page.locator('text=Your new account number').locator('..').locator('a');
  }

  get accountDetailsLink() {
    return this.page.locator('text=Your new account number').locator('..').locator('a');
  }

  // Locators for Account Details Page
  get accountNumberDetail() {
    return this.page.locator('#accountId');
  }

  get accountTypeDetail() {
    return this.page.locator('#accountType');
  }

  get accountBalanceDetail() {
    return this.page.locator('#balance');
  }

  get accountActivityTable() {
    return this.page.locator('#transactionTable');
  }

  // Actions
  async navigate() {
    await this.page.goto('/');
  }

  async clickOpenNewAccount() {
    await this.openNewAccountLink.click();
  }

  async selectAccountType(type: 'CHECKING' | 'SAVINGS') {
    await this.accountTypeSelect.selectOption(type);
  }

  async selectFromAccount(accountId?: string) {
    if (accountId) {
      await this.fromAccountSelect.selectOption(accountId);
    }
    // Se não especificar, usa a primeira conta disponível (já selecionada por padrão)
  }

  async submitOpenAccount() {
    await this.openAccountButton.click();
  }

  async getNewAccountNumber(): Promise<string> {
    await this.newAccountNumber.waitFor({ state: 'visible' });
    const accountNumberText = await this.newAccountNumber.textContent();
    return accountNumberText?.trim() || '';
  }

  async clickAccountDetails() {
    await this.accountDetailsLink.click();
  }

  async openNewAccount(type: 'CHECKING' | 'SAVINGS', fromAccountId?: string) {
    await this.selectAccountType(type);
    if (fromAccountId) {
      await this.selectFromAccount(fromAccountId);
    }
    await this.submitOpenAccount();
  }
}

// Page Object Model - Login Page (para autenticação antes dos testes)
class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get usernameInput() {
    return this.page.locator('input[name="username"]');
  }

  get passwordInput() {
    return this.page.locator('input[name="password"]');
  }

  get loginButton() {
    return this.page.locator('input[type="submit"][value="Log In"]');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

test.describe('New Account Tests', () => {
  let newAccountPage: NewAccountPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    newAccountPage = new NewAccountPage(page);
    loginPage = new LoginPage(page);

    // Navegar para a página inicial
    await newAccountPage.navigate();

    // Fazer login usando credenciais de um usuário existente 
    await loginPage.login('johndoe123', 'Password@123');

    // Aguardar o login ser processado
    await page.waitForTimeout(2000);

    // Clicar em Open New Account
    await newAccountPage.clickOpenNewAccount();
  });

  test('Abrir nova conta Savings e visualizar detalhes e atividade da conta', async ({ page }) => {
    
    // seleciona o tipo de conta "Savings" no listbox
    await newAccountPage.selectAccountType('SAVINGS');

    // And informa um valor inicial de depósito maior ou igual a 100.00
    // o valor inicial vem de uma conta existente, não é digitado manualmente

    // And confirma a abertura da conta
    await newAccountPage.submitOpenAccount();

    // Aguardar processamento 
    await page.waitForTimeout(5000);

    // Verificar se houve redirecionamento ou se a mensagem apareceu
    const isStillOnForm = await page.locator('text=What type of Account would you like to open?').isVisible();
    if (isStillOnForm) {
      console.log('Ainda na página de formulário - pode haver um problema com o servidor ParaBank');
      // Tentar clicar no botão novamente
      await newAccountPage.submitOpenAccount();
      await page.waitForTimeout(5000);
    }


    // And deve exibir o número da conta criada
    await expect(newAccountPage.newAccountNumber).toBeVisible({ timeout: 15000 });
    const accountNumber = await newAccountPage.getNewAccountNumber();
    expect(accountNumber).toBeTruthy();
    expect(accountNumber).toMatch(/^\d+$/); // Verificar que é um número

    console.log(`Nova conta criada com sucesso: ${accountNumber}`);

    // Clicar no link do número da conta para visualizar detalhes
    await newAccountPage.clickAccountDetails();

    // Aguardar página de detalhes carregar
    await page.waitForTimeout(2000);

    // Verificar que a página de detalhes foi carregada
    await expect(newAccountPage.accountNumberDetail).toBeVisible();
    
    // Verificar que o tipo de conta está correto
    await expect(newAccountPage.accountTypeDetail).toContainText('SAVINGS');

    // Verificar que o saldo está visível
    await expect(newAccountPage.accountBalanceDetail).toBeVisible();

    // Verificar que a tabela de atividades está presente
    await expect(newAccountPage.accountActivityTable).toBeVisible();

    console.log('Detalhes e atividade da conta visualizados com sucesso');
  });

  test(' Abrir nova conta Checking', async ({ page }) => {
    // Seleciona o tipo de conta "Checking"
    await newAccountPage.selectAccountType('CHECKING');

    // Confirma a abertura da conta
    await newAccountPage.submitOpenAccount();

    // Aguardar processamento (servidor pode estar lento)
    await page.waitForTimeout(5000);

    // Verificar se houve redirecionamento ou se a mensagem apareceu
    const isStillOnForm = await page.locator('text=What type of Account would you like to open?').isVisible();
    if (isStillOnForm) {
      console.log('Ainda na página de formulário - pode haver um problema com o servidor ParaBank');
      // Tentar clicar no botão novamente
      await newAccountPage.submitOpenAccount();
      await page.waitForTimeout(5000);
    }

    // Verificar mensagem de sucesso
    await expect(newAccountPage.successMessage).toBeVisible({ timeout: 15000 });
    await expect(newAccountPage.successMessage).toContainText(/Account Opened/);

    // Verificar número da conta
    await expect(newAccountPage.newAccountNumber).toBeVisible();
    const accountNumber = await newAccountPage.getNewAccountNumber();
    expect(accountNumber).toBeTruthy();

    console.log(`Nova conta Checking criada: ${accountNumber}`);
  });
});
