# JuriPlus - Sistema de Gestão Jurídica

![JuriPlus](https://img.shields.io/badge/JuriPlus-v1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)

Sistema completo de gestão para escritórios de advocacia, desenvolvido com tecnologias modernas.

## 🚀 Características

### Frontend (React + TypeScript)
- ⚡ **Vite** - Build tool rápido e moderno
- 🎨 **Tailwind CSS** - Estilização utilitária
- 🧩 **Shadcn/ui** - Componentes UI modernos
- 📱 **Responsivo** - Design adaptável para todos os dispositivos
- 🔄 **React Query** - Gerenciamento de estado e cache
- 🛣️ **React Router** - Navegação SPA

### Backend (Node.js + Express)
- 🔒 **JWT Authentication** - Autenticação segura
- 🗄️ **PostgreSQL** - Banco de dados robusto
- 📝 **Joi Validation** - Validação de dados
- 🛡️ **Helmet** - Segurança HTTP
- 📊 **Morgan** - Logging de requisições
- 🔐 **Bcrypt** - Hash de senhas
- ⚡ **Rate Limiting** - Proteção contra abuso

## 📋 Funcionalidades

### 🏢 Gestão de Escritório
- ✅ Cadastro e autenticação de usuários
- ✅ Perfis diferenciados (Admin, Escritório, Advogado)
- ✅ Configurações personalizadas
- ✅ Auditoria de ações

### 👥 Gestão de Clientes
- ✅ Cadastro completo de clientes (PF/PJ)
- ✅ Histórico de atendimentos
- ✅ Busca e filtros avançados
- ✅ Estatísticas de clientes

### 🎯 CRM - Gestão de Leads
- ✅ Captação multi-canal (WhatsApp, Instagram, Site)
- ✅ Funil de vendas visual (Kanban)
- ✅ Status personalizáveis
- ✅ Conversão de leads em clientes
- ✅ Relatórios de performance

### 📅 Sistema de Agenda
- ✅ Calendário completo
- ✅ Agendamento de consultorias
- ✅ Controle de conflitos
- ✅ Notificações e lembretes
- ✅ Integração com atendimentos

### 🏥 Gestão de Atendimentos
- ✅ Registro de atendimentos
- ✅ Status e acompanhamento
- ✅ Observações detalhadas
- ✅ Vinculação com agenda

### 📊 Dashboard e Relatórios
- ✅ Visão geral do escritório
- ✅ Gráficos de performance
- ✅ Estatísticas em tempo real
- ✅ Métricas de conversão

## 🛠️ Tecnologias Utilizadas

### Frontend
```json
{
  "react": "^18.3.1",
  "typescript": "^5.8.3",
  "vite": "^5.4.19",
  "tailwindcss": "^3.4.17",
  "@tanstack/react-query": "^5.83.0",
  "react-router-dom": "^6.30.1",
  "lucide-react": "^0.462.0",
  "recharts": "^3.1.2"
}
```

### Backend
```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "joi": "^17.9.2",
  "helmet": "^7.0.0",
  "cors": "^2.8.5"
}
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Instalação Automática

#### Windows
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd juriplus-nav-kit-53-main

# Execute o script de configuração
setup.bat
```

#### Linux/Mac
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd juriplus-nav-kit-53-main

# Torne o script executável e execute
chmod +x setup.sh
./setup.sh
```

### Instalação Manual

#### 1. Backend
```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Configurar banco de dados
npm run setup

# Iniciar servidor de desenvolvimento
npm run dev
```

#### 2. Frontend
```bash
# Na raiz do projeto
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env se necessário

# Iniciar aplicação
npm run dev
```

## ⚙️ Configuração do Banco de Dados

### Variáveis de Ambiente (.env)
```env
# Configurações do Banco
DB_HOST=localhost
DB_PORT=5432
DB_NAME=juriplus
DB_USER=postgres
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRE=7d

# Servidor
PORT=3001
NODE_ENV=development
```

### Usuários Padrão
Após a configuração, os seguintes usuários estarão disponíveis:

```
Admin:
Email: admin@juriplus.com
Senha: admin123

Escritório:
Email: escritorio@exemplo.com
Senha: escritorio123

Advogado:
Email: advogado@exemplo.com
Senha: advogado123
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Produção
```bash
# Frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

## 📊 URLs da Aplicação

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

## 🗂️ Estrutura do Projeto

```
juriplus-nav-kit-53-main/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── middleware/     # Middlewares
│   │   ├── routes/         # Rotas da API
│   │   ├── setup/          # Scripts de configuração
│   │   └── server.js       # Servidor principal
│   ├── package.json
│   └── .env
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   ├── contexts/          # Contextos React
│   ├── hooks/             # Hooks customizados
│   ├── lib/               # Utilitários e API
│   ├── pages/             # Páginas da aplicação
│   └── App.tsx            # Componente principal
├── public/                # Arquivos estáticos
├── package.json
└── README.md
```

## 🔒 Segurança

- ✅ **Autenticação JWT** com tokens seguros
- ✅ **Hash de senhas** com bcrypt
- ✅ **Rate limiting** para prevenir abuso
- ✅ **Validação de dados** em todas as entradas
- ✅ **Headers de segurança** com Helmet
- ✅ **CORS** configurado adequadamente
- ✅ **Auditoria** de ações dos usuários

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 **Mobile** (320px+)
- 📟 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a seção de [Issues](../../issues)
2. Consulte a documentação da API
3. Entre em contato com a equipe de desenvolvimento

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] **Integração WhatsApp** - API oficial
- [ ] **Relatórios avançados** - PDF/Excel
- [ ] **Sistema de documentos** - Upload e gestão
- [ ] **Calendário compartilhado** - Team collaboration
- [ ] **Notificações push** - Real-time updates
- [ ] **Mobile app** - React Native
- [ ] **Integração bancária** - Gestão financeira
- [ ] **Chat interno** - Comunicação da equipe

---

**Desenvolvido com ❤️ para advogados por advogados**
