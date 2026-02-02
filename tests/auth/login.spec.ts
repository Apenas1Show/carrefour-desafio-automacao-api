import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/clientes';
import { ConstrutorDeDadosDeTeste } from '../utils/construtor';

test.describe('POST /login - Autenticação', () => {
  let apiClient: ApiClient;
  let usuarioTeste: any;
  let usuarioId: string;

  test.beforeAll(async () => {
    const baseURL = process.env.BASE_URL || 'https://serverest.dev';
    apiClient = new ApiClient(baseURL);

    // Criar usuário para testes de login
    usuarioTeste = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    const response = await apiClient.post('/usuarios', usuarioTeste);
    usuarioId = response.data._id;
  });

  test.afterAll(async () => {
    if (usuarioId) {
      await apiClient.delete(`/usuarios/${usuarioId}`);
    }
  });

  test('Deve fazer login com credenciais válidas e retornar token JWT', async () => {
    const credenciais = {
      email: usuarioTeste.email,
      password: usuarioTeste.password,
    };

    const response = await apiClient.post('/login', credenciais);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', 'Login realizado com sucesso');
    expect(response.data).toHaveProperty('authorization');
    expect(typeof response.data.authorization).toBe('string');
    expect(response.data.authorization).not.toBe('');
    expect(response.data.authorization.startsWith('Bearer ')).toBeTruthy();
  });

  test('Deve validar estrutura do token JWT', async () => {
    const credenciais = {
      email: usuarioTeste.email,
      password: usuarioTeste.password,
    };

    const response = await apiClient.post('/login', credenciais);

    const token = response.data.authorization.replace('Bearer ', '');
    const partes = token.split('.');
    
    expect(partes.length).toBe(3);
    expect(partes[0]).not.toBe('');
    expect(partes[1]).not.toBe('');
    expect(partes[2]).not.toBe('');
  });

  test('Não deve fazer login com email inexistente', async () => {
    const credenciaisInvalidas = {
      email: 'emailnaocadastrado@teste.com',
      password: 'senhaQualquer123',
    };

    const response = await apiClient.post('/login', credenciaisInvalidas);

    expect(response.status).toBe(401);
    expect(response.data).toHaveProperty('message', 'Email e/ou senha inválidos');
  });

  test('Não deve fazer login com senha incorreta', async () => {
    const credenciaisInvalidas = {
      email: usuarioTeste.email,
      password: 'senhaErrada123',
    };

    const response = await apiClient.post('/login', credenciaisInvalidas);

    expect(response.status).toBe(401);
    expect(response.data).toHaveProperty('message', 'Email e/ou senha inválidos');
  });

  test('Não deve fazer login sem email', async () => {
    const credenciaisIncompletas = {
      password: usuarioTeste.password,
    };

    const response = await apiClient.post('/login', credenciaisIncompletas);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('email');
  });

  test('Não deve fazer login sem password', async () => {
    const credenciaisIncompletas = {
      email: usuarioTeste.email,
    };

    const response = await apiClient.post('/login', credenciaisIncompletas);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('password');
  });

  test('Não deve fazer login com email em formato inválido', async () => {
    const credenciaisInvalidas = {
      email: 'email-invalido-sem-arroba',
      password: 'senha123',
    };

    const response = await apiClient.post('/login', credenciaisInvalidas);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('email');
  });
});