'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Droplets, Thermometer, Wind, Eye, RefreshCw } from "lucide-react";

interface WeatherDataProps {
  onBack: () => void;
}

interface WeatherReading {
  timestamp: string;
  rainfall_mm: number;
  temperature_celsius: number;
  humidity_percent: number;
  wind_speed_kmh: number;
  location: string;
}

export function WeatherData({ onBack }: WeatherDataProps) {
  const [weatherData, setWeatherData] = useState<WeatherReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("Marrakech, Maroc");

  const locations = [
    "Marrakech, Maroc",
    "Casablanca, Maroc", 
    "Rabat, Maroc",
    "Fès, Maroc"
  ];

  useEffect(() => {
    // Simulation de données météo - dans une vraie app, ceci viendrait d'un oracle
    const mockWeatherData: WeatherReading[] = [
      {
        timestamp: "2024-01-15T10:00:00Z",
        rainfall_mm: 32,
        temperature_celsius: 24,
        humidity_percent: 45,
        wind_speed_kmh: 12,
        location: "Marrakech, Maroc"
      },
      {
        timestamp: "2024-01-14T10:00:00Z",
        rainfall_mm: 28,
        temperature_celsius: 26,
        humidity_percent: 42,
        wind_speed_kmh: 15,
        location: "Marrakech, Maroc"
      },
      {
        timestamp: "2024-01-13T10:00:00Z",
        rainfall_mm: 35,
        temperature_celsius: 23,
        humidity_percent: 48,
        wind_speed_kmh: 8,
        location: "Marrakech, Maroc"
      },
      {
        timestamp: "2024-01-12T10:00:00Z",
        rainfall_mm: 18,
        temperature_celsius: 28,
        humidity_percent: 38,
        wind_speed_kmh: 20,
        location: "Marrakech, Maroc"
      },
      {
        timestamp: "2024-01-11T10:00:00Z",
        rainfall_mm: 45,
        temperature_celsius: 22,
        humidity_percent: 52,
        wind_speed_kmh: 6,
        location: "Marrakech, Maroc"
      }
    ];

    setTimeout(() => {
      setWeatherData(mockWeatherData);
      setLoading(false);
    }, 1000);
  }, [selectedLocation]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getRainfallStatus = (rainfall: number) => {
    if (rainfall < 30) return { status: "Sécheresse", color: "bg-red-100 text-red-800" };
    if (rainfall > 100) return { status: "Inondation", color: "bg-blue-100 text-blue-800" };
    return { status: "Normal", color: "bg-green-100 text-green-800" };
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 15) return { status: "Froid", color: "bg-blue-100 text-blue-800" };
    if (temp > 35) return { status: "Chaud", color: "bg-red-100 text-red-800" };
    return { status: "Normal", color: "bg-green-100 text-green-800" };
  };

  const getWindStatus = (wind: number) => {
    if (wind > 60) return { status: "Tempête", color: "bg-red-100 text-red-800" };
    if (wind > 30) return { status: "Vent fort", color: "bg-yellow-100 text-yellow-800" };
    return { status: "Normal", color: "bg-green-100 text-green-800" };
  };

  const latestData = weatherData[0];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Données Météo</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des données météo...</p>
        </div>
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
          <h2 className="text-2xl font-bold text-gray-900">Données Météo</h2>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Sélecteur de localisation */}
      <Card>
        <CardHeader>
          <CardTitle>Localisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLocation(location)}
                className={selectedLocation === location ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {location}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Données actuelles */}
      {latestData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pluviométrie</p>
                  <p className="text-2xl font-bold text-gray-900">{latestData.rainfall_mm}mm</p>
                  <Badge className={getRainfallStatus(latestData.rainfall_mm).color}>
                    {getRainfallStatus(latestData.rainfall_mm).status}
                  </Badge>
                </div>
                <Droplets className="h-8 w-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Température</p>
                  <p className="text-2xl font-bold text-gray-900">{latestData.temperature_celsius}°C</p>
                  <Badge className={getTemperatureStatus(latestData.temperature_celsius).color}>
                    {getTemperatureStatus(latestData.temperature_celsius).status}
                  </Badge>
                </div>
                <Thermometer className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Humidité</p>
                  <p className="text-2xl font-bold text-gray-900">{latestData.humidity_percent}%</p>
                  <p className="text-xs text-gray-500">Relative</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vent</p>
                  <p className="text-2xl font-bold text-gray-900">{latestData.wind_speed_kmh} km/h</p>
                  <Badge className={getWindStatus(latestData.wind_speed_kmh).color}>
                    {getWindStatus(latestData.wind_speed_kmh).status}
                  </Badge>
                </div>
                <Wind className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historique des données */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Pluie (mm)</th>
                  <th className="text-left p-2">Température (°C)</th>
                  <th className="text-left p-2">Humidité (%)</th>
                  <th className="text-left p-2">Vent (km/h)</th>
                  <th className="text-left p-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.map((data, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{new Date(data.timestamp).toLocaleDateString()}</td>
                    <td className="p-2">{data.rainfall_mm}</td>
                    <td className="p-2">{data.temperature_celsius}</td>
                    <td className="p-2">{data.humidity_percent}</td>
                    <td className="p-2">{data.wind_speed_kmh}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Badge className={getRainfallStatus(data.rainfall_mm).color}>
                          {getRainfallStatus(data.rainfall_mm).status}
                        </Badge>
                        {data.wind_speed_kmh > 60 && (
                          <Badge className="bg-red-100 text-red-800">
                            Tempête
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alertes */}
      <Card>
        <CardHeader>
          <CardTitle>Alertes Actives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {latestData && latestData.rainfall_mm < 30 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-red-800">Alerte Sécheresse</p>
                  <p className="text-xs text-red-600">
                    Pluviométrie actuelle: {latestData.rainfall_mm}mm (seuil critique: 30mm)
                  </p>
                </div>
              </div>
            )}
            
            {latestData && latestData.wind_speed_kmh > 60 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Alerte Tempête</p>
                  <p className="text-xs text-yellow-600">
                    Vents violents: {latestData.wind_speed_kmh} km/h
                  </p>
                </div>
              </div>
            )}
            
            {latestData && latestData.rainfall_mm >= 30 && latestData.rainfall_mm <= 100 && latestData.wind_speed_kmh <= 60 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-green-800">Conditions Normales</p>
                  <p className="text-xs text-green-600">
                    Toutes les conditions météo sont dans les normes
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
