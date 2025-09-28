import axios from 'axios';
import { WeatherData, WeatherDataDocument } from '../models/WeatherData';
import { WeatherApiConfig } from '../types';
import { logger } from '../utils/logger';

export class WeatherService {
  private config: WeatherApiConfig;

  constructor(config: WeatherApiConfig) {
    this.config = config;
  }

  /**
   * Récupère les données météo actuelles pour une localisation
   */
  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherDataDocument> {
    try {
      const response = await this.fetchWeatherData(latitude, longitude);
      return await this.saveWeatherData(response);
    } catch (error) {
      logger.error('Error fetching current weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  /**
   * Récupère les données météo historiques
   */
  async getHistoricalWeather(
    latitude: number, 
    longitude: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<WeatherDataDocument[]> {
    try {
      const response = await this.fetchHistoricalWeather(latitude, longitude, startDate, endDate);
      return await this.saveWeatherDataArray(response);
    } catch (error) {
      logger.error('Error fetching historical weather:', error);
      throw new Error('Failed to fetch historical weather data');
    }
  }

  /**
   * Vérifie si les conditions météo déclenchent une alerte
   */
  async checkWeatherAlerts(
    latitude: number, 
    longitude: number, 
    riskTypes: string[]
  ): Promise<{ triggered: boolean; alerts: any[] }> {
    try {
      const weatherData = await this.getCurrentWeather(latitude, longitude);
      const alerts = [];

      for (const riskType of riskTypes) {
        const alert = this.evaluateRiskType(weatherData, riskType);
        if (alert.triggered) {
          alerts.push(alert);
        }
      }

      return {
        triggered: alerts.length > 0,
        alerts
      };
    } catch (error) {
      logger.error('Error checking weather alerts:', error);
      throw new Error('Failed to check weather alerts');
    }
  }

  /**
   * Récupère les données météo depuis l'API externe
   */
  private async fetchWeatherData(latitude: number, longitude: number): Promise<any> {
    const url = `${this.config.baseUrl}/weather`;
    const params = {
      lat: latitude,
      lon: longitude,
      appid: this.config.apiKey,
      units: 'metric'
    };

    const response = await axios.get(url, { params });
    return this.transformWeatherData(response.data);
  }

  /**
   * Récupère les données météo historiques
   */
  private async fetchHistoricalWeather(
    latitude: number, 
    longitude: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<any[]> {
    const url = `${this.config.baseUrl}/history`;
    const params = {
      lat: latitude,
      lon: longitude,
      start: Math.floor(startDate.getTime() / 1000),
      end: Math.floor(endDate.getTime() / 1000),
      appid: this.config.apiKey,
      units: 'metric'
    };

    const response = await axios.get(url, { params });
    return response.data.list.map((item: any) => this.transformWeatherData(item));
  }

  /**
   * Transforme les données de l'API en format interne
   */
  private transformWeatherData(apiData: any): any {
    return {
      location: {
        latitude: apiData.coord.lat,
        longitude: apiData.coord.lon
      },
      timestamp: new Date(apiData.dt * 1000),
      temperature: {
        current: apiData.main.temp,
        min: apiData.main.temp_min,
        max: apiData.main.temp_max,
        feelsLike: apiData.main.feels_like
      },
      humidity: apiData.main.humidity,
      rainfall: {
        current: apiData.rain?.['1h'] || 0,
        last24h: apiData.rain?.['24h'] || 0,
        last7days: 0, // Calculé séparément
        last30days: 0 // Calculé séparément
      },
      wind: {
        speed: apiData.wind.speed * 3.6, // Convert m/s to km/h
        direction: apiData.wind.deg,
        gust: (apiData.wind.gust || 0) * 3.6
      },
      pressure: apiData.main.pressure,
      visibility: apiData.visibility / 1000, // Convert m to km
      uvIndex: apiData.uvi || 0,
      source: 'api',
      quality: 'high'
    };
  }

  /**
   * Sauvegarde les données météo en base
   */
  private async saveWeatherData(weatherData: any): Promise<WeatherDataDocument> {
    const weather = new WeatherData(weatherData);
    return await weather.save();
  }

  /**
   * Sauvegarde plusieurs données météo
   */
  private async saveWeatherDataArray(weatherDataArray: any[]): Promise<WeatherDataDocument[]> {
    return await WeatherData.insertMany(weatherDataArray) as WeatherDataDocument[];
  }

  /**
   * Évalue un type de risque météo
   */
  private evaluateRiskType(weatherData: WeatherDataDocument, riskType: string): any {
    const thresholds = this.getRiskThresholds(riskType);
    let triggered = false;
    let severity = 'low';

    switch (riskType) {
      case 'drought':
        triggered = weatherData.rainfall.last30days < thresholds.rainfall;
        severity = triggered ? 'high' : 'low';
        break;
      
      case 'flood':
        triggered = weatherData.rainfall.last24h > thresholds.rainfall;
        severity = triggered ? 'critical' : 'low';
        break;
      
      case 'frost':
        triggered = weatherData.temperature.current < thresholds.temperature;
        severity = triggered ? 'high' : 'low';
        break;
      
      case 'heat_wave':
        triggered = weatherData.temperature.current > thresholds.temperature;
        severity = triggered ? 'medium' : 'low';
        break;
      
      case 'storm':
        triggered = weatherData.wind.speed > thresholds.windSpeed;
        severity = triggered ? 'high' : 'low';
        break;
    }

    return {
      riskType,
      triggered,
      severity,
      weatherData,
      threshold: thresholds,
      message: this.generateAlertMessage(riskType, severity, weatherData)
    };
  }

  /**
   * Définit les seuils pour chaque type de risque
   */
  private getRiskThresholds(riskType: string): any {
    const thresholds: Record<string, any> = {
      drought: { rainfall: 50 }, // mm sur 30 jours
      flood: { rainfall: 100 }, // mm sur 24h
      frost: { temperature: 2 }, // °C
      heat_wave: { temperature: 35 }, // °C
      storm: { windSpeed: 60 } // km/h
    };

    return thresholds[riskType] || {};
  }

  /**
   * Génère un message d'alerte personnalisé
   */
  private generateAlertMessage(riskType: string, severity: string, weatherData: WeatherDataDocument): string {
    const messages: Record<string, string> = {
      drought: `Sécheresse détectée: ${weatherData.rainfall.last30days}mm de pluie sur 30 jours`,
      flood: `Risque d'inondation: ${weatherData.rainfall.last24h}mm de pluie en 24h`,
      frost: `Gel détecté: température de ${weatherData.temperature.current}°C`,
      heat_wave: `Vague de chaleur: température de ${weatherData.temperature.current}°C`,
      storm: `Tempête détectée: vent de ${weatherData.wind.speed}km/h`
    };

    return messages[riskType] || 'Alerte météo détectée';
  }

  /**
   * Calcule les statistiques météo pour une période
   */
  async getWeatherStatistics(
    latitude: number, 
    longitude: number, 
    days: number
  ): Promise<any> {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

      const weatherData = await WeatherData.find({
        'location.latitude': latitude,
        'location.longitude': longitude,
        timestamp: { $gte: startDate, $lte: endDate }
      }).sort({ timestamp: -1 });

      if (weatherData.length === 0) {
        return null;
      }

      const stats = {
        averageTemperature: this.calculateAverage(weatherData.map(w => w.temperature.current)),
        minTemperature: Math.min(...weatherData.map(w => w.temperature.min)),
        maxTemperature: Math.max(...weatherData.map(w => w.temperature.max)),
        totalRainfall: weatherData.reduce((sum, w) => sum + w.rainfall.current, 0),
        averageHumidity: this.calculateAverage(weatherData.map(w => w.humidity)),
        averageWindSpeed: this.calculateAverage(weatherData.map(w => w.wind.speed)),
        maxWindSpeed: Math.max(...weatherData.map(w => w.wind.speed)),
        dataPoints: weatherData.length
      };

      return stats;
    } catch (error) {
      logger.error('Error calculating weather statistics:', error);
      throw new Error('Failed to calculate weather statistics');
    }
  }

  /**
   * Calcule la moyenne d'un tableau de nombres
   */
  private calculateAverage(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }
}
