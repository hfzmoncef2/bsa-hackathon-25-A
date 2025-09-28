// Configuration pour l'oracle Nautilus TEE
export const nautilusConfig = {
  // Endpoint de l'oracle Nautilus TEE
  endpoint: process.env.NAUTILUS_ENDPOINT || 'https://nautilus-tee-api.com',
  
  // Clé API pour l'authentification
  apiKey: process.env.NAUTILUS_API_KEY || 'demo-key',
  
  // Configuration du quorum
  quorum: {
    // Nombre minimum d'oracles requis pour validation
    threshold: parseInt(process.env.NAUTILUS_QUORUM_THRESHOLD || '3'),
    
    // Oracles autorisés
    authorizedOracles: [
      '0xnautilus-oracle-1',
      '0xnautilus-oracle-2', 
      '0xnautilus-oracle-3',
      '0xnautilus-oracle-4'
    ],
    
    // Score de confiance minimum
    minConfidenceScore: parseInt(process.env.NAUTILUS_MIN_CONFIDENCE || '80')
  },
  
  // Configuration des APIs météo
  weatherAPIs: {
    openMeteo: {
      endpoint: 'https://api.open-meteo.com/v1/forecast',
      apiKey: process.env.OPEN_METEO_API_KEY || 'demo-key'
    },
    weatherAPI: {
      endpoint: 'https://api.weatherapi.com/v1/current.json',
      apiKey: process.env.WEATHER_API_KEY || 'demo-key'
    }
  },
  
  // Configuration des produits d'assurance
  insuranceProducts: {
    seasonal: {
      name: 'Assurance Saisonnière',
      description: 'Protection basée sur la pluie cumulée sur une période',
      basePremium: 200,
      minCoverage: 10000,
      maxCoverage: 1000000,
      defaultTriggerThreshold: 200, // mm
      defaultSaturationThreshold: 100, // mm
      coveragePeriod: {
        min: 30, // jours
        max: 365 // jours
      }
    },
    event: {
      name: 'Assurance Événementielle', 
      description: 'Protection basée sur les événements météo extrêmes',
      basePremium: 150,
      minCoverage: 5000,
      maxCoverage: 500000,
      defaultTriggerThreshold: 50, // mm
      defaultSaturationThreshold: 25, // mm
      coveragePeriod: {
        min: 1, // jour
        max: 30 // jours
      }
    }
  },
  
  // Configuration des seuils météo
  weatherThresholds: {
    drought: {
      seasonal: { trigger: 200, saturation: 100 },
      event: { trigger: 0, saturation: 0 }
    },
    flood: {
      seasonal: { trigger: 0, saturation: 0 },
      event: { trigger: 50, saturation: 25 }
    },
    hail: {
      seasonal: { trigger: 0, saturation: 0 },
      event: { trigger: 10, saturation: 5 }
    },
    storm: {
      seasonal: { trigger: 0, saturation: 0 },
      event: { trigger: 60, saturation: 30 } // km/h
    },
    frost: {
      seasonal: { trigger: 0, saturation: 0 },
      event: { trigger: 2, saturation: 1 } // °C
    }
  },
  
  // Configuration des zones géographiques
  coverageAreas: {
    // Rayon de couverture par défaut (mètres)
    defaultRadius: 10000,
    
    // Rayon maximum (mètres)
    maxRadius: 50000,
    
    // Rayon minimum (mètres)
    minRadius: 1000
  },
  
  // Configuration des paiements
  payments: {
    // Délai de traitement des réclamations (heures)
    claimProcessingDelay: 24,
    
    // Délai de paiement après approbation (heures)
    payoutDelay: 48,
    
    // Montant minimum de réclamation (€)
    minClaimAmount: 100,
    
    // Montant maximum de réclamation (€)
    maxClaimAmount: 1000000
  },
  
  // Configuration de la blockchain Sui
  sui: {
    // Package ID du contrat RainGuard
    packageId: '0xbc0e271b66dad1f15403e75f6ddb58d38a6ae35684297e804508779c27fac329',
    
    // ID du pool d'assurance
    insurancePoolId: '0xae90aa41283e0b0eef57835a4442cb77a0dc5ed7c1bf78cf587e38b5283087c9',
    
    // Network (testnet, mainnet, devnet)
    network: process.env.SUI_NETWORK || 'testnet',
    
    // Gas budget pour les transactions
    gasBudget: 10000000
  }
};

export default nautilusConfig;
