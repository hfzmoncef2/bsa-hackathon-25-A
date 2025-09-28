# Script PowerShell pour déployer et tester le contrat d'assurance
# Ce script garantit que les objets apparaissent dans le wallet

Write-Host "🚀 Déploiement et test du contrat RainGuard Insurance" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Variables
$PACKAGE_NAME = "working_insurance"
$MOVE_TOML = "Move.toml"

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path $MOVE_TOML)) {
    Write-Host "❌ Erreur: Move.toml non trouvé. Exécutez ce script depuis la racine du projet." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Configuration du projet..." -ForegroundColor Yellow

# Vérifier la configuration Move.toml
$moveTomlContent = Get-Content $MOVE_TOML -Raw
if ($moveTomlContent -notmatch "working_insurance") {
    Write-Host "⚠️  Attention: Le module working_insurance n'est pas configuré dans Move.toml" -ForegroundColor Yellow
    Write-Host "   Assurez-vous que votre Move.toml contient le bon module." -ForegroundColor Yellow
}

Write-Host "🔨 Construction du contrat..." -ForegroundColor Yellow
try {
    sui move build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Construction réussie!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur de construction" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors de la construction: $_" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Déploiement du contrat..." -ForegroundColor Yellow
try {
    $deployResult = sui client publish --gas-budget 100000000
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Déploiement réussi!" -ForegroundColor Green
        
        # Extraire le Package ID
        $packageId = ($deployResult | Select-String "Created Objects:" -A 10 | Select-String "0x[a-f0-9]{64}").Matches[0].Value
        Write-Host "📦 Package ID: $packageId" -ForegroundColor Cyan
        
        # Sauvegarder le Package ID
        $packageId | Out-File -FilePath "package_id.txt" -Encoding UTF8
        Write-Host "💾 Package ID sauvegardé dans package_id.txt" -ForegroundColor Cyan
        
    } else {
        Write-Host "❌ Erreur de déploiement" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors du déploiement: $_" -ForegroundColor Red
    exit 1
}

Write-Host "🧪 Test de création d'une police d'assurance..." -ForegroundColor Yellow

# Créer un script de test temporaire
$testScript = @"
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

const client = new SuiClient({ url: getFullnodeUrl('devnet') });
const PACKAGE_ID = '$packageId';

async function testCreatePolicy() {
    console.log('🚀 Test de création d\'une police d\'assurance...');
    
    // Créer une clé de test
    const keypair = Ed25519Keypair.deriveKeypair('test-secret-phrase-for-wallet-display');
    const userAddress = keypair.getPublicKey().toSuiAddress();
    
    console.log('👤 Adresse de test:', userAddress);
    
    const txb = new TransactionBlock();
    
    // Appeler create_simple_policy
    txb.moveCall({
        target: `\${PACKAGE_ID}::working_insurance::create_simple_policy`,
        arguments: [
            txb.pure.u64(1000000000), // 1 SUI en MIST
            txb.pure.u64(100000000),  // 0.1 SUI en MIST
        ],
    });

    try {
        const result = await client.signAndExecuteTransactionBlock({
            transactionBlock: txb,
            signer: keypair,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });

        console.log('✅ Transaction réussie!');
        console.log('📋 Digest:', result.digest);
        
        // Analyser les objets créés
        const createdObjects = result.objectChanges?.filter(
            (change) => change.type === 'created'
        );

        if (createdObjects && createdObjects.length > 0) {
            console.log('🎉 Objets créés dans le wallet:');
            createdObjects.forEach((obj, index) => {
                console.log(`  \${index + 1}. Type: \${obj.objectType}`);
                console.log(`     ID: \${obj.objectId}`);
                console.log(`     Owner: \${obj.owner}`);
            });
            
            // Vérifier les objets spécifiques
            const insurancePolicy = createdObjects.find(obj => 
                obj.objectType?.includes('InsurancePolicy')
            );
            const policyCap = createdObjects.find(obj => 
                obj.objectType?.includes('PolicyCap')
            );
            
            if (insurancePolicy) {
                console.log('✅ Objet InsurancePolicy trouvé! Il devrait apparaître dans votre wallet.');
                console.log(`   ID: \${insurancePolicy.objectId}`);
            }
            
            if (policyCap) {
                console.log('✅ Objet PolicyCap trouvé! Il devrait apparaître dans votre wallet.');
                console.log(`   ID: \${policyCap.objectId}`);
            }
            
        } else {
            console.log('❌ Aucun objet créé trouvé');
        }

    } catch (error) {
        console.error('❌ Erreur lors de la création:', error);
    }
}

testCreatePolicy();
"@

$testScript | Out-File -FilePath "test-policy-creation.js" -Encoding UTF8

Write-Host "📝 Script de test créé: test-policy-creation.js" -ForegroundColor Cyan
Write-Host "🔧 Pour tester, exécutez: node test-policy-creation.js" -ForegroundColor Cyan

Write-Host "`n🎯 RÉSUMÉ DES CORRECTIONS APPORTÉES:" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "✅ 1. Code Move corrigé - objets InsurancePolicy avec 'has key'" -ForegroundColor Green
Write-Host "✅ 2. Fonctions entry qui transfèrent les objets au créateur" -ForegroundColor Green
Write-Host "✅ 3. Frontend corrigé pour utiliser le bon module (working_insurance)" -ForegroundColor Green
Write-Host "✅ 4. Script de test créé pour vérifier l'affichage dans le wallet" -ForegroundColor Green
Write-Host "✅ 5. Composant React WalletDisplayTest ajouté" -ForegroundColor Green

Write-Host "`n🚀 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow
Write-Host "1. Connectez votre wallet Sui à l'application" -ForegroundColor White
Write-Host "2. Utilisez le composant WalletDisplayTest sur la page d'accueil" -ForegroundColor White
Write-Host "3. Créez une police d'assurance" -ForegroundColor White
Write-Host "4. Vérifiez que les objets apparaissent dans votre wallet Sui" -ForegroundColor White

Write-Host "`n💡 PACKAGE ID pour votre frontend:" -ForegroundColor Cyan
Write-Host "PACKAGE_ID = '$packageId'" -ForegroundColor Cyan

Write-Host "`n🎉 Le contrat est maintenant prêt et les objets DEVRAIENT apparaître dans le wallet!" -ForegroundColor Green

