# SCRIPT ULTRA-SIMPLE - PAS D'ERREURS
Write-Host "🚀 SCRIPT SIMPLE" -ForegroundColor Green

# Étape 1: Vérifier Sui
Write-Host "1. Vérification de Sui..." -ForegroundColor Yellow
try {
    sui --version
    Write-Host "✅ Sui installé" -ForegroundColor Green
} catch {
    Write-Host "❌ Sui pas installé!" -ForegroundColor Red
    Write-Host "Installez Sui d'abord: https://docs.sui.io/build/install" -ForegroundColor Red
    exit 1
}

# Étape 2: Build
Write-Host "2. Construction..." -ForegroundColor Yellow
sui move build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur de build" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build OK" -ForegroundColor Green

# Étape 3: Deploy
Write-Host "3. Déploiement..." -ForegroundColor Yellow
$result = sui client publish --gas-budget 100000000
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur de déploiement" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Déploiement OK" -ForegroundColor Green

# Étape 4: Extraire Package ID
Write-Host "4. Extraction Package ID..." -ForegroundColor Yellow
$packageId = ($result | Select-String "0x[a-f0-9]{64}").Matches[0].Value
Write-Host "📦 Package ID: $packageId" -ForegroundColor Cyan

# Étape 5: Sauvegarder
$packageId | Out-File -FilePath "package_id.txt" -Encoding UTF8
Write-Host "💾 Package ID sauvegardé" -ForegroundColor Green

Write-Host "🎉 TERMINÉ! Package ID: $packageId" -ForegroundColor Green
Write-Host "Maintenant testez avec votre frontend!" -ForegroundColor Yellow

