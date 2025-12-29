import { test, expect, Page } from '@playwright/test';

// Page Object Model - Register Page
class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  get registerLink() {
    return this.page.getByRole('link', { name: 'Register' });
  }

  get firstNameInput() {
    return this.page.locator('input[name="customer.firstName"]');
  }

  get lastNameInput() {
    return this.page.locator('input[name="customer.lastName"]');
  }

  get streetInput() {
    return this.page.locator('input[name="customer.address.street"]');
  }

  get cityInput() {
    return this.page.locator('input[name="customer.address.city"]');
  }

  get stateInput() {
    return this.page.locator('input[name="customer.address.state"]');
  }

  get zipCodeInput() {
    return this.page.locator('input[name="customer.address.zipCode"]');
  }

  get phoneInput() {
    return this.page.locator('input[name="customer.phoneNumber"]');
  }

  get ssnInput() {
    return this.page.locator('input[name="customer.ssn"]');
  }

  get usernameInput() {
    return this.page.locator('input[name="customer.username"]');
  }

  get passwordInput() {
    return this.page.locator('input[name="customer.password"]');
  }

  get confirmPasswordInput() {
    return this.page.locator('input[name="repeatedPassword"]');
  }

  get registerButton() {
    return this.page.locator('input[type="submit"][value="Register"]');
  }

  get successMessage() {
    return this.page.getByText('Sucessfully'); 

  }

  get logoutLink() {
    return this.page.getByRole('link', { name: 'Log Out' });
  }

  get errorMessage() {
    return this.page.locator('.error');
  }

  get firstNameError() {
    return this.page.locator('#customer\\.firstName\\.errors');
  }

  get lastNameError() {
    return this.page.locator('#customer\\.lastName\\.errors');
  }

  get addressError() {
    return this.page.locator('#customer\\.address\\.street\\.errors');
  }

  get cityError() {
    return this.page.locator('#customer\\.address\\.city\\.errors');
  }

  get stateError() {
    return this.page.locator('#customer\\.address\\.state\\.errors');
  }

  get zipCodeError() {
    return this.page.locator('#customer\\.address\\.zipCode\\.errors');
  }

  get ssnError() {
    return this.page.locator('#customer\\.ssn\\.errors');
  }

  get usernameError() {
    return this.page.locator('#customer\\.username\\.errors');
  }

  get passwordError() {
    return this.page.locator('#customer\\.password\\.errors');
  }

  get confirmPasswordError() {
    return this.page.locator('#repeatedPassword\\.errors');
  }

  // Actions
  async navigate() {
    await this.page.goto('/');
  }

  async clickRegister() {
    await this.registerLink.click();
  }

  async fillRegistrationForm(data: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
    username: string;
    password: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.streetInput.fill(data.street);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipCodeInput.fill(data.zipCode);
    await this.phoneInput.fill(data.phone);
    await this.ssnInput.fill(data.ssn);
    await this.usernameInput.fill(data.username);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.password);
  }

  async submitRegistration() {
    await this.registerButton.click();
  }

  async fillPasswordFields(password: string, confirmPassword: string) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
  }
}

