// Teste do auth-simple
try {
  console.log('Testando auth-simple...');
  const authSimple = require('./src/routes/auth-simple');
  
  console.log('Resultado auth-simple:');
  console.log('  Tipo:', typeof authSimple);
  console.log('  É função?', typeof authSimple === 'function');
  
} catch (error) {
  console.error('❌ Erro no auth-simple:', error.message);
}
