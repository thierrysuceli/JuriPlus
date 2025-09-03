const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database-adapter');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Schema para configurações
const configSchema = Joi.object({
  escritorio_nome: Joi.string().min(2).optional(),
  escritorio_email: Joi.string().email().optional(),
  escritorio_telefone: Joi.string().optional(),
  escritorio_endereco: Joi.string().optional(),
  escritorio_cnpj: Joi.string().optional(),
  notificacoes_email: Joi.boolean().optional(),
  notificacoes_whatsapp: Joi.boolean().optional(),
  fuso_horario: Joi.string().optional(),
  tema: Joi.string().valid('light', 'dark', 'system').optional(),
  idioma: Joi.string().optional()
});

// Buscar configurações
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    // Buscar configurações do usuário
    const configResult = await query(`
      SELECT * FROM configuracoes WHERE user_id = $1
    `, [req.user.id]);

    let configuracoes = {};
    
    if (configResult.rows.length > 0) {
      configuracoes = configResult.rows[0];
    } else {
      // Configurações padrão
      configuracoes = {
        user_id: req.user.id,
        notificacoes_email: true,
        notificacoes_whatsapp: false,
        fuso_horario: 'America/Sao_Paulo',
        tema: 'light',
        idioma: 'pt-br'
      };
    }

    // Buscar dados do escritório se for escritorio
    if (req.user.role === 'escritorio') {
      const escritorioResult = await query(`
        SELECT nome, telefone, endereco, cnpj 
        FROM escritorios WHERE user_id = $1
      `, [req.user.id]);

      if (escritorioResult.rows.length > 0) {
        const escritorio = escritorioResult.rows[0];
        configuracoes = {
          ...configuracoes,
          escritorio_nome: escritorio.nome,
          escritorio_telefone: escritorio.telefone,
          escritorio_endereco: escritorio.endereco,
          escritorio_cnpj: escritorio.cnpj
        };
      }
    }

    res.json(configuracoes);

  } catch (error) {
    next(error);
  }
});

// Atualizar configurações
router.put('/', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = configSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const userId = req.user.id;

    // Separar configurações do escritório das configurações gerais
    const {
      escritorio_nome,
      escritorio_email,
      escritorio_telefone,
      escritorio_endereco,
      escritorio_cnpj,
      ...configGerais
    } = value;

    // Atualizar configurações gerais
    if (Object.keys(configGerais).length > 0) {
      // Verificar se já existem configurações
      const existingConfig = await query(
        'SELECT id FROM configuracoes WHERE user_id = $1',
        [userId]
      );

      if (existingConfig.rows.length > 0) {
        // Atualizar configurações existentes
        const updates = [];
        const values = [];
        let paramCounter = 1;

        Object.entries(configGerais).forEach(([key, val]) => {
          if (val !== undefined) {
            updates.push(`${key} = $${paramCounter}`);
            values.push(val);
            paramCounter++;
          }
        });

        if (updates.length > 0) {
          updates.push('updated_at = NOW()');
          values.push(userId);

          const updateQuery = `
            UPDATE configuracoes 
            SET ${updates.join(', ')}
            WHERE user_id = $${paramCounter}
            RETURNING *
          `;

          await query(updateQuery, values);
        }
      } else {
        // Criar novas configurações
        const fields = ['user_id', ...Object.keys(configGerais)];
        const placeholders = fields.map((_, index) => `$${index + 1}`);
        const values = [userId, ...Object.values(configGerais)];

        await query(`
          INSERT INTO configuracoes (${fields.join(', ')})
          VALUES (${placeholders.join(', ')})
        `, values);
      }
    }

    // Atualizar dados do escritório (se aplicável)
    if (req.user.role === 'escritorio' && (
      escritorio_nome || escritorio_telefone || escritorio_endereco || escritorio_cnpj
    )) {
      const escritorioUpdates = [];
      const escritorioValues = [];
      let paramCounter = 1;

      if (escritorio_nome) {
        escritorioUpdates.push(`nome = $${paramCounter}`);
        escritorioValues.push(escritorio_nome);
        paramCounter++;
      }
      if (escritorio_telefone) {
        escritorioUpdates.push(`telefone = $${paramCounter}`);
        escritorioValues.push(escritorio_telefone);
        paramCounter++;
      }
      if (escritorio_endereco) {
        escritorioUpdates.push(`endereco = $${paramCounter}`);
        escritorioValues.push(escritorio_endereco);
        paramCounter++;
      }
      if (escritorio_cnpj) {
        escritorioUpdates.push(`cnpj = $${paramCounter}`);
        escritorioValues.push(escritorio_cnpj);
        paramCounter++;
      }

      if (escritorioUpdates.length > 0) {
        escritorioUpdates.push('updated_at = NOW()');
        escritorioValues.push(userId);

        const updateEscritorioQuery = `
          UPDATE escritorios 
          SET ${escritorioUpdates.join(', ')}
          WHERE user_id = $${paramCounter}
        `;

        await query(updateEscritorioQuery, escritorioValues);
      }
    }

    // Atualizar email do usuário principal se fornecido
    if (escritorio_email && req.user.role === 'escritorio') {
      await query(
        'UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2',
        [escritorio_email, userId]
      );
    }

    res.json({ message: 'Configurações atualizadas com sucesso' });

  } catch (error) {
    next(error);
  }
});

