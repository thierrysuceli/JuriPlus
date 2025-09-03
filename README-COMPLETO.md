# JuriPlus - Sistema de Gestão Jurídica

## 🎯 Sistema Full-Stack Completo

Este projeto é um **sistema completo de gestão jurídica** com frontend React e backend Node.js, incluindo:

- ⚖️ **CRM Jurídico** - Gestão de leads e clientes
- 📅 **Agenda** - Agendamento de consultas e audiências  
- 👥 **Gestão de Clientes** - Cadastro completo de pessoas físicas e jurídicas
- 📊 **Dashboard** - Analytics e relatórios
- 🔐 **Sistema de Autenticação** - Login seguro com JWT
- ⚙️ **Configurações** - Personalização do sistema

## 🚀 Executando o Sistema

### Backend (API)
```bash
# Navegar para o backend
cd backend

# Instalar dependências (se ainda não instalou)
npm install

# Configurar banco de dados
npm run setup

# Iniciar servidor
npm start
# ou para desenvolvimento:
npm run dev
```

O backend estará rodando em: **http://localhost:3001**

### Frontend (Interface)
```bash
# Na raiz do projeto
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: **http://localhost:8080**

## 📦 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express** - Servidor e API REST
- **SQLite** - Banco de dados local (desenvolvimento)
- **PostgreSQL** - Suporte para produção
- **JWT** - Autenticação segura
- **Joi** - Validação de dados
- **bcryptjs** - Hash de senhas

### Frontend
- **React 18** + **TypeScript** - Interface moderna
- **Vite** - Build tool rápido
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **React Router** - Navegação

## 🔧 Configuração do Banco

O sistema usa **SQLite por padrão** para facilitar o desenvolvimento local. Os dados ficam armazenados em:
```
backend/data/juriplus.db
```

### Usuários Padrão
- **Admin**: admin@juriplus.com / admin123
- **Escritório**: escritorio@exemplo.com / escritorio123  
- **Advogado**: advogado@exemplo.com / advogado123

## 📁 Estrutura do Projeto

```
juriplus-nav-kit-53-main/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── config/         # Configurações
│   │   ├── middleware/     # Middlewares
│   │   └── setup/          # Scripts de setup
│   └── package.json
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── lib/               # Utilitários e API client
│   └── hooks/             # Custom hooks
└── package.json
```

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Dados do usuário

### CRM
- `GET /api/crm/leads` - Listar leads
- `POST /api/crm/leads` - Criar lead
- `PUT /api/crm/leads/:id` - Atualizar lead

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/:id` - Atualizar cliente

### Agenda
- `GET /api/agenda` - Listar eventos
- `POST /api/agenda` - Criar evento
- `PUT /api/agenda/:id` - Atualizar evento

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/leads-chart` - Gráfico de leads
- `GET /api/dashboard/receita-chart` - Gráfico de receita

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Hash de senhas com bcrypt
- ✅ Validação de dados com Joi
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Headers de segurança (Helmet)
- ✅ Logs de auditoria

## 🎨 Interface

O sistema possui uma interface moderna e responsiva com:

- 📱 **Design Responsivo** - Funciona em desktop e mobile
- 🎨 **Tema Escuro/Claro** - Personalizável
- ⚡ **Performance** - Carregamento rápido
- 🔄 **Real-time** - Atualizações em tempo real
- 📊 **Gráficos** - Visualização de dados

## 🚀 Deploy

### Desenvolvimento Local
1. Clone o repositório
2. Execute o backend: `cd backend && npm install && npm run setup && npm start`
3. Execute o frontend: `npm install && npm run dev`
4. Acesse: http://localhost:8080

### Produção
- Backend: Configure PostgreSQL e variáveis de ambiente
- Frontend: Execute `npm run build` e deploy os arquivos estáticos

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se ambos os servidores estão rodando
2. Confira se o banco foi configurado (`npm run setup`)
3. Teste a API em: http://localhost:3001/health

---

**Desenvolvido com ❤️ para gestão jurídica moderna**
