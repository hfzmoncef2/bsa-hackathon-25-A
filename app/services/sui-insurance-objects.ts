// Service pour gérer les objets d'assurance dans le wallet Sui
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
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

export class SuiInsuranceObjectsService {
  private packageId = '0xd28e4cf0eeaa232ceb08f293cc8d2f76ea719aa8b31a691fe11a9966b862b566'; // Package ID du contrat simple_insurance

  /**
   * Créer un nouvel objet d'assurance dans le wallet Sui
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

    const tx = new Transaction();
    
    // Appeler la fonction create_policy_entry du contrat simple_insurance
    tx.moveCall({
      target: `${this.packageId}::simple_insurance::create_policy_entry`,
      arguments: [
        tx.pure.u64(coverageAmount * 1000000000), // Convertir SUI en MIST
        tx.pure.u64(premiumAmount * 1000000000), // Convertir SUI en MIST
        tx.pure.u8(riskType),
      ],
    });

    // Exécuter la transaction
    console.log("🚀 Début de création d'objet d'assurance...");
    console.log("📊 Données:", { coverageAmount, premiumAmount, riskType });
    console.log("🎯 Package ID:", this.packageId);
    
    const result = await signAndExecute({
      transaction: tx,
    });

    console.log("✅ Transaction réussie!");
    console.log("📋 Résultat complet:", result);
    console.log("🔗 Transaction ID:", result.digest);
    
    // Extraire les objets créés
    const createdObjects = (result.effects as any)?.created || [];
    console.log("📦 Objets créés:", createdObjects.length);
    console.log("🔍 Détails des objets:", createdObjects);
    
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
      }
    };
  }

  /**
   * Récupérer les objets d'assurance du wallet
   */
  async getInsuranceObjects(
    suiClient: any,
    currentAccount: any
  ): Promise<InsurancePolicyObject[]> {
    if (!currentAccount) {
      return [];
    }

    try {
      // Récupérer tous les objets du wallet
      const objects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${this.packageId}::simple_insurance::InsurancePolicy`
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return objects.data.map((obj: any) => ({
        objectId: obj.data?.objectId || '',
        policyId: obj.data?.objectId || '',
        clientAddress: obj.data?.content?.fields?.client_address || '',
        coverageAmount: parseInt(obj.data?.content?.fields?.coverage_amount || '0') / 1000000000, // Convertir MIST en SUI
        premiumAmount: parseInt(obj.data?.content?.fields?.premium_amount || '0') / 1000000000,
        riskType: parseInt(obj.data?.content?.fields?.risk_type || '0'),
        status: parseInt(obj.data?.content?.fields?.status || '0'),
        createdAt: parseInt(obj.data?.content?.fields?.created_at || '0'),
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des objets:', error);
      return [];
    }
  }

  /**
   * Récupérer les capabilities d'assurance du wallet
   */
  async getPolicyCapabilities(
    suiClient: any,
    currentAccount: any
  ): Promise<PolicyCapObject[]> {
    if (!currentAccount) {
      return [];
    }

    try {
      const objects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${this.packageId}::simple_insurance::PolicyCap`
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return objects.data.map((obj: any) => ({
        objectId: obj.data?.objectId || '',
        policyId: obj.data?.content?.fields?.policy_id || '',
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des capabilities:', error);
      return [];
    }
  }

  /**
   * Obtenir les détails d'un objet d'assurance spécifique
   */
  async getInsuranceObjectDetails(
    suiClient: any,
    objectId: string
  ): Promise<InsurancePolicyObject | null> {
    try {
      const object = await suiClient.getObject({
        id: objectId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (!object.data?.content) {
        return null;
      }

      const fields = object.data.content.fields;
      return {
        objectId: object.data.objectId,
        policyId: object.data.objectId,
        clientAddress: fields.client_address || '',
        coverageAmount: parseInt(fields.coverage_amount || '0') / 1000000000,
        premiumAmount: parseInt(fields.premium_amount || '0') / 1000000000,
        riskType: parseInt(fields.risk_type || '0'),
        status: parseInt(fields.status || '0'),
        createdAt: parseInt(fields.created_at || '0'),
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      return null;
    }
  }

  /**
   * Mapper les types de risque
   */
  getRiskTypeLabel(riskType: number): string {
    switch (riskType) {
      case 1: return 'Sécheresse';
      case 2: return 'Inondation';
      case 3: return 'Tempête';
      default: return 'Inconnu';
    }
  }

  /**
   * Mapper les statuts
   */
  getStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'Actif';
      case 2: return 'Expiré';
      case 3: return 'Réclamé';
      default: return 'Inconnu';
    }
  }
}

// Instance singleton du service
export const suiInsuranceObjectsService = new SuiInsuranceObjectsService();
