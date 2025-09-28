// Service Oracle pour récupérer les données météo
export interface WeatherData {
  temperature: number;    // Température en degrés Celsius
  rainfall: number;      // Pluviométrie en mm
  humidity: number;      // Humidité en pourcentage
  location: {
    lat: number;
    lng: number;
  };
  timestamp: number;
  description?: string;  // Description des conditions météo
}

export interface WeatherThresholds {
  maxTemperature: number;
  minTemperature: number;
  maxRainfall: number;
  minHumidity: number;
  maxHumidity: number;
}

export class WeatherOracleService {
  private apiKey: string | null = null;

  constructor() {
    // Pour la démo, on utilise des données simulées
    this.apiKey = 'demo_key';
  }

  /**
   * Récupérer les données météo actuelles pour une zone
   */
  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    console.log("🌤️ Récupération des données météo...");
    console.log("📍 Position:", { lat, lng });

    // Utiliser le service de vraies données météo avec cache
    const { realWeatherAPIService } = await import('./real-weather-api');
    
    try {
      const realData = await realWeatherAPIService.getCurrentWeather(lat, lng);
      
      const weatherData: WeatherData = {
        temperature: realData.temperature,
        rainfall: realData.rainfall,
        humidity: realData.humidity,
        location: realData.location,
        timestamp: realData.timestamp,
        description: realData.description,
      };

      console.log("📊 Données météo récupérées:", weatherData);
      return weatherData;
    } catch (error) {
      console.error("❌ Erreur API météo:", error);
      // Fallback vers des données cohérentes
      return this.getFallbackWeather(lat, lng);
    }
  }

  /**
   * Vérifier si les conditions météo déclenchent un remboursement
   */
  checkWeatherConditions(
    weatherData: WeatherData,
    thresholds: WeatherThresholds
  ): { shouldClaim: boolean; reason: string; claimAmount: number } {
    const { temperature, rainfall, humidity } = weatherData;
    const { maxTemperature, minTemperature, maxRainfall, minHumidity, maxHumidity } = thresholds;

    let shouldClaim = false;
    let reason = '';

    // Vérifier la température
    if (temperature > maxTemperature) {
      shouldClaim = true;
      reason = `Température trop élevée: ${temperature}°C > ${maxTemperature}°C`;
    } else if (temperature < minTemperature) {
      shouldClaim = true;
      reason = `Température trop basse: ${temperature}°C < ${minTemperature}°C`;
    }

    // Vérifier la pluie
    if (rainfall > maxRainfall) {
      shouldClaim = true;
      reason = `Pluviométrie excessive: ${rainfall}mm > ${maxRainfall}mm`;
    }

    // Vérifier l'humidité
    if (humidity < minHumidity) {
      shouldClaim = true;
      reason = `Humidité trop faible: ${humidity}% < ${minHumidity}%`;
    } else if (humidity > maxHumidity) {
      shouldClaim = true;
      reason = `Humidité trop élevée: ${humidity}% > ${maxHumidity}%`;
    }

    return {
      shouldClaim,
      reason,
      claimAmount: shouldClaim ? 1000 : 0, // Montant de remboursement en SUI
    };
  }

  /**
   * Obtenir des données météo réalistes basées sur la position
   */
  private getRealisticTemperature(lat: number, lng: number): number {
    // Température basée sur la latitude (plus froid vers les pôles)
    const baseTemp = 30 - Math.abs(lat) * 0.5; // Base temp selon latitude
    const seasonalVariation = Math.sin(Date.now() / (365 * 24 * 60 * 60 * 1000) * 2 * Math.PI) * 10; // Variation saisonnière
    const randomVariation = (Math.random() - 0.5) * 4; // Variation aléatoire ±2°C
    
    const temperature = baseTemp + seasonalVariation + randomVariation;
    return Math.round(temperature * 10) / 10;
  }

  private getRealisticRainfall(lat: number, lng: number): number {
    // Pluviométrie basée sur la position (plus de pluie près de l'équateur)
    const baseRainfall = Math.abs(lat) < 30 ? Math.random() * 20 : Math.random() * 10; // Plus de pluie près de l'équateur
    const seasonalFactor = Math.sin(Date.now() / (365 * 24 * 60 * 60 * 1000) * 2 * Math.PI + Math.PI) * 0.5 + 0.5; // Saison des pluies
    
    const rainfall = baseRainfall * seasonalFactor;
    return Math.round(rainfall * 10) / 10;
  }

  private getRealisticHumidity(lat: number, lng: number): number {
    // Humidité basée sur la position et la saison
    const baseHumidity = Math.abs(lat) < 30 ? 70 : 50; // Plus humide près de l'équateur
    const seasonalVariation = Math.sin(Date.now() / (365 * 24 * 60 * 60 * 1000) * 2 * Math.PI) * 15; // Variation saisonnière
    const randomVariation = (Math.random() - 0.5) * 20; // Variation aléatoire ±10%
    
    const humidity = Math.max(20, Math.min(95, baseHumidity + seasonalVariation + randomVariation));
    return Math.round(humidity);
  }

  /**
   * Données de fallback en cas d'erreur
   */
  private getFallbackWeather(lat: number, lng: number): WeatherData {
    return {
      temperature: 22,
      rainfall: 5,
      humidity: 60,
      location: { lat, lng },
      timestamp: Date.now(),
    };
  }

  /**
   * Simuler des données météo pour la démo (ancienne méthode)
   */
  private simulateTemperature(): number {
    // Température entre 15°C et 35°C
    return Math.round((Math.random() * 20 + 15) * 10) / 10;
  }

  private simulateRainfall(): number {
    // Pluviométrie entre 0 et 50mm
    return Math.round(Math.random() * 50 * 10) / 10;
  }

  private simulateHumidity(): number {
    // Humidité entre 30% et 90%
    return Math.round(Math.random() * 60 + 30);
  }

  /**
   * Obtenir des données météo critiques pour tester
   */
  getCriticalWeatherData(lat: number, lng: number): WeatherData {
    return {
      temperature: 40, // Température critique
      rainfall: 100,  // Pluie excessive
      humidity: 95,   // Humidité excessive
      location: { lat, lng },
      timestamp: Date.now(),
    };
  }

  /**
   * Obtenir des données météo normales
   */
  getNormalWeatherData(lat: number, lng: number): WeatherData {
    return {
      temperature: 25,
      rainfall: 5,
      humidity: 60,
      location: { lat, lng },
      timestamp: Date.now(),
    };
  }
}

export const weatherOracleService = new WeatherOracleService();
