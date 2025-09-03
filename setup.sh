#!/bin/bash

echo "🚀 Configurando JuriPlus - Sistema de Gestão Jurídica"
echo "====================================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL não encontrado. Por favor, instale o PostgreSQL primeiro."
    exit 1
fi

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install

# Configurar banco de dados
echo "🗄️ Configurando banco de dados..."
npm run setup

# Voltar para raiz e instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd ..
npm install

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "🎯 Para executar o projeto:"
echo "   Backend:  cd backend && npm run dev"
echo "   Frontend: npm run dev"
echo ""
echo "📊 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo "   API:      http://localhost:3001/api"
