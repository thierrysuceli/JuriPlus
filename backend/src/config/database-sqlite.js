const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Caminho para o banco SQLite
const DB_PATH = path.join(__dirname, '../../data/juriplus.db');

// Criar diretório data se não existir
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Conectar ao banco SQLite
let db = null;

// Função para conectar
function connect() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }
    
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Erro ao conectar com SQLite:', err);
        reject(err);
      } else {
        console.log('🎯 Conectado ao banco SQLite com sucesso');
        resolve(db);
      }
    });
  });
}

// Função para inicializar o banco com schema
async function initializeDatabase() {
  try {
    await connect();
    
    // Ler arquivo SQL de setup
    const sqlFilePath = path.join(__dirname, '..', 'setup', 'database-sqlite.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`Arquivo SQL não encontrado: ${sqlFilePath}`);
    }
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    return new Promise((resolve, reject) => {
      db.exec(sqlContent, (err) => {
        if (err) {
          console.error('❌ Erro ao executar script SQL:', err.message);
          reject(err);
        } else {
          console.log('✅ Banco de dados SQLite inicializado com sucesso');
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('❌ Erro na inicialização do banco:', error);
    throw error;
  }
}

// Função para executar query
function query(sql, params = []) {
  return new Promise(async (resolve, reject) => {
    try {
      await connect();
      
      if (sql.toLowerCase().trim().startsWith('select')) {
        db.all(sql, params, (err, rows) => {
          if (err) {
            console.error('❌ Erro na query:', err.message);
            reject(err);
          } else {
            resolve({ rows });
          }
        });
      } else {
        db.run(sql, params, function(err) {
          if (err) {
            console.error('❌ Erro na execução:', err.message);
            reject(err);
          } else {
            resolve({ 
              rows: [], 
              rowCount: this.changes,
              lastID: this.lastID 
            });
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Função para transações
async function transaction(callback) {
  return new Promise(async (resolve, reject) => {
    try {
      await connect();
      
      db.serialize(async () => {
        try {
          await query('BEGIN TRANSACTION');
          const result = await callback({ query });
          await query('COMMIT');
          resolve(result);
        } catch (error) {
          await query('ROLLBACK');
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Função para testar conexão
async function testConnection() {
  try {
    await query('SELECT 1 as test');
    console.log('🎯 Conexão SQLite estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com SQLite:', error);
    throw error;
  }
}

// Função para fechar conexão
function closePool() {
  return new Promise((resolve) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Erro ao fechar banco:', err);
        } else {
          console.log('🔌 Banco SQLite fechado');
        }
        db = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  query,
  transaction,
  testConnection,
  closePool,
  initializeDatabase
};
