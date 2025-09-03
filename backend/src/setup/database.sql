-- Script de criação do banco de dados JuriPlus
-- PostgreSQL

-- Criação do banco (executar como superuser)
-- CREATE DATABASE juriplus;
-- \c juriplus;

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================
-- TABELAS PRINCIPAIS
-- ===============================

-- Tabela de usuários (base para todos os tipos)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'escritorio', 'advogado', 'cliente')),
    active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de escritórios
CREATE TABLE escritorios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    telefone VARCHAR(20),
    endereco TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de advogados
CREATE TABLE advogados (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    escritorio_id INTEGER REFERENCES users(id),
    oab VARCHAR(50),
    telefone VARCHAR(20),
    endereco TEXT,
    especialidades TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT,
    observacoes TEXT,
    tipo_pessoa VARCHAR(20) DEFAULT 'fisica' CHECK (tipo_pessoa IN ('fisica', 'juridica')),
    documento VARCHAR(50), -- CPF ou CNPJ
    profissao VARCHAR(255),
    estado_civil VARCHAR(50),
    data_nascimento DATE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de leads (CRM)
CREATE TABLE leads (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    assunto VARCHAR(255) NOT NULL,
    plataforma VARCHAR(50) NOT NULL CHECK (plataforma IN ('whatsapp', 'instagram', 'site', 'indicacao', 'outro')),
    status VARCHAR(50) DEFAULT 'novo' CHECK (status IN ('novo', 'contato', 'agendado', 'concluido')),
    observacoes TEXT,
    descricao TEXT,
    origem VARCHAR(255),
    data_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atendimentos
CREATE TABLE atendimentos (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'em_andamento', 'concluido', 'cancelado')),
    data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    advogado_id INTEGER REFERENCES users(id),
    observacoes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agenda
CREATE TABLE agenda (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('consultoria', 'audiencia', 'reuniao', 'outro')),
    cliente_id INTEGER REFERENCES clientes(id),
    advogado_id INTEGER REFERENCES users(id),
    local VARCHAR(255),
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'concluido', 'cancelado')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do usuário
CREATE TABLE configuracoes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    notificacoes_email BOOLEAN DEFAULT true,
    notificacoes_whatsapp BOOLEAN DEFAULT false,
    notificacao_novos_leads BOOLEAN DEFAULT true,
    notificacao_agendamentos BOOLEAN DEFAULT true,
    notificacao_lembretes BOOLEAN DEFAULT true,
    fuso_horario VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    tema VARCHAR(20) DEFAULT 'light' CHECK (tema IN ('light', 'dark', 'system')),
    idioma VARCHAR(10) DEFAULT 'pt-br',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de log de auditoria
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- ÍNDICES PARA PERFORMANCE
-- ===============================

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);

-- Índices para clientes
CREATE INDEX idx_clientes_name ON clientes(name);
CREATE INDEX idx_clientes_telefone ON clientes(telefone);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_created_by ON clientes(created_by);

-- Índices para leads
CREATE INDEX idx_leads_nome ON leads(nome);
CREATE INDEX idx_leads_telefone ON leads(telefone);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_plataforma ON leads(plataforma);
CREATE INDEX idx_leads_data_entrada ON leads(data_entrada);
CREATE INDEX idx_leads_created_by ON leads(created_by);

-- Índices para atendimentos
CREATE INDEX idx_atendimentos_status ON atendimentos(status);
CREATE INDEX idx_atendimentos_data_agendamento ON atendimentos(data_agendamento);
CREATE INDEX idx_atendimentos_cliente_id ON atendimentos(cliente_id);
CREATE INDEX idx_atendimentos_advogado_id ON atendimentos(advogado_id);

-- Índices para agenda
CREATE INDEX idx_agenda_data_inicio ON agenda(data_inicio);
CREATE INDEX idx_agenda_data_fim ON agenda(data_fim);
CREATE INDEX idx_agenda_tipo ON agenda(tipo);
CREATE INDEX idx_agenda_status ON agenda(status);
CREATE INDEX idx_agenda_cliente_id ON agenda(cliente_id);
CREATE INDEX idx_agenda_advogado_id ON agenda(advogado_id);

-- Índices para audit_log
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- ===============================
-- TRIGGERS PARA UPDATED_AT
-- ===============================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para todas as tabelas que têm updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escritorios_updated_at BEFORE UPDATE ON escritorios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advogados_updated_at BEFORE UPDATE ON advogados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_atendimentos_updated_at BEFORE UPDATE ON atendimentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agenda_updated_at BEFORE UPDATE ON agenda
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- VIEWS ÚTEIS
-- ===============================

