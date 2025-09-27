'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Sun,
  Wind,
  Snowflake,
  CloudRain,
  MapPin,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { suiContractService } from '@/services/sui-contract';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [contractData, setContractData] = useState<any>(null);
  const [poolStats, setPoolStats] = useState<any>(null);

  // Charger les données du contrat depuis localStorage
  useEffect(() => {
    const storedContract = localStorage.getItem('rainGuardContract');
    if (storedContract) {
      setContractData(JSON.parse(storedContract));
    }
    
    // Charger les statistiques du pool
    loadPoolStats();
  }, []);

  const loadPoolStats = async () => {
    try {
      const stats = await suiContractService.getPoolStats();
      setPoolStats(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Données simulées - dans une vraie app, ces données viendraient du contrat Sui
  const farmerData = {
    name: "Jean Dupont",
    farmName: "Ferme des Champs Verts",
    location: "Normandie, France",
    farmSize: 45,
    policies: [
      {
        id: "POL-001",
        type: "Sécheresse",
        status: "active",
        coverage: 50000,
        premium: 150,
        startDate: "2024-01-15",
        endDate: "2024-12-15",
        riskLevel: "medium"
      },
      {
        id: "POL-002", 
        type: "Grêle",
        status: "active",
        coverage: 30000,
        premium: 200,
        startDate: "2024-02-01",
        endDate: "2024-12-31",
        riskLevel: "high"
      }
    ],
    claims: [
      {
        id: "CLM-001",
        policyId: "POL-001",
        type: "Sécheresse",
        amount: 5000,
        status: "approved",
        date: "2024-06-15",
        description: "Dommages dus à la sécheresse sur 15 hectares"
      }
    ],
    weatherData: {
      current: {
        temperature: 28,
        humidity: 45,
        rainfall: 0,
        windSpeed: 12,
        riskLevel: "medium"
      },
      forecast: [
        { date: "2024-12-20", temperature: 25, rainfall: 0, risk: "drought" },
        { date: "2024-12-21", temperature: 22, rainfall: 5, risk: "none" },
        { date: "2024-12-22", temperature: 20, rainfall: 15, risk: "none" },
        { date: "2024-12-23", temperature: 18, rainfall: 8, risk: "none" },
        { date: "2024-12-24", temperature: 16, rainfall: 2, risk: "none" }
      ]
    }
  };

  const stats = [
    {
      title: "Policies Actives",
      value: contractData ? "1" : "0",
      change: contractData ? "+1" : "0",
      changeType: contractData ? "positive" : "neutral",
      icon: Shield
    },
    {
      title: "Couverture Totale",
      value: contractData ? `${contractData.fieldData.coverageAmount}€` : "0€",
      change: contractData ? `+${contractData.fieldData.coverageAmount}€` : "0€",
      changeType: contractData ? "positive" : "neutral", 
      icon: DollarSign
    },
    {
      title: "Réclamations",
      value: farmerData.claims.length,
      change: "1 approuvée",
      changeType: "neutral",
      icon: CheckCircle
    },
    {
      title: "Prime Mensuelle",
      value: contractData ? `${contractData.premium}€` : "0€",
      change: contractData ? "Active" : "Aucune",
      changeType: contractData ? "positive" : "neutral",
      icon: AlertTriangle
    }
  ];

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

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'drought': return 'bg-yellow-100 text-yellow-800';
      case 'flood': return 'bg-blue-100 text-blue-800';
      case 'hail': return 'bg-gray-100 text-gray-800';
      case 'storm': return 'bg-purple-100 text-purple-800';
      case 'frost': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
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
                  <p className="text-sm text-gray-600">Tableau de bord</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Bonjour,</p>
                <p className="font-medium">{farmerData.name}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">JD</span>
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
              { id: 'policies', name: 'Mes polices' },
              { id: 'claims', name: 'Réclamations' },
              { id: 'weather', name: 'Météo' }
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
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className={`text-sm ${
                            stat.changeType === 'positive' ? 'text-green-600' :
                            stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {stat.change}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Icon className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Informations de l'exploitation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-green-600" />
                    Mon exploitation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Nom de l'exploitation</p>
                      <p className="font-medium">{contractData?.fieldData?.fieldName || farmerData.farmName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Localisation</p>
                      <p className="font-medium">{contractData?.fieldData?.location || farmerData.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Surface</p>
                      <p className="font-medium">{contractData?.fieldData?.totalArea || farmerData.farmSize} hectares</p>
                    </div>
                    {contractData && (
                      <div>
                        <p className="text-sm text-gray-600">Culture</p>
                        <p className="font-medium">{contractData.fieldData.cropType}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {contractData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-green-600" />
                      Mon contrat d'assurance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">ID du contrat</p>
                        <p className="font-medium font-mono text-sm">{contractData.policyId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Couverture</p>
                        <p className="font-medium">{contractData.fieldData.coverageAmount}€</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Prime mensuelle</p>
                        <p className="font-medium text-green-600">{contractData.premium}€</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Risques couverts</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contractData.fieldData.selectedRisks.map((risk: string) => {
                            const riskNames: { [key: string]: string } = {
                              'drought': 'Sécheresse',
                              'flood': 'Inondation',
                              'hail': 'Grêle',
                              'storm': 'Tempête',
                              'frost': 'Gel'
                            };
                            return (
                              <Badge key={risk} variant="outline" className="text-xs">
                                {riskNames[risk] || risk}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-green-600" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Réclamation approuvée</p>
                          <p className="text-xs text-gray-600">15 juin 2024</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">5,000€</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Nouvelle police</p>
                          <p className="text-xs text-gray-600">1 février 2024</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Grêle</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Mes polices */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Mes polices d'assurance</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <Shield className="mr-2 h-4 w-4" />
                Nouvelle police
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {farmerData.policies.map((policy) => {
                const RiskIcon = getRiskIcon(policy.type.toLowerCase());
                return (
                  <Card key={policy.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <RiskIcon className="mr-2 h-5 w-5 text-green-600" />
                          {policy.type}
                        </CardTitle>
                        <Badge className={getRiskColor(policy.riskLevel)}>
                          {policy.status}
                        </Badge>
                      </div>
                      <CardDescription>Police #{policy.id}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Couverture</p>
                            <p className="font-medium">{policy.coverage.toLocaleString()}€</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prime mensuelle</p>
                            <p className="font-medium">{policy.premium}€</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Début</p>
                            <p className="font-medium">{policy.startDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Fin</p>
                            <p className="font-medium">{policy.endDate}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                          <Button variant="outline" size="sm">
                            Réclamer
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

        {/* Réclamations */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Mes réclamations</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Nouvelle réclamation
              </Button>
            </div>

            <div className="space-y-4">
              {farmerData.claims.map((claim) => (
                <Card key={claim.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Réclamation #{claim.id}</h3>
                          <p className="text-sm text-gray-600">{claim.description}</p>
                          <p className="text-xs text-gray-500">{claim.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{claim.amount.toLocaleString()}€</p>
                        <Badge className="bg-green-100 text-green-800">
                          {claim.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Météo */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Conditions météo</h2>
            
            {/* Conditions actuelles */}
            <Card>
              <CardHeader>
                <CardTitle>Conditions actuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{farmerData.weatherData.current.temperature}°C</p>
                    <p className="text-sm text-gray-600">Température</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{farmerData.weatherData.current.humidity}%</p>
                    <p className="text-sm text-gray-600">Humidité</p>
                  </div>
                  <div className="text-center">
                    <CloudRain className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{farmerData.weatherData.current.rainfall}mm</p>
                    <p className="text-sm text-gray-600">Pluie</p>
                  </div>
                  <div className="text-center">
                    <Wind className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{farmerData.weatherData.current.windSpeed}km/h</p>
                    <p className="text-sm text-gray-600">Vent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prévisions */}
            <Card>
              <CardHeader>
                <CardTitle>Prévisions météo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmerData.weatherData.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{day.date}</p>
                          <p className="text-sm text-gray-600">
                            {day.temperature}°C, {day.rainfall}mm de pluie
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {day.risk === 'none' ? (
                          <Badge className="bg-green-100 text-green-800">Aucun risque</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Risque {day.risk}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
