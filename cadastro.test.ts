import { describe, it, expect } from '@jest/globals';

// Interface para dados de cadastro
interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// Mock da função de cadastro
function register(credentials: RegisterCredentials): RegisterResponse {
  // Validação de campos vazios
  if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
    return {
      success: false,
      message: 'Todos os campos são obrigatórios',
    };
  }

  // Validação de senhas iguais
  if (credentials.password !== credentials.confirmPassword) {
    return {
      success: false,
      message: 'As senhas não conferem',
    };
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(credentials.email)) {
    return {
      success: false,
      message: 'Email inválido',
    };
  }

  // Validação de senha forte (mínimo 6 caracteres)
  if (credentials.password.length < 6) {
    return {
      success: false,
      message: 'Senha muito curta',
    };
  }

  // Cadastro bem-sucedido
  return {
    success: true,
    token: 'mock-jwt-token-12345',
  };
}

describe('Register Tests', () => {
  describe('Successful Register', () => {
    it('deve fazer cadastro com credenciais válidas', () => {
      const credentials: RegisterCredentials = {
        name: 'Admin User',
        email: 'admin@email.com',
        password: 'admin123@',
        confirmPassword: 'admin123@',
      };

      const result = register(credentials);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.token).toBe('mock-jwt-token-12345');
    });

    it('deve retornar um token JWT válido', () => {
      const credentials: RegisterCredentials = {
        name: 'Test User',
        email: 'test@email.com',
        password: 'test123@',
        confirmPassword: 'test123@',
      };

      const result = register(credentials);

      expect(result.token).toMatch(/^mock-jwt-token/);
    });
  });

  describe('Failed Register', () => {
    it('deve falhar com senhas diferentes', () => {
      const credentials: RegisterCredentials = {
        name: 'Admin User',
        email: 'admin@email.com',
        password: 'admin123@',
        confirmPassword: 'different123@',
      };

      const result = register(credentials);

      expect(result.success).toBe(false);
      expect(result.token).toBeUndefined();
      expect(result.message).toBe('As senhas não conferem');
    });

    it('deve falhar com email inválido', () => {
      const credentials: RegisterCredentials = {
        name: 'Admin User',
        email: 'invalid-email',
        password: 'admin123@',
        confirmPassword: 'admin123@',
      };

      const result = register(credentials);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Email inválido');
    });

    it('deve falhar com campos vazios', () => {
      const credentials: RegisterCredentials = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      };

      const result = register(credentials);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Todos os campos são obrigatórios');
    });
  });

  describe('Input Validation', () => {
    it('deve rejeitar senha muito curta', () => {
      const credentials: RegisterCredentials = {
        name: 'Admin User',
        email: 'admin@email.com',
        password: '123',
        confirmPassword: '123',
      };

      const result = register(credentials);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Senha muito curta');
    });

    it('deve aceitar email válido com múltiplos domínios', () => {
      const credentials: RegisterCredentials = {
        name: 'Admin User',
        email: 'admin@company.com.br',
        password: 'admin123@',
        confirmPassword: 'admin123@',
      };

      const result = register(credentials);

      expect(result.success).toBe(true);
    });
  });
});
