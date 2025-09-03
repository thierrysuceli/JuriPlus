function errorHandler(err, req, res, next) {
  console.error('❌ Erro capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Erro de validação do Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Erro de banco de dados PostgreSQL
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        return res.status(409).json({
          error: 'Conflito de dados',
          message: 'Este registro já existe'
        });
      
      case '23503': // Foreign key violation
        return res.status(400).json({
          error: 'Referência inválida',
          message: 'Dados relacionados não encontrados'
        });
      
      case '23502': // Not null violation
        return res.status(400).json({
          error: 'Campo obrigatório',
          message: 'Dados obrigatórios não fornecidos'
        });
      
      case '22001': // String data too long
        return res.status(400).json({
          error: 'Dados muito grandes',
          message: 'Um ou mais campos excedem o tamanho máximo'
        });
      
      default:
        console.error('Erro de banco não tratado:', err.code, err.message);
    }
  }

  // Erro JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'Token de autenticação inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      message: 'Token de autenticação expirado'
    });
  }

  // Erro de sintaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON inválido',
      message: 'Formato de dados inválido'
    });
  }

  // Erro de arquivo muito grande
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Arquivo muito grande',
      message: 'O arquivo enviado excede o tamanho máximo permitido'
    });
  }

  // Erro de tipo de arquivo não permitido
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(415).json({
      error: 'Tipo de arquivo não permitido',
      message: 'O tipo de arquivo enviado não é suportado'
    });
  }

  // Erro personalizado da aplicação
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message || 'Erro da aplicação'
    });
  }

  // Erro interno do servidor
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Algo deu errado, tente novamente mais tarde',
    requestId: req.id || 'unknown'
  });
}

module.exports = errorHandler;
