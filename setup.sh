#!/bin/bash

echo "🚀 PromptForge - Inicio Rápido"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Instala Node.js 18+ desde: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL no está instalado"
    echo "Instala PostgreSQL desde: https://www.postgresql.org/download/"
    echo "O usa Railway/Heroku para deployment directo"
    read -p "¿Continuar sin PostgreSQL local? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📦 Instalando dependencias del backend..."
cd backend
npm install

echo ""
echo "🔧 Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Archivo .env creado"
    echo "⚠️  IMPORTANTE: Edita backend/.env con tus credenciales"
    echo ""
    read -p "¿Abrir .env en el editor? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env
    fi
else
    echo "✅ Archivo .env ya existe"
fi

echo ""
read -p "¿Ejecutar migraciones de base de datos? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd ../database
    node migrate.js
    cd ../backend
fi

echo ""
echo "✨ ¡Configuración completa!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Editar backend/.env con tus credenciales"
echo "2. Configurar Stripe: https://stripe.com"
echo "3. Obtener API key de OpenAI o Anthropic"
echo "4. Ejecutar: cd backend && npm start"
echo ""
echo "📚 Ver README.md para más información"
echo "🚀 Ver DEPLOYMENT.md para deployment en producción"
echo ""
echo "¿Iniciar servidor ahora? (y/n) "
read -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm start
fi
