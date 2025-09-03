const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados...');
  
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'juriplus',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
  });

  try {
    // Testar conexão
    console.log('📡 Testando conexão com o banco...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexão estabelecida com sucesso');

    // Ler e executar script SQL
    console.log('📄 Lendo arquivo SQL...');
    const sqlFile = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('⚙️ Executando comandos SQL...');
    await pool.query(sql);
    
    console.log('✅ Banco de dados configurado com sucesso!');
    console.log('');
    console.log('📊 Dados criados:');
    console.log('   - Tabelas: users, escritorios, advogados, clientes, leads, atendimentos, agenda, configuracoes, audit_log');
    console.log('   - Usuário admin: admin@juriplus.com (senha: admin123)');
    console.log('   - Escritório exemplo: escritorio@exemplo.com (senha: escritorio123)');
    console.log('   - Advogado exemplo: advogado@exemplo.com (senha: advogado123)');
    console.log('');
    console.log('🎯 Próximos passos:');
    console.log('   1. npm run dev (para iniciar o servidor)');
    console.log('   2. Testar API em http://localhost:3001/health');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('🔧 Possíveis soluções:');
      console.log('   1. Verifique se o PostgreSQL está rodando');
      console.log('   2. Confirme as credenciais no arquivo .env');
      console.log('   3. Certifique-se que o banco "juriplus" existe');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
