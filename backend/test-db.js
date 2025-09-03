// Teste simples do database adapter
try {
  console.log('Testando database-adapter...');
  const db = require('./src/config/database-adapter');
  console.log('✓ Database adapter importado');
  console.log('  Tipo:', typeof db);
  console.log('  Propriedades:', Object.keys(db));
  
  console.log('\nTestando auth middleware...');
  const auth = require('./src/middleware/auth');
  console.log('✓ Auth middleware importado');
  console.log('  Tipo:', typeof auth);
  console.log('  Propriedades:', Object.keys(auth));
  
} catch (error) {
  console.error('❌ Erro:', error.message);
  console.error('Stack:', error.stack);
}
