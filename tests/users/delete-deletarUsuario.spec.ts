import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/clientes';
import { ConstrutorDeDadosDeTeste } from '../utils/construtor';

test.describe('PUT /usuarios/{id} - Atualizar Usuário', () => {
  let apiClient: ApiClient;
  let usuarioId: string;
  let usuarioOriginal: any;

  test.beforeEach(async () => {
    const baseURL = process.env.BASE_URL || 'https://serverest.dev';
    apiClient = new ApiClient(baseURL);

    usuarioOriginal = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    const response = await apiClient.post('/usuarios', usuarioOriginal);
    usuarioId = response.data._id;
  });

  test('Deve atualizar usuário existente com sucesso', async () => {
    const dadosAtualizados = ConstrutorDeDadosDeTeste.gerarDadosAtualizacao();

    const response = await apiClient.put(`/usuarios/${usuarioId}`, dadosAtualizados);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', 'Registro alterado com sucesso');

    const verificacao = await apiClient.get(`/usuarios/${usuarioId}`);
    expect(verificacao.data.nome).toBe(dadosAtualizados.nome);
    expect(verificacao.data.email).toBe(dadosAtualizados.email);
  });

  test('Deve criar novo usuário se ID não existir (comportamento PUT)', async () => {
    const idInexistente = 'idqueNaoExiste123';
    const novoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();

    const response = await apiClient.put(`/usuarios/${idInexistente}`, novoUsuario);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('message', 'Cadastro realizado com sucesso');
    expect(response.data).toHaveProperty('_id');
  });

  test('Não deve atualizar com email já existente', async () => {
    const segundoUsuario = ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    const responseSegundo = await apiClient.post('/usuarios', segundoUsuario);
    const segundoId = responseSegundo.data._id;

    const dadosInvalidos = {
      nome: 'Nome Atualizado',
      email: segundoUsuario.email, // Email já em uso
      password: 'senha@123',
      administrador: 'false',
    };

    const response = await apiClient.put(`/usuarios/${usuarioId}`, dadosInvalidos);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('message', 'Este email já está sendo usado');

    await apiClient.delete(`/usuarios/${segundoId}`);
  });

  test('Não deve atualizar sem campos obrigatórios', async () => {
    const dadosIncompletos = {
      nome: 'Apenas Nome',
    };

    const response = await apiClient.put(`/usuarios/${usuarioId}`, dadosIncompletos);

    expect(response.status).toBe(400);
  });
});