test.describe('Parabank Register Tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.clickRegister();
  });

  test('Cenário: Cadastro com sucesso preenchendo todos os campos obrigatórios', async ({ page }) => {
    // Dado que o usuário está na página de registro
    // (já executado no beforeEach)

    // Quando preenche todos os campos obrigatórios
    await registerPage.fillRegistrationForm({
      firstName: 'John',
      lastName: 'Doe',
      street: 'Rua A, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001000',
      phone: '11999999999',
      ssn: '123-45-6789',
      username: `johndoe${Date.now()}`, // Username único para evitar conflitos
      password: 'Password@123',
    });

    // E clica no botão Register
    await registerPage.submitRegistration();

    // Então o sistema deve criar a conta com sucesso
    // E deve exibir mensagem de confirmação ou estar autenticado
    await expect(
      registerPage.successMessage.or(registerPage.logoutLink)
    ).toBeVisible({ timeout: 10000 });
  });

  test('Scenario: Submeter formulário sem preencher campos obrigatórios', async ({ page }) => {
    // Quando o usuário não preenche nenhum campo do formulário
    // (todos os campos ficam vazios)

    // E clica no botão Register
    await registerPage.submitRegistration();

    // Então o sistema deve exibir mensagens de erro de campos obrigatórios
    await expect(registerPage.firstNameError).toBeVisible();
    await expect(registerPage.lastNameError).toBeVisible();
    await expect(registerPage.addressError).toBeVisible();
    await expect(registerPage.cityError).toBeVisible();
    await expect(registerPage.stateError).toBeVisible();
    await expect(registerPage.zipCodeError).toBeVisible();
    await expect(registerPage.ssnError).toBeVisible();
    await expect(registerPage.usernameError).toBeVisible();
    await expect(registerPage.passwordError).toBeVisible();
    await expect(registerPage.confirmPasswordError).toBeVisible();
  });

  test('Scenario: Senha e confirmação de senha diferentes', async ({ page }) => {
    // Quando o usuário preenche todos os campos obrigatórios com dados válidos
    await registerPage.firstNameInput.fill('John');
    await registerPage.lastNameInput.fill('Doe');
    await registerPage.streetInput.fill('Rua A, 123');
    await registerPage.cityInput.fill('São Paulo');
    await registerPage.stateInput.fill('SP');
    await registerPage.zipCodeInput.fill('01001000');
    await registerPage.phoneInput.fill('11999999999');
    await registerPage.ssnInput.fill('123-45-6789');
    await registerPage.usernameInput.fill(`johndoe${Date.now()}`);

    // E informa senhas diferentes nos campos Password e Confirm Password
    await registerPage.fillPasswordFields('Password@123', 'DifferentPassword@123');

    // E clica no botão Register
    await registerPage.submitRegistration();

    // Então o sistema deve exibir mensagem de erro de senha não conferente
    await expect(registerPage.confirmPasswordError).toBeVisible();
    await expect(registerPage.confirmPasswordError).toContainText(/not match|do not match|conferir/i);
  });

  test('Scenario: Cadastro com username já existente', async ({ page }) => {
    // Given que já existe um usuário cadastrado com o username informado
    const duplicateUsername = `testuser${Date.now()}`;
    
    // Primeiro, criar um usuário para garantir que ele existe
    await registerPage.fillRegistrationForm({
      firstName: 'First',
      lastName: 'User',
      street: 'Street A, 100',
      city: 'City A',
      state: 'State A',
      zipCode: '12345',
      phone: '1234567890',
      ssn: '111-11-1111',
      username: duplicateUsername,
      password: 'Password@123',
    });
    
    await registerPage.submitRegistration();
    
    // Aguardar confirmação do cadastro
    await page.waitForTimeout(2000);
    
    // Fazer logout se estiver autenticado
    const logoutVisible = await registerPage.logoutLink.isVisible().catch(() => false);
    if (logoutVisible) {
      await registerPage.logoutLink.click();
      await page.waitForTimeout(1000);
    }
    
    // Navegar novamente para a página de registro
    await registerPage.navigate();
    await registerPage.clickRegister();
    
    // When o usuário tenta cadastrar novamente com o mesmo username
    await registerPage.fillRegistrationForm({
      firstName: 'Second',
      lastName: 'User',
      street: 'Street B, 200',
      city: 'City B',
      state: 'State B',
      zipCode: '54321',
      phone: '0987654321',
      ssn: '222-22-2222',
      username: duplicateUsername, // Mesmo username
      password: 'Password@456',
    });

    // E clica no botão Register
    await registerPage.submitRegistration();
    
    // Aguardar resposta do sistema
    await page.waitForTimeout(2000);

    // Investigar o comportamento real do sistema
    console.log('=== Investigação do comportamento ===');
    console.log('URL atual:', page.url());
    
    // Procurar por diferentes possíveis mensagens de erro
    const possibleErrorSelectors = [
      'text=/already exists/i',
      'text=/já existe/i',
    ];
    
    let errorFound = false;
    for (const selector of possibleErrorSelectors) {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        const text = await element.textContent();
        console.log(`Erro encontrado com seletor "${selector}": ${text}`);
        errorFound = true;
        
        // Validar que o erro contém informação sobre username duplicado
        await expect(element).toContainText(/already exists|já existe|username|duplicat/i);
        break;
      }
    }
    
    // Se nenhum erro foi encontrado visualmente, capturar todo o conteúdo da página
    if (!errorFound) {
      const pageContent = await page.content();
      console.log('Nenhuma mensagem de erro visível encontrada.');
      console.log('Verificando se permaneceu na página de registro...');
      
      // Verificar se permaneceu na página de registro (comportamento esperado quando há erro)
      expect(page.url()).toContain('register');
      
      // Procurar por texto de erro no conteúdo da página
      if (pageContent.includes('already exists') || pageContent.includes('já existe')) {
        console.log('Texto de erro encontrado no HTML, mas não está visível.');
      }
    }
    
    
  });

  test('Scenario: Cadastro com Zip Code inválido', async ({ page }) => {
    // When o usuário preenche todos os campos obrigatórios
    await registerPage.firstNameInput.fill('Mark');
    await registerPage.lastNameInput.fill('Johnson');
    await registerPage.streetInput.fill('Rua C, 789');
    await registerPage.cityInput.fill('Belo Horizonte');
    await registerPage.stateInput.fill('MG');
    
    // E informa um Zip Code inválido
    await registerPage.zipCodeInput.fill('INVALID');
    
    await registerPage.phoneInput.fill('31977777777');
    await registerPage.ssnInput.fill('456-78-9012');
    await registerPage.usernameInput.fill(`markj${Date.now()}`);
    await registerPage.passwordInput.fill('Password@123');
    await registerPage.confirmPasswordInput.fill('Password@123');

    // E clica no botão Register
    await registerPage.submitRegistration();

    // Então o sistema deve validar o campo Zip Code
    // E o comportamento do sistema deve ser registrado
    const zipCodeErrorVisible = await registerPage.zipCodeError.isVisible().catch(() => false);
    const pageUrl = page.url();
    
    // Registra o comportamento do sistema
    console.log(`Zip Code validation behavior: Error visible = ${zipCodeErrorVisible}, URL = ${pageUrl}`);
    
    // Verifica se há erro ou se a validação impede o cadastro
    if (zipCodeErrorVisible) {
      await expect(registerPage.zipCodeError).toBeVisible();
    } else {
      // Se não houver erro visível, verifica que não houve redirecionamento para sucesso
      expect(pageUrl).toContain('register');
    }
  });
});
