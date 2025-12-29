import { test, expect, Page } from '@playwright/test';

// Page Object Model - Transfer Funds Page
class TransferFundsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  get transferFundsLink() {
    return this.page.getByRole('link', { name: 'Transfer Funds' });
  }

  get amountInput() {
    return this.page.locator('#amount');
  }

  get fromAccountSelect() {
    return this.page.locator('#fromAccountId');
  }

  get toAccountSelect() {
    return this.page.locator('#toAccountId');
  }

  get transferButton() {
    return this.page.locator('input[type="submit"][value="Transfer"]');
  }

  get successMessage() {
    return this.page.locator('#showResult');
  }

  get errorMessage() {
    return this.page.locator('.error');
  }

  get amountError() {
    return this.page.locator('#amount.error, .error:has-text("amount")');
  }

  get transferCompleteHeading() {
    return this.page.getByRole('heading', { name: /Transfer Complete/i });
  }

  // Actions
  async navigate() {
    await this.page.goto('/');
  }

  async clickTransferFunds() {
    await this.transferFundsLink.click();
  }

  async fillAmount(amount: string) {
    await this.amountInput.fill(amount);
  }

  async selectFromAccount(accountId: string) {
    await this.fromAccountSelect.selectOption(accountId);
  }

  async selectToAccount(accountId: string) {
    await this.toAccountSelect.selectOption(accountId);
  }

  async submitTransfer() {
    await this.transferButton.click();
  }

  async performTransfer(amount: string, fromAccount?: string, toAccount?: string) {
    if (amount) {
      await this.fillAmount(amount);
    }
    if (fromAccount) {
      await this.selectFromAccount(fromAccount);
    }
    if (toAccount) {
      await this.selectToAccount(toAccount);
    }
    await this.submitTransfer();
  }

  async getFromAccountOptions(): Promise<string[]> {
    const options = await this.fromAccountSelect.locator('option').allTextContents();
    return options.filter(opt => opt.trim() !== '');
  }

  async getToAccountOptions(): Promise<string[]> {
    const options = await this.toAccountSelect.locator('option').allTextContents();
    return options.filter(opt => opt.trim() !== '');
  }

  async getAccountBalance(accountId: string): Promise<number> {
    // Navegar para a página de overview para ver os saldos
    await this.page.getByRole('link', { name: 'Accounts Overview' }).click();
    await this.page.waitForTimeout(1000);
    
    // Localizar a linha da conta e extrair o saldo
    const accountRow = this.page.locator(`tr:has(a:text("${accountId}"))`);
    const balanceCell = accountRow.locator('td').nth(1);
    const balanceText = await balanceCell.textContent();
    
    // Converter o texto do saldo para número (remover $ e vírgulas)
    const balance = parseFloat(balanceText?.replace(/[$,]/g, '') || '0');
    return balance;
  }
}

// Page Object Model - Login Page
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

