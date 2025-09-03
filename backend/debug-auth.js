// Debug do auth.js linha por linha
try {
  console.log('=== INÍCIO DEBUG AUTH.JS ===');
  
  console.log('1. Importando express...');
  const express = require('express');
  
  console.log('2. Importando Joi...');
  const Joi = require('joi');
  
  console.log('3. Importando database-adapter...');
  const { query, transaction } = require('./src/config/database-adapter');
  
  console.log('4. Importando middleware auth...');
  const { 
    authenticateToken, 
    hashPassword, 
    comparePassword, 
    generateToken 
  } = require('./src/middleware/auth');
  
  console.log('5. Criando router...');
  const router = express.Router();
  
  console.log('6. Definindo schema...');
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  
  console.log('7. Criando rota POST /login...');
  router.post('/login', async (req, res, next) => {
    // Conteúdo da rota simplificado para teste
    res.json({ message: 'Login route test' });
  });
  
  console.log('8. Exportando router...');
  console.log('   Router tipo:', typeof router);
  console.log('   Router é função?', typeof router === 'function');
  
  // Simular export
  const exported = router;
  console.log('9. Resultado final:', typeof exported);
  
  console.log('=== FIM DEBUG - SUCESSO ===');
  
} catch (error) {
  console.error('❌ ERRO NO DEBUG:', error.message);
  console.error('Stack:', error.stack);
}
