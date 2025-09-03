const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Configuração do banco de dados
const db = require('./config/database-adapter');
const errorHandler = require('./middleware/errorHandler');

// Importar rotas
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const atendimentosRoutes = require('./routes/atendimentos');
const agendaRoutes = require('./routes/agenda');
const crmRoutes = require('./routes/crm');
const dashboardRoutes = require('./routes/dashboard');
const configuracoesRoutes = require('./routes/configuracoes');
const perfilRoutes = require('./routes/perfil');
const advogadosRoutes = require('./routes/advogados');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate Limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutos
  max: process.env.RATE_LIMIT_MAX || 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas tentativas, tente novamente em alguns minutos'
  }
});

// Middlewares de segurança
app.use(helmet());
app.use(limiter);
app.use(compression());

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares gerais
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/atendimentos', atendimentosRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/configuracoes', configuracoesRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/advogados', advogadosRoutes);

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl 
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicializar servidor
async function startServer() {
  try {
    // Testar conexão com banco
    await db.testConnection();
    console.log('✅ Conexão com banco de dados estabelecida');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

module.exports = app;
