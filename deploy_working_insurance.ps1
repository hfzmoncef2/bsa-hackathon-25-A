# Script PowerShell pour déployer et tester le contrat d'assurance qui fonctionne

Write-Host "🚀 Déploiement du contrat d'assurance RainGuard..." -ForegroundColor Green

# Variables
$PACKAGE_NAME = "working_insurance"
$CONTRACT_NAME = "rainguard::working_insurance"

# Déployer le contrat
Write-Host "📦 Déploiement du package..." -ForegroundColor Yellow
sui client publish --gas-budget 100000000

Write-Host "✅ Contrat déployé avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Instructions pour tester:" -ForegroundColor Cyan
Write-Host "1. Copiez l'Object ID du package déployé"
Write-Host "2. Utilisez la fonction create_simple_policy pour créer une police"
Write-Host "3. Vérifiez que l'objet InsurancePolicy apparaît dans votre wallet"
Write-Host ""
Write-Host "🔧 Commandes de test:" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Créer une police simple (remplacez PACKAGE_ID par l'ID du package):" -ForegroundColor White
Write-Host "sui client call --package PACKAGE_ID --module working_insurance --function create_simple_policy --args 1000000 100000 --gas-budget 10000000"
Write-Host ""
Write-Host "# Vérifier les objets dans votre wallet:" -ForegroundColor White
Write-Host "sui client objects"
Write-Host ""
Write-Host "🎯 Les objets InsurancePolicy et PolicyCap devraient maintenant apparaître dans votre wallet!" -ForegroundColor Green
