const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database-adapter');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Schema para agendamento
const agendamentoSchema = Joi.object({
  titulo: Joi.string().required(),
  descricao: Joi.string().optional().allow(''),
  data_inicio: Joi.date().iso().required(),
  data_fim: Joi.date().iso().required(),
  tipo: Joi.string().valid('consultoria', 'audiencia', 'reuniao', 'outro').required(),
  cliente_id: Joi.number().integer().optional(),
  advogado_id: Joi.number().integer().optional(),
  local: Joi.string().optional().allow(''),
  observacoes: Joi.string().optional().allow(''),
  status: Joi.string().valid('agendado', 'confirmado', 'concluido', 'cancelado').default('agendado')
});

// Listar agendamentos
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { 
      data_inicio, 
      data_fim, 
      tipo, 
      status, 
      cliente_id, 
      advogado_id 
    } = req.query;
    
    let baseQuery = `
      SELECT 
        ag.*,
        c.name as cliente_nome,
        c.telefone as cliente_telefone,
        u.name as advogado_nome
      FROM agenda ag
      LEFT JOIN clientes c ON ag.cliente_id = c.id
      LEFT JOIN users u ON ag.advogado_id = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCounter = 1;

    // Filtros
    if (data_inicio) {
      baseQuery += ` AND ag.data_inicio >= $${paramCounter}`;
      queryParams.push(data_inicio);
      paramCounter++;
    }

    if (data_fim) {
      baseQuery += ` AND ag.data_fim <= $${paramCounter}`;
      queryParams.push(data_fim);
      paramCounter++;
    }

    if (tipo && tipo !== 'todos') {
      baseQuery += ` AND ag.tipo = $${paramCounter}`;
      queryParams.push(tipo);
      paramCounter++;
    }

    if (status && status !== 'todos') {
      baseQuery += ` AND ag.status = $${paramCounter}`;
      queryParams.push(status);
      paramCounter++;
    }

    if (cliente_id) {
      baseQuery += ` AND ag.cliente_id = $${paramCounter}`;
      queryParams.push(cliente_id);
      paramCounter++;
    }

    if (advogado_id) {
      baseQuery += ` AND ag.advogado_id = $${paramCounter}`;
      queryParams.push(advogado_id);
      paramCounter++;
    }

    baseQuery += ` ORDER BY ag.data_inicio ASC`;

    const result = await query(baseQuery, queryParams);

    // Formatar dados para o calendário
    const agendamentos = result.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      data_inicio: row.data_inicio,
      data_fim: row.data_fim,
      tipo: row.tipo,
      status: row.status,
      local: row.local,
      observacoes: row.observacoes,
      created_at: row.created_at,
      cliente: row.cliente_nome ? {
        id: row.cliente_id,
        nome: row.cliente_nome,
        telefone: row.cliente_telefone
      } : null,
      advogado: row.advogado_nome ? {
        id: row.advogado_id,
        nome: row.advogado_nome
      } : null
    }));

    res.json({ agendamentos });

  } catch (error) {
    next(error);
  }
});

// Buscar agendamento por ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        ag.*,
        c.name as cliente_nome,
        c.telefone as cliente_telefone,
        c.email as cliente_email,
        u.name as advogado_nome,
        u.email as advogado_email
      FROM agenda ag
      LEFT JOIN clientes c ON ag.cliente_id = c.id
      LEFT JOIN users u ON ag.advogado_id = u.id
      WHERE ag.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const row = result.rows[0];
    const agendamento = {
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      data_inicio: row.data_inicio,
      data_fim: row.data_fim,
      tipo: row.tipo,
      status: row.status,
      local: row.local,
      observacoes: row.observacoes,
      created_at: row.created_at,
      cliente: row.cliente_nome ? {
        id: row.cliente_id,
        nome: row.cliente_nome,
        telefone: row.cliente_telefone,
        email: row.cliente_email
      } : null,
      advogado: row.advogado_nome ? {
        id: row.advogado_id,
        nome: row.advogado_nome,
        email: row.advogado_email
      } : null
    };

    res.json(agendamento);

  } catch (error) {
    next(error);
  }
});

// Criar agendamento
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = agendamentoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const {
      titulo,
      descricao,
      data_inicio,
      data_fim,
      tipo,
      cliente_id,
      advogado_id,
      local,
      observacoes,
      status
    } = value;

    // Validar se data_fim é posterior a data_inicio
    if (new Date(data_fim) <= new Date(data_inicio)) {
      return res.status(400).json({ 
        error: 'Data de fim deve ser posterior à data de início' 
      });
    }

    // Verificar conflitos de horário para o advogado (se especificado)
    if (advogado_id) {
      const conflictResult = await query(`
        SELECT id FROM agenda 
        WHERE advogado_id = $1 
        AND status != 'cancelado'
        AND (
          (data_inicio < $2 AND data_fim > $2) OR
          (data_inicio < $3 AND data_fim > $3) OR
          (data_inicio >= $2 AND data_fim <= $3)
        )
      `, [advogado_id, data_inicio, data_fim]);

      if (conflictResult.rows.length > 0) {
        return res.status(400).json({ 
          error: 'Conflito de horário: advogado já possui compromisso neste período' 
        });
      }
    }

    const result = await query(`
      INSERT INTO agenda (
        titulo, descricao, data_inicio, data_fim, tipo, cliente_id, 
        advogado_id, local, observacoes, status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      titulo, descricao, data_inicio, data_fim, tipo, cliente_id,
      advogado_id, local, observacoes, status, req.user.id
    ]);

    const agendamento = result.rows[0];

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      agendamento
    });

  } catch (error) {
    next(error);
  }
});

