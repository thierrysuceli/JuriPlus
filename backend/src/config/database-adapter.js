const fs = require('fs');
const path = require('path');

// Função para detectar qual banco usar
function getDatabaseConfig() {
  // Tentar SQLite primeiro (desenvolvimento local)
  try {
    require('sqlite3');
    console.log('📦 SQLite disponível - usando banco local para desenvolvimento');
    return {
      type: 'sqlite',
      module: require('./database-sqlite')
    };
  } catch (error) {
    console.log('⚠️  SQLite não encontrado');
  }

  // Fallback para PostgreSQL
  try {
    require('pg');
    console.log('🐘 PostgreSQL disponível - usando banco PostgreSQL');
    return {
      type: 'postgresql',
      module: require('./database')
    };
  } catch (error) {
    console.log('⚠️  PostgreSQL não encontrado');
  }

  throw new Error('❌ Nenhum banco de dados disponível. Instale sqlite3 ou pg.');
}

// Exportar configuração dinâmica
const dbConfig = getDatabaseConfig();

module.exports = {
  ...dbConfig.module,
  dbType: dbConfig.type
};
