import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/clientes';

test.describe('GET /users - Listar Usuários', () => {
  let apiClient: ApiClient;

  test.beforeAll(() => {
    const baseURL = process.env.BASE_URL || 'https://serverest.dev';
    apiClient = new ApiClient(baseURL);
  });

  test('Deve retornar lista de usuários com status 200', async () => {
    // Dispara o get e armazena o resultado no response
    const response = await apiClient.get('/usuarios');

    // Validações do retorno
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('usuarios');
    expect(Array.isArray(response.data.usuarios)).toBeTruthy();
  });

  test('Deve retornar a quantidade de usuários cadastrados', async () => {
    const response = await apiClient.get('/usuarios');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('quantidade');
    expect(typeof response.data.quantidade).toBe('number');
    expect(response.data.quantidade).toBeGreaterThanOrEqual(0);
  });

  test('Deve retornar usuários com estrutura correta', async () => {
    const response = await apiClient.get('/usuarios');

    expect(response.status).toBe(200);
    
    if (response.data.usuarios.length > 0) {
      const primeiroUsuario = response.data.usuarios[0];
      
      expect(primeiroUsuario).toHaveProperty('nome');
      expect(primeiroUsuario).toHaveProperty('email');
      expect(primeiroUsuario).toHaveProperty('password');
      expect(primeiroUsuario).toHaveProperty('administrador');
      expect(primeiroUsuario).toHaveProperty('_id');
      
      expect(typeof primeiroUsuario.nome).toBe('string');
      expect(typeof primeiroUsuario.email).toBe('string');
      expect(typeof primeiroUsuario._id).toBe('string');
    }
  });
});