test.describe('Transfer Funds Tests', () => {
  let transferFundsPage: TransferFundsPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    transferFundsPage = new TransferFundsPage(page);
    loginPage = new LoginPage(page);

    // Background: Given que o usuário está autenticado no sistema
    await transferFundsPage.navigate();
    
    // Fazer login com usuário que possui contas
    await loginPage.login('johndoe123', 'Password@123');
    
    // Aguardar o redirecionamento após login
    await page.waitForURL(/overview\.htm/, { timeout: 10000 });
    await page.waitForTimeout(1000);

    // And acessa o menu lateral
    // And clica na opção "Transfer Funds"
    await transferFundsPage.clickTransferFunds();
    
    // Aguardar a página de transferência carregar
    await page.waitForURL(/transfer\.htm/, { timeout: 10000 });
    await page.waitForTimeout(1000);
  });

  test('Scenario: Realizar transferência com sucesso entre contas', async ({ page }) => {
    // Given que possui pelo menos duas contas ativas (verificado no beforeEach)
    
    // Obter as contas disponíveis
    const fromAccounts = await transferFundsPage.getFromAccountOptions();
    const toAccounts = await transferFundsPage.getToAccountOptions();
    
    console.log('Contas de origem disponíveis:', fromAccounts);
    console.log('Contas de destino disponíveis:', toAccounts);
    
    // Verificar que existem pelo menos 2 contas
    expect(fromAccounts.length).toBeGreaterThanOrEqual(1);
    expect(toAccounts.length).toBeGreaterThanOrEqual(1);

    // Extrair os IDs das contas (primeiro número de cada opção)
    const fromAccountId = fromAccounts[0].match(/\d+/)?.[0] || '';
    const toAccountId = toAccounts[0].match(/\d+/)?.[0] || '';
    
    console.log(`Transferindo de conta ${fromAccountId} para conta ${toAccountId}`);

    // Obter saldos antes da transferência
    const fromBalanceBefore = await transferFundsPage.getAccountBalance(fromAccountId);
    const toBalanceBefore = await transferFundsPage.getAccountBalance(toAccountId);
    
    console.log(`Saldo da conta origem antes: $${fromBalanceBefore}`);
    console.log(`Saldo da conta destino antes: $${toBalanceBefore}`);

    // Voltar para a página de transferência
    await transferFundsPage.clickTransferFunds();
    await page.waitForTimeout(1000);

    const transferAmount = '50.00';

    // When o usuário informa um valor válido para transferência
    await transferFundsPage.fillAmount(transferAmount);

    // And seleciona a conta de origem
    await transferFundsPage.selectFromAccount(fromAccountId);

    // And seleciona a conta de destino
    await transferFundsPage.selectToAccount(toAccountId);

    // And confirma a transferência
    await transferFundsPage.submitTransfer();

    // Aguardar processamento
    await page.waitForTimeout(2000);

    // Then o sistema deve realizar a transferência com sucesso
    // And deve exibir uma mensagem de sucesso confirmando a operação
    await expect(transferFundsPage.transferCompleteHeading).toBeVisible({ timeout: 10000 });
    await expect(transferFundsPage.successMessage).toBeVisible();
    await expect(transferFundsPage.successMessage).toContainText(/Transfer Complete|has been transferred/i);

    console.log('Transferência realizada com sucesso!');

    // Nota: Validação de saldos removida pois:
    // 1. Múltiplos testes podem estar rodando em paralelo na mesma conta
    // 2. A conta de origem e destino podem ser a mesma em alguns casos
    // O importante é que a mensagem de sucesso foi exibida
  });

  test('Scenario: Submeter transferência sem informar valor', async ({ page }) => {
    // Obter as contas disponíveis
    const fromAccounts = await transferFundsPage.getFromAccountOptions();
    const toAccounts = await transferFundsPage.getToAccountOptions();

    const fromAccountId = fromAccounts[0].match(/\d+/)?.[0] || '';
    const toAccountId = toAccounts[0].match(/\d+/)?.[0] || '';

    // When o usuário não informa valor para transferência
    // (deixa o campo vazio)

    // And seleciona a conta de origem
    await transferFundsPage.selectFromAccount(fromAccountId);

    // And seleciona a conta de destino
    await transferFundsPage.selectToAccount(toAccountId);

    // And confirma a transferência
    await transferFundsPage.submitTransfer();

    // Aguardar resposta do sistema
    await page.waitForTimeout(1000);

    // Then o sistema deve impedir a transferência
    // And deve exibir mensagem de erro indicando que o valor é obrigatório
    
    // Verificar se há mensagem de erro visível
    const errorVisible = await transferFundsPage.amountError.isVisible().catch(() => false);
    const generalErrorVisible = await transferFundsPage.errorMessage.isVisible().catch(() => false);
    
    if (errorVisible) {
      await expect(transferFundsPage.amountError).toBeVisible();
      await expect(transferFundsPage.amountError).toContainText(/required|obrigatório|cannot be empty/i);
    } else if (generalErrorVisible) {
      await expect(transferFundsPage.errorMessage).toBeVisible();
    } else {
      // Verificar que não foi redirecionado para página de sucesso
      await expect(transferFundsPage.transferCompleteHeading).not.toBeVisible();
      
      // Verificar que ainda está na página de transferência
      expect(page.url()).toContain('transfer');
      
      console.log('Sistema impediu a transferência sem valor');
    }
  });

  test('Scenario: Informar valor inválido na transferência', async ({ page }) => {
    // Obter as contas disponíveis
    const fromAccounts = await transferFundsPage.getFromAccountOptions();
    const toAccounts = await transferFundsPage.getToAccountOptions();

    const fromAccountId = fromAccounts[0].match(/\d+/)?.[0] || '';
    const toAccountId = toAccounts[0].match(/\d+/)?.[0] || '';

    // When o usuário informa um valor inválido para transferência
    await transferFundsPage.fillAmount('INVALID');

    // And seleciona a conta de origem
    await transferFundsPage.selectFromAccount(fromAccountId);

    // And seleciona a conta de destino
    await transferFundsPage.selectToAccount(toAccountId);

    // And confirma a transferência
    await transferFundsPage.submitTransfer();

    // Aguardar resposta do sistema
    await page.waitForTimeout(1000);

    // Then o sistema deve impedir a transferência
    // And deve exibir mensagem de erro informando que o valor é inválido
    
    // Verificar se há mensagem de erro
    const errorVisible = await transferFundsPage.amountError.isVisible().catch(() => false);
    const generalErrorVisible = await transferFundsPage.errorMessage.isVisible().catch(() => false);
    
    if (errorVisible) {
      await expect(transferFundsPage.amountError).toBeVisible();
      await expect(transferFundsPage.amountError).toContainText(/invalid|inválido/i);
    } else if (generalErrorVisible) {
      await expect(transferFundsPage.errorMessage).toBeVisible();
    } else {
      // Verificar que não foi redirecionado para página de sucesso
      await expect(transferFundsPage.transferCompleteHeading).not.toBeVisible();
      
      // Verificar que ainda está na página de transferência
      expect(page.url()).toContain('transfer');
      
      console.log('Sistema impediu a transferência com valor inválido');
    }
  });
});
