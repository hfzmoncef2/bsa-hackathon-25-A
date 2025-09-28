// Unified service for all weather data
import { realWeatherAPIService, RealWeatherData } from './real-weather-api';

export interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: number;
  description?: string;
}

export interface WeatherThresholds {
  maxTemperature: number;
  minTemperature: number;
  maxRainfall: number;
  minHumidity: number;
  maxHumidity: number;
}

export class UnifiedWeatherService {
  private static instance: UnifiedWeatherService;
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): UnifiedWeatherService {
    if (!UnifiedWeatherService.instance) {
      UnifiedWeatherService.instance = new UnifiedWeatherService();
    }
    return UnifiedWeatherService.instance;
  }

  /**
   * Get weather data (with unified cache)
   */
  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    console.log("🌤️ [UnifiedWeatherService] Fetching weather data...");
    console.log("📍 Position:", { lat, lng });

    // Check cache first
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      console.log("📦 [UnifiedWeatherService] Data retrieved from cache");
      return cached.data;
    }

    try {
      // Use real weather data service
      const realData = await realWeatherAPIService.getCurrentWeather(lat, lng);
      
      const weatherData: WeatherData = {
        temperature: realData.temperature,
        rainfall: realData.rainfall,
        humidity: realData.humidity,
        location: realData.location,
        timestamp: realData.timestamp,
        description: realData.description,
      };

      // Cache the data
      this.cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
      
      console.log("✅ [UnifiedWeatherService] Weather data retrieved:", weatherData);
      return weatherData;
    } catch (error) {
      console.error("❌ [UnifiedWeatherService] Weather API error:", error);
      
      // Use consistent fallback data
      const fallbackData = this.getConsistentFallbackData(lat, lng);
      
      // Cache even fallback data
      this.cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
      
      return fallbackData;
    }
  }

  /**
   * Check weather conditions for claims
   */
  checkWeatherConditions(
    weatherData: WeatherData,
    thresholds: WeatherThresholds
  ): { shouldClaim: boolean; reason: string; claimAmount: number } {
    const { temperature, rainfall, humidity } = weatherData;
    const { maxTemperature, minTemperature, maxRainfall, minHumidity, maxHumidity } = thresholds;

    let shouldClaim = false;
    let reason = '';

    // Check temperature
    if (temperature > maxTemperature) {
      shouldClaim = true;
      reason = `Temperature too high: ${temperature}°C > ${maxTemperature}°C`;
    } else if (temperature < minTemperature) {
      shouldClaim = true;
      reason = `Temperature too low: ${temperature}°C < ${minTemperature}°C`;
    }

    // Check rainfall
    if (rainfall > maxRainfall) {
      shouldClaim = true;
      reason = `Excessive rainfall: ${rainfall}mm > ${maxRainfall}mm`;
    }

    // Check humidity
    if (humidity < minHumidity) {
      shouldClaim = true;
      reason = `Humidity too low: ${humidity}% < ${minHumidity}%`;
    } else if (humidity > maxHumidity) {
      shouldClaim = true;
      reason = `Humidity too high: ${humidity}% > ${maxHumidity}%`;
    }

    return {
      shouldClaim,
      reason,
      claimAmount: shouldClaim ? 1000 : 0, // Reimbursement amount in SUI
    };
  }

  /**
   * Consistent fallback data (without randomness)
   */
  private getConsistentFallbackData(lat: number, lng: number): WeatherData {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1;
    const isDay = hour >= 6 && hour <= 18;
    
    // Deterministic temperature based on position and time
    const baseTemp = 25 - Math.abs(lat) * 0.4;
    const dailyVariation = isDay ? 8 : -5;
    const seasonalVariation = Math.sin((month - 1) / 12 * 2 * Math.PI) * 8;
    
    // Use deterministic function instead of Math.random()
    const deterministicVariation = Math.sin(lat * lng * 0.001) * 3;
    const temperature = baseTemp + dailyVariation + seasonalVariation + deterministicVariation;
    
    // Deterministic humidity
    const baseHumidity = Math.abs(lat) < 30 ? 75 : 55;
    const seasonalHumidity = Math.sin((month - 1) / 12 * 2 * Math.PI + Math.PI) * 15;
    const deterministicHumidity = Math.sin(lat * 0.1) * 10;
    
    const humidity = Math.max(25, Math.min(95, baseHumidity + seasonalHumidity + deterministicHumidity));
    
    // Deterministic rainfall
    const isRainySeason = Math.abs(lat) < 30 && (month >= 5 && month <= 10);
    const baseRainfall = isRainySeason ? 15 : 3;
    const deterministicRainfall = Math.sin(lng * 0.01) * 5;
    const rainfall = Math.max(0, baseRainfall + deterministicRainfall);
    
    // Weather description
    let description = 'Clear sky';
    if (rainfall > 10) description = 'Heavy rain';
    else if (rainfall > 5) description = 'Moderate rain';
    else if (rainfall > 0) description = 'Light rain';
    else if (temperature > 30) description = 'Hot and sunny';
    else if (temperature < 5) description = 'Cold and cloudy';
    else if (humidity > 80) description = 'Humid and cloudy';
    else description = 'Partly cloudy';
    
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
   * Get critical weather data for testing
   */
  getCriticalWeatherData(lat: number, lng: number): WeatherData {
    return {
      temperature: 40, // Critical temperature
      rainfall: 100,  // Excessive rain
      humidity: 95,   // Excessive humidity
      location: { lat, lng },
      timestamp: Date.now(),
      description: 'Extreme weather conditions',
    };
  }

  /**
   * Get normal weather data
   */
  getNormalWeatherData(lat: number, lng: number): WeatherData {
    return {
      temperature: 25,
      rainfall: 5,
      humidity: 60,
      location: { lat, lng },
      timestamp: Date.now(),
      description: 'Normal weather conditions',
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log("🗑️ [UnifiedWeatherService] Cache cleared");
  }
}

export const unifiedWeatherService = UnifiedWeatherService.getInstance();
