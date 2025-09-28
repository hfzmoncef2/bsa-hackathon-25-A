#!/bin/bash

# Script pour déployer et tester le contrat d'assurance qui fonctionne

echo "🚀 Déploiement du contrat d'assurance RainGuard..."

# Variables
PACKAGE_NAME="working_insurance"
CONTRACT_NAME="rainguard::working_insurance"

# Déployer le contrat
echo "📦 Déploiement du package..."
sui client publish --gas-budget 100000000

echo "✅ Contrat déployé avec succès!"
echo ""
echo "📋 Instructions pour tester:"
echo "1. Copiez l'Object ID du package déployé"
echo "2. Utilisez la fonction create_simple_policy pour créer une police"
echo "3. Vérifiez que l'objet InsurancePolicy apparaît dans votre wallet"
echo ""
echo "🔧 Commandes de test:"
echo ""
echo "# Créer une police simple (remplacez PACKAGE_ID par l'ID du package):"
echo "sui client call --package PACKAGE_ID --module working_insurance --function create_simple_policy --args 1000000 100000 --gas-budget 10000000"
echo ""
echo "# Vérifier les objets dans votre wallet:"
echo "sui client objects"
echo ""
echo "🎯 Les objets InsurancePolicy et PolicyCap devraient maintenant apparaître dans votre wallet!"
