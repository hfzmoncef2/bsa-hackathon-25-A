// Service de démonstration pour créer des objets d'assurance (sans blockchain)
export interface DemoInsuranceObject {
  objectId: string;
  coverageAmount: number;
  premiumAmount: number;
  riskType: number;
  status: number;
  createdAt: number;
}

export class DemoInsuranceObjectsService {
  /**
   * Créer un objet d'assurance de démonstration (stockage local uniquement)
   */
  async createDemoInsuranceObject(
    coverageAmount: number,
    premiumAmount: number,
    riskType: number
  ): Promise<DemoInsuranceObject> {
    console.log("🚀 Création d'un objet d'assurance de démonstration...");
    console.log("📊 Données:", { coverageAmount, premiumAmount, riskType });

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Créer un objet de démonstration
    const demoObject: DemoInsuranceObject = {
      objectId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      coverageAmount,
      premiumAmount,
      riskType,
      status: 1, // Actif
      createdAt: Date.now()
    };

    console.log("✅ Objet de démonstration créé:", demoObject);

    // Stocker dans localStorage pour simulation
    localStorage.setItem('demoInsuranceObject', JSON.stringify(demoObject));
    localStorage.setItem('insurancePolicyId', demoObject.objectId);

    console.log("💾 Objet stocké localement:", demoObject);

    return demoObject;
  }

  /**
   * Récupérer les objets d'assurance de démonstration
   */
  getDemoInsuranceObjects(): DemoInsuranceObject[] {
    try {
      const stored = localStorage.getItem('demoInsuranceObject');
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
export const demoInsuranceObjectsService = new DemoInsuranceObjectsService();
