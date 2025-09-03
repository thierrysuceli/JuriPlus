const express = require('express');
const Joi = require('joi');
const { query, transaction } = require('../config/database-adapter');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Schema de validação para atendimento
const atendimentoSchema = Joi.object({
  tipo: Joi.string().required(),
  status: Joi.string().valid('agendado', 'em_andamento', 'concluido', 'cancelado').default('agendado'),
  data_agendamento: Joi.date().iso().required(),
  cliente_id: Joi.number().integer().required(),
  advogado_id: Joi.number().integer().optional(),
  observacoes: Joi.string().optional().allow('')
});

const updateAtendimentoSchema = Joi.object({
  tipo: Joi.string().optional(),
  status: Joi.string().valid('agendado', 'em_andamento', 'concluido', 'cancelado').optional(),
  data_agendamento: Joi.date().iso().optional(),
  cliente_id: Joi.number().integer().optional(),
  advogado_id: Joi.number().integer().optional(),
  observacoes: Joi.string().optional().allow('')
});

// Listar atendimentos
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search, data_inicio, data_fim } = req.query;
    
    let baseQuery = `
      SELECT 
        a.*,
        c.name as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        u.name as advogado_nome,
        u.email as advogado_email
      FROM atendimentos a
      LEFT JOIN clientes c ON a.cliente_id = c.id
      LEFT JOIN users u ON a.advogado_id = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCounter = 1;

    // Filtro por status
    if (status && status !== 'todos') {
      baseQuery += ` AND a.status = $${paramCounter}`;
      queryParams.push(status);
      paramCounter++;
    }

    // Filtro por busca
    if (search) {
      baseQuery += ` AND (
        c.name ILIKE $${paramCounter} 
        OR a.tipo ILIKE $${paramCounter}
        OR a.observacoes ILIKE $${paramCounter}
      )`;
      queryParams.push(`%${search}%`);
      paramCounter++;
    }

    // Filtro por data
    if (data_inicio) {
      baseQuery += ` AND a.data_agendamento >= $${paramCounter}`;
      queryParams.push(data_inicio);
      paramCounter++;
    }

    if (data_fim) {
      baseQuery += ` AND a.data_agendamento <= $${paramCounter}`;
      queryParams.push(data_fim);
      paramCounter++;
    }

    // Ordenação e paginação
    baseQuery += ` ORDER BY a.data_agendamento DESC`;
    
    const offset = (page - 1) * limit;
    baseQuery += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    queryParams.push(limit, offset);

    const result = await query(baseQuery, queryParams);

    // Query para contar total
    let countQuery = `
      SELECT COUNT(*) as total
      FROM atendimentos a
      LEFT JOIN clientes c ON a.cliente_id = c.id
      WHERE 1=1
    `;
    
    const countParams = queryParams.slice(0, -2); // Remove limit e offset
    
    // Reaplicar filtros na query de contagem
    let countParamCounter = 1;
    if (status && status !== 'todos') {
      countQuery += ` AND a.status = $${countParamCounter}`;
      countParamCounter++;
    }
    if (search) {
      countQuery += ` AND (
        c.name ILIKE $${countParamCounter} 
        OR a.tipo ILIKE $${countParamCounter}
        OR a.observacoes ILIKE $${countParamCounter}
      )`;
      countParamCounter++;
    }
    if (data_inicio) {
      countQuery += ` AND a.data_agendamento >= $${countParamCounter}`;
      countParamCounter++;
    }
    if (data_fim) {
      countQuery += ` AND a.data_agendamento <= $${countParamCounter}`;
      countParamCounter++;
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Formatar dados
    const atendimentos = result.rows.map(row => ({
      id: row.id,
      tipo: row.tipo,
      status: row.status,
      data_agendamento: row.data_agendamento,
      observacoes: row.observacoes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      cliente: row.cliente_nome ? {
        id: row.cliente_id,
        nome: row.cliente_nome,
        email: row.cliente_email,
        telefone: row.cliente_telefone
      } : null,
      advogado: row.advogado_nome ? {
        id: row.advogado_id,
        nome: row.advogado_nome,
        email: row.advogado_email
      } : null
    }));

    res.json({
      atendimentos,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });

  } catch (error) {
    next(error);
  }
});

// Buscar atendimento por ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        a.*,
        c.name as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        c.endereco as cliente_endereco,
        u.name as advogado_nome,
        u.email as advogado_email
      FROM atendimentos a
      LEFT JOIN clientes c ON a.cliente_id = c.id
      LEFT JOIN users u ON a.advogado_id = u.id
      WHERE a.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Atendimento não encontrado' });
    }

    const row = result.rows[0];
    const atendimento = {
      id: row.id,
      tipo: row.tipo,
      status: row.status,
      data_agendamento: row.data_agendamento,
      observacoes: row.observacoes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      cliente: row.cliente_nome ? {
        id: row.cliente_id,
        nome: row.cliente_nome,
        email: row.cliente_email,
        telefone: row.cliente_telefone,
        endereco: row.cliente_endereco
      } : null,
      advogado: row.advogado_nome ? {
        id: row.advogado_id,
        nome: row.advogado_nome,
        email: row.advogado_email
      } : null
    };

    res.json(atendimento);

  } catch (error) {
    next(error);
  }
});

// Criar atendimento
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = atendimentoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const {
      tipo,
      status,
      data_agendamento,
      cliente_id,
      advogado_id,
      observacoes
    } = value;

    // Verificar se cliente existe
    const clienteExists = await query(
      'SELECT id FROM clientes WHERE id = $1',
      [cliente_id]
    );

    if (clienteExists.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Verificar se advogado existe (se fornecido)
    if (advogado_id) {
      const advogadoExists = await query(
        'SELECT id FROM users WHERE id = $1 AND role IN (\'advogado\', \'admin\')',
        [advogado_id]
      );

      if (advogadoExists.rows.length === 0) {
        return res.status(404).json({ error: 'Advogado não encontrado' });
      }
    }

    const result = await query(`
      INSERT INTO atendimentos (
        tipo, status, data_agendamento, cliente_id, advogado_id, observacoes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [tipo, status, data_agendamento, cliente_id, advogado_id, observacoes, req.user.id]);

    const atendimento = result.rows[0];

    res.status(201).json({
      message: 'Atendimento criado com sucesso',
      atendimento
    });

  } catch (error) {
    next(error);
  }
});

