import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/clientes';
import { ConstrutorDeDadosDeTeste } from '../utils/construtor';
import { AllureHelper, Severity } from '../utils/allure-helpers';

test.describe('Exemplo Completo - Relatório Allure', () => {
  let apiClient: ApiClient;

  test.beforeAll(() => {
    const baseURL = process.env.BASE_URL || 'https://serverest.dev';
    apiClient = new ApiClient(baseURL);
  });

  test('Cenário Completo: Criar, Atualizar e Deletar Usuário', async () => {
    AllureHelper.severity(Severity.BLOCKER);
    AllureHelper.feature('Gerenciamento de Usuários');
    AllureHelper.story('CRUD Completo de Usuário');
    AllureHelper.owner('QA Team');
    AllureHelper.tag('e2e');
    AllureHelper.tag('crud');
    AllureHelper.link('https://serverest.dev', 'Documentação da API');

    let userId: string;

    await AllureHelper.step('STEP 1: Criar novo usuário', async () => {
      const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
      AllureHelper.attachJSON('Payload - Novo Usuário', novoUsuario);

      const response = await apiClient.post('/usuarios', novoUsuario);
      AllureHelper.attachJSON('Response - Criação', response.data);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('_id');
      
      userId = response.data._id;
      AllureHelper.attach('User ID Criado', userId);
    });

    await AllureHelper.step('STEP 2: Buscar usuário criado', async () => {
      const response = await apiClient.get(`/usuarios/${userId}`);
      AllureHelper.attachJSON('Response - Busca', response.data);

      expect(response.status).toBe(200);
      expect(response.data._id).toBe(userId);
    });

    await AllureHelper.step('STEP 3: Atualizar dados do usuário', async () => {
      const dadosAtualizados = ConstrutorDeDadosDeTeste.gerarDadosAtualizacao();
      AllureHelper.attachJSON('Payload - Atualização', dadosAtualizados);

      const response = await apiClient.put(`/usuarios/${userId}`, dadosAtualizados);
      AllureHelper.attachJSON('Response - Atualização', response.data);

      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Registro alterado com sucesso');
    });

    await AllureHelper.step('STEP 4: Verificar atualização', async () => {
      const response = await apiClient.get(`/usuarios/${userId}`);
      AllureHelper.attachJSON('Response - Verificação', response.data);

      expect(response.status).toBe(200);
    });

    await AllureHelper.step('STEP 5: Deletar usuário', async () => {
      const response = await apiClient.delete(`/usuarios/${userId}`);
      AllureHelper.attachJSON('Response - Deleção', response.data);

      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Registro excluído com sucesso');
    });

    await AllureHelper.step('STEP 6: Confirmar deleção', async () => {
      const response = await apiClient.get(`/usuarios/${userId}`);
      AllureHelper.attachJSON('Response - Confirmação', response.data);

      expect(response.status).toBe(400);
      expect(response.data.message).toBe('Usuário não encontrado');
    });
  });

  test('Exemplo de teste com severity BLOCKER', async () => {
    AllureHelper.severity(Severity.BLOCKER);
    AllureHelper.feature('Autenticação');
    AllureHelper.story('Login Básico');
    AllureHelper.tag('critical');

    await test.step('Validar endpoint de listagem', async () => {
      const response = await apiClient.get('/usuarios');
      expect(response.status).toBe(200);
    });
  });

  test('Exemplo de teste com severity CRITICAL', async () => {
    AllureHelper.severity(Severity.CRITICAL);
    AllureHelper.feature('Gerenciamento de Usuários');
    AllureHelper.tag('regression');

    await test.step('Criar usuário', async () => {
      const usuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
      const response = await apiClient.post('/usuarios', usuario);
      expect(response.status).toBe(201);
    });
  });

  test('Exemplo de teste com severity NORMAL', async () => {
    AllureHelper.severity(Severity.NORMAL);
    AllureHelper.feature('Validações');

    await test.step('Validar estrutura de resposta', async () => {
      const response = await apiClient.get('/usuarios');
      expect(response.data).toHaveProperty('usuarios');
    });
  });
});