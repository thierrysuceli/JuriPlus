const express = require('express');
const Joi = require('joi');
const { query, transaction } = require('../config/database-adapter');
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Schema para novo lead
const leadSchema = Joi.object({
  nome: Joi.string().min(2).required(),
  telefone: Joi.string().required(),
  email: Joi.string().email().optional(),
  assunto: Joi.string().required(),
  plataforma: Joi.string().valid('whatsapp', 'instagram', 'site', 'indicacao', 'outro').required(),
  status: Joi.string().valid('novo', 'contato', 'agendado', 'concluido').default('novo'),
  observacoes: Joi.string().optional().allow(''),
  descricao: Joi.string().optional().allow(''),
  origem: Joi.string().optional()
});

const updateLeadSchema = Joi.object({
  nome: Joi.string().min(2).optional(),
  telefone: Joi.string().optional(),
  email: Joi.string().email().optional(),
  assunto: Joi.string().optional(),
  plataforma: Joi.string().valid('whatsapp', 'instagram', 'site', 'indicacao', 'outro').optional(),
  status: Joi.string().valid('novo', 'contato', 'agendado', 'concluido').optional(),
  observacoes: Joi.string().optional().allow(''),
  descricao: Joi.string().optional().allow(''),
  origem: Joi.string().optional()
});

// Listar leads
router.get('/leads', authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status, plataforma, search, data_inicio, data_fim } = req.query;
    
    let baseQuery = `
      SELECT 
        id,
        nome,
        telefone,
        email,
        assunto,
        plataforma,
        status,
        observacoes,
        descricao,
        origem,
        data_entrada,
        created_at,
        updated_at
      FROM leads
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCounter = 1;

    // Filtros
    if (status && status !== 'todos') {
      baseQuery += ` AND status = $${paramCounter}`;
      queryParams.push(status);
      paramCounter++;
    }

    if (plataforma && plataforma !== 'todas') {
      baseQuery += ` AND plataforma = $${paramCounter}`;
      queryParams.push(plataforma);
      paramCounter++;
    }

    if (search) {
      baseQuery += ` AND (
        nome ILIKE $${paramCounter} 
        OR telefone ILIKE $${paramCounter}
        OR email ILIKE $${paramCounter}
        OR assunto ILIKE $${paramCounter}
        OR observacoes ILIKE $${paramCounter}
      )`;
      queryParams.push(`%${search}%`);
      paramCounter++;
    }

    if (data_inicio) {
      baseQuery += ` AND data_entrada >= $${paramCounter}`;
      queryParams.push(data_inicio);
      paramCounter++;
    }

    if (data_fim) {
      baseQuery += ` AND data_entrada <= $${paramCounter}`;
      queryParams.push(data_fim);
      paramCounter++;
    }

    // Ordenação e paginação
    baseQuery += ` ORDER BY data_entrada DESC`;
    
    const offset = (page - 1) * limit;
    baseQuery += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    queryParams.push(limit, offset);

    const result = await query(baseQuery, queryParams);

    // Contar total
    let countQuery = `SELECT COUNT(*) as total FROM leads WHERE 1=1`;
    const countParams = queryParams.slice(0, -2);
    
    let countParamCounter = 1;
    if (status && status !== 'todos') {
      countQuery += ` AND status = $${countParamCounter}`;
      countParamCounter++;
    }
    if (plataforma && plataforma !== 'todas') {
      countQuery += ` AND plataforma = $${countParamCounter}`;
      countParamCounter++;
    }
    if (search) {
      countQuery += ` AND (
        nome ILIKE $${countParamCounter} 
        OR telefone ILIKE $${countParamCounter}
        OR email ILIKE $${countParamCounter}
        OR assunto ILIKE $${countParamCounter}
        OR observacoes ILIKE $${countParamCounter}
      )`;
      countParamCounter++;
    }
    if (data_inicio) {
      countQuery += ` AND data_entrada >= $${countParamCounter}`;
      countParamCounter++;
    }
    if (data_fim) {
      countQuery += ` AND data_entrada <= $${countParamCounter}`;
      countParamCounter++;
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      leads: result.rows,
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

// Buscar lead por ID
router.get('/leads/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM leads WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    next(error);
  }
});

// Criar novo lead
router.post('/leads', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = leadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const {
      nome,
      telefone,
      email,
      assunto,
      plataforma,
      status,
      observacoes,
      descricao,
      origem
    } = value;

    const leadId = uuidv4();

    const result = await query(`
      INSERT INTO leads (
        id, nome, telefone, email, assunto, plataforma, status, 
        observacoes, descricao, origem, data_entrada, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), $11)
      RETURNING *
    `, [
      leadId, nome, telefone, email, assunto, plataforma, 
      status, observacoes, descricao, origem, req.user.id
    ]);

    const lead = result.rows[0];

    res.status(201).json({
      message: 'Lead criado com sucesso',
      lead
    });

  } catch (error) {
    next(error);
  }
});

// Atualizar lead
router.put('/leads/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateLeadSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    // Verificar se lead existe
    const leadExists = await query('SELECT id FROM leads WHERE id = $1', [id]);
    if (leadExists.rows.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    // Construir query de update
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
      UPDATE leads 
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    const lead = result.rows[0];

    res.json({
      message: 'Lead atualizado com sucesso',
      lead
    });

  } catch (error) {
    next(error);
  }
});

// Converter lead em cliente
router.post('/leads/:id/convert', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar lead
    const leadResult = await query('SELECT * FROM leads WHERE id = $1', [id]);
    if (leadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    const lead = leadResult.rows[0];

    // Transação para converter lead em cliente
    const result = await transaction(async (client) => {
      // Criar cliente
      const clienteResult = await client.query(`
        INSERT INTO clientes (
          name, telefone, email, endereco, observacoes, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        lead.nome,
        lead.telefone,
        lead.email,
        null, // endereco
        lead.observacoes,
        req.user.id
      ]);

      const cliente = clienteResult.rows[0];

      // Atualizar status do lead
      await client.query(
        'UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2',
        ['concluido', id]
      );

      return cliente;
    });

    res.json({
      message: 'Lead convertido em cliente com sucesso',
      cliente: result
    });

  } catch (error) {
    next(error);
  }
});

