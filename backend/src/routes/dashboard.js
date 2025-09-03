const express = require('express');
const { query } = require('../config/database-adapter');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Dashboard - Estatísticas gerais
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const { periodo = 'mes' } = req.query;
    
    let dateFilter = '';
    let previousDateFilter = '';
    
    if (periodo === 'semana') {
      dateFilter = "AND created_at >= NOW() - INTERVAL '7 days'";
      previousDateFilter = "AND created_at >= NOW() - INTERVAL '14 days' AND created_at < NOW() - INTERVAL '7 days'";
    } else if (periodo === 'mes') {
      dateFilter = "AND created_at >= NOW() - INTERVAL '30 days'";
      previousDateFilter = "AND created_at >= NOW() - INTERVAL '60 days' AND created_at < NOW() - INTERVAL '30 days'";
    }

    // Estatísticas atuais
    const currentStats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM leads WHERE 1=1 ${dateFilter}) as leads_iniciados,
        (SELECT COUNT(*) FROM atendimentos WHERE status = 'agendado' ${dateFilter}) as consultorias_agendadas,
        (SELECT COUNT(*) FROM agenda WHERE DATE(data_inicio) = CURRENT_DATE AND status != 'cancelado') as agendamentos_hoje,
        (SELECT COUNT(*) FROM agenda WHERE DATE(data_inicio) = CURRENT_DATE + INTERVAL '1 day' AND status != 'cancelado') as agendamentos_amanha,
        (SELECT COUNT(*) FROM clientes ${dateFilter}) as novos_clientes
    `);

    // Estatísticas do período anterior para comparação
    const previousStats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM leads WHERE 1=1 ${previousDateFilter}) as leads_anteriores,
        (SELECT COUNT(*) FROM atendimentos WHERE status = 'agendado' ${previousDateFilter}) as consultorias_anteriores
    `);

    const current = currentStats.rows[0];
    const previous = previousStats.rows[0];

    // Calcular taxa de conversão
    const leadsTotal = await query(`
      SELECT COUNT(*) as total FROM leads WHERE 1=1 ${dateFilter}
    `);
    
    const leadsConvertidos = await query(`
      SELECT COUNT(*) as convertidos FROM leads WHERE status = 'concluido' ${dateFilter}
    `);

    const taxaConversao = leadsTotal.rows[0].total > 0 
      ? ((leadsConvertidos.rows[0].convertidos / leadsTotal.rows[0].total) * 100).toFixed(1)
      : 0;

    res.json({
      periodo,
      leads_iniciados: parseInt(current.leads_iniciados),
      consultorias_agendadas: parseInt(current.consultorias_agendadas),
      agendamentos_hoje: parseInt(current.agendamentos_hoje),
      agendamentos_amanha: parseInt(current.agendamentos_amanha),
      novos_clientes: parseInt(current.novos_clientes),
      taxa_conversao: parseFloat(taxaConversao),
      leads_anteriores: parseInt(previous.leads_anteriores),
      consultorias_anteriores: parseInt(previous.consultorias_anteriores)
    });

  } catch (error) {
    next(error);
  }
});

// Dashboard - Gráfico de performance
router.get('/chart-data', authenticateToken, async (req, res, next) => {
  try {
    const { periodo = 'semana' } = req.query;
    
    let intervalDays = 7;
    let groupBy = "DATE(created_at)";
    
    if (periodo === 'mes') {
      intervalDays = 30;
    }

    // Dados para o gráfico de leads por dia
    const chartData = await query(`
      SELECT 
        ${groupBy} as data,
        COUNT(*) as leads,
        COUNT(CASE WHEN status = 'concluido' THEN 1 END) as convertidos
      FROM leads
      WHERE created_at >= NOW() - INTERVAL '${intervalDays} days'
      GROUP BY ${groupBy}
      ORDER BY data ASC
    `);

    // Formatar dados para o frontend
    const formattedData = chartData.rows.map(row => ({
      data: row.data,
      leads: parseInt(row.leads),
      convertidos: parseInt(row.convertidos),
      taxa_conversao: row.leads > 0 ? ((row.convertidos / row.leads) * 100).toFixed(1) : 0
    }));

    res.json(formattedData);

  } catch (error) {
    next(error);
  }
});

// Dashboard - Próximos agendamentos
router.get('/proximos-agendamentos', authenticateToken, async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const result = await query(`
      SELECT 
        ag.id,
        ag.titulo,
        ag.data_inicio,
        ag.tipo,
        c.name as cliente_nome,
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
      tipo: row.tipo,
      cliente: row.cliente_nome,
      advogado: row.advogado_nome
    }));

    res.json(agendamentos);

  } catch (error) {
    next(error);
  }
});

// Dashboard - Distribuição de leads por origem
router.get('/leads-por-origem', authenticateToken, async (req, res, next) => {
  try {
    const { periodo = 'mes' } = req.query;
    
    let dateFilter = '';
    if (periodo === 'semana') {
      dateFilter = "AND data_entrada >= NOW() - INTERVAL '7 days'";
    } else if (periodo === 'mes') {
      dateFilter = "AND data_entrada >= NOW() - INTERVAL '30 days'";
    }

    const result = await query(`
      SELECT 
        plataforma,
        COUNT(*) as quantidade,
        ROUND(
          (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 
          1
        ) as percentual
      FROM leads
      WHERE 1=1 ${dateFilter}
      GROUP BY plataforma
      ORDER BY quantidade DESC
    `);

    res.json(result.rows);

  } catch (error) {
    next(error);
  }
});

// Dashboard - Resumo de atividades recentes
router.get('/atividades-recentes', authenticateToken, async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    // Buscar atividades dos últimos 7 dias
    const atividades = [];

    // Novos leads
    const leadsResult = await query(`
      SELECT 
        'lead' as tipo,
        'Novo lead: ' || nome as descricao,
        data_entrada as data,
        plataforma
      FROM leads
      WHERE data_entrada >= NOW() - INTERVAL '7 days'
      ORDER BY data_entrada DESC
      LIMIT 5
    `);

    // Novos clientes
    const clientesResult = await query(`
      SELECT 
        'cliente' as tipo,
        'Novo cliente: ' || name as descricao,
        created_at as data,
        null as plataforma
      FROM clientes
      WHERE created_at >= NOW() - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Agendamentos criados
    const agendamentosResult = await query(`
      SELECT 
        'agendamento' as tipo,
        'Agendamento: ' || titulo as descricao,
        created_at as data,
        tipo as plataforma
      FROM agenda
      WHERE created_at >= NOW() - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Combinar e ordenar todas as atividades
    const todasAtividades = [
      ...leadsResult.rows,
      ...clientesResult.rows,
      ...agendamentosResult.rows
    ].sort((a, b) => new Date(b.data) - new Date(a.data))
     .slice(0, limit);

    res.json(todasAtividades);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
