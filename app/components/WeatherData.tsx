'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Droplets, Thermometer, Wind, Eye, RefreshCw } from "lucide-react";

interface WeatherDataProps {
  onBack: () => void;
}

interface WeatherStation {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  lastUpdate: string;
  data: {
    rainfall: number;
    temperature: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
  };
  status: 'online' | 'offline' | 'maintenance';
}

export function WeatherData({ onBack }: WeatherDataProps) {
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // Simuler le chargement des données météo
  useEffect(() => {
    const loadWeatherData = async () => {
      // Dans une vraie application, vous récupéreriez les données depuis l'oracle météo
      const mockStations: WeatherStation[] = [
        {
          id: "station-001",
          name: "Station Marrakech Centre",
          location: "Marrakech, Maroc",
          coordinates: "31.6295° N, 7.9811° W",
          lastUpdate: "2024-01-15 14:30:00",
          data: {
            rainfall: 32,
            temperature: 24,
            humidity: 45,
            windSpeed: 12,
            pressure: 1013
          },
          status: 'online'
        },
        {
          id: "station-002",
          name: "Station Casablanca Port",
          location: "Casablanca, Maroc",
          coordinates: "33.5731° N, 7.5898° W",
          lastUpdate: "2024-01-15 14:25:00",
          data: {
            rainfall: 28,
            temperature: 22,
            humidity: 60,
            windSpeed: 18,
            pressure: 1015
          },
          status: 'online'
        },
        {
          id: "station-003",
          name: "Station Rabat Agriculture",
          location: "Rabat, Maroc",
          coordinates: "34.0209° N, 6.8416° W",
          lastUpdate: "2024-01-15 14:20:00",
          data: {
            rainfall: 45,
            temperature: 20,
            humidity: 70,
            windSpeed: 8,
            pressure: 1012
          },
          status: 'online'
        },
        {
          id: "station-004",
          name: "Station Fès Rural",
          location: "Fès, Maroc",
          coordinates: "34.0331° N, 5.0003° W",
          lastUpdate: "2024-01-15 13:45:00",
          data: {
            rainfall: 0,
            temperature: 0,
            humidity: 0,
            windSpeed: 0,
            pressure: 0
          },
          status: 'offline'
        }
      ];

      setTimeout(() => {
        setStations(mockStations);
        setLoading(false);
      }, 1000);
    };

    loadWeatherData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En ligne';
      case 'offline': return 'Hors ligne';
      case 'maintenance': return 'Maintenance';
      default: return 'Inconnu';
    }
  };

  const getRainfallStatus = (rainfall: number) => {
    if (rainfall < 20) return { status: 'Sécheresse', color: 'bg-red-100 text-red-800' };
    if (rainfall < 50) return { status: 'Faible', color: 'bg-yellow-100 text-yellow-800' };
    if (rainfall < 100) return { status: 'Normal', color: 'bg-green-100 text-green-800' };
    return { status: 'Élevé', color: 'bg-blue-100 text-blue-800' };
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 10) return { status: 'Froid', color: 'bg-blue-100 text-blue-800' };
    if (temp < 20) return { status: 'Frais', color: 'bg-cyan-100 text-cyan-800' };
    if (temp < 30) return { status: 'Tempéré', color: 'bg-green-100 text-green-800' };
    return { status: 'Chaud', color: 'bg-orange-100 text-orange-800' };
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simuler le rafraîchissement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Données météo en temps réel</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des données météo...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Données météo en temps réel</h2>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(stations.reduce((sum, s) => sum + s.data.rainfall, 0) / stations.filter(s => s.status === 'online').length)}mm
                </div>
                <div className="text-sm text-gray-600">Pluviométrie moyenne</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Thermometer className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(stations.reduce((sum, s) => sum + s.data.temperature, 0) / stations.filter(s => s.status === 'online').length)}°C
                </div>
                <div className="text-sm text-gray-600">Température moyenne</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Wind className="h-8 w-8 text-cyan-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(stations.reduce((sum, s) => sum + s.data.windSpeed, 0) / stations.filter(s => s.status === 'online').length)} km/h
                </div>
                <div className="text-sm text-gray-600">Vent moyen</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stations.filter(s => s.status === 'online').length}/{stations.length}
                </div>
                <div className="text-sm text-gray-600">Stations actives</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des stations */}
      <div className="space-y-4">
        {stations.map((station) => {
          const rainfallStatus = getRainfallStatus(station.data.rainfall);
          const temperatureStatus = getTemperatureStatus(station.data.temperature);
          
          return (
            <Card key={station.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{station.name}</h3>
                      <p className="text-sm text-gray-600">{station.location}</p>
                      <p className="text-xs text-gray-500">{station.coordinates}</p>
                      <p className="text-xs text-gray-500">Dernière mise à jour: {station.lastUpdate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(station.status)}>
                      {getStatusText(station.status)}
                    </Badge>
                    {station.status === 'online' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStation(selectedStation === station.id ? null : station.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    )}
                  </div>
                </div>

                {selectedStation === station.id && station.status === 'online' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Droplets className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-900">{station.data.rainfall}mm</div>
                        <div className="text-xs text-gray-600">Pluviométrie</div>
                        <Badge className={rainfallStatus.color}>
                          {rainfallStatus.status}
                        </Badge>
                      </div>
                      
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Thermometer className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-900">{station.data.temperature}°C</div>
                        <div className="text-xs text-gray-600">Température</div>
                        <Badge className={temperatureStatus.color}>
                          {temperatureStatus.status}
                        </Badge>
                      </div>
                      
                      <div className="text-center p-3 bg-cyan-50 rounded-lg">
                        <Wind className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-900">{station.data.windSpeed} km/h</div>
                        <div className="text-xs text-gray-600">Vent</div>
                      </div>
                      
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{station.data.humidity}%</div>
                        <div className="text-xs text-gray-600">Humidité</div>
                      </div>
                      
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{station.data.pressure} hPa</div>
                        <div className="text-xs text-gray-600">Pression</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertes météo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-orange-600" />
            Alertes météo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Sécheresse détectée</p>
                <p className="text-xs text-gray-600">Pluviométrie moyenne de 35mm - seuil critique atteint</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Vent fort prévu</p>
                <p className="text-xs text-gray-600">Rafales jusqu'à 25 km/h attendues dans les prochaines heures</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
