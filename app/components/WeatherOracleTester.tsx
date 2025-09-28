'use client';

import { useState } from 'react';
import { unifiedWeatherService, WeatherData, WeatherThresholds } from '../services/unified-weather-service';

export function WeatherOracleTester() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [claimResult, setClaimResult] = useState<any>(null);
  const [dataSource, setDataSource] = useState<string>('');
  
  // Seuils par défaut
  const [thresholds, setThresholds] = useState<WeatherThresholds>({
    maxTemperature: 35,
    minTemperature: 5,
    maxRainfall: 50,
    minHumidity: 30,
    maxHumidity: 80,
  });

  const [location, setLocation] = useState({ lat: 48.8566, lng: 2.3522 });

  const handleGetWeather = async () => {
    setIsLoading(true);
    try {
      // Utiliser le service unifié
      const data = await unifiedWeatherService.getCurrentWeather(location.lat, location.lng);
      
      setWeatherData(data);
      setDataSource('Service Unifié (Cache/API)');
      
      // Vérifier les conditions
      const result = unifiedWeatherService.checkWeatherConditions(data, thresholds);
      setClaimResult(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo:', error);
      setDataSource('Erreur Service');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🌤️ Test Oracle Météo
      </h2>
      
      <div className="space-y-6">
        {/* Configuration des seuils */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Seuils de Réclamation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Température max (°C)
              </label>
              <input
                type="number"
                value={thresholds.maxTemperature}
                onChange={(e) => setThresholds({...thresholds, maxTemperature: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Température min (°C)
              </label>
              <input
                type="number"
                value={thresholds.minTemperature}
                onChange={(e) => setThresholds({...thresholds, minTemperature: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pluviométrie max (mm)
              </label>
              <input
                type="number"
                value={thresholds.maxRainfall}
                onChange={(e) => setThresholds({...thresholds, maxRainfall: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humidité min (%)
              </label>
              <input
                type="number"
                value={thresholds.minHumidity}
                onChange={(e) => setThresholds({...thresholds, minHumidity: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humidité max (%)
              </label>
              <input
                type="number"
                value={thresholds.maxHumidity}
                onChange={(e) => setThresholds({...thresholds, maxHumidity: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>


        {/* Position */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Position</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={location.lat}
                onChange={(e) => setLocation({...location, lat: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={location.lng}
                onChange={(e) => setLocation({...location, lng: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bouton principal */}
        <div className="flex justify-center">
          <button
            onClick={handleGetWeather}
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-lg font-semibold"
          >
            {isLoading ? '⏳ Récupération...' : '🌤️ Obtenir Données Météo'}
          </button>
        </div>

        {/* Résultats */}
        {weatherData && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Données Météo Actuelles</h3>
            
            {/* Description météo */}
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Conditions actuelles :</strong> {weatherData.description || 'Ciel dégagé'}
              </p>
              <p className="text-xs text-gray-500">
                Position: {weatherData.location.lat.toFixed(4)}°, {weatherData.location.lng.toFixed(4)}°
              </p>
              <p className="text-xs text-blue-600">
                <strong>Source :</strong> {dataSource || 'Données simulées'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-semibold text-blue-800">🌡️ Température</h4>
                <p className="text-2xl font-bold text-blue-600">{weatherData.temperature}°C</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-semibold text-blue-800">🌧️ Pluviométrie</h4>
                <p className="text-2xl font-bold text-blue-600">{weatherData.rainfall}mm</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-semibold text-blue-800">💧 Humidité</h4>
                <p className="text-2xl font-bold text-blue-600">{weatherData.humidity}%</p>
              </div>
            </div>

            {claimResult && (
              <div className={`p-4 rounded-md ${claimResult.shouldClaim ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <h4 className={`font-semibold ${claimResult.shouldClaim ? 'text-red-800' : 'text-green-800'}`}>
                  {claimResult.shouldClaim ? '⚠️ Réclamation Déclenchée' : '✅ Aucune Réclamation'}
                </h4>
                {claimResult.reason && (
                  <p className={`mt-2 ${claimResult.shouldClaim ? 'text-red-700' : 'text-green-700'}`}>
                    {claimResult.reason}
                  </p>
                )}
                {claimResult.shouldClaim && (
                  <p className="mt-2 text-lg font-bold text-red-600">
                    Montant de réclamation: {claimResult.claimAmount} SUI
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