// Atualizar atendimento
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateAtendimentoSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    // Verificar se atendimento existe
    const atendimentoExists = await query(
      'SELECT id FROM atendimentos WHERE id = $1',
      [id]
    );

    if (atendimentoExists.rows.length === 0) {
      return res.status(404).json({ error: 'Atendimento não encontrado' });
    }

    // Construir query de update dinamicamente
    const updates = [];
    const values = [];
    let paramCounter = 1;

    Object.entries(value).forEach(([key, val]) => {
      if (val !== undefined) {
        updates.push(`${key} = $${paramCounter}`);
        values.push(val);
        paramCounter++;
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    const updateQuery = `
      UPDATE atendimentos 
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    const atendimento = result.rows[0];

    res.json({
      message: 'Atendimento atualizado com sucesso',
      atendimento
    });

  } catch (error) {
    next(error);
  }
});

// Deletar atendimento
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM atendimentos WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Atendimento não encontrado' });
    }

    res.json({ message: 'Atendimento deletado com sucesso' });

  } catch (error) {
    next(error);
  }
});

// Estatísticas de atendimentos
router.get('/stats/overview', authenticateToken, async (req, res, next) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'agendado' THEN 1 END) as agendados,
        COUNT(CASE WHEN status = 'em_andamento' THEN 1 END) as em_andamento,
        COUNT(CASE WHEN status = 'concluido' THEN 1 END) as concluidos,
        COUNT(CASE WHEN status = 'cancelado' THEN 1 END) as cancelados,
        COUNT(CASE WHEN DATE(data_agendamento) = CURRENT_DATE THEN 1 END) as hoje,
        COUNT(CASE WHEN DATE(data_agendamento) = CURRENT_DATE + INTERVAL '1 day' THEN 1 END) as amanha
      FROM atendimentos
      WHERE data_agendamento >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(stats.rows[0]);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
