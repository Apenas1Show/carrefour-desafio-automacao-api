const fs = require('fs');
const path = require('path');

// Criar diretório de reports se não existir
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Ler resultados dos testes
const resultsPath = path.join(__dirname, '../reports/test-results.json');

if (!fs.existsSync(resultsPath)) {
  console.warn('⚠️  Arquivo de resultados não encontrado. Criando relatório básico...');
  
  const basicReport = `
# 📊 Relatório Executivo de Testes - Carrefour Bank API

**Data da Execução:** ${new Date().toLocaleString('pt-BR')}

---

## ⚠️ Status

Arquivo de resultados não encontrado. Os testes podem não ter sido executados completamente.

Verifique os artefatos do GitHub Actions para mais detalhes.

---

**Relatório gerado automaticamente**
`;
  
  const reportPath = path.join(reportsDir, 'EXECUTIVE_SUMMARY.md');
  fs.writeFileSync(reportPath, basicReport);
  console.log('✅ Relatório básico criado');
  process.exit(0);
}

try {
  const rawData = fs.readFileSync(resultsPath, 'utf8');
  console.log('📄 Arquivo JSON encontrado, tamanho:', rawData.length, 'bytes');
  
  const results = JSON.parse(rawData);
  console.log('✅ JSON parseado com sucesso');
  console.log('📊 Estrutura do JSON:', Object.keys(results));

  // Processar resultados
  const stats = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
    duration: 0,
    suites: {}
  };

  // Função para processar specs recursivamente
  function processSpecs(suites) {
    if (!suites || !Array.isArray(suites)) return;

    suites.forEach(suite => {
      const suiteName = suite.title || 'Outros';
      
      // Inicializar suite stats se não existir
      if (!stats.suites[suiteName]) {
        stats.suites[suiteName] = { passed: 0, failed: 0, skipped: 0, total: 0 };
      }

      // Processar specs
      if (suite.specs && Array.isArray(suite.specs)) {
        suite.specs.forEach(spec => {
          stats.total++;
          stats.suites[suiteName].total++;

          // Verificar resultados
          if (spec.tests && spec.tests.length > 0) {
            const test = spec.tests[0];
            
            if (test.results && test.results.length > 0) {
              const result = test.results[0];
              const status = result.status;
              const duration = result.duration || 0;
              
              stats.duration += duration;

              switch (status) {
                case 'passed':
                  stats.passed++;
                  stats.suites[suiteName].passed++;
                  break;
                case 'failed':
                  stats.failed++;
                  stats.suites[suiteName].failed++;
                  break;
                case 'skipped':
                  stats.skipped++;
                  stats.suites[suiteName].skipped++;
                  break;
                case 'flaky':
                  stats.flaky++;
                  stats.passed++; // Flaky conta como passou eventualmente
                  stats.suites[suiteName].passed++;
                  break;
              }
            }
          }
        });
      }

      // Processar suites aninhadas recursivamente
      if (suite.suites && Array.isArray(suite.suites)) {
        processSpecs(suite.suites);
      }
    });
  }

  // Processar todas as suites
  if (results.suites) {
    processSpecs(results.suites);
  }

  console.log('📊 Estatísticas processadas:', stats);

  // Gerar relatório
  const percentualSucesso = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(2) : '0';
  const duracaoMinutos = (stats.duration / 1000 / 60).toFixed(2);
  const duracaoSegundos = (stats.duration / 1000).toFixed(1);

  const report = `
# 📊 Relatório Executivo de Testes - Carrefour Bank API

**Data da Execução:** ${new Date().toLocaleString('pt-BR')}

---

## 📈 Resumo Geral

| Métrica | Valor |
|---------|-------|
| **Total de Testes** | ${stats.total} |
| **✅ Aprovados** | ${stats.passed} |
| **❌ Reprovados** | ${stats.failed} |
| **⏭️ Ignorados** | ${stats.skipped} |
| **🔄 Flaky** | ${stats.flaky} |
| **📊 Taxa de Sucesso** | ${percentualSucesso}% |
| **⏱️ Tempo Total** | ${duracaoSegundos}s (${duracaoMinutos} min) |

---

## 🎯 Cobertura por Funcionalidade

| Suite de Testes | Total | ✅ Passou | ❌ Falhou | ⏭️ Ignorado | Taxa |
|----------------|-------|-----------|-----------|-------------|------|
${Object.entries(stats.suites)
  .filter(([_, data]) => data.total > 0)
  .map(([suite, data]) => {
    const taxa = data.total > 0 ? ((data.passed / data.total) * 100).toFixed(0) : '0';
    return `| ${suite} | ${data.total} | ${data.passed} | ${data.failed} | ${data.skipped} | ${taxa}% |`;
  }).join('\n') || '| Nenhuma suite encontrada | 0 | 0 | 0 | 0 | 0% |'}

---

## 🏆 Status do Projeto

${stats.failed === 0 && stats.total > 0
  ? '✅ **TODOS OS TESTES PASSARAM!** O projeto está pronto para revisão.' 
  : stats.failed > 0
  ? `⚠️ **${stats.failed} TESTE(S) FALHARAM!** Revisar antes de prosseguir.`
  : '⚠️ **NENHUM TESTE EXECUTADO!** Verifique a configuração.'}

---

## 📋 Detalhes Técnicos

- **Framework:** Playwright Test
- **Ambiente:** CI/CD GitHub Actions
- **Node.js:** 20.x
- **Total de Suites:** ${Object.keys(stats.suites).length}

---

## 🔗 Links Úteis

- 📊 [Relatório HTML Completo](https://github.com/${process.env.GITHUB_REPOSITORY || 'seu-usuario/seu-repo'}/actions)
- 📦 [Artefatos da Execução](https://github.com/${process.env.GITHUB_REPOSITORY || 'seu-usuario/seu-repo'}/actions)

---

**Relatório gerado automaticamente pela automação de testes**
`;

  // Salvar relatório
  const reportPath = path.join(__dirname, '../reports/EXECUTIVE_SUMMARY.md');
  fs.writeFileSync(reportPath, report);

  console.log('✅ Relatório executivo gerado com sucesso!');
  console.log(`📄 Localização: ${reportPath}\n`);
  console.log(report);

  // Retornar código de erro se houver falhas
  if (stats.failed > 0) {
    console.error(`\n❌ ${stats.failed} teste(s) falharam!`);
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Erro ao processar resultados:', error);
  console.error('Stack trace:', error.stack);
  
  // Criar relatório de erro
  const errorReport = `
# 📊 Relatório Executivo de Testes - Carrefour Bank API

**Data da Execução:** ${new Date().toLocaleString('pt-BR')}

---

## ❌ Erro ao Processar Resultados

Ocorreu um erro ao processar o arquivo de resultados:

\`\`\`
${error.message}
\`\`\`

Verifique os logs do GitHub Actions para mais detalhes.

---

**Relatório gerado automaticamente**
`;
  
  const reportPath = path.join(reportsDir, 'EXECUTIVE_SUMMARY.md');
  fs.writeFileSync(reportPath, errorReport);
  
  process.exit(1);
}