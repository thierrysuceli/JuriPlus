const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'juriplus',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event listeners
pool.on('connect', () => {
  console.log('📦 Nova conexão estabelecida com PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool de conexões:', err);
});

// Função para testar conexão
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('🎯 Teste de conexão bem-sucedido:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco:', error);
    throw error;
  }
}

// Função para executar queries
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Query executada:', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('❌ Erro na query:', error);
    throw error;
  }
}

// Função para transações
async function transaction(callback) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Função para obter cliente do pool
async function getClient() {
  return await pool.connect();
}

// Função para fechar pool
async function closePool() {
  await pool.end();
  console.log('🔌 Pool de conexões fechado');
}

module.exports = {
  pool,
  query,
  transaction,
  getClient,
  testConnection,
  closePool
};
