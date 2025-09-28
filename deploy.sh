#!/bin/bash

# Script de déploiement simple pour le contrat d'assurance
echo "🚀 Déploiement du contrat d'assurance RainGuard..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "Move.toml" ]; then
    echo "❌ Erreur: Move.toml non trouvé. Assurez-vous d'être dans le répertoire move/counter"
    exit 1
fi

# Compiler le contrat
echo "📦 Compilation du contrat..."
sui move build

if [ $? -ne 0 ]; then
    echo "❌ Erreur de compilation"
    exit 1
fi

echo "✅ Compilation réussie"

# Déployer le contrat
echo "🚀 Déploiement du contrat..."
sui client publish --gas-budget 50000000

if [ $? -ne 0 ]; then
    echo "❌ Erreur de déploiement"
    echo "💡 Essayez de lancer PowerShell en tant qu'administrateur"
    exit 1
fi

echo "✅ Déploiement réussi!"
echo "📋 Copiez le Package ID et mettez-le à jour dans votre frontend"

