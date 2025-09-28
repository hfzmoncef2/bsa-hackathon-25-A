// Script de test pour vérifier que les objets apparaissent dans le wallet
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

// Configuration
const client = new SuiClient({ url: getFullnodeUrl('devnet') });
const PACKAGE_ID = '0xd28e4cf0eeaa232ceb08f293cc8d2f76ea719aa8b31a691fe11a9966b862b566';

// Fonction pour créer une police d'assurance simple
export async function testCreateInsurancePolicy(
  coverageAmount = 1000000000, // 1 SUI en MIST
  premiumAmount = 100000000,   // 0.1 SUI en MIST
  signer
) {
  console.log('🚀 Test de création d\'une police d\'assurance...');
  
  const txb = new TransactionBlock();
  
  // Appeler la fonction create_simple_policy du contrat working_insurance
  txb.moveCall({
    target: `${PACKAGE_ID}::working_insurance::create_simple_policy`,
    arguments: [
      txb.pure.u64(coverageAmount),
      txb.pure.u64(premiumAmount),
    ],
  });

  try {
    // Exécuter la transaction
    const result = await client.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      signer,
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
        console.log(`  ${index + 1}. Type: ${obj.objectType}`);
        console.log(`     ID: ${obj.objectId}`);
        console.log(`     Owner: ${obj.owner}`);
        console.log('');
      });
      
      // Vérifier spécifiquement les objets InsurancePolicy et PolicyCap
      const insurancePolicy = createdObjects.find(obj => 
        obj.objectType?.includes('InsurancePolicy')
      );
      const policyCap = createdObjects.find(obj => 
        obj.objectType?.includes('PolicyCap')
      );
      
      if (insurancePolicy) {
        console.log('✅ Objet InsurancePolicy trouvé! Il devrait apparaître dans votre wallet.');
        console.log(`   ID: ${insurancePolicy.objectId}`);
      } else {
        console.log('❌ Aucun objet InsurancePolicy trouvé');
      }
      
      if (policyCap) {
        console.log('✅ Objet PolicyCap trouvé! Il devrait apparaître dans votre wallet.');
        console.log(`   ID: ${policyCap.objectId}`);
      } else {
        console.log('❌ Aucun objet PolicyCap trouvé');
      }
      
    } else {
      console.log('❌ Aucun objet créé trouvé');
    }

    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    throw error;
  }
}

// Fonction pour vérifier les objets dans le wallet
export async function checkWalletObjects(userAddress) {
  console.log(`🔍 Vérification des objets dans le wallet de ${userAddress}...`);
  
  try {
    const objects = await client.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: `${PACKAGE_ID}::working_insurance::InsurancePolicy`,
      },
      options: {
        showContent: true,
      },
    });

    console.log(`📊 Trouvé ${objects.data.length} objets InsurancePolicy dans le wallet`);
    
    objects.data.forEach((obj, index) => {
      console.log(`  ${index + 1}. ID: ${obj.data?.objectId}`);
      if (obj.data?.content && 'fields' in obj.data.content) {
        const fields = obj.data.content.fields;
        console.log(`     Policy ID: ${fields.policy_id}`);
        console.log(`     Policyholder: ${fields.policyholder}`);
        console.log(`     Coverage: ${fields.coverage_amount} MIST`);
        console.log(`     Premium: ${fields.premium_amount} MIST`);
        console.log(`     Status: ${fields.status}`);
        console.log('');
      }
    });

    return objects.data;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du wallet:', error);
    throw error;
  }
}

// Exemple d'utilisation
export async function runTest() {
  // Créer une clé pour les tests (en production, utilisez une vraie clé)
  const keypair = Ed25519Keypair.deriveKeypair('test-secret-phrase-for-wallet-display-test');
  const userAddress = keypair.getPublicKey().toSuiAddress();
  
  console.log(`👤 Adresse de test: ${userAddress}`);
  console.log('');
  
  try {
    // 1. Créer une police d'assurance
    await testCreateInsurancePolicy(1000000000, 100000000, keypair);
    
    console.log('');
    console.log('⏳ Attente de 3 secondes pour que la transaction soit confirmée...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 2. Vérifier les objets dans le wallet
    await checkWalletObjects(userAddress);
    
    console.log('');
    console.log('🎉 Test terminé! Vérifiez votre wallet Sui pour voir les objets.');
    
  } catch (error) {
    console.error('❌ Test échoué:', error);
  }
}

// Exporter pour utilisation dans le navigateur
if (typeof window !== 'undefined') {
  window.testWalletDisplay = {
    testCreateInsurancePolicy,
    checkWalletObjects,
    runTest
  };
}

