#!/bin/bash

echo "🚀 Déploiement du contrat d'assurance Sui..."

# Vérifier que Sui CLI est installé
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que le fichier existe
if [ ! -f "sources/insurance.move" ]; then
    echo "❌ Fichier sources/insurance.move non trouvé."
    exit 1
fi

echo "📦 Déploiement du contrat..."
sui client publish --gas-budget 100000000 sources/insurance.move

echo "✅ Déploiement terminé !"
echo "📋 Copiez le Package ID affiché ci-dessus et utilisez-le dans l'application."
