import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/clientes';
import { ConstrutorDeDadosDeTeste } from '../utils/construtor';
import { AllureHelper, Severity } from '../utils/allure-helpers';

test.describe('POST /usuarios - Criar Usuário', () => {
  let apiClient: ApiClient;

  test.beforeAll(() => {
    const baseURL = process.env.BASE_URL || 'https://serverest.dev';
    apiClient = new ApiClient(baseURL);
  });

  test('Deve criar um novo usuário com sucesso', async () => {
    AllureHelper.severity(Severity.CRITICAL);
    AllureHelper.feature('Gerenciamento de Usuários');
    AllureHelper.story('Criação de Usuário');
    AllureHelper.tag('smoke');
    AllureHelper.tag('regression');

    await AllureHelper.step('Preparar dados do novo usuário', async () => {
      const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
      AllureHelper.attachJSON('Dados do Usuário', novoUsuario);

      await AllureHelper.step('Enviar requisição POST /usuarios', async () => {
        const response = await apiClient.post('/usuarios', novoUsuario);
        
        AllureHelper.attachJSON('Response', {
          status: response.status,
          data: response.data,
        });

        await AllureHelper.step('Validar resposta', async () => {
          expect(response.status).toBe(201);
          expect(response.data).toHaveProperty('message', 'Cadastro realizado com sucesso');
          expect(response.data).toHaveProperty('_id');
          expect(typeof response.data._id).toBe('string');
          expect(response.data._id).not.toBe('');
        });
      });
    });
  });


  test('Deve criar um usuário administrador com sucesso', async () => {
    const usuarioAdmin = ConstrutorDeDadosDeTeste.gerarUsuarioAdmin();
    const response = await apiClient.post('/usuarios', usuarioAdmin);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('message', 'Cadastro realizado com sucesso');
    expect(response.data).toHaveProperty('_id');
  });

  test('Não deve criar usuário com email duplicado', async () => {
    const usuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    
    await apiClient.post('/usuarios', usuario);

    const response = await apiClient.post('/usuarios', usuario);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('message', 'Este email já está sendo usado');
  });

  test('Não deve criar usuário sem nome', async () => {
    const usuarioInvalido = {
      email: ConstrutorDeDadosDeTeste.gerarEmailUnico(),
      password: 'senha@123',
      administrador: 'false',
    };

    const response = await apiClient.post('/usuarios', usuarioInvalido);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('nome');
  });

  test('Não deve criar usuário sem email', async () => {
    const usuarioInvalido = {
      nome: 'Teste QA',
      password: 'senha@123',
      administrador: 'false',
    };

    const response = await apiClient.post('/usuarios', usuarioInvalido);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('email');
  });

  test('Não deve criar usuário sem password', async () => {
    const usuarioInvalido = {
      nome: 'Teste QA',
      email: ConstrutorDeDadosDeTeste.gerarEmailUnico(),
      administrador: 'false',
    };

    const response = await apiClient.post('/usuarios', usuarioInvalido);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('password');
  });

  test('Não deve criar usuário com email inválido', async () => {
    const usuarioInvalido = {
      nome: 'Teste QA',
      email: 'email-invalido',
      password: 'senha@123',
      administrador: 'false',
    };

    const response = await apiClient.post('/usuarios', usuarioInvalido);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('email');
  });
});