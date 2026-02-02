# 🏦 Banco Carrefour - Testes automatizados de API

Projeto de automação de testes de API para o desafio técnico de QA Senior do Banco Carrefour.

## 📋 Sobre o Projeto

Este projeto implementa testes automatizados end-to-end para uma API REST de gerenciamento de usuários, cobrindo operações CRUD, autenticação JWT, validações de schema e testes de performance.

## 🛠️ Tecnologias Utilizadas

- **TypeScript** - Linguagem de programação
- **Playwright Test** - Framework de testes
- **Axios** - Cliente HTTP para requisições
- **Node.js** - Ambiente de execução

## 📦 Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Git

## 🚀 Instalação
```bash
# Clone o repositório
git clone https://github.com/Apenas1Show/carrefour-desafio-automacao-api.git

# Entre na pasta do projeto
cd carrefour-desafio-automacao-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

## ▶️ Executando os Testes
```bash
# Executar todos os testes
npm test

# Executar em modo debug
npm run test:debug

# Ver relatório HTML
npm run test:report
```

## 📊 Relatórios

Os relatórios são gerados automaticamente em:
- `reports/html-report/` - Relatório HTML interativo
- `reports/test-results.json` - Resultados em JSON

## 🧪 Cobertura de Testes

### Endpoints Testados
- ✅ GET /users - Listar usuários
- ✅ POST /users - Criar usuário
- ✅ GET /users/{id} - Buscar usuário específico
- ✅ PUT /users/{id} - Atualizar usuário
- ✅ DELETE /users/{id} - Deletar usuário

### Cenários Cobertos
- Testes funcionais (caminho feliz)
- Testes negativos (validações e erros)
- Autenticação JWT
- Validação de schema JSON
- Testes de rate limiting

## 📁 Estrutura do Projeto
```
carrefour-api-test-automation/
├── tests/
│   ├── auth/          # Testes de autenticação
│   ├── users/         # Testes de CRUD de usuários
│   ├── schemas/       # Schemas JSON para validação
│   └── utils/         # Utilitários e helpers
├── reports/           # Relatórios gerados
├── .env.example       # Exemplo de variáveis de ambiente
├── playwright.config.ts
└── README.md
```

## 🔄 CI/CD

O projeto está configurado com GitHub Actions para execução automática dos testes a cada push/PR.

## 👤 Autor

Seu Nome - [LinkedIn](seu-linkedin) - [GitHub](seu-github)

## 📝 Licença

MIT License

---

⭐ **Status do Projeto:** Em Desenvolvimento - Fase 1 Concluída