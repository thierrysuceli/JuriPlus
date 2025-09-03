const express = require('express');
console.log('🔄 Executando auth-simple.js');

const router = express.Router();

// Rota simples para teste
router.get('/test', (req, res) => {
  res.json({ message: 'Auth router funcionando!' });
});

console.log('✅ Router criado e configurado');
console.log('   Tipo do router:', typeof router);

module.exports = router;