-- View para estatísticas rápidas
CREATE VIEW v_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM leads WHERE data_entrada >= CURRENT_DATE - INTERVAL '30 days') as leads_mes,
    (SELECT COUNT(*) FROM clientes WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as clientes_mes,
    (SELECT COUNT(*) FROM atendimentos WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as atendimentos_mes,
    (SELECT COUNT(*) FROM agenda WHERE DATE(data_inicio) = CURRENT_DATE AND status != 'cancelado') as agendamentos_hoje;

-- View para leads com informações completas
CREATE VIEW v_leads_completo AS
SELECT 
    l.*,
    u.name as created_by_name
FROM leads l
LEFT JOIN users u ON l.created_by = u.id;

-- View para atendimentos com informações completas
CREATE VIEW v_atendimentos_completo AS
SELECT 
    a.*,
    c.name as cliente_nome,
    c.telefone as cliente_telefone,
    c.email as cliente_email,
    adv.name as advogado_nome,
    creator.name as created_by_name
FROM atendimentos a
LEFT JOIN clientes c ON a.cliente_id = c.id
LEFT JOIN users adv ON a.advogado_id = adv.id
LEFT JOIN users creator ON a.created_by = creator.id;

-- ===============================
-- PERMISSÕES E SEGURANÇA
-- ===============================

-- RLS (Row Level Security) pode ser implementado aqui se necessário
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY leads_policy ON leads FOR ALL TO authenticated_users;

-- ===============================
-- COMENTÁRIOS NAS TABELAS
-- ===============================

COMMENT ON TABLE users IS 'Tabela principal de usuários do sistema';
COMMENT ON TABLE escritorios IS 'Dados específicos de escritórios de advocacia';
COMMENT ON TABLE advogados IS 'Dados específicos de advogados';
COMMENT ON TABLE clientes IS 'Cadastro de clientes';
COMMENT ON TABLE leads IS 'Leads do CRM - potenciais clientes';
COMMENT ON TABLE atendimentos IS 'Atendimentos agendados e realizados';
COMMENT ON TABLE agenda IS 'Sistema de agenda/calendário';
COMMENT ON TABLE configuracoes IS 'Configurações personalizadas por usuário';
COMMENT ON TABLE audit_log IS 'Log de auditoria de ações do sistema';

COMMENT ON COLUMN users.role IS 'Tipo de usuário: admin, escritorio, advogado, cliente';
COMMENT ON COLUMN leads.plataforma IS 'Origem do lead: whatsapp, instagram, site, indicacao, outro';
COMMENT ON COLUMN leads.status IS 'Status do lead: novo, contato, agendado, concluido';
COMMENT ON COLUMN atendimentos.status IS 'Status do atendimento: agendado, em_andamento, concluido, cancelado';
COMMENT ON COLUMN agenda.tipo IS 'Tipo de evento: consultoria, audiencia, reuniao, outro';

-- ===============================
-- DADOS INICIAIS (SEEDS)
-- ===============================

-- Usuário administrador padrão (senha: admin123)
INSERT INTO users (email, password_hash, name, role, email_verified) VALUES 
('admin@juriplus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewRyeE5a8hHgv3fy', 'Administrador', 'admin', true);

-- Exemplo de escritório (senha: escritorio123)
INSERT INTO users (email, password_hash, name, role, email_verified) VALUES 
('escritorio@exemplo.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewRyeE5a8hHgv3fy', 'Escritório Exemplo', 'escritorio', true);

INSERT INTO escritorios (user_id, nome, telefone, endereco) VALUES 
(2, 'Escritório de Advocacia Exemplo', '(11) 99999-0000', 'Rua Exemplo, 123 - São Paulo/SP');

-- Exemplo de advogado (senha: advogado123)
INSERT INTO users (email, password_hash, name, role, email_verified) VALUES 
('advogado@exemplo.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewRyeE5a8hHgv3fy', 'Dr. João Silva', 'advogado', true);

INSERT INTO advogados (user_id, escritorio_id, oab, telefone, especialidades) VALUES 
(3, 2, 'OAB/SP 123456', '(11) 98888-0000', 'Direito Civil, Direito Trabalhista');

-- Alguns clientes de exemplo
INSERT INTO clientes (name, telefone, email, created_by) VALUES 
('Maria Santos', '(11) 97777-1111', 'maria@email.com', 2),
('João Oliveira', '(11) 96666-2222', 'joao@email.com', 2),
('Ana Costa', '(11) 95555-3333', 'ana@email.com', 2);

-- Alguns leads de exemplo
INSERT INTO leads (nome, telefone, assunto, plataforma, status, created_by) VALUES 
('Carlos Silva', '(11) 94444-4444', 'Divórcio', 'whatsapp', 'novo', 2),
('Paula Lima', '(11) 93333-5555', 'Trabalhista', 'instagram', 'contato', 2),
('Roberto Santos', '(11) 92222-6666', 'Inventário', 'site', 'agendado', 2);

-- Alguns atendimentos de exemplo
INSERT INTO atendimentos (tipo, data_agendamento, cliente_id, advogado_id, created_by) VALUES 
('Consulta Inicial', NOW() + INTERVAL '1 day', 1, 3, 2),
('Acompanhamento', NOW() + INTERVAL '2 days', 2, 3, 2);

-- Configurações padrão para o escritório exemplo
INSERT INTO configuracoes (user_id) VALUES (2);

-- Log inicial
INSERT INTO audit_log (user_id, action, ip_address) VALUES 
(1, 'SYSTEM_SETUP', '127.0.0.1');

-- ===============================
-- VERIFICAÇÃO FINAL
-- ===============================

-- Verificar se todas as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
