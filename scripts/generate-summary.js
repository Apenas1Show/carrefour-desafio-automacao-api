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

---

**Relatório gerado automaticamente**
`;
  
  const reportPath = path.join(reportsDir, 'EXECUTIVE_SUMMARY.md');
  fs.writeFileSync(reportPath, basicReport);
  console.log('✅ Relatório básico criado');
  process.exit(0);
}

try {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

  // Processar resultados
  const stats = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    suites: {}
  };

  if (results.suites) {
    results.suites.forEach(suite => {
      if (suite.specs) {
        suite.specs.forEach(spec => {
          stats.total++;
          const testStatus = spec.tests?.[0]?.results?.[0]?.status || 'unknown';
          
          if (testStatus === 'passed') stats.passed++;
          else if (testStatus === 'failed') stats.failed++;
          else if (testStatus === 'skipped') stats.skipped++;
          
          stats.duration += spec.tests?.[0]?.results?.[0]?.duration || 0;

          // Agrupar por suite
          const suiteName = suite.title || 'Outros';
          if (!stats.suites[suiteName]) {
            stats.suites[suiteName] = { passed: 0, failed: 0, total: 0 };
          }
          stats.suites[suiteName].total++;
          if (testStatus === 'passed') stats.suites[suiteName].passed++;
          if (testStatus === 'failed') stats.suites[suiteName].failed++;
        });
      }
    });
  }

  // Gerar relatório
  const percentualSucesso = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(2) : '0';
  const duracaoMinutos = (stats.duration / 1000 / 60).toFixed(2);

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
| **📊 Taxa de Sucesso** | ${percentualSucesso}% |
| **⏱️ Tempo Total** | ${duracaoMinutos} minutos |

---

## 🎯 Cobertura por Funcionalidade

| Suite de Testes | Total | ✅ Passou | ❌ Falhou | Taxa |
|----------------|-------|-----------|-----------|------|
${Object.entries(stats.suites).map(([suite, data]) => {
  const taxa = data.total > 0 ? ((data.passed / data.total) * 100).toFixed(0) : '0';
  return `| ${suite} | ${data.total} | ${data.passed} | ${data.failed} | ${taxa}% |`;
}).join('\n')}

---

## 🏆 Status do Projeto

${stats.failed === 0 
  ? '✅ **TODOS OS TESTES PASSARAM!** O projeto está pronto para revisão.' 
  : `⚠️ **${stats.failed} TESTE(S) FALHARAM!** Revisar antes de prosseguir.`}

---

**Relatório gerado automaticamente pela automação de testes**
`;

  // Salvar relatório
  const reportPath = path.join(__dirname, '../reports/EXECUTIVE_SUMMARY.md');
  fs.writeFileSync(reportPath, report);

  console.log('✅ Relatório executivo gerado com sucesso!');
  console.log(`📄 Localização: ${reportPath}\n`);
  console.log(report);

} catch (error) {
  console.error('❌ Erro ao processar resultados:', error.message);
  process.exit(1);
}