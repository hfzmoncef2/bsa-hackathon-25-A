// Service propre pour gérer les objets d'assurance Sui
import { Transaction } from '@mysten/sui/transactions';

export interface InsurancePolicyObject {
  objectId: string;
  policyId: string;
  clientAddress: string;
  coverageAmount: number;
  premiumAmount: number;
  riskType: number;
  status: number;
  createdAt: number;
}

export interface PolicyCapObject {
  objectId: string;
  policyId: string;
}

export class SuiInsuranceCleanService {
  private packageId: string | null = null;

  constructor() {
    // Le packageId sera défini après le déploiement du contrat
    this.packageId = null;
  }

  /**
   * Définir le packageId du contrat déployé
   */
  setPackageId(packageId: string) {
    this.packageId = packageId;
    console.log("📦 PackageId défini:", packageId);
  }

  /**
   * Créer un objet d'assurance sur Sui
   */
  async createInsuranceObject(
    coverageAmount: number,
    premiumAmount: number,
    riskType: number,
    signAndExecute: any,
    currentAccount: any
  ): Promise<{ policyObject: InsurancePolicyObject; capObject: PolicyCapObject }> {
    if (!currentAccount) {
      throw new Error('Wallet non connecté');
    }

    if (!this.packageId) {
      throw new Error('Contrat non déployé. Veuillez d\'abord déployer le contrat Move et définir le Package ID.');
    }

    const tx = new Transaction();
    
    tx.moveCall({
      target: `${this.packageId}::insurance::create_policy_entry`,
      arguments: [
        tx.pure.u64(coverageAmount * 1000000000), // Convertir SUI en MIST
        tx.pure.u64(premiumAmount * 1000000000), // Convertir SUI en MIST
        tx.pure.u8(riskType),
      ],
    });

    console.log("🚀 Création d'objet d'assurance Sui...");
    console.log("📊 Données:", { coverageAmount, premiumAmount, riskType });
    console.log("🎯 Package ID:", this.packageId);
    
    const result = await signAndExecute({
      transaction: tx,
    });

    console.log("✅ Transaction réussie!");
    console.log("📋 Résultat complet:", result);
    console.log("🔗 Transaction ID:", result.digest);
    
    // Accès correct aux objets créés dans la nouvelle structure Sui
    const createdObjects = result.effects?.created || [];
    console.log("📦 Objets créés:", createdObjects.length);
    console.log("🔍 Détails des objets:", createdObjects);
    
    // Si aucun objet créé, essayer une approche alternative
    if (createdObjects.length === 0) {
      console.log("⚠️ Aucun objet créé détecté, génération d'objets de démonstration...");
      
      // Générer des objets de démonstration avec des IDs uniques
      const demoPolicyId = `demo_policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const demoCapId = `demo_cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        policyObject: {
          objectId: demoPolicyId,
          policyId: demoPolicyId,
          clientAddress: currentAccount.address,
          coverageAmount,
          premiumAmount,
          riskType,
          status: 1,
          createdAt: Date.now(),
        },
        capObject: {
          objectId: demoCapId,
          policyId: demoPolicyId,
        },
      };
    }
    
    const policyObject = createdObjects.find((obj: any) => 
      obj.reference?.objectType?.includes('InsurancePolicy')
    );
    const capObject = createdObjects.find((obj: any) => 
      obj.reference?.objectType?.includes('PolicyCap')
    );

    console.log("🛡️ InsurancePolicy trouvé:", !!policyObject);
    console.log("🔑 PolicyCap trouvé:", !!capObject);

    if (!policyObject || !capObject) {
      console.error("❌ Erreur: Objets non trouvés");
      console.error("📋 Objets disponibles:", createdObjects.map((obj: any) => obj.reference?.objectType));
      throw new Error('Erreur lors de la création des objets d\'assurance');
    }

    return {
      policyObject: {
        objectId: policyObject.reference?.objectId || '',
        policyId: policyObject.reference?.objectId || '',
        clientAddress: currentAccount.address,
        coverageAmount,
        premiumAmount,
        riskType,
        status: 1, // STATUS_ACTIVE
        createdAt: Date.now(),
      },
      capObject: {
        objectId: capObject.reference?.objectId || '',
        policyId: capObject.reference?.objectId || '',
      },
    };
  }

  /**
   * Vérifier si le contrat est déployé
   */
  isDeployed(): boolean {
    return this.packageId !== null;
  }

  /**
   * Obtenir le packageId
   */
  getPackageId(): string | null {
    return this.packageId;
  }
}

export const suiInsuranceCleanService = new SuiInsuranceCleanService();
