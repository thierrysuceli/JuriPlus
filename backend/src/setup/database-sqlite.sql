-- Script de criação do banco SQLite para JuriPlus

-- ===============================
-- TABELAS PRINCIPAIS
-- ===============================

-- Tabela de usuários (base para todos os tipos)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'escritorio', 'advogado', 'cliente')),
    active BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de escritórios
CREATE TABLE IF NOT EXISTS escritorios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    telefone VARCHAR(20),
    endereco TEXT,
    website VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de advogados
CREATE TABLE IF NOT EXISTS advogados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    escritorio_id INTEGER REFERENCES users(id),
    oab VARCHAR(50),
    telefone VARCHAR(20),
    endereco TEXT,
    especialidades TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT,
    observacoes TEXT,
    tipo_pessoa VARCHAR(20) DEFAULT 'fisica' CHECK (tipo_pessoa IN ('fisica', 'juridica')),
    documento VARCHAR(50),
    profissao VARCHAR(255),
    estado_civil VARCHAR(50),
    data_nascimento DATE,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de leads (CRM)
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    assunto VARCHAR(255) NOT NULL,
    plataforma VARCHAR(50) NOT NULL CHECK (plataforma IN ('whatsapp', 'instagram', 'site', 'indicacao', 'outro')),
    status VARCHAR(50) DEFAULT 'novo' CHECK (status IN ('novo', 'contato', 'agendado', 'concluido')),
    observacoes TEXT,
    descricao TEXT,
    origem VARCHAR(255),
    data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de atendimentos
CREATE TABLE IF NOT EXISTS atendimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'em_andamento', 'concluido', 'cancelado')),
    data_agendamento DATETIME NOT NULL,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    advogado_id INTEGER REFERENCES users(id),
    observacoes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agenda
CREATE TABLE IF NOT EXISTS agenda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('consultoria', 'audiencia', 'reuniao', 'outro')),
    cliente_id INTEGER REFERENCES clientes(id),
    advogado_id INTEGER REFERENCES users(id),
    local VARCHAR(255),
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'concluido', 'cancelado')),
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS configuracoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    notificacoes_email BOOLEAN DEFAULT 1,
    notificacoes_whatsapp BOOLEAN DEFAULT 0,
    notificacao_novos_leads BOOLEAN DEFAULT 1,
    notificacao_agendamentos BOOLEAN DEFAULT 1,
    notificacao_lembretes BOOLEAN DEFAULT 1,
    fuso_horario VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    tema VARCHAR(20) DEFAULT 'light' CHECK (tema IN ('light', 'dark', 'system')),
    idioma VARCHAR(10) DEFAULT 'pt-br',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de log de auditoria
CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- ÍNDICES PARA PERFORMANCE
-- ===============================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);

CREATE INDEX IF NOT EXISTS idx_clientes_name ON clientes(name);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);

CREATE INDEX IF NOT EXISTS idx_leads_nome ON leads(nome);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_plataforma ON leads(plataforma);
CREATE INDEX IF NOT EXISTS idx_leads_data_entrada ON leads(data_entrada);

CREATE INDEX IF NOT EXISTS idx_atendimentos_status ON atendimentos(status);
CREATE INDEX IF NOT EXISTS idx_atendimentos_data_agendamento ON atendimentos(data_agendamento);
CREATE INDEX IF NOT EXISTS idx_atendimentos_cliente_id ON atendimentos(cliente_id);

CREATE INDEX IF NOT EXISTS idx_agenda_data_inicio ON agenda(data_inicio);
CREATE INDEX IF NOT EXISTS idx_agenda_tipo ON agenda(tipo);
CREATE INDEX IF NOT EXISTS idx_agenda_status ON agenda(status);

-- ===============================
-- DADOS INICIAIS (SEEDS)
-- ===============================

-- Usuário administrador padrão (senha: admin123)
INSERT OR IGNORE INTO users (id, email, password_hash, name, role, email_verified) VALUES 
(1, 'admin@juriplus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewRyeE5a8hHgv3fy', 'Administrador', 'admin', 1);

-- Exemplo de escritório (senha: escritorio123)
INSERT OR IGNORE INTO users (id, email, password_hash, name, role, email_verified) VALUES 
(2, 'escritorio@exemplo.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewRyeE5a8hHgv3fy', 'Escritório Exemplo', 'escritorio', 1);

INSERT OR IGNORE INTO escritorios (user_id, nome, telefone, endereco) VALUES 
(2, 'Escritório de Advocacia Exemplo', '(11) 99999-0000', 'Rua Exemplo, 123 - São Paulo/SP');

-- Exemplo de advogado (senha: advogado123)
INSERT OR IGNORE INTO users (id, email, password_hash, name, role, email_verified) VALUES 
(3, 'advogado@exemplo.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewRyeE5a8hHgv3fy', 'Dr. João Silva', 'advogado', 1);

INSERT OR IGNORE INTO advogados (user_id, escritorio_id, oab, telefone, especialidades) VALUES 
(3, 2, 'OAB/SP 123456', '(11) 98888-0000', 'Direito Civil, Direito Trabalhista');

-- Alguns clientes de exemplo
INSERT OR IGNORE INTO clientes (id, name, telefone, email, created_by) VALUES 
(1, 'Maria Santos', '(11) 97777-1111', 'maria@email.com', 2),
(2, 'João Oliveira', '(11) 96666-2222', 'joao@email.com', 2),
(3, 'Ana Costa', '(11) 95555-3333', 'ana@email.com', 2);

-- Alguns leads de exemplo
INSERT OR IGNORE INTO leads (id, nome, telefone, assunto, plataforma, status, created_by) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Carlos Silva', '(11) 94444-4444', 'Divórcio', 'whatsapp', 'novo', 2),
('550e8400-e29b-41d4-a716-446655440002', 'Paula Lima', '(11) 93333-5555', 'Trabalhista', 'instagram', 'contato', 2),
('550e8400-e29b-41d4-a716-446655440003', 'Roberto Santos', '(11) 92222-6666', 'Inventário', 'site', 'agendado', 2);

-- Alguns atendimentos de exemplo
INSERT OR IGNORE INTO atendimentos (id, tipo, data_agendamento, cliente_id, advogado_id, created_by) VALUES 
(1, 'Consulta Inicial', datetime('now', '+1 day'), 1, 3, 2),
(2, 'Acompanhamento', datetime('now', '+2 days'), 2, 3, 2);

-- Configurações padrão para o escritório exemplo
INSERT OR IGNORE INTO configuracoes (user_id) VALUES (2);

-- Log inicial
INSERT OR IGNORE INTO audit_log (user_id, action, ip_address) VALUES 
(1, 'SYSTEM_SETUP', '127.0.0.1');
