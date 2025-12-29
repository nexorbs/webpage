#!/bin/bash

echo "🚀 NexOrbs Development Setup"
echo "============================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  Wrangler CLI no está instalado (opcional para desarrollo local)"
    echo "   Instálalo con: npm install -g wrangler"
    echo ""
else
    echo "✅ Wrangler CLI encontrado"
    echo ""
fi

echo "📦 Instalando dependencias..."
npm install

echo ""
echo "🔧 Configuración de variables de entorno para desarrollo local"
echo ""
echo "Para probar el formulario de contacto localmente, necesitas:"
echo "1. Una clave de API de Brevo: https://app.brevo.com/settings/keys/api"
echo "2. Configurar la variable BREVO_API_KEY"
echo ""
read -p "¿Quieres configurar la clave de API de Brevo para desarrollo local? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v wrangler &> /dev/null; then
        echo "Configurando BREVO_API_KEY para desarrollo..."
        wrangler secret put BREVO_API_KEY --env development
        echo "✅ Clave configurada para desarrollo local"
    else
        echo "❌ Necesitas instalar wrangler primero: npm install -g wrangler"
    fi
else
    echo "⚠️  Para probar el formulario localmente, configura BREVO_API_KEY más tarde"
fi

echo ""
echo "🎉 Setup completado!"
echo ""
echo "Comandos disponibles:"
echo "   npm run dev          - Desarrollo local"
echo "   npm run build        - Build para producción"
echo "   npm run preview      - Preview del build"
echo ""
echo "El deploy a producción se hace automáticamente via GitHub Actions"
echo "cuando haces push a la rama 'main'"
echo ""