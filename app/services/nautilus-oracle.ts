// Service d'intégration avec l'oracle Nautilus TEE pour RainGuard
export class NautilusOracleService {
  private nautilusEndpoint: string;
  private apiKey: string;
  private quorumThreshold: number;

  constructor(config: {
    nautilusEndpoint: string;
    apiKey: string;
    quorumThreshold?: number;
  }) {
    this.nautilusEndpoint = config.nautilusEndpoint;
    this.apiKey = config.apiKey;
    this.quorumThreshold = config.quorumThreshold || 3;
  }

  /**
   * Récupère les données météo depuis l'oracle Nautilus TEE
   */
  async getWeatherData(params: {
    latitude: number;
    longitude: number;
    startDate?: string;
    endDate?: string;
    productType: 'seasonal' | 'event';
  }): Promise<WeatherOracleData> {
    try {
      const response = await fetch(`${this.nautilusEndpoint}/weather-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          latitude: params.latitude,
          longitude: params.longitude,
          start_date: params.startDate,
          end_date: params.endDate,
          product_type: params.productType,
          quorum_threshold: this.quorumThreshold,
        }),
      });

      if (!response.ok) {
        throw new Error(`Oracle error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.validateOracleData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données oracle:', error);
      throw new Error('Impossible de récupérer les données météo sécurisées');
    }
  }

  /**
   * Valide les données oracle avec vérification de quorum
   */
  private validateOracleData(data: any): WeatherOracleData {
    // Vérifier que le quorum est atteint
    if (data.oracle_responses.length < this.quorumThreshold) {
      throw new Error(`Quorum non atteint: ${data.oracle_responses.length}/${this.quorumThreshold}`);
    }

    // Vérifier la cohérence des signatures
    const validSignatures = data.oracle_responses.filter((response: any) => 
      this.verifyOracleSignature(response)
    );

    if (validSignatures.length < this.quorumThreshold) {
      throw new Error('Signatures oracle invalides');
    }

    // Calculer la moyenne pondérée des données
    const aggregatedData = this.aggregateOracleData(validSignatures);

    return {
      timestamp: aggregatedData.timestamp,
      latitude: aggregatedData.latitude,
      longitude: aggregatedData.longitude,
      cumulativeRainfall: aggregatedData.cumulative_rainfall,
      rainfall24h: aggregatedData.rainfall_24h,
      oracleSignatures: validSignatures.map((r: any) => r.signature),
      oracleAddresses: validSignatures.map((r: any) => r.oracle_address),
      confidenceScore: aggregatedData.confidence_score,
      quorumReached: true,
      productType: data.product_type,
    };
  }

  /**
   * Vérifie la signature d'un oracle
   */
  private verifyOracleSignature(response: any): boolean {
    try {
      // Dans un vrai système, vous vérifieriez la signature cryptographique
      // Ici on simule la vérification
      return response.signature && response.signature.length > 0;
    } catch (error) {
      console.error('Erreur de vérification de signature:', error);
      return false;
    }
  }

  /**
   * Agrège les données de plusieurs oracles
   */
  private aggregateOracleData(responses: any[]): any {
    const weights = responses.map(r => r.confidence_score || 50);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    let cumulativeRainfall = 0;
    let rainfall24h = 0;
    let confidenceScore = 0;

    responses.forEach((response, index) => {
      const weight = weights[index] / totalWeight;
      cumulativeRainfall += response.cumulative_rainfall * weight;
      rainfall24h += response.rainfall_24h * weight;
      confidenceScore += (response.confidence_score || 50) * weight;
    });

    return {
      timestamp: Math.max(...responses.map(r => r.timestamp)),
      latitude: responses[0].latitude,
      longitude: responses[0].longitude,
      cumulative_rainfall: Math.round(cumulativeRainfall),
      rainfall_24h: Math.round(rainfall24h),
      confidence_score: Math.round(confidenceScore),
    };
  }

  /**
   * Calcule l'indice météo pour un produit d'assurance
   */
  calculateWeatherIndex(
    weatherData: WeatherOracleData,
    productType: 'seasonal' | 'event'
  ): number {
    if (productType === 'seasonal') {
      return weatherData.cumulativeRainfall;
    } else {
      return weatherData.rainfall24h;
    }
  }

  /**
   * Vérifie si les conditions de déclenchement sont remplies
   */
  checkTriggerConditions(
    weatherData: WeatherOracleData,
    policy: ParametricPolicy
  ): boolean {
    const weatherIndex = this.calculateWeatherIndex(weatherData, policy.productType);
    
    return weatherIndex >= policy.triggerThreshold;
  }

  /**
   * Calcule le montant de paiement paramétrique
   */
  calculateParametricPayout(
    weatherData: WeatherOracleData,
    policy: ParametricPolicy
  ): number {
    const weatherIndex = this.calculateWeatherIndex(weatherData, policy.productType);
    
    if (weatherIndex < policy.triggerThreshold) {
      return 0;
    }

    let payoutPercentage: number;
    
    if (weatherIndex >= policy.saturationThreshold) {
      // Paiement complet
      payoutPercentage = 100;
    } else {
      // Paiement proportionnel
      const range = policy.saturationThreshold - policy.triggerThreshold;
      const excess = weatherIndex - policy.triggerThreshold;
      payoutPercentage = (excess * 100) / range;
    }

    return Math.round((policy.coverageAmount * payoutPercentage) / 100);
  }
}

// Types pour l'oracle Nautilus
export interface WeatherOracleData {
  timestamp: number;
  latitude: number;
  longitude: number;
  cumulativeRainfall: number;
  rainfall24h: number;
  oracleSignatures: string[];
  oracleAddresses: string[];
  confidenceScore: number;
  quorumReached: boolean;
  productType: 'seasonal' | 'event';
}

export interface ParametricPolicy {
  id: string;
  policyholder: string;
  productType: 'seasonal' | 'event';
  coverageAmount: number;
  premiumPaid: number;
  coverageStart: number;
  coverageEnd: number;
  triggerThreshold: number;
  saturationThreshold: number;
  coverageArea: {
    centerLatitude: number;
    centerLongitude: number;
    radiusMeters: number;
  };
  status: 'active' | 'expired' | 'claimed';
}

// Instance singleton du service oracle
export const nautilusOracleService = new NautilusOracleService({
  nautilusEndpoint: process.env.NAUTILUS_ENDPOINT || 'https://nautilus-tee-api.com',
  apiKey: process.env.NAUTILUS_API_KEY || 'demo-key',
  quorumThreshold: 3,
});
