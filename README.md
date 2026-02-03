# 🏦 Banco Carrefour - API Test Automation

![API Tests](https://github.com/SEU-USUARIO/carrefour-api-test-automation/actions/workflows/api-tests.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Playwright](https://img.shields.io/badge/Playwright-1.41-green)
![License](https://img.shields.io/badge/license-MIT-blue)

> Projeto de automação de testes de API desenvolvido como parte do desafio técnico de QA Senior para o Banco Carrefour.

---

## 📋 Sobre o Projeto

Este projeto implementa uma suíte completa de testes automatizados end-to-end para uma API REST de gerenciamento de usuários, cobrindo:

- ✅ **CRUD completo** de usuários
- ✅ **Autenticação JWT**
- ✅ **Validação de Schema JSON**
- ✅ **Testes de Performance e Rate Limiting**
- ✅ **Testes Negativos e de Segurança**
- ✅ **Pipeline CI/CD Automatizada**

---

## 🎯 Cobertura de Testes

### Endpoints Testados

| Método | Endpoint | Cenários | Status |
|--------|----------|----------|--------|
| GET | `/usuarios` | 3 | ✅ |
| POST | `/usuarios` | 7 | ✅ |
| GET | `/usuarios/{id}` | 3 | ✅ |
| PUT | `/usuarios/{id}` | 4 | ✅ |
| DELETE | `/usuarios/{id}` | 3 | ✅ |
| POST | `/login` | 7 | ✅ |

### Tipos de Teste

| Categoria | Quantidade | Descrição |
|-----------|------------|-----------|
| 🟢 **Funcionais** | 20 | Happy path e fluxos principais |
| 🔴 **Negativos** | 15 | Validações e erros esperados |
| 🔐 **Segurança** | 7 | Autenticação e autorização |
| 📋 **Contrato** | 12 | Validação de schema JSON |
| ⚡ **Performance** | 12 | Tempo de resposta e rate limit |

**Total: 58+ cenários de teste automatizados**

---

## 🛠️ Tecnologias Utilizadas

- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação type-safe
- **[Playwright Test](https://playwright.dev/)** - Framework moderno de testes
- **[Axios](https://axios-http.com/)** - Cliente HTTP para requisições
- **[AJV](https://ajv.js.org/)** - Validador de JSON Schema
- **[Allure Report](https://docs.qameta.io/allure/)** - Relatórios avançados
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Git** ([Download](https://git-scm.com/))

---

## 🚀 Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone https://github.com/SEU-USUARIO/carrefour-api-test-automation.git
cd carrefour-api-test-automation
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` se necessário (valores padrão já funcionam):
```env
BASE_URL=https://serverest.dev
TIMEOUT=30000
```

---

## ▶️ Executando os Testes

### Comandos Principais
```bash
# Executar todos os testes
npm test

# Executar testes em modo visual (UI Mode)
npm run test:ui

# Executar em modo debug
npm run test:debug

# Executar suite completa com relatórios
npm run test:full

# Limpar relatórios anteriores
npm run clean:reports
```

### Executar Testes Específicos
```bash
# Apenas testes de CRUD
npm test tests/users/

# Apenas testes de autenticação
npm test tests/auth/

# Apenas testes de performance
npm test tests/performance/

# Apenas testes de schema
npm test tests/schemas/
```

---

## 📊 Visualizando Relatórios

### Relatório HTML (Playwright)
```bash
npm run test:report
```

Abre automaticamente no navegador com:
- Lista completa de testes executados
- Screenshots de falhas
- Traces de execução
- Filtros por status

### Relatório Allure
```bash
# Gerar e visualizar relatório Allure
npm run allure:serve

# Ou gerar estático
npm run allure:generate
npm run allure:open
```

O Allure Report oferece:
- 📈 Dashboard executivo
- 📊 Gráficos e métricas
- 🏷️ Categorização por feature
- ⏱️ Timeline de execução
- 📝 Histórico de testes

### Relatório Executivo
```bash
# Gerar resumo em Markdown
npm run report:summary

# Ver o relatório
cat reports/EXECUTIVE_SUMMARY.md
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

O projeto possui pipeline automatizada que:

- ✅ Executa em **push** e **pull requests**
- ✅ Roda em **múltiplas versões** do Node.js (18.x, 20.x)
- ✅ Gera **relatórios automáticos**
- ✅ Publica **artefatos** para download
- ✅ Executa **agendamento diário** (segunda a sexta, 9h UTC)

### Artefatos Gerados

Cada execução da pipeline gera:

1. 📊 **Playwright HTML Report**
2. 📄 **Test Results JSON**
3. 📋 **JUnit XML** (para integrações)
4. 🎯 **Allure Results**
5. 📝 **Executive Summary**

### Como Acessar

1. Vá para aba **Actions** no GitHub
2. Selecione a execução desejada
3. Role até **Artifacts**
4. Faça download dos relatórios

---

## 📁 Estrutura do Projeto
```
carrefour-api-test-automation/
├── .github/
│   └── workflows/
│       └── api-tests.yml          # Pipeline CI/CD
├── tests/
│   ├── auth/                      # Testes de autenticação
│   │   ├── login.spec.ts
│   │   └── protecao-endpoint.spec.ts
│   ├── users/                     # Testes de CRUD
│   │   ├── get-usuarios.spec.ts
│   │   ├── post-criarUsuarios.spec.ts
│   │   ├── get-buscarPorUsuarioId.spec.ts
│   │   ├── put-atualizarUsuario.spec.ts
│   │   └── delete-deletarUsuario.spec.ts
│   ├── schemas/                   # Validação de contratos
│   │   ├── auth-schema.ts
│   │   ├── schemasUsuarios.ts
│   │   └── schemasUsuariosTeste.spec.ts
│   ├── performance/               # Testes de performance
│   │   └── rate-limit.spec.ts
│   └── utils/                      # Utilitários
│       ├── clientes.ts             # Cliente HTTP
│       ├── auth-helper.ts          # Helper de autenticação
│       ├── test-data.ts            # Gerador de dados
│       ├── validador.ts            # Validador de schemas
│       ├── performance-helpers.ts  # Helper de performance
│       └── allure-helpers.ts       # Helper Allure
├── scripts/
│   └── generate-summary.js        # Gerador de relatório executivo
├── reports/                       # Relatórios gerados (git ignored)
├── .env.example                   # Template de variáveis
├── .gitignore
├── playwright.config.ts           # Configuração do Playwright
├── tsconfig.json                  # Configuração TypeScript
├── package.json
├── CONTRIBUTING.md                # Guia de contribuição
└── README.md
```

---

## 🧪 Exemplos de Casos de Teste

### Teste Funcional (Happy Path)
```typescript
test('Deve criar um novo usuário com sucesso', async () => {
  const novoUsuario = {
    nome: 'Usuario Teste',
    email: 'teste@email.com',
    password: 'senha123',
    administrador: 'true'
  };

  const response = await apiClient.post('/usuarios', novoUsuario);

  expect(response.status).toBe(201);
  expect(response.data.message).toBe('Cadastro realizado com sucesso');
});
```

### Teste Negativo
```typescript
test('Não deve criar usuário sem email', async () => {
  const usuarioInvalido = {
    nome: 'Teste',
    password: 'senha123'
  };

  const response = await apiClient.post('/usuarios', usuarioInvalido);

  expect(response.status).toBe(400);
  expect(response.data).toHaveProperty('email');
});
```

### Teste de Schema
```typescript
test('Deve validar schema da resposta', async () => {
  const response = await apiClient.get('/usuarios');

  const validation = schemaValidator.validate(userListSchema, response.data);
  expect(validation.valid).toBeTruthy();
});
```

---

## 🎓 Aprendizados e Decisões Técnicas

### Por que Playwright Test?

- ✅ Framework moderno e mantido
- ✅ Excelente para testes de API
- ✅ Relatórios nativos de alta qualidade
- ✅ Suporte a TypeScript out-of-the-box
- ✅ Trace viewer integrado

### Por que TypeScript?

- ✅ Type safety evita erros
- ✅ Melhor IntelliSense/autocomplete
- ✅ Refatoração mais segura
- ✅ Padrão do mercado

### Arquitetura de Testes

- **Page Object Pattern adaptado** para APIs
- **Helper classes** para reutilização
- **Data builders** para dados de teste
- **Separation of concerns** clara

---

## 🐛 Troubleshooting

### Testes falhando localmente
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm test
```

### Porta em uso
```bash
# A API serverest.dev é externa, não há conflito de porta
# Se usar API local, ajuste BASE_URL no .env
```

### Problemas com TypeScript
```bash
# Verificar versão do Node
node --version  # Deve ser 18+

# Limpar build
npm run clean:reports
```

---

## 👤 Autor

**Rafael Bertolai**

- LinkedIn: [seu-linkedin](https://www.linkedin.com/in/obertolai/)
- GitHub: [@seu-usuario](https://github.com/Apenas1Show/)
- Email: rafaelbertolai2@gmail.com

---

## 🙏 Agradecimentos

- Banco Carrefour pela oportunidade
- [ServeRest](https://serverest.dev/) pela API de testes
- Comunidade Playwright
- Anthropic Claude pela assistência no desenvolvimento

---

## 📌 Status do Projeto

✅ **Completo e Pronto para Produção**

- [x] Implementação de testes
- [x] CI/CD configurado
- [x] Documentação completa
- [x] 100% de cobertura dos endpoints
- [x] Relatórios automatizados

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**

---

*Desenvolvido com ☕ e dedicação para o desafio técnico do Banco Carrefour*