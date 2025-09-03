const path = require('path');

// Função para configurar e inicializar o banco
async function setupDatabase() {
  try {
    console.log('🔄 Iniciando configuração do banco de dados...\n');

    // Detectar qual banco usar
    let dbModule;
    let dbType;

    // Tentar SQLite primeiro
    try {
      require('sqlite3');
      dbModule = require('../config/database-sqlite');
      dbType = 'SQLite';
      console.log('📦 SQLite detectado - configurando banco local...');
      
      // Inicializar banco SQLite com schema
      await dbModule.initializeDatabase();
      
    } catch (sqliteError) {
      console.log('⚠️  SQLite não disponível, tentando PostgreSQL...');
      
      // Fallback para PostgreSQL
      try {
        require('pg');
        dbModule = require('../config/database');
        dbType = 'PostgreSQL';
        console.log('🐘 PostgreSQL detectado - configurando banco...');
        
        // Testar conexão PostgreSQL
        await dbModule.testConnection();
        console.log('✅ PostgreSQL configurado com sucesso');
        
      } catch (pgError) {
        throw new Error(`❌ Nenhum banco disponível.\nSQLite: ${sqliteError.message}\nPostgreSQL: ${pgError.message}`);
      }
    }

    // Testar conexão final
    await dbModule.testConnection();
    
    console.log(`\n✅ Banco ${dbType} configurado e pronto para uso!`);
    console.log(`📍 Localização: ${dbType === 'SQLite' ? 'Local (arquivo)' : 'Servidor PostgreSQL'}`);
    
    // Fechar conexão
    if (dbModule.closePool) {
      await dbModule.closePool();
    }
    
    return { type: dbType, success: true };
    
  } catch (error) {
    console.error('\n❌ Erro na configuração do banco:', error.message);
    
    console.log('\n🔧 Soluções sugeridas:');
    console.log('1. Para desenvolvimento local (recomendado):');
    console.log('   npm install sqlite3');
    console.log('   npm run setup');
    console.log('');
    console.log('2. Para PostgreSQL:');
    console.log('   - Instale e inicie o PostgreSQL');
    console.log('   - Configure as variáveis de ambiente (DB_*)');
    console.log('   - Execute: npm run setup');
    
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
