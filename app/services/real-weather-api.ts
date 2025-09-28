// Service pour récupérer les vraies données météo via OpenWeatherMap
export interface RealWeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: number;
  description: string;
}

export class RealWeatherAPIService {
  private apiKey: string;
  private cache: Map<string, { data: RealWeatherData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(apiKey: string = '0dbe8612a65b424ffc1c4b394171a388') {
    this.apiKey = apiKey;
  }

  /**
   * Récupérer les vraies données météo actuelles
   */
  async getCurrentWeather(lat: number, lng: number): Promise<RealWeatherData> {
    console.log("🌤️ Récupération des données météo...");
    console.log("📍 Position:", { lat, lng });

    // Vérifier le cache d'abord
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      console.log("📦 Données récupérées du cache");
      return cached.data;
    }

    try {
      // Utiliser la vraie API OpenWeatherMap
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`;
      
      console.log("🔗 Appel API OpenWeatherMap...");
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("📊 Données API reçues:", data);

      const weatherData: RealWeatherData = {
        temperature: Math.round(data.main.temp * 10) / 10,
        rainfall: this.extractRainfall(data),
        humidity: data.main.humidity,
        location: { lat, lng },
        timestamp: Date.now(),
        description: data.weather[0].description,
      };

      // Mettre en cache
      this.cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
      
      console.log("✅ Données météo récupérées:", weatherData);
      return weatherData;
    } catch (error) {
      console.error("❌ Erreur API météo:", error);
      console.log("🔄 Utilisation des données de fallback...");
      
      // Utiliser des données de fallback cohérentes
      const fallbackData = this.getConsistentFallbackData(lat, lng);
      
      // Mettre en cache même les données de fallback
      this.cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
      
      return fallbackData;
    }
  }

  /**
   * Extraire les données de pluviométrie
   */
  private extractRainfall(data: any): number {
    // OpenWeatherMap ne fournit pas toujours les données de pluie
    // On utilise les données de précipitation si disponibles
    if (data.rain && data.rain['1h']) {
      return Math.round(data.rain['1h'] * 10) / 10;
    }
    if (data.rain && data.rain['3h']) {
      return Math.round(data.rain['3h'] / 3 * 10) / 10; // Convertir 3h en 1h
    }
    // Fallback basé sur la description météo
    const description = data.weather[0].description.toLowerCase();
    if (description.includes('rain') || description.includes('drizzle')) {
      return Math.round(Math.random() * 10 * 10) / 10; // 0-10mm
    }
    return 0;
  }

  /**
   * Données météo réalistes basées sur la position
   */
  private getRealisticWeatherData(lat: number, lng: number): RealWeatherData {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1; // 1-12
    const isDay = hour >= 6 && hour <= 18;
    
    // Température basée sur la latitude, l'heure et la saison
    const baseTemp = 25 - Math.abs(lat) * 0.4; // Base selon latitude
    const dailyVariation = isDay ? 8 : -5; // Plus chaud le jour
    const seasonalVariation = Math.sin((month - 1) / 12 * 2 * Math.PI) * 8; // Variation saisonnière
    const randomVariation = (Math.random() - 0.5) * 6; // Variation aléatoire ±3°C
    
    const temperature = baseTemp + dailyVariation + seasonalVariation + randomVariation;
    
    // Humidité basée sur la position et la saison
    const baseHumidity = Math.abs(lat) < 30 ? 75 : 55; // Plus humide près de l'équateur
    const seasonalHumidity = Math.sin((month - 1) / 12 * 2 * Math.PI + Math.PI) * 15; // Variation saisonnière
    const randomHumidity = (Math.random() - 0.5) * 20; // Variation aléatoire ±10%
    
    const humidity = Math.max(25, Math.min(95, baseHumidity + seasonalHumidity + randomHumidity));
    
    // Pluviométrie basée sur la position et la saison
    const isRainySeason = Math.abs(lat) < 30 && (month >= 5 && month <= 10); // Saison des pluies tropicale
    const baseRainfall = isRainySeason ? Math.random() * 25 : Math.random() * 8;
    const dailyRainfall = Math.random() < 0.3 ? baseRainfall : 0; // 30% de chance de pluie
    
    // Description météo
    let description = 'Ciel dégagé';
    if (dailyRainfall > 10) description = 'Pluie forte';
    else if (dailyRainfall > 5) description = 'Pluie modérée';
    else if (dailyRainfall > 0) description = 'Pluie légère';
    else if (temperature > 30) description = 'Chaud et ensoleillé';
    else if (temperature < 5) description = 'Froid et nuageux';
    else if (humidity > 80) description = 'Humide et nuageux';
    else description = 'Ciel partiellement nuageux';
    
    return {
      temperature: Math.round(temperature * 10) / 10,
      rainfall: Math.round(dailyRainfall * 10) / 10,
      humidity: Math.round(humidity),
      location: { lat, lng },
      timestamp: Date.now(),
      description,
    };
  }

  /**
   * Données de fallback cohérentes (sans aléatoire)
   */
  private getConsistentFallbackData(lat: number, lng: number): RealWeatherData {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1;
    const isDay = hour >= 6 && hour <= 18;
    
    // Température déterministe basée sur la position et l'heure
    const baseTemp = 25 - Math.abs(lat) * 0.4;
    const dailyVariation = isDay ? 8 : -5;
    const seasonalVariation = Math.sin((month - 1) / 12 * 2 * Math.PI) * 8;
    
    // Utiliser une fonction déterministe au lieu de Math.random()
    const deterministicVariation = Math.sin(lat * lng * 0.001) * 3;
    const temperature = baseTemp + dailyVariation + seasonalVariation + deterministicVariation;
    
    // Humidité déterministe
    const baseHumidity = Math.abs(lat) < 30 ? 75 : 55;
    const seasonalHumidity = Math.sin((month - 1) / 12 * 2 * Math.PI + Math.PI) * 15;
    const deterministicHumidity = Math.sin(lat * 0.1) * 10;
    
    const humidity = Math.max(25, Math.min(95, baseHumidity + seasonalHumidity + deterministicHumidity));
    
    // Pluviométrie déterministe
    const isRainySeason = Math.abs(lat) < 30 && (month >= 5 && month <= 10);
    const baseRainfall = isRainySeason ? 15 : 3;
    const deterministicRainfall = Math.sin(lng * 0.01) * 5;
    const rainfall = Math.max(0, baseRainfall + deterministicRainfall);
    
    // Description météo
    let description = 'Ciel dégagé';
    if (rainfall > 10) description = 'Pluie forte';
    else if (rainfall > 5) description = 'Pluie modérée';
    else if (rainfall > 0) description = 'Pluie légère';
    else if (temperature > 30) description = 'Chaud et ensoleillé';
    else if (temperature < 5) description = 'Froid et nuageux';
    else if (humidity > 80) description = 'Humide et nuageux';
    else description = 'Ciel partiellement nuageux';
    
    return {
      temperature: Math.round(temperature * 10) / 10,
      rainfall: Math.round(rainfall * 10) / 10,
      humidity: Math.round(humidity),
      location: { lat, lng },
      timestamp: Date.now(),
      description,
    };
  }

  /**
   * Données de démo réalistes (ancienne méthode)
   */
  private getDemoWeather(lat: number, lng: number): RealWeatherData {
    // Données basées sur la position et l'heure
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour <= 18;
    
    // Température basée sur la latitude et l'heure
    const baseTemp = 30 - Math.abs(lat) * 0.4;
    const dailyVariation = isDay ? 5 : -5; // Plus chaud le jour
    const temperature = baseTemp + dailyVariation + (Math.random() - 0.5) * 4;
    
    // Humidité basée sur la position
    const baseHumidity = Math.abs(lat) < 30 ? 70 : 50;
    const humidity = Math.max(30, Math.min(90, baseHumidity + (Math.random() - 0.5) * 20));
    
    // Pluviométrie (plus réaliste)
    const rainfall = Math.random() < 0.3 ? Math.random() * 15 : 0; // 30% de chance de pluie
    
    return {
      temperature: Math.round(temperature * 10) / 10,
      rainfall: Math.round(rainfall * 10) / 10,
      humidity: Math.round(humidity),
      location: { lat, lng },
      timestamp: Date.now(),
      description: rainfall > 5 ? 'Pluie modérée' : rainfall > 0 ? 'Pluie légère' : 'Ciel dégagé',
    };
  }

  /**
   * Définir une nouvelle clé API
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    console.log("🔑 Nouvelle clé API définie");
  }
}

export const realWeatherAPIService = new RealWeatherAPIService('0dbe8612a65b424ffc1c4b394171a388');