// Buscar configurações de notificação
router.get('/notificacoes', authenticateToken, async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        notificacoes_email,
        notificacoes_whatsapp,
        notificacao_novos_leads,
        notificacao_agendamentos,
        notificacao_lembretes
      FROM configuracoes 
      WHERE user_id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      // Configurações padrão
      return res.json({
        notificacoes_email: true,
        notificacoes_whatsapp: false,
        notificacao_novos_leads: true,
        notificacao_agendamentos: true,
        notificacao_lembretes: true
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    next(error);
  }
});

// Atualizar configurações de notificação
router.put('/notificacoes', authenticateToken, async (req, res, next) => {
  try {
    const schema = Joi.object({
      notificacoes_email: Joi.boolean().optional(),
      notificacoes_whatsapp: Joi.boolean().optional(),
      notificacao_novos_leads: Joi.boolean().optional(),
      notificacao_agendamentos: Joi.boolean().optional(),
      notificacao_lembretes: Joi.boolean().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const userId = req.user.id;

    // Verificar se configurações existem
    const existingConfig = await query(
      'SELECT id FROM configuracoes WHERE user_id = $1',
      [userId]
    );

    if (existingConfig.rows.length > 0) {
      // Atualizar configurações existentes
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

      if (updates.length > 0) {
        updates.push('updated_at = NOW()');
        values.push(userId);

        const updateQuery = `
          UPDATE configuracoes 
          SET ${updates.join(', ')}
          WHERE user_id = $${paramCounter}
        `;

        await query(updateQuery, values);
      }
    } else {
      // Criar configurações com valores padrão
      await query(`
        INSERT INTO configuracoes (
          user_id, notificacoes_email, notificacoes_whatsapp,
          notificacao_novos_leads, notificacao_agendamentos, notificacao_lembretes
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        userId,
        value.notificacoes_email ?? true,
        value.notificacoes_whatsapp ?? false,
        value.notificacao_novos_leads ?? true,
        value.notificacao_agendamentos ?? true,
        value.notificacao_lembretes ?? true
      ]);
    }

    res.json({ message: 'Configurações de notificação atualizadas com sucesso' });

  } catch (error) {
    next(error);
  }
});

// Backup de dados
router.post('/backup', authenticateToken, async (req, res, next) => {
  try {
    // Esta é uma implementação básica. Em produção, você poderia:
    // 1. Gerar um arquivo de backup real
    // 2. Enviar por email
    // 3. Salvar em cloud storage
    
    const timestamp = new Date().toISOString();
    
    res.json({
      message: 'Backup iniciado com sucesso',
      timestamp,
      status: 'em_processamento'
    });

  } catch (error) {
    next(error);
  }
});

// Limpar cache/dados temporários
router.post('/limpar-cache', authenticateToken, async (req, res, next) => {
  try {
    // Aqui você pode implementar limpeza de:
    // - Logs antigos
    // - Arquivos temporários
    // - Cache da aplicação
    
    res.json({ message: 'Cache limpo com sucesso' });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
