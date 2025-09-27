'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft,
  Droplets,
  Sun,
  CloudRain,
  Wind,
  Snowflake,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { nautilusOracleService } from '@/services/nautilus-oracle';

export default function ParametricDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [parametricPolicies, setParametricPolicies] = useState<any[]>([]);
  const [oracleStatus, setOracleStatus] = useState<any>(null);

  // Charger les données au montage
  useEffect(() => {
    loadWeatherData();
    loadParametricPolicies();
    checkOracleStatus();
  }, []);

  const loadWeatherData = async () => {
    try {
      // Simulation des données météo depuis l'oracle Nautilus
      const data = await nautilusOracleService.getWeatherData({
        latitude: 48.8566,
        longitude: 2.3522,
        productType: 'seasonal'
      });
      setWeatherData(data);
    } catch (error) {
      console.error('Erreur lors du chargement des données météo:', error);
    }
  };

  const loadParametricPolicies = () => {
    // Simulation des polices paramétriques
    const policies = [
      {
        id: 'POL-PARAM-001',
        type: 'seasonal',
        name: 'Assurance Saisonnière Blé',
        coverageAmount: 50000,
        premium: 250,
        triggerThreshold: 200,
        saturationThreshold: 100,
        status: 'active',
        weatherIndex: 150,
        riskLevel: 'medium',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      {
        id: 'POL-PARAM-002',
        type: 'event',
        name: 'Assurance Événementielle Maïs',
        coverageAmount: 30000,
        premium: 180,
        triggerThreshold: 50,
        saturationThreshold: 25,
        status: 'active',
        weatherIndex: 35,
        riskLevel: 'low',
        startDate: '2024-03-01',
        endDate: '2024-11-30'
      }
    ];
    setParametricPolicies(policies);
  };

  const checkOracleStatus = () => {
    // Simulation du statut de l'oracle
    setOracleStatus({
      status: 'active',
      lastUpdate: new Date().toISOString(),
      quorumReached: true,
      confidenceScore: 95,
      oracleCount: 3
    });
  };

  const getRiskIcon = (risk: string) => {
    switch(risk) {
      case 'drought': return Sun;
      case 'flood': return Droplets;
      case 'hail': return Snowflake;
      case 'storm': return Wind;
      case 'frost': return CloudRain;
      default: return AlertTriangle;
    }
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProductTypeInfo = (type: string) => {
    switch(type) {
      case 'seasonal':
        return {
          name: 'Saisonnière',
          icon: Calendar,
          color: 'bg-blue-100 text-blue-800',
          description: 'Pluie cumulée sur la période'
        };
      case 'event':
        return {
          name: 'Événementielle',
          icon: Zap,
          color: 'bg-red-100 text-red-800',
          description: 'Pluie en 24h'
        };
      default:
        return {
          name: 'Inconnu',
          icon: AlertTriangle,
          color: 'bg-gray-100 text-gray-800',
          description: 'Type non défini'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RainGuard</h1>
                  <p className="text-sm text-gray-600">Dashboard Paramétrique</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Oracle Nautilus TEE</p>
                <p className="font-medium text-green-600">
                  {oracleStatus?.status === 'active' ? 'Actif' : 'Inactif'}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">N</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Vue d\'ensemble' },
              { id: 'policies', name: 'Polices paramétriques' },
              { id: 'weather', name: 'Données météo' },
              { id: 'oracle', name: 'Statut Oracle' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Polices Actives</p>
                      <p className="text-2xl font-bold text-gray-900">{parametricPolicies.length}</p>
                      <p className="text-sm text-green-600">Paramétriques</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Couverture Totale</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {parametricPolicies.reduce((sum, p) => sum + p.coverageAmount, 0).toLocaleString()}€
                      </p>
                      <p className="text-sm text-blue-600">Protection active</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Oracle Status</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {oracleStatus?.confidenceScore || 0}%
                      </p>
                      <p className="text-sm text-green-600">Confiance élevée</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dernière Mise à Jour</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {oracleStatus?.lastUpdate ? new Date(oracleStatus.lastUpdate).toLocaleTimeString() : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">Données temps réel</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Polices paramétriques actives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-green-600" />
                  Polices paramétriques actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parametricPolicies.map((policy) => {
                    const productInfo = getProductTypeInfo(policy.type);
                    const ProductIcon = productInfo.icon;
                    
                    return (
                      <div key={policy.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full ${productInfo.color} flex items-center justify-center`}>
                              <ProductIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{policy.name}</h3>
                              <p className="text-sm text-gray-600">{productInfo.description}</p>
                            </div>
                          </div>
                          <Badge className={getRiskColor(policy.riskLevel)}>
                            {policy.riskLevel}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Couverture</p>
                            <p className="font-medium">{policy.coverageAmount.toLocaleString()}€</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Seuil de déclenchement</p>
                            <p className="font-medium">{policy.triggerThreshold}mm</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Indice météo actuel</p>
                            <p className="font-medium text-blue-600">{policy.weatherIndex}mm</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Statut</p>
                            <p className="font-medium text-green-600">Actif</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Polices paramétriques */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Mes polices paramétriques</h2>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/parametric-insurance">
                  <Shield className="mr-2 h-4 w-4" />
                  Nouvelle police paramétrique
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {parametricPolicies.map((policy) => {
                const productInfo = getProductTypeInfo(policy.type);
                const ProductIcon = productInfo.icon;
                
                return (
                  <Card key={policy.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <ProductIcon className="mr-2 h-5 w-5 text-green-600" />
                          {policy.name}
                        </CardTitle>
                        <Badge className={getRiskColor(policy.riskLevel)}>
                          {policy.riskLevel}
                        </Badge>
                      </div>
                      <CardDescription>Police #{policy.id}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Type de produit</p>
                            <p className="font-medium">{productInfo.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Couverture</p>
                            <p className="font-medium">{policy.coverageAmount.toLocaleString()}€</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Seuil de déclenchement</p>
                            <p className="font-medium">{policy.triggerThreshold}mm</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prime mensuelle</p>
                            <p className="font-medium">{policy.premium}€</p>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Indice météo actuel:</span>
                            <span className="font-bold text-blue-600">{policy.weatherIndex}mm</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min((policy.weatherIndex / policy.triggerThreshold) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {policy.weatherIndex >= policy.triggerThreshold 
                              ? 'Conditions de déclenchement remplies' 
                              : `${policy.triggerThreshold - policy.weatherIndex}mm avant déclenchement`
                            }
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                          <Button variant="outline" size="sm">
                            Historique
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Données météo */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Données météo en temps réel</h2>
            
            {weatherData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{weatherData.cumulativeRainfall}mm</p>
                    <p className="text-sm text-gray-600">Pluie cumulée</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <CloudRain className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{weatherData.rainfall24h}mm</p>
                    <p className="text-sm text-gray-600">Pluie 24h</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{weatherData.confidenceScore}%</p>
                    <p className="text-sm text-gray-600">Confiance Oracle</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{weatherData.oracleAddresses.length}</p>
                    <p className="text-sm text-gray-600">Oracles actifs</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Statut de l'oracle Nautilus TEE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Oracle actif</p>
                        <p className="text-sm text-gray-600">Données en temps réel</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">En ligne</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Dernière mise à jour</p>
                      <p className="font-medium">{oracleStatus?.lastUpdate ? new Date(oracleStatus.lastUpdate).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Score de confiance</p>
                      <p className="font-medium">{oracleStatus?.confidenceScore || 0}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quorum atteint</p>
                      <p className="font-medium text-green-600">{oracleStatus?.quorumReached ? 'Oui' : 'Non'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Oracles actifs</p>
                      <p className="font-medium">{oracleStatus?.oracleCount || 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Statut Oracle */}
        {activeTab === 'oracle' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Statut de l'oracle Nautilus TEE</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-green-600" />
                    Statut général
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Statut</span>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dernière mise à jour</span>
                      <span className="font-medium">{oracleStatus?.lastUpdate ? new Date(oracleStatus.lastUpdate).toLocaleString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Score de confiance</span>
                      <span className="font-medium text-green-600">{oracleStatus?.confidenceScore || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quorum atteint</span>
                      <span className="font-medium text-green-600">{oracleStatus?.quorumReached ? 'Oui' : 'Non'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-blue-600" />
                    Oracles actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((oracleId) => (
                      <div key={oracleId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">{oracleId}</span>
                          </div>
                          <div>
                            <p className="font-medium">Oracle {oracleId}</p>
                            <p className="text-sm text-gray-600">Nautilus TEE</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Actif</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
