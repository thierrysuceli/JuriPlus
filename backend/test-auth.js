// Teste do auth router especificamente
try {
  console.log('Testando auth router isoladamente...');
  
  // Importar express primeiro
  const express = require('express');
  console.log('✓ Express importado');
  
  // Importar Joi
  const Joi = require('joi');
  console.log('✓ Joi importado');
  
  // Importar database
  const { query, transaction } = require('./src/config/database-adapter');
  console.log('✓ Database functions importadas');
  console.log('   query tipo:', typeof query);
  console.log('   transaction tipo:', typeof transaction);
  
  // Importar auth middleware
  const { 
    authenticateToken, 
    hashPassword, 
    comparePassword, 
    generateToken 
  } = require('./src/middleware/auth');
  console.log('✓ Auth middleware importado');
  console.log('   authenticateToken tipo:', typeof authenticateToken);
  
  // Criar router
  const router = express.Router();
  console.log('✓ Router criado');
  console.log('   Router tipo:', typeof router);
  
  // Simular o export
  console.log('✓ Módulo auth seria exportado corretamente');
  
} catch (error) {
  console.error('❌ Erro específico no auth:', error.message);
  console.error('Stack:', error.stack);
}
