const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database-adapter');
const { authenticateToken, hashPassword, comparePassword } = require('../middleware/auth');

const router = express.Router();

// Schema para atualização de perfil
const perfilSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
  telefone: Joi.string().optional(),
  endereco: Joi.string().optional(),
  bio: Joi.string().max(500).optional().allow(''),
  especialidades: Joi.string().optional().allow(''),
  oab: Joi.string().when('role', {
    is: 'advogado',
    then: Joi.optional(),
    otherwise: Joi.forbidden()
  })
});

const passwordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
  confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
});

// Buscar perfil do usuário
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Buscar dados básicos do usuário
    const userResult = await query(`
      SELECT id, email, name, role, created_at, updated_at
      FROM users WHERE id = $1
    `, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userResult.rows[0];
    let perfil = { ...user };

    // Buscar dados específicos baseado no role
    if (user.role === 'escritorio') {
      const escritorioResult = await query(`
        SELECT nome, telefone, endereco, cnpj
        FROM escritorios WHERE user_id = $1
      `, [userId]);

      if (escritorioResult.rows.length > 0) {
        const escritorio = escritorioResult.rows[0];
        perfil = {
          ...perfil,
          escritorio_nome: escritorio.nome,
          telefone: escritorio.telefone,
          endereco: escritorio.endereco,
          cnpj: escritorio.cnpj
        };
      }
    } else if (user.role === 'advogado') {
      const advogadoResult = await query(`
        SELECT oab, telefone, endereco, especialidades, bio, escritorio_id
        FROM advogados WHERE user_id = $1
      `, [userId]);

      if (advogadoResult.rows.length > 0) {
        const advogado = advogadoResult.rows[0];
        perfil = {
          ...perfil,
          oab: advogado.oab,
          telefone: advogado.telefone,
          endereco: advogado.endereco,
          especialidades: advogado.especialidades,
          bio: advogado.bio,
          escritorio_id: advogado.escritorio_id
        };

        // Buscar nome do escritório se vinculado
        if (advogado.escritorio_id) {
          const escritorioResult = await query(`
            SELECT e.nome as escritorio_nome
            FROM escritorios e 
            WHERE e.user_id = $1
          `, [advogado.escritorio_id]);

          if (escritorioResult.rows.length > 0) {
            perfil.escritorio_nome = escritorioResult.rows[0].escritorio_nome;
          }
        }
      }
    }

    // Buscar estatísticas do usuário
    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM atendimentos WHERE advogado_id = $1) as total_atendimentos,
        (SELECT COUNT(*) FROM clientes WHERE created_by = $1) as total_clientes,
        (SELECT COUNT(*) FROM leads WHERE created_by = $1) as total_leads
    `, [userId]);

    if (statsResult.rows.length > 0) {
      perfil.estatisticas = statsResult.rows[0];
    }

    res.json(perfil);

  } catch (error) {
    next(error);
  }
});

// Atualizar perfil
router.put('/', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = perfilSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    // Verificar se email já está em uso (se fornecido)
    if (value.email) {
      const emailExists = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [value.email, userId]
      );
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
    }

    // Atualizar dados básicos do usuário
    const userUpdates = [];
    const userValues = [];
    let userParamCounter = 1;

    if (value.name) {
      userUpdates.push(`name = $${userParamCounter}`);
      userValues.push(value.name);
      userParamCounter++;
    }
    if (value.email) {
      userUpdates.push(`email = $${userParamCounter}`);
      userValues.push(value.email);
      userParamCounter++;
    }

    if (userUpdates.length > 0) {
      userUpdates.push('updated_at = NOW()');
      userValues.push(userId);

      const userUpdateQuery = `
        UPDATE users 
        SET ${userUpdates.join(', ')}
        WHERE id = $${userParamCounter}
      `;

      await query(userUpdateQuery, userValues);
    }

    // Atualizar dados específicos baseado no role
    if (userRole === 'escritorio') {
      const escritorioFields = ['telefone', 'endereco'];
      const escritorioUpdates = [];
      const escritorioValues = [];
      let escritorioParamCounter = 1;

      escritorioFields.forEach(field => {
        if (value[field] !== undefined) {
          escritorioUpdates.push(`${field} = $${escritorioParamCounter}`);
          escritorioValues.push(value[field]);
          escritorioParamCounter++;
        }
      });

      if (escritorioUpdates.length > 0) {
        escritorioUpdates.push('updated_at = NOW()');
        escritorioValues.push(userId);

        const escritorioUpdateQuery = `
          UPDATE escritorios 
          SET ${escritorioUpdates.join(', ')}
          WHERE user_id = $${escritorioParamCounter}
        `;

        await query(escritorioUpdateQuery, escritorioValues);
      }
    } else if (userRole === 'advogado') {
      const advogadoFields = ['oab', 'telefone', 'endereco', 'especialidades', 'bio'];
      const advogadoUpdates = [];
      const advogadoValues = [];
      let advogadoParamCounter = 1;

      advogadoFields.forEach(field => {
        if (value[field] !== undefined) {
          advogadoUpdates.push(`${field} = $${advogadoParamCounter}`);
          advogadoValues.push(value[field]);
          advogadoParamCounter++;
        }
      });

      if (advogadoUpdates.length > 0) {
        advogadoUpdates.push('updated_at = NOW()');
        advogadoValues.push(userId);

        const advogadoUpdateQuery = `
          UPDATE advogados 
          SET ${advogadoUpdates.join(', ')}
          WHERE user_id = $${advogadoParamCounter}
        `;

        await query(advogadoUpdateQuery, advogadoValues);
      }
    }

    res.json({ message: 'Perfil atualizado com sucesso' });

  } catch (error) {
    next(error);
  }
});

// Alterar senha
router.put('/senha', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = passwordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const { current_password, new_password } = value;
    const userId = req.user.id;

    // Buscar senha atual
    const userResult = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userResult.rows[0];

    // Verificar senha atual
    const isValidPassword = await comparePassword(current_password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    // Gerar hash da nova senha
    const newPasswordHash = await hashPassword(new_password);

    // Atualizar senha
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, userId]
    );

    // Log da ação
    await query(
      `INSERT INTO audit_log (user_id, action, ip_address, user_agent) 
       VALUES ($1, 'PASSWORD_CHANGE', $2, $3)`,
      [userId, req.ip, req.get('User-Agent')]
    );

    res.json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    next(error);
  }
});

// Upload de foto de perfil
router.post('/foto', authenticateToken, async (req, res, next) => {
  try {
    // Esta é uma implementação básica
    // Em produção, você implementaria upload real com multer
    
    res.json({ 
      message: 'Upload de foto não implementado ainda',
      info: 'Funcionalidade será adicionada em versão futura'
    });

  } catch (error) {
    next(error);
  }
});

// Buscar atividades recentes do usuário
router.get('/atividades', authenticateToken, async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        action,
        ip_address,
        user_agent,
        created_at
      FROM audit_log
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [userId, limit]);

    const atividades = result.rows.map(row => ({
      acao: row.action,
      ip: row.ip_address,
      navegador: row.user_agent,
      data: row.created_at
    }));

    res.json(atividades);

  } catch (error) {
    next(error);
  }
});

// Desativar conta
router.delete('/desativar', authenticateToken, async (req, res, next) => {
  try {
    const schema = Joi.object({
      password: Joi.string().required(),
      motivo: Joi.string().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const { password, motivo } = value;
    const userId = req.user.id;

    // Verificar senha
    const userResult = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userResult.rows[0];
    const isValidPassword = await comparePassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    // Desativar conta
    await query(
      'UPDATE users SET active = false, updated_at = NOW() WHERE id = $1',
      [userId]
    );

    // Log da ação
    await query(
      `INSERT INTO audit_log (user_id, action, ip_address, user_agent, details) 
       VALUES ($1, 'ACCOUNT_DEACTIVATED', $2, $3, $4)`,
      [userId, req.ip, req.get('User-Agent'), motivo || 'Sem motivo especificado']
    );

    res.json({ message: 'Conta desativada com sucesso' });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
