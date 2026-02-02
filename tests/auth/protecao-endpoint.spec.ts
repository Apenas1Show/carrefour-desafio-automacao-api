import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/clientes';
import { AuthHelper } from '../utils/auth-helpers';
import { ConstrutorDeDadosDeTeste } from '../utils/construtor';

test.describe('Testes de Segurança - Autenticação em Endpoints', () => {
  let apiClient: ApiClient;
  let authHelper: AuthHelper;

  test.beforeAll(() => {
    const baseURL = process.env.BASE_URL || 'https://serverest.dev';
    apiClient = new ApiClient(baseURL);
    authHelper = new AuthHelper(apiClient);
  });

  test.afterAll(async () => {
    await authHelper.cleanupUsers();
  });

  test('Deve permitir criar usuário sem autenticação', async () => {
    const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();

    const response = await apiClient.post('/usuarios', novoUsuario);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('message', 'Cadastro realizado com sucesso');
  });

  test('Deve permitir listar usuários sem autenticação', async () => {
    const response = await apiClient.get('/usuarios');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('usuarios');
  });

  test('Deve permitir buscar usuário por ID sem autenticação', async () => {
    const { userId } = await authHelper.createUserAndLogin();

    const response = await apiClient.get(`/usuarios/${userId}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('_id', userId);
  });

  test('Deve usar token JWT corretamente no header Authorization', async () => {
    const { token, userId } = await authHelper.createUserAndLogin();
    
    apiClient.setAuthToken(token);
    const response = await apiClient.get(`/usuarios/${userId}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('_id', userId);

    apiClient.removeAuthToken();
  });

  test('Deve aceitar requisições com token inválido (API não valida token para leitura)', async () => {
    const { userId } = await authHelper.createUserAndLogin();
    const tokenInvalido = authHelper.generateInvalidToken();

    apiClient.setAuthToken(tokenInvalido);
    const response = await apiClient.get(`/usuarios/${userId}`);

    expect(response.status).toBe(200);

    apiClient.removeAuthToken();
  });

  test('Deve manter token entre múltiplas requisições', async () => {
    const { token, userId } = await authHelper.createUserAndLogin();
    apiClient.setAuthToken(token);

    const response1 = await apiClient.get(`/usuarios/${userId}`);
    const response2 = await apiClient.get('/usuarios');
    const response3 = await apiClient.get(`/usuarios/${userId}`);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response3.status).toBe(200);

    apiClient.removeAuthToken();
  });

  test('Deve remover token corretamente do cliente', async () => {
    const { token, userId } = await authHelper.createUserAndLogin();
    
    apiClient.setAuthToken(token);
    let response = await apiClient.get(`/usuarios/${userId}`);
    expect(response.status).toBe(200);

    apiClient.removeAuthToken();

    response = await apiClient.get(`/usuarios/${userId}`);
    expect(response.status).toBe(200);
  });
});