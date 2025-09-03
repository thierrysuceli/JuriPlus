// Teste manual linha a linha do auth.js
try {
  console.log('=== TESTE MANUAL AUTH.JS ===');
  
  // Linha 1: console.log
  console.log('🔄 INÍCIO auth.js');
  
  // Linha 2: express
  console.log('Tentando importar express...');
  const express = require('express');
  console.log('✅ Express importado');
  
  // Linha 3: Joi
  console.log('Tentando importar Joi...');
  const Joi = require('joi');
  console.log('✅ Joi importado');
  
  // Linha 4: database-adapter
  console.log('Tentando importar database-adapter...');
  const { query, transaction } = require('./src/config/database-adapter');
  console.log('✅ Database adapter importado');
  
  // Linha 5: middleware auth
  console.log('Tentando importar middleware auth...');
  const { 
    authenticateToken, 
    hashPassword, 
    comparePassword, 
    generateToken 
  } = require('./src/middleware/auth');
  console.log('✅ Auth middleware importado');
  
  // Linha 6: router
  console.log('Criando router...');
  const router = express.Router();
  console.log('✅ Router criado');
  
  console.log('=== SUCESSO COMPLETO ===');
  
} catch (error) {
  console.error('❌ ERRO ENCONTRADO:', error.message);
  console.error('Stack completo:', error.stack);
}
