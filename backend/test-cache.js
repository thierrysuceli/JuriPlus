// Teste com limpeza de cache
delete require.cache[require.resolve('./src/routes/auth')];

try {
  console.log('Testando auth após limpeza de cache...');
  const authRoutes = require('./src/routes/auth');
  
  console.log('Resultado:');
  console.log('  Tipo:', typeof authRoutes);
  console.log('  É função?', typeof authRoutes === 'function');
  
  if (typeof authRoutes === 'function') {
    console.log('✅ Auth router funcionando!');
  } else {
    console.log('❌ Auth router não é função');
    console.log('  Valor:', authRoutes);
  }
  
} catch (error) {
  console.error('❌ Erro:', error.message);
}
