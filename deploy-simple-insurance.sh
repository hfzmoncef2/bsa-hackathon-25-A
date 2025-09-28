#!/bin/bash

# Script pour déployer le contrat simple_insurance sur Sui

echo "🚀 Déploiement du contrat simple_insurance..."

# Vérifier si Sui CLI est installé
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI n'est pas installé. Installez-le d'abord :"
    echo "curl -fsSL https://get.sui.io/install | sh"
    exit 1
fi

# Vérifier si on est connecté à un réseau
echo "📡 Vérification de la connexion réseau..."
sui client active-address

if [ $? -ne 0 ]; then
    echo "❌ Aucune adresse active. Configurez d'abord votre wallet :"
    echo "sui client new-address ed25519"
    echo "sui client switch --address <VOTRE_ADRESSE>"
    exit 1
fi

# Déployer le contrat
echo "📦 Déploiement du contrat simple_insurance..."
sui client publish --gas-budget 100000000 sources/simple_insurance.move

if [ $? -eq 0 ]; then
    echo "✅ Contrat déployé avec succès !"
    echo "📋 Récupérez le Package ID depuis la sortie ci-dessus"
    echo "🔧 Mettez à jour le package ID dans app/services/sui-insurance-objects.ts"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi
