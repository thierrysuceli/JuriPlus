@echo off

echo 🚀 Configurando JuriPlus - Sistema de Gestao Juridica
echo =====================================================

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado. Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se PostgreSQL está instalado
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL nao encontrado. Por favor, instale o PostgreSQL primeiro.
    pause
    exit /b 1
)

REM Instalar dependências do backend
echo 📦 Instalando dependencias do backend...
cd backend
call npm install

REM Configurar banco de dados
echo 🗄️ Configurando banco de dados...
call npm run setup

REM Voltar para raiz e instalar dependências do frontend
echo 📦 Instalando dependencias do frontend...
cd ..
call npm install

echo.
echo ✅ Configuracao concluida!
echo.
echo 🎯 Para executar o projeto:
echo    Backend:  cd backend ^&^& npm run dev
echo    Frontend: npm run dev
echo.
echo 📊 URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3001
echo    API:      http://localhost:3001/api

pause
