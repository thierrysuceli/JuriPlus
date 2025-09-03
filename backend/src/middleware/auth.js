const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database-adapter');

// Gerar hash da senha
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Comparar senha
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Gerar token JWT
function generateToken(userId, role) {
  const payload = {
    userId,
    role,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
}

// Middleware de autenticação
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco
    const userResult = await query(
      'SELECT id, email, name, role, active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = userResult.rows[0];
    
    if (!user.active) {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' });
    }
    
    console.error('Erro na autenticação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Middleware de autorização por role
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Permissões insuficientes.' 
      });
    }

    next();
  };
}

// Middleware para verificar se o usuário pode acessar o recurso
function authorizeOwnerOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // Admin pode acessar tudo
  if (req.user.role === 'admin') {
    return next();
  }

  // Verificar se é o próprio usuário
  const resourceUserId = req.params.userId || req.params.id || req.body.userId;
  
  if (req.user.id === parseInt(resourceUserId)) {
    return next();
  }

  return res.status(403).json({ 
    error: 'Acesso negado. Você só pode acessar seus próprios recursos.' 
  });
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  authenticateToken,
  authorizeRoles,
  authorizeOwnerOrAdmin
};
