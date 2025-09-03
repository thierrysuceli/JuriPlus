const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database-adapter');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Schema para cliente
const clienteSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().optional(),
  telefone: Joi.string().required(),
  endereco: Joi.string().optional().allow(''),
  observacoes: Joi.string().optional().allow(''),
  tipo_pessoa: Joi.string().valid('fisica', 'juridica').default('fisica'),
  documento: Joi.string().optional(), // CPF ou CNPJ
  profissao: Joi.string().optional(),
  estado_civil: Joi.string().optional(),
  data_nascimento: Joi.date().optional()
});

const updateClienteSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
  telefone: Joi.string().optional(),
  endereco: Joi.string().optional().allow(''),
  observacoes: Joi.string().optional().allow(''),
  tipo_pessoa: Joi.string().valid('fisica', 'juridica').optional(),
  documento: Joi.string().optional(),
  profissao: Joi.string().optional(),
  estado_civil: Joi.string().optional(),
  data_nascimento: Joi.date().optional()
});

// Listar clientes
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, tipo_pessoa } = req.query;
    
    let baseQuery = `
      SELECT 
        c.*,
        COUNT(a.id) as total_atendimentos,
        MAX(a.data_agendamento) as ultimo_atendimento
      FROM clientes c
      LEFT JOIN atendimentos a ON c.id = a.cliente_id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCounter = 1;

    // Filtro por busca
    if (search) {
      baseQuery += ` AND (
        c.name ILIKE $${paramCounter} 
        OR c.email ILIKE $${paramCounter}
        OR c.telefone ILIKE $${paramCounter}
        OR c.documento ILIKE $${paramCounter}
      )`;
      queryParams.push(`%${search}%`);
      paramCounter++;
    }

    // Filtro por tipo de pessoa
    if (tipo_pessoa && tipo_pessoa !== 'todos') {
      baseQuery += ` AND c.tipo_pessoa = $${paramCounter}`;
      queryParams.push(tipo_pessoa);
      paramCounter++;
    }

    baseQuery += ` GROUP BY c.id ORDER BY c.name ASC`;
    
    // Paginação
    const offset = (page - 1) * limit;
    baseQuery += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    queryParams.push(limit, offset);

    const result = await query(baseQuery, queryParams);

    // Contar total
    let countQuery = `SELECT COUNT(*) as total FROM clientes c WHERE 1=1`;
    const countParams = queryParams.slice(0, -2);
    
    let countParamCounter = 1;
    if (search) {
      countQuery += ` AND (
        c.name ILIKE $${countParamCounter} 
        OR c.email ILIKE $${countParamCounter}
        OR c.telefone ILIKE $${countParamCounter}
        OR c.documento ILIKE $${countParamCounter}
      )`;
      countParamCounter++;
    }
    if (tipo_pessoa && tipo_pessoa !== 'todos') {
      countQuery += ` AND c.tipo_pessoa = $${countParamCounter}`;
      countParamCounter++;
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      clientes: result.rows,
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

// Buscar cliente por ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        c.*,
        COUNT(a.id) as total_atendimentos,
        MAX(a.data_agendamento) as ultimo_atendimento
      FROM clientes c
      LEFT JOIN atendimentos a ON c.id = a.cliente_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Buscar histórico de atendimentos
    const atendimentosResult = await query(`
      SELECT 
        a.*,
        u.name as advogado_nome
      FROM atendimentos a
      LEFT JOIN users u ON a.advogado_id = u.id
      WHERE a.cliente_id = $1
      ORDER BY a.data_agendamento DESC
      LIMIT 10
    `, [id]);

    const cliente = {
      ...result.rows[0],
      historico_atendimentos: atendimentosResult.rows
    };

    res.json(cliente);

  } catch (error) {
    next(error);
  }
});

// Criar cliente
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = clienteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const {
      name,
      email,
      telefone,
      endereco,
      observacoes,
      tipo_pessoa,
      documento,
      profissao,
      estado_civil,
      data_nascimento
    } = value;

    // Verificar se já existe cliente com mesmo email ou telefone
    if (email) {
      const emailExists = await query(
        'SELECT id FROM clientes WHERE email = $1',
        [email]
      );
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
    }

    const telefoneExists = await query(
      'SELECT id FROM clientes WHERE telefone = $1',
      [telefone]
    );
    if (telefoneExists.rows.length > 0) {
      return res.status(400).json({ error: 'Telefone já cadastrado' });
    }

    const result = await query(`
      INSERT INTO clientes (
        name, email, telefone, endereco, observacoes, tipo_pessoa, 
        documento, profissao, estado_civil, data_nascimento, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      name, email, telefone, endereco, observacoes, tipo_pessoa,
      documento, profissao, estado_civil, data_nascimento, req.user.id
    ]);

    const cliente = result.rows[0];

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      cliente
    });

  } catch (error) {
    next(error);
  }
});

