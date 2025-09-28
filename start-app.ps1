# Script pour démarrer l'application et tester la création de police

Write-Host "🚀 Démarrage de l'application RainGuard..." -ForegroundColor Green

# Installer les dépendances si nécessaire
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Démarrer l'application
Write-Host "🌐 Démarrage du serveur de développement..." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ L'application sera disponible sur: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Instructions pour tester:" -ForegroundColor Cyan
Write-Host "1. Ouvrez http://localhost:3000 dans votre navigateur"
Write-Host "2. Connectez votre wallet Sui"
Write-Host "3. Utilisez la section 'Test Rapide' sur la page d'accueil"
Write-Host "4. Créez une police d'assurance"
Write-Host "5. Vérifiez que les objets apparaissent dans votre wallet !"
Write-Host ""
Write-Host "🔧 PACKAGE_ID utilisé: 0xd28e4cf0eeaa232ceb08f293cc8d2f76ea719aa8b31a691fe11a9966b862b566" -ForegroundColor Yellow
Write-Host ""

npm run dev
