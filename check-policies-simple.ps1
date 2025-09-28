# Script PowerShell pour verifier les polices d'assurance

Write-Host "Verification des polices d'assurance RainGuard..." -ForegroundColor Blue
Write-Host ""

# Verifier les objets dans le wallet
Write-Host "Objets dans votre wallet:" -ForegroundColor Yellow
sui client objects

Write-Host ""
Write-Host "Recherche des objets InsurancePolicy:" -ForegroundColor Yellow
sui client objects | findstr -i "InsurancePolicy"

Write-Host ""
Write-Host "Recherche des objets PolicyHolderCap:" -ForegroundColor Yellow
sui client objects | findstr -i "PolicyHolderCap"

Write-Host ""
Write-Host "Pour verifier en ligne:" -ForegroundColor Blue
Write-Host "1. Ouvrez https://suiscan.xyz/devnet" -ForegroundColor White
Write-Host "2. Recherchez votre adresse" -ForegroundColor White
Write-Host "3. Verifiez la section Objects" -ForegroundColor White