// Atualizar cliente
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateClienteSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    // Verificar se cliente existe
    const clienteExists = await query('SELECT id FROM clientes WHERE id = $1', [id]);
    if (clienteExists.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Verificar duplicação de email/telefone
    if (value.email) {
      const emailExists = await query(
        'SELECT id FROM clientes WHERE email = $1 AND id != $2',
        [value.email, id]
      );
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email já cadastrado para outro cliente' });
      }
    }

    if (value.telefone) {
      const telefoneExists = await query(
        'SELECT id FROM clientes WHERE telefone = $1 AND id != $2',
        [value.telefone, id]
      );
      if (telefoneExists.rows.length > 0) {
        return res.status(400).json({ error: 'Telefone já cadastrado para outro cliente' });
      }
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
      UPDATE clientes 
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    const cliente = result.rows[0];

    res.json({
      message: 'Cliente atualizado com sucesso',
      cliente
    });

  } catch (error) {
    next(error);
  }
});

// Deletar cliente
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar se cliente tem atendimentos
    const atendimentosResult = await query(
      'SELECT COUNT(*) as total FROM atendimentos WHERE cliente_id = $1',
      [id]
    );

    if (parseInt(atendimentosResult.rows[0].total) > 0) {
      return res.status(400).json({ 
        error: 'Cliente não pode ser deletado pois possui atendimentos vinculados' 
      });
    }

    const result = await query(
      'DELETE FROM clientes WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente deletado com sucesso' });

  } catch (error) {
    next(error);
  }
});

// Buscar clientes para autocomplete
router.get('/search/autocomplete', authenticateToken, async (req, res, next) => {
  try {
    const { q = '', limit = 10 } = req.query;

    if (q.length < 2) {
      return res.json([]);
    }

    const result = await query(`
      SELECT id, name, telefone, email
      FROM clientes
      WHERE name ILIKE $1 OR telefone ILIKE $1 OR email ILIKE $1
      ORDER BY name ASC
      LIMIT $2
    `, [`%${q}%`, limit]);

    res.json(result.rows);

  } catch (error) {
    next(error);
  }
});

// Estatísticas de clientes
router.get('/stats/overview', authenticateToken, async (req, res, next) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_clientes,
        COUNT(CASE WHEN tipo_pessoa = 'fisica' THEN 1 END) as pessoas_fisicas,
        COUNT(CASE WHEN tipo_pessoa = 'juridica' THEN 1 END) as pessoas_juridicas,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as novos_mes,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as novos_semana
      FROM clientes
    `);

    // Clientes mais ativos
    const ativosResult = await query(`
      SELECT 
        c.id,
        c.name,
        COUNT(a.id) as total_atendimentos
      FROM clientes c
      INNER JOIN atendimentos a ON c.id = a.cliente_id
      GROUP BY c.id, c.name
      ORDER BY total_atendimentos DESC
      LIMIT 5
    `);

    res.json({
      ...stats.rows[0],
      clientes_mais_ativos: ativosResult.rows
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
