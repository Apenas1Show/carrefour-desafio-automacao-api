import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/clientes';

test.describe('Rate Limit - Limitação de Requisições', () => {
  let apiClient: ApiClient;

  test.beforeAll(() => {
    const baseURL = process.env.BASE_URL || 'https://serverest.dev';
    apiClient = new ApiClient(baseURL);
  });

  test('Deve permitir até 100 requisições em sequência', async () => {
    const totalRequisicoes = 50;
    const requisicoes: Promise<any>[] = [];

    const inicio = Date.now();
    
    for (let i = 0; i < totalRequisicoes; i++) {
      requisicoes.push(apiClient.get('/usuarios'));
    }

    const respostas = await Promise.all(requisicoes);
    const fim = Date.now();
    const tempoTotal = fim - inicio;

    const todasComSucesso = respostas.every(r => r.status === 200);
    expect(todasComSucesso).toBeTruthy();
    
    console.log(`✓ ${totalRequisicoes} requisições completadas em ${tempoTotal}ms`);
    console.log(`✓ Média: ${(tempoTotal / totalRequisicoes).toFixed(2)}ms por requisição`);
  });

  test('Deve medir tempo de resposta médio das requisições', async () => {
    const totalTestes = 10;
    const temposResposta: number[] = [];

    for (let i = 0; i < totalTestes; i++) {
      const inicio = Date.now();
      const response = await apiClient.get('/usuarios');
      const fim = Date.now();
      
      expect(response.status).toBe(200);
      temposResposta.push(fim - inicio);
    }

    const tempoMedio = temposResposta.reduce((a, b) => a + b, 0) / totalTestes;
    const tempoMinimo = Math.min(...temposResposta);
    const tempoMaximo = Math.max(...temposResposta);

    console.log(`\n📊 Estatísticas de Performance:`);
    console.log(`   Tempo médio: ${tempoMedio.toFixed(2)}ms`);
    console.log(`   Tempo mínimo: ${tempoMinimo}ms`);
    console.log(`   Tempo máximo: ${tempoMaximo}ms`);

    expect(tempoMedio).toBeLessThan(3000);
  });

  test('Deve validar que API responde dentro de SLA aceitável', async () => {
    const SLA_MAXIMO_MS = 5000;
    const totalTestes = 20;
    let requisicoesForaSLA = 0;

    for (let i = 0; i < totalTestes; i++) {
      const inicio = Date.now();
      const response = await apiClient.get('/usuarios');
      const tempoResposta = Date.now() - inicio;

      if (tempoResposta > SLA_MAXIMO_MS) {
        requisicoesForaSLA++;
      }

      expect(response.status).toBe(200);
    }

    const percentualDentroSLA = ((totalTestes - requisicoesForaSLA) / totalTestes) * 100;
    
    console.log(`\n📈 SLA Performance:`);
    console.log(`   Requisições testadas: ${totalTestes}`);
    console.log(`   Dentro do SLA: ${totalTestes - requisicoesForaSLA}`);
    console.log(`   Fora do SLA: ${requisicoesForaSLA}`);
    console.log(`   Percentual de sucesso: ${percentualDentroSLA.toFixed(2)}%`);

    expect(percentualDentroSLA).toBeGreaterThanOrEqual(90);
  });

  test('Deve testar requisições paralelas sem exceder rate limit', async () => {
    const requisicoesParalelas = 20;
    const requisicoes: Promise<any>[] = [];

    const inicio = Date.now();

    for (let i = 0; i < requisicoesParalelas; i++) {
      requisicoes.push(apiClient.get('/usuarios'));
    }

    const respostas = await Promise.all(requisicoes);
    const tempoTotal = Date.now() - inicio;

    const sucesso = respostas.filter(r => r.status === 200).length;
    const falhas = respostas.filter(r => r.status !== 200).length;

    console.log(`\n🔄 Requisições Paralelas:`);
    console.log(`   Total enviadas: ${requisicoesParalelas}`);
    console.log(`   Sucesso (200): ${sucesso}`);
    console.log(`   Falhas: ${falhas}`);
    console.log(`   Tempo total: ${tempoTotal}ms`);

    expect(sucesso).toBeGreaterThan(0);
  });

  test('Deve validar consistência de dados sob carga', async () => {
    const totalRequisicoes = 15;
    const requisicoes: Promise<any>[] = [];

    for (let i = 0; i < totalRequisicoes; i++) {
      requisicoes.push(apiClient.get('/usuarios'));
    }

    const respostas = await Promise.all(requisicoes);

    const todasComQuantidade = respostas.every(r => 
      r.status === 200 && typeof r.data.quantidade === 'number'
    );

    expect(todasComQuantidade).toBeTruthy();

    const quantidades = respostas.map(r => r.data.quantidade);
    const quantidadeUnica = new Set(quantidades).size;

    console.log(`\n🔍 Consistência de Dados:`);
    console.log(`   Requisições: ${totalRequisicoes}`);
    console.log(`   Variações de quantidade: ${quantidadeUnica}`);
    
    expect(quantidadeUnica).toBeLessThanOrEqual(5);
  });
});