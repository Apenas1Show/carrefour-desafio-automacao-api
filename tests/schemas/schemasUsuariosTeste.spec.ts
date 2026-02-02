import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/clientes';
import { ConstrutorDeDadosDeTeste } from '../utils/construtor';
import { ValidadorSchema } from '../utils/validador';
import {
  userSchema,
  userListSchema,
  createUserResponseSchema,
  updateUserResponseSchema,
  deleteUserResponseSchema,
} from './schemasUsuarios';

test.describe('Validação de Schema - Endpoints de Usuários', () => {
  let apiClient: ApiClient;
  let schemaValidator: ValidadorSchema;

  test.beforeAll(() => {
    const baseURL = process.env.BASE_URL || 'https://serverest.dev';
    apiClient = new ApiClient(baseURL);
    schemaValidator = new ValidadorSchema();
  });

  test('GET /usuarios deve retornar schema válido de lista de usuários', async () => {
    const response = await apiClient.get('/usuarios');

    expect(response.status).toBe(200);
    
    const validation = schemaValidator.validate(userListSchema, response.data);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      console.error('Erros de validação:', validation.errors);
      expect(validation.valid).toBeTruthy(); // Falhar com mensagem clara
    }
  });

  test('GET /usuarios/{id} deve retornar schema válido de usuário único', async () => {
    const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    const createResponse = await apiClient.post('/usuarios', novoUsuario);
    const userId = createResponse.data._id;

    const response = await apiClient.get(`/usuarios/${userId}`);

    expect(response.status).toBe(200);
    
    const validation = schemaValidator.validate(userSchema, response.data);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      console.error('Erros de validação:', validation.errors);
    }

    await apiClient.delete(`/usuarios/${userId}`);
  });

  test('POST /usuarios deve retornar schema válido de criação', async () => {
    const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();

    const response = await apiClient.post('/usuarios', novoUsuario);

    expect(response.status).toBe(201);
    
    const validation = schemaValidator.validate(createUserResponseSchema, response.data);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      console.error('Erros de validação:', validation.errors);
    }

    await apiClient.delete(`/usuarios/${response.data._id}`);
  });

  test('PUT /usuarios/{id} deve retornar schema válido de atualização', async () => {
    const usuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    const createResponse = await apiClient.post('/usuarios', usuario);
    const userId = createResponse.data._id;

    const dadosAtualizados = ConstrutorDeDadosDeTeste.gerarDadosAtualizacao();
    const response = await apiClient.put(`/usuarios/${userId}`, dadosAtualizados);

    expect(response.status).toBe(200);
    
    const validation = schemaValidator.validate(updateUserResponseSchema, response.data);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      console.error('Erros de validação:', validation.errors);
    }

    await apiClient.delete(`/usuarios/${userId}`);
  });

  test('DELETE /usuarios/{id} deve retornar schema válido de deleção', async () => {
    const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    const createResponse = await apiClient.post('/usuarios', novoUsuario);
    const userId = createResponse.data._id;

    const response = await apiClient.delete(`/usuarios/${userId}`);

    expect(response.status).toBe(200);
    
    const validation = schemaValidator.validate(deleteUserResponseSchema, response.data);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      console.error('Erros de validação:', validation.errors);
    }
  });

  test('Deve validar que todos os campos obrigatórios estão presentes', async () => {
    const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    const createResponse = await apiClient.post('/usuarios', novoUsuario);
    const userId = createResponse.data._id;

    const response = await apiClient.get(`/usuarios/${userId}`);

    const userData = response.data;
    expect(userData).toHaveProperty('nome');
    expect(userData).toHaveProperty('email');
    expect(userData).toHaveProperty('password');
    expect(userData).toHaveProperty('administrador');
    expect(userData).toHaveProperty('_id');

    await apiClient.delete(`/usuarios/${userId}`);
  });

  test('Deve validar tipos de dados dos campos', async () => {
    const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    const createResponse = await apiClient.post('/usuarios', novoUsuario);
    const userId = createResponse.data._id;

    const response = await apiClient.get(`/usuarios/${userId}`);

    const userData = response.data;
    expect(typeof userData.nome).toBe('string');
    expect(typeof userData.email).toBe('string');
    expect(typeof userData.password).toBe('string');
    expect(typeof userData.administrador).toBe('string');
    expect(typeof userData._id).toBe('string');
    
    expect(['true', 'false']).toContain(userData.administrador);

    await apiClient.delete(`/usuarios/${userId}`);
  });

  test('Deve validar formato de email no campo email', async () => {
    const response = await apiClient.get('/usuarios');

    expect(response.status).toBe(200);
    
    if (response.data.usuarios.length > 0) {
      const usuario = response.data.usuarios[0];
      expect(usuario.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });
});