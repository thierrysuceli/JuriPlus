// Testar importação direta do auth.js
try {
  console.log('Importando auth.js diretamente...');
  const authRoutes = require('./src/routes/auth');
  
  console.log('Resultado da importação:');
  console.log('  Tipo:', typeof authRoutes);
  console.log('  É undefined?', authRoutes === undefined);
  console.log('  É null?', authRoutes === null);
  console.log('  Valor:', authRoutes);
  
  if (typeof authRoutes === 'object' && authRoutes !== null) {
    console.log('  Propriedades:', Object.keys(authRoutes));
    console.log('  Constructor:', authRoutes.constructor.name);
  }
  
} catch (error) {
  console.error('❌ Erro na importação direta:', error.message);
  console.error('Stack:', error.stack);
}
