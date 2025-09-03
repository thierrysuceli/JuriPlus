const express = require('express');
const Joi = require('joi');
const { query, transaction } = require('../config/database-adapter');
const { 
  authenticateToken, 
  hashPassword, 
  comparePassword, 
  generateToken 
} = require('../middleware/auth');

const router = express.Router();

// Schema para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Schema para registro
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'escritorio', 'advogado').default('escritorio')
});

// POST /login - Autenticar usuário
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const { email, password } = value;

    // Buscar usuário por email
    const result = await query('SELECT * FROM users WHERE email = ? AND active = ?', [email, 1]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    const user = result.rows[0];

    // Verificar senha
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token JWT
    const token = generateToken(user.id, user.role);

    // Log de auditoria
    await query('INSERT INTO audit_log (user_id, action, ip_address, user_agent) VALUES (?, ?, ?, ?)', [
      user.id,
      'LOGIN',
      req.ip,
      req.get('User-Agent')
    ]);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
});

// POST /register - Registrar novo usuário
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const { name, email, password, role } = value;

    // Verificar se email já existe
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já cadastrado',
        message: 'Este email já está em uso'
      });
    }

    // Hash da senha
    const passwordHash = await hashPassword(password);

    // Inserir usuário
    const result = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?) RETURNING id',
      [name, email, passwordHash, role]
    );

    const userId = result.rows[0]?.id || result.lastID;

    // Log de auditoria
    await query('INSERT INTO audit_log (user_id, action, ip_address, user_agent) VALUES (?, ?, ?, ?)', [
      userId,
      'REGISTER',
      req.ip,
      req.get('User-Agent')
    ]);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: userId,
        name,
        email,
        role
      }
    });

  } catch (error) {
    next(error);
  }
});

// GET /me - Obter dados do usuário atual
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      user: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
