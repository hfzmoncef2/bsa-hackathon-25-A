# Script PowerShell pour vérifier les polices d'assurance créées

Write-Host "🔍 Vérification des polices d'assurance RainGuard..." -ForegroundColor Blue
Write-Host ""

# Vérifier les objets dans le wallet
Write-Host "📋 Objets dans votre wallet:" -ForegroundColor Yellow
sui client objects

Write-Host ""
Write-Host "🔍 Recherche spécifique des objets InsurancePolicy:" -ForegroundColor Yellow
sui client objects | findstr -i "InsurancePolicy"

Write-Host ""
Write-Host "🔍 Recherche spécifique des objets PolicyCap:" -ForegroundColor Yellow
sui client objects | findstr -i "PolicyCap"

Write-Host ""
Write-Host "📊 Statistiques:" -ForegroundColor Yellow
$objects = sui client objects
$totalObjects = ($objects | Select-String "objectId").Count
$insuranceObjects = ($objects | Select-String "InsurancePolicy").Count
$capObjects = ($objects | Select-String "PolicyCap").Count

Write-Host "Total d'objets: $totalObjects" -ForegroundColor White
Write-Host "Objets InsurancePolicy: $insuranceObjects" -ForegroundColor Green
Write-Host "Objets PolicyCap: $capObjects" -ForegroundColor Green

if ($insuranceObjects -gt 0) {
    Write-Host ""
    Write-Host "✅ SUCCÈS ! Des polices d'assurance ont été trouvées !" -ForegroundColor Green
    Write-Host "Vérifiez votre wallet Sui pour voir les objets." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Aucune police d'assurance trouvée." -ForegroundColor Red
    Write-Host "Créez une police depuis le frontend ou utilisez la commande:" -ForegroundColor Yellow
    Write-Host "sui client call --package 0xd28e4cf0eeaa232ceb08f293cc8d2f76ea719aa8b31a691fe11a9966b862b566 --module rainguard --function create_policy_entry --args 1000000000000 100000000000 365 1 10 b\"Maize\" b\"Farm_001\" 50000000000 --gas-budget 10000000" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🌐 Pour vérifier en ligne:" -ForegroundColor Blue
Write-Host "1. Ouvrez https://suiscan.xyz/devnet" -ForegroundColor White
Write-Host "2. Recherchez votre adresse: $(sui client active-address)" -ForegroundColor White
Write-Host "3. Verifiez la section 'Objects'" -ForegroundColor White
