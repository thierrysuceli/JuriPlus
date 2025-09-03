require('dotenv').config();
const express = require('express');

// Teste mínimo do servidor
const app = express();

// Testar importação e uso das rotas uma por uma
try {
  console.log('📦 Testando servidor Express...');
  
  console.log('1. Importando auth...');
  const authRoutes = require('./src/routes/auth');
  console.log('   Tipo:', typeof authRoutes);
  console.log('   É função?', typeof authRoutes === 'function');
  
  console.log('2. Testando app.use com auth...');
  app.use('/api/auth', authRoutes);
  console.log('✓ auth router registrado');
  
  console.log('3. Importando clientes...');
  const clientesRoutes = require('./src/routes/clientes');
  app.use('/api/clientes', clientesRoutes);
  console.log('✓ clientes router registrado');
  
  console.log('4. Importando atendimentos...');
  const atendimentosRoutes = require('./src/routes/atendimentos');
  app.use('/api/atendimentos', atendimentosRoutes);
  console.log('✓ atendimentos router registrado');
  
  console.log('5. Importando agenda...');
  const agendaRoutes = require('./src/routes/agenda');
  app.use('/api/agenda', agendaRoutes);
  console.log('✓ agenda router registrado');
  
  console.log('6. Importando crm...');
  const crmRoutes = require('./src/routes/crm');
  app.use('/api/crm', crmRoutes);
  console.log('✓ crm router registrado');
  
  console.log('7. Importando dashboard...');
  const dashboardRoutes = require('./src/routes/dashboard');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('✓ dashboard router registrado');
  
  console.log('8. Importando configuracoes...');
  const configuracoesRoutes = require('./src/routes/configuracoes');
  app.use('/api/configuracoes', configuracoesRoutes);
  console.log('✓ configuracoes router registrado');
  
  console.log('9. Importando perfil...');
  const perfilRoutes = require('./src/routes/perfil');
  app.use('/api/perfil', perfilRoutes);
  console.log('✓ perfil router registrado');
  
  console.log('\n✅ Todos os routers registrados com sucesso!');
  
} catch (error) {
  console.error('❌ Erro:', error.message);
  console.error('Stack:', error.stack);
}
