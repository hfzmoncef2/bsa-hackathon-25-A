// Service pour interagir avec le contrat RainGuard sur Sui
export class SuiContractService {
  private packageId = '0xbc0e271b66dad1f15403e75f6ddb58d38a6ae35684297e804508779c27fac329';
  private insurancePoolId = '0xae90aa41283e0b0eef57835a4442cb77a0dc5ed7c1bf78cf587e38b5283087c9';

  /**
   * Crée une nouvelle police d'assurance
   */
  async createInsurancePolicy(fieldData: any, premium: number) {
    try {
      // Simulation de l'appel au contrat Sui
      // Dans une vraie implémentation, vous utiliseriez @mysten/dapp-kit
      
      const policyData = {
        policyholder: fieldData.policyholder || '0xd342a0554cd59f74fa94ae34e8c6d8b5a3e63d1da60a4c393dbd84b8d21a32ee',
        coverage_amount: parseInt(fieldData.coverageAmount),
        premium_amount: premium,
        coverage_period_days: 365, // 1 an
        risk_types: this.mapRiskTypes(fieldData.selectedRisks),
        land_area_hectares: parseFloat(fieldData.totalArea),
        crop_type: this.stringToVector(fieldData.cropType),
        location: this.stringToVector(fieldData.location),
        deductible: parseInt(fieldData.deductible) || 5000,
        weather_thresholds: this.getWeatherThresholds(fieldData.selectedRisks),
        threshold_values: this.getThresholdValues(fieldData.selectedRisks)
      };

      console.log('Création du contrat avec les données:', policyData);
      
      // Simulation de l'appel au contrat
      const result = await this.simulateContractCall('create_policy', [
        policyData.policyholder,
        policyData.coverage_amount,
        policyData.premium_amount,
        policyData.coverage_period_days,
        ...policyData.risk_types,
        policyData.land_area_hectares,
        policyData.crop_type,
        policyData.location,
        policyData.deductible,
        policyData.weather_thresholds,
        policyData.threshold_values,
        this.insurancePoolId
      ]);

      console.log(result.contractAddress)

      return {
        success: true,
        policyId: result.policyId,
        contractAddress: result.contractAddress,
        transactionHash: result.transactionHash
      };
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
      throw new Error('Impossible de créer le contrat d\'assurance');
    }
  }

  /**
   * Récupère les statistiques du pool d'assurance
   */
  async getPoolStats() {
    try {
      // Simulation de l'appel au contrat
      const result = await this.simulateContractCall('get_pool_stats', [this.insurancePoolId]);
      
      return {
        totalPremiums: result.totalPremiums,
        totalPayouts: result.totalPayouts,
        availableFunds: result.availableFunds,
        activePolicies: result.activePolicies,
        totalClaims: result.totalClaims
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw new Error('Impossible de récupérer les statistiques du pool');
    }
  }

  /**
   * Soumet une réclamation
   */
  async submitClaim(policyId: string, claimData: any) {
    try {
      const result = await this.simulateContractCall('submit_claim', [
        policyId,
        claimData.claimAmount,
        claimData.weatherData,
        claimData.weatherValues,
        claimData.damageAssessment,
        this.insurancePoolId
      ]);

      return {
        success: true,
        claimId: result.claimId,
        transactionHash: result.transactionHash
      };
    } catch (error) {
      console.error('Erreur lors de la soumission de la réclamation:', error);
      throw new Error('Impossible de soumettre la réclamation');
    }
  }

  /**
   * Mappe les types de risques vers les constantes du contrat
   */
  private mapRiskTypes(selectedRisks: string[]): number[] {
    const riskMapping: { [key: string]: number } = {
      'drought': 1,
      'flood': 2,
      'hail': 3,
      'storm': 4,
      'frost': 5
    };

    return selectedRisks.map(risk => riskMapping[risk] || 0);
  }

  /**
   * Convertit une chaîne en vector<u8>
   */
  private stringToVector(str: string): number[] {
    return Array.from(new TextEncoder().encode(str));
  }

  /**
   * Obtient les seuils météo pour les risques sélectionnés
   */
  private getWeatherThresholds(selectedRisks: string[]): number[] {
    const thresholds: { [key: string]: number } = {
      'drought': 1, // 1 = sécheresse
      'flood': 2,   // 2 = inondation
      'hail': 3,    // 3 = grêle
      'storm': 4,   // 4 = tempête
      'frost': 5    // 5 = gel
    };

    return selectedRisks.map(risk => thresholds[risk] || 0);
  }

  /**
   * Obtient les valeurs de seuil pour les risques sélectionnés
   */
  private getThresholdValues(selectedRisks: string[]): number[] {
    const values: { [key: string]: number } = {
      'drought': 50,  // 50mm de pluie sur 30 jours
      'flood': 100,   // 100mm de pluie sur 24h
      'hail': 25,     // 25mm de grêle
      'storm': 60,    // 60km/h de vent
      'frost': 2      // 2°C de température
    };

    return selectedRisks.map(risk => values[risk] || 0);
  }

  /**
   * Simule un appel au contrat Sui
   * Dans une vraie implémentation, ceci utiliserait @mysten/dapp-kit
   */
  private async simulateContractCall(functionName: string, args: any[]): Promise<any> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulation des résultats selon la fonction appelée
    switch (functionName) {
      case 'create_policy':
        return {
          policyId: `POL-${Date.now()}`,
          contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
        };
      
      case 'get_pool_stats':
        return {
          totalPremiums: 1500000,
          totalPayouts: 450000,
          availableFunds: 1050000,
          activePolicies: 125,
          totalClaims: 23
        };
      
      case 'submit_claim':
        return {
          claimId: `CLM-${Date.now()}`,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
        };
      
      default:
        throw new Error(`Fonction ${functionName} non supportée`);
    }
  }
}

// Instance singleton du service
export const suiContractService = new SuiContractService();
