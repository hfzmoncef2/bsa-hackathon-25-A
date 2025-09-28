// Service alternatif pour créer des objets d'assurance simples
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

export interface SimpleInsuranceObject {
  objectId: string;
  coverageAmount: number;
  premiumAmount: number;
  riskType: number;
  status: number;
  createdAt: number;
}

export class SuiSimpleObjectsService {
  /**
   * Créer un objet d'assurance simple en utilisant les objets Sui natifs
   */
  async createSimpleInsuranceObject(
    coverageAmount: number,
    premiumAmount: number,
    riskType: number,
    signAndExecute: any,
    currentAccount: any
  ): Promise<SimpleInsuranceObject> {
    if (!currentAccount) {
      throw new Error('Wallet non connecté');
    }

    console.log("🚀 Création d'un objet d'assurance simple...");
    console.log("📊 Données:", { coverageAmount, premiumAmount, riskType });

    const tx = new Transaction();
    
    // Créer un objet simple avec des métadonnées
    // Utiliser les objets Sui natifs au lieu d'un contrat externe
    const objectData = {
      coverage_amount: coverageAmount,
      premium_amount: premiumAmount,
      risk_type: riskType,
      status: 1, // Actif
      created_at: Date.now(),
      owner: currentAccount.address
    };

    // Créer un objet avec des métadonnées personnalisées
    const objectId = tx.moveCall({
      target: '0x2::object::new',
      arguments: [
        tx.pure.string(JSON.stringify(objectData))
      ],
    });

    console.log("📦 Objet créé avec ID:", objectId);

    try {
      const result = await signAndExecute({
        transaction: tx,
      });

      console.log("✅ Transaction réussie!");
      console.log("📋 Résultat:", result);

      // Simuler la création d'un objet d'assurance
      const simulatedObject: SimpleInsuranceObject = {
        objectId: result.digest || `obj_${Date.now()}`,
        coverageAmount,
        premiumAmount,
        riskType,
        status: 1,
        createdAt: Date.now()
      };

      // Stocker dans localStorage pour simulation
      localStorage.setItem('simpleInsuranceObject', JSON.stringify(simulatedObject));
      localStorage.setItem('insurancePolicyId', simulatedObject.objectId);

      console.log("💾 Objet stocké:", simulatedObject);

      return simulatedObject;

    } catch (error) {
      console.error("❌ Erreur lors de la création:", error);
      throw error;
    }
  }

  /**
   * Récupérer les objets d'assurance simples
   */
  getSimpleInsuranceObjects(): SimpleInsuranceObject[] {
    try {
      const stored = localStorage.getItem('simpleInsuranceObject');
      return stored ? [JSON.parse(stored)] : [];
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      return [];
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
export const suiSimpleObjectsService = new SuiSimpleObjectsService();
