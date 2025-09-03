require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Configuração do banco de dados
const db = require('./src/config/database-adapter');
const errorHandler = require('./src/middleware/errorHandler');

// Testar importação das rotas uma por uma
try {
  console.log('Testando importação das rotas...');
  
  console.log('1. auth...');
  const authRoutes = require('./src/routes/auth');
  console.log('✓ auth importado com sucesso');
  
  console.log('2. clientes...');
  const clientesRoutes = require('./src/routes/clientes');
  console.log('✓ clientes importado com sucesso');
  
  console.log('3. atendimentos...');
  const atendimentosRoutes = require('./src/routes/atendimentos');
  console.log('✓ atendimentos importado com sucesso');
  
  console.log('4. agenda...');
  const agendaRoutes = require('./src/routes/agenda');
  console.log('✓ agenda importado com sucesso');
  
  console.log('5. crm...');
  const crmRoutes = require('./src/routes/crm');
  console.log('✓ crm importado com sucesso');
  
  console.log('6. dashboard...');
  const dashboardRoutes = require('./src/routes/dashboard');
  console.log('✓ dashboard importado com sucesso');
  
  console.log('7. configuracoes...');
  const configuracoesRoutes = require('./src/routes/configuracoes');
  console.log('✓ configuracoes importado com sucesso');
  
  console.log('8. perfil...');
  const perfilRoutes = require('./src/routes/perfil');
  console.log('✓ perfil importado com sucesso');
  
  console.log('\n✅ Todas as rotas importadas com sucesso!');
  
} catch (error) {
  console.error('❌ Erro na importação das rotas:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
