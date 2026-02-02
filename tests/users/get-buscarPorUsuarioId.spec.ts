import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/clientes';
import { ConstrutorDeDadosDeTeste } from '../utils/construtor';

test.describe('GET /usuarios/{id} - Buscar Usuário por ID', () => {
  let apiClient: ApiClient;
  let usuarioId: string;

  test.beforeAll(async () => {
    const baseURL = process.env.BASE_URL || 'https://serverest.dev';
    apiClient = new ApiClient(baseURL);

    const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    const response = await apiClient.post('/usuarios', novoUsuario);
    usuarioId = response.data._id;
  });

  test('Deve buscar usuário existente por ID com sucesso', async () => {
    const response = await apiClient.get(`/usuarios/${usuarioId}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('nome');
    expect(response.data).toHaveProperty('email');
    expect(response.data).toHaveProperty('password');
    expect(response.data).toHaveProperty('administrador');
    expect(response.data).toHaveProperty('_id', usuarioId);
  });

  test('Deve retornar 400 ao buscar usuário com ID inexistente', async () => {
    const idInexistente = 'abc123xyz789nao2';

    const response = await apiClient.get(`/usuarios/${idInexistente}`);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('message', 'Usuário não encontrado');
  });

  test('Deve validar tipos dos campos retornados', async () => {
    const response = await apiClient.get(`/usuarios/${usuarioId}`);

    expect(response.status).toBe(200);
    expect(typeof response.data.nome).toBe('string');
    expect(typeof response.data.email).toBe('string');
    expect(typeof response.data.password).toBe('string');
    expect(typeof response.data.administrador).toBe('string');
    expect(typeof response.data._id).toBe('string');
  });
});