// Atualizar agendamento
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = agendamentoSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    // Verificar se agendamento existe
    const agendamentoExists = await query(
      'SELECT id FROM agenda WHERE id = $1',
      [id]
    );

    if (agendamentoExists.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Validar datas
    if (new Date(value.data_fim) <= new Date(value.data_inicio)) {
      return res.status(400).json({ 
        error: 'Data de fim deve ser posterior à data de início' 
      });
    }

    // Verificar conflitos (excluindo o próprio agendamento)
    if (value.advogado_id) {
      const conflictResult = await query(`
        SELECT id FROM agenda 
        WHERE advogado_id = $1 
        AND id != $2
        AND status != 'cancelado'
        AND (
          (data_inicio < $3 AND data_fim > $3) OR
          (data_inicio < $4 AND data_fim > $4) OR
          (data_inicio >= $3 AND data_fim <= $4)
        )
      `, [value.advogado_id, id, value.data_inicio, value.data_fim]);

      if (conflictResult.rows.length > 0) {
        return res.status(400).json({ 
          error: 'Conflito de horário: advogado já possui compromisso neste período' 
        });
      }
    }

    const result = await query(`
      UPDATE agenda 
      SET titulo = $1, descricao = $2, data_inicio = $3, data_fim = $4, 
          tipo = $5, cliente_id = $6, advogado_id = $7, local = $8, 
          observacoes = $9, status = $10, updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `, [
      value.titulo, value.descricao, value.data_inicio, value.data_fim,
      value.tipo, value.cliente_id, value.advogado_id, value.local,
      value.observacoes, value.status, id
    ]);

    const agendamento = result.rows[0];

    res.json({
      message: 'Agendamento atualizado com sucesso',
      agendamento
    });

  } catch (error) {
    next(error);
  }
});

// Deletar agendamento
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM agenda WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json({ message: 'Agendamento deletado com sucesso' });

  } catch (error) {
    next(error);
  }
});

// Agendamentos do dia
router.get('/hoje/list', authenticateToken, async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        ag.*,
        c.name as cliente_nome,
        c.telefone as cliente_telefone,
        u.name as advogado_nome
      FROM agenda ag
      LEFT JOIN clientes c ON ag.cliente_id = c.id
      LEFT JOIN users u ON ag.advogado_id = u.id
      WHERE DATE(ag.data_inicio) = CURRENT_DATE
      AND ag.status != 'cancelado'
      ORDER BY ag.data_inicio ASC
    `);

    const agendamentos = result.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      data_inicio: row.data_inicio,
      data_fim: row.data_fim,
      tipo: row.tipo,
      status: row.status,
      cliente: row.cliente_nome ? {
        nome: row.cliente_nome,
        telefone: row.cliente_telefone
      } : null,
      advogado: row.advogado_nome ? {
        nome: row.advogado_nome
      } : null
    }));

    res.json({ agendamentos });

  } catch (error) {
    next(error);
  }
});

// Próximos agendamentos
router.get('/proximos/list', authenticateToken, async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const result = await query(`
      SELECT 
        ag.*,
        c.name as cliente_nome,
        c.telefone as cliente_telefone,
        u.name as advogado_nome
      FROM agenda ag
      LEFT JOIN clientes c ON ag.cliente_id = c.id
      LEFT JOIN users u ON ag.advogado_id = u.id
      WHERE ag.data_inicio >= NOW()
      AND ag.status != 'cancelado'
      ORDER BY ag.data_inicio ASC
      LIMIT $1
    `, [limit]);

    const agendamentos = result.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      data_inicio: row.data_inicio,
      data_fim: row.data_fim,
      tipo: row.tipo,
      status: row.status,
      cliente: row.cliente_nome ? {
        nome: row.cliente_nome,
        telefone: row.cliente_telefone
      } : null,
      advogado: row.advogado_nome ? {
        nome: row.advogado_nome
      } : null
    }));

    res.json({ agendamentos });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
