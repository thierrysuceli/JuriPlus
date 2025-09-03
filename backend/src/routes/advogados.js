const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database-adapter');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Schema de criação/atualização
const advogadoSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  oab: Joi.string().min(3).required(),
  telefone: Joi.string().allow('', null),
  endereco: Joi.string().allow('', null),
  especialidades: Joi.string().allow('', null),
  escritorio_id: Joi.number().integer().allow(null)
});

// Listar advogados
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, a.oab, a.telefone, a.endereco, a.especialidades, a.escritorio_id,
              u.created_at
         FROM users u
         JOIN advogados a ON a.user_id = u.id
        WHERE u.role = 'advogado'
        ORDER BY u.created_at DESC`
    );
    res.json({ advogados: result.rows });
  } catch (error) {
    next(error);
  }
});

// Criar novo advogado (cria user + registro em advogados)
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = advogadoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Dados inválidos', details: error.details });

    const { name, email, oab, telefone, endereco, especialidades, escritorio_id } = value;

    // Verificar e-mail existente
    const emailExists = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    // Criar usuário com senha temporária
    const tempPassword = 'advogado123';
    const { hashPassword } = require('../middleware/auth');
    const passwordHash = await hashPassword(tempPassword);

    const createUser = await query(
      'INSERT INTO users (name, email, password_hash, role, email_verified) VALUES (?, ?, ?, ?, ?) RETURNING id',
      [name, email, passwordHash, 'advogado', 0]
    );

    const userId = createUser.rows[0]?.id || createUser.lastID;

    // Criar registro do advogado
    await query(
      'INSERT INTO advogados (user_id, escritorio_id, oab, telefone, endereco, especialidades) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, escritorio_id || null, oab, telefone || null, endereco || null, especialidades || null]
    );

    res.status(201).json({
      message: 'Advogado criado com sucesso',
      advogado: { id: userId, name, email, oab, telefone, endereco, especialidades, escritorio_id },
      senha_temporaria: tempPassword
    });
  } catch (error) {
    next(error);
  }
});

// Atualizar advogado
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = advogadoSchema.fork(['email', 'oab'], (s) => s.optional()).validate(req.body);
    if (error) return res.status(400).json({ error: 'Dados inválidos', details: error.details });

    const id = Number(req.params.id);
    const { name, email, oab, telefone, endereco, especialidades, escritorio_id } = value;

    // Atualizar dados básicos
    if (name) await query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    if (email) await query('UPDATE users SET email = ? WHERE id = ?', [email, id]);

    // Atualizar dados do advogado
    await query(
      `UPDATE advogados SET oab = COALESCE(?, oab), telefone = COALESCE(?, telefone),
        endereco = COALESCE(?, endereco), especialidades = COALESCE(?, especialidades),
        escritorio_id = COALESCE(?, escritorio_id) WHERE user_id = ?`,
      [oab || null, telefone || null, endereco || null, especialidades || null, escritorio_id || null, id]
    );

    res.json({ message: 'Advogado atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
});

// Remover advogado (soft delete: desativar usuário)
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await query('UPDATE users SET active = 0 WHERE id = ?', [id]);
    res.json({ message: 'Advogado desativado com sucesso' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