// Deletar lead
router.delete('/leads/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM leads WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    res.json({ message: 'Lead deletado com sucesso' });

  } catch (error) {
    next(error);
  }
});

// Estatísticas do CRM
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const { periodo = 'mes' } = req.query;
    
    let dateFilter = '';
    if (periodo === 'semana') {
      dateFilter = "AND data_entrada >= NOW() - INTERVAL '7 days'";
    } else if (periodo === 'mes') {
      dateFilter = "AND data_entrada >= NOW() - INTERVAL '30 days'";
    } else if (periodo === 'ano') {
      dateFilter = "AND data_entrada >= NOW() - INTERVAL '365 days'";
    }

    // Estatísticas gerais
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN status = 'novo' THEN 1 END) as novos,
        COUNT(CASE WHEN status = 'contato' THEN 1 END) as em_contato,
        COUNT(CASE WHEN status = 'agendado' THEN 1 END) as agendados,
        COUNT(CASE WHEN status = 'concluido' THEN 1 END) as concluidos,
        COUNT(CASE WHEN plataforma = 'whatsapp' THEN 1 END) as whatsapp,
        COUNT(CASE WHEN plataforma = 'instagram' THEN 1 END) as instagram,
        COUNT(CASE WHEN plataforma = 'site' THEN 1 END) as site
      FROM leads
      WHERE 1=1 ${dateFilter}
    `);

    // Taxa de conversão
    const conversaoResult = await query(`
      SELECT 
        COUNT(CASE WHEN status = 'concluido' THEN 1 END) as convertidos,
        COUNT(*) as total
      FROM leads
      WHERE 1=1 ${dateFilter}
    `);

    const stats = statsResult.rows[0];
    const conversao = conversaoResult.rows[0];
    
    const taxaConversao = conversao.total > 0 
      ? ((conversao.convertidos / conversao.total) * 100).toFixed(1)
      : 0;

    // Leads por dia (últimos 7 dias)
    const leadsPorDiaResult = await query(`
      SELECT 
        DATE(data_entrada) as data,
        COUNT(*) as total
      FROM leads
      WHERE data_entrada >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(data_entrada)
      ORDER BY data DESC
    `);

    res.json({
      ...stats,
      taxa_conversao: parseFloat(taxaConversao),
      leads_por_dia: leadsPorDiaResult.rows
    });

  } catch (error) {
    next(error);
  }
});

// Funil de vendas
router.get('/funil', authenticateToken, async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        status,
        COUNT(*) as quantidade,
        ROUND(
          (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 
          1
        ) as percentual
      FROM leads
      WHERE data_entrada >= NOW() - INTERVAL '30 days'
      GROUP BY status
      ORDER BY 
        CASE status
          WHEN 'novo' THEN 1
          WHEN 'contato' THEN 2
          WHEN 'agendado' THEN 3
          WHEN 'concluido' THEN 4
        END
    `);

    res.json(result.rows);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
