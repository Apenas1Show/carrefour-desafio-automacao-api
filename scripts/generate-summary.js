const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, '../reports/test-results.json');

if (!fs.existsSync(resultsPath)) {
  console.error('❌ Arquivo de resultados não encontrado!');
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  duration: 0,
  suites: {}
};

results.suites?.forEach(suite => {
  suite.specs?.forEach(spec => {
    stats.total++;
    const testStatus = spec.tests?.[0]?.results?.[0]?.status || 'unknown';
    
    if (testStatus === 'passed') stats.passed++;
    else if (testStatus === 'failed') stats.failed++;
    else if (testStatus === 'skipped') stats.skipped++;
    
    stats.duration += spec.tests?.[0]?.results?.[0]?.duration || 0;

    const suiteName = suite.title || 'Outros';
    if (!stats.suites[suiteName]) {
      stats.suites[suiteName] = { passed: 0, failed: 0, total: 0 };
    }
    stats.suites[suiteName].total++;
    if (testStatus === 'passed') stats.suites[suiteName].passed++;
    if (testStatus === 'failed') stats.suites[suiteName].failed++;
  });
});

const percentualSucesso = ((stats.passed / stats.total) * 100).toFixed(2);
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
  const taxa = ((data.passed / data.total) * 100).toFixed(0);
  return `| ${suite} | ${data.total} | ${data.passed} | ${data.failed} | ${taxa}% |`;
}).join('\n')}

---

## 🏆 Status do Projeto

${stats.failed === 0 
  ? '✅ **TODOS OS TESTES PASSARAM!** O projeto está pronto para produção.' 
  : `⚠️ **${stats.failed} TESTE(S) FALHARAM!** Revisar antes de prosseguir.`}

---

## 📋 Próximos Passos

${stats.failed === 0 
  ? '- ✅ Revisar relatório Allure detalhado\n- ✅ Preparar para deploy\n- ✅ Documentar cobertura de testes' 
  : '- ❌ Corrigir testes falhados\n- ❌ Re-executar suite completa\n- ❌ Validar com equipe'}

---

**Relatório gerado automaticamente pela automação de testes**
`;

const reportPath = path.join(__dirname, '../reports/EXECUTIVE_SUMMARY.md');
fs.writeFileSync(reportPath, report);

console.log('✅ Relatório executivo gerado com sucesso!');
console.log(`📄 Localização: ${reportPath}`);
console.log(`\n${report}`);