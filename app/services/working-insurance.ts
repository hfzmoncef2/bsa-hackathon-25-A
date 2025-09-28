// Script pour interagir avec le contrat d'assurance qui fonctionne
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';

// Configuration
const client = new SuiClient({ url: getFullnodeUrl('devnet') });
const PACKAGE_ID = 'YOUR_PACKAGE_ID_HERE'; // Remplacez par l'ID de votre package déployé

// Fonction pour créer une police d'assurance simple
export async function createSimpleInsurancePolicy(
  coverageAmount: number,
  premiumAmount: number,
  signer: Ed25519Keypair
) {
  const txb = new TransactionBlock();
  
  // Appeler la fonction create_simple_policy
  txb.moveCall({
    target: `${PACKAGE_ID}::working_insurance::create_simple_policy`,
    arguments: [
      txb.pure.u64(coverageAmount),
      txb.pure.u64(premiumAmount),
      // Le pool sera automatiquement trouvé car il est partagé
    ],
  });

  // Exécuter la transaction
  const result = await client.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    signer,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  console.log('✅ Police d\'assurance créée avec succès!');
  console.log('Transaction:', result.digest);
  
  // Trouver les nouveaux objets créés
  const createdObjects = result.objectChanges?.filter(
    (change) => change.type === 'created'
  );

  if (createdObjects) {
    console.log('📋 Objets créés:');
    createdObjects.forEach((obj: any) => {
      console.log(`- ${obj.objectType}: ${obj.objectId}`);
    });
  }

  return result;
}

// Fonction pour créer une police d'assurance complète
export async function createFullInsurancePolicy(
  coverageAmount: number,
  premiumAmount: number,
  coveragePeriodDays: number,
  riskType: number,
  landAreaHectares: number,
  cropType: string,
  location: string,
  deductible: number,
  signer: Ed25519Keypair
) {
  const txb = new TransactionBlock();
  
  txb.moveCall({
    target: `${PACKAGE_ID}::working_insurance::create_policy_entry`,
    arguments: [
      txb.pure.u64(coverageAmount),
      txb.pure.u64(premiumAmount),
      txb.pure.u64(coveragePeriodDays),
      txb.pure.u8(riskType),
      txb.pure.u64(landAreaHectares),
      txb.pure.string(cropType),
      txb.pure.string(location),
      txb.pure.u64(deductible),
    ],
  });

  const result = await client.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    signer,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  console.log('✅ Police d\'assurance complète créée!');
  return result;
}

// Fonction pour soumettre une réclamation
export async function submitClaim(
  policyId: string,
  claimAmount: number,
  signer: Ed25519Keypair
) {
  const txb = new TransactionBlock();
  
  txb.moveCall({
    target: `${PACKAGE_ID}::working_insurance::submit_claim`,
    arguments: [
      txb.object(policyId),
      txb.pure.u64(claimAmount),
    ],
  });

  const result = await client.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    signer,
    options: {
      showEffects: true,
    },
  });

  console.log('✅ Réclamation soumise!');
  return result;
}

// Fonction pour obtenir les détails d'une police
export async function getPolicyDetails(policyId: string) {
  const policy = await client.getObject({
    id: policyId,
    options: {
      showContent: true,
    },
  });

  if (policy.data?.content && 'fields' in policy.data.content) {
    const fields = policy.data.content.fields as any;
    return {
      policyId: fields.policy_id,
      policyholder: fields.policyholder,
      coverageAmount: fields.coverage_amount,
      premiumAmount: fields.premium_amount,
      startDate: fields.start_date,
      endDate: fields.end_date,
      riskType: fields.risk_type,
      status: fields.status,
      cropType: fields.crop_type,
      location: fields.location,
    };
  }

  return null;
}

// Fonction pour lister toutes les polices d'un utilisateur
export async function getUserInsurancePolicies(userAddress: string) {
  const objects = await client.getOwnedObjects({
    owner: userAddress,
    filter: {
      StructType: `${PACKAGE_ID}::working_insurance::InsurancePolicy`,
    },
    options: {
      showContent: true,
    },
  });

  return objects.data.map((obj) => ({
    objectId: obj.data?.objectId,
    details: obj.data?.content && 'fields' in obj.data.content 
      ? obj.data.content.fields as any 
      : null,
  }));
}

// Exemple d'utilisation
export async function example() {
  // Créer une clé pour les tests (en production, utilisez une vraie clé)
  const keypair = Ed25519Keypair.deriveKeypair('your-secret-phrase-here');
  
  try {
    // Créer une police simple
    const result = await createSimpleInsurancePolicy(
      1000000, // 1M de couverture
      100000,  // 100K de prime
      keypair
    );
    
    console.log('🎉 Police créée! Vérifiez votre wallet pour voir l\'objet InsurancePolicy');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Constantes pour les types de risque
export const RISK_TYPES = {
  DROUGHT: 1,
  FLOOD: 2,
  HAIL: 3,
  EXCESSIVE_RAIN: 4,
  FROST: 5,
};

// Constantes pour les statuts
export const POLICY_STATUS = {
  ACTIVE: 1,
  CANCELLED: 2,
  EXPIRED: 3,
  CLAIMED: 4,
};
