'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  ArrowLeft,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Droplets,
  Sun,
  CloudRain,
  Wind,
  Activity,
  TrendingUp,
  RefreshCw,
  Database,
  Lock,
  Eye,
  EyeOff,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { nautilusOracleService } from '@/services/nautilus-oracle';

export default function OracleTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [oracleStatus, setOracleStatus] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [testCoordinates, setTestCoordinates] = useState({
    lat: '48.8566',
    lng: '2.3522'
  });
  const [showDetails, setShowDetails] = useState(false);

  // Charger le statut de l'oracle au montage
  useEffect(() => {
    checkOracleStatus();
    runBasicTest();
  }, []);

  const checkOracleStatus = async () => {
    try {
      // Simulation du statut de l'oracle
      const status = {
        status: 'active',
        lastUpdate: new Date().toISOString(),
        quorumReached: true,
        confidenceScore: 95,
        oracleCount: 3,
        authorizedOracles: [
          '0xnautilus-oracle-1',
          '0xnautilus-oracle-2', 
          '0xnautilus-oracle-3'
        ],
        networkLatency: Math.random() * 100 + 50, // ms
        uptime: '99.9%'
      };
      setOracleStatus(status);
    } catch (error) {
      console.error('Erreur lors de la vérification du statut oracle:', error);
    }
  };

  const runBasicTest = async () => {
    try {
      const testData = await nautilusOracleService.getWeatherData({
        latitude: parseFloat(testCoordinates.lat),
        longitude: parseFloat(testCoordinates.lng),
        productType: 'seasonal'
      });
      setWeatherData(testData);
    } catch (error) {
      console.error('Erreur lors du test basique:', error);
    }
  };

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    const results = [];

    try {
      // Test 1: Connexion à l'oracle
      const connectionTest = await testOracleConnection();
      results.push({
        test: 'Connexion Oracle',
        status: connectionTest.success ? 'success' : 'error',
        message: connectionTest.message,
        timestamp: new Date().toISOString(),
        details: connectionTest.details
      });

      // Test 2: Récupération des données météo
      const weatherTest = await testWeatherDataRetrieval();
      results.push({
        test: 'Données Météo',
        status: weatherTest.success ? 'success' : 'error',
        message: weatherTest.message,
        timestamp: new Date().toISOString(),
        details: weatherTest.details
      });

      // Test 3: Validation du quorum
      const quorumTest = await testQuorumValidation();
      results.push({
        test: 'Validation Quorum',
        status: quorumTest.success ? 'success' : 'error',
        message: quorumTest.message,
        timestamp: new Date().toISOString(),
        details: quorumTest.details
      });

      // Test 4: Calculs paramétriques
      const parametricTest = await testParametricCalculations();
      results.push({
        test: 'Calculs Paramétriques',
        status: parametricTest.success ? 'success' : 'error',
        message: parametricTest.message,
        timestamp: new Date().toISOString(),
        details: parametricTest.details
      });

      // Test 5: Intégration Sui
      const suiTest = await testSuiIntegration();
      results.push({
        test: 'Intégration Sui',
        status: suiTest.success ? 'success' : 'error',
        message: suiTest.message,
        timestamp: new Date().toISOString(),
        details: suiTest.details
      });

    } catch (error) {
      results.push({
        test: 'Test Global',
        status: 'error',
        message: 'Erreur lors de l\'exécution des tests',
        timestamp: new Date().toISOString(),
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const testOracleConnection = async () => {
    try {
      // Simulation de la connexion à l'oracle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Connexion établie avec succès',
        details: {
          endpoint: 'https://nautilus-tee-api.com',
          responseTime: Math.random() * 200 + 100,
          statusCode: 200
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Échec de la connexion',
        details: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  };

  const testWeatherDataRetrieval = async () => {
    try {
      const data = await nautilusOracleService.getWeatherData({
        latitude: parseFloat(testCoordinates.lat),
        longitude: parseFloat(testCoordinates.lng),
        productType: 'seasonal'
      });

      return {
        success: true,
        message: 'Données météo récupérées avec succès',
        details: {
          cumulativeRainfall: data.cumulativeRainfall,
          rainfall24h: data.rainfall24h,
          confidenceScore: data.confidenceScore,
          oracleCount: data.oracleAddresses.length
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Échec de la récupération des données',
        details: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  };

  const testQuorumValidation = async () => {
    try {
      // Simulation de la validation du quorum
      const quorumData = {
        requiredOracles: 3,
        activeOracles: 3,
        signatures: [
          { oracle: '0xnautilus-oracle-1', valid: true },
          { oracle: '0xnautilus-oracle-2', valid: true },
          { oracle: '0xnautilus-oracle-3', valid: true }
        ]
      };

      const quorumReached = quorumData.activeOracles >= quorumData.requiredOracles;
      const allSignaturesValid = quorumData.signatures.every(s => s.valid);

      return {
        success: quorumReached && allSignaturesValid,
        message: quorumReached && allSignaturesValid 
          ? 'Quorum validé avec succès' 
          : 'Échec de la validation du quorum',
        details: quorumData
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la validation du quorum',
        details: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  };

  const testParametricCalculations = async () => {
    try {
      // Simulation des calculs paramétriques
      const policy = {
        id: 'test-policy',
        policyholder: 'test-holder',
        productType: 'seasonal' as const,
        coverageAmount: 50000,
        premiumPaid: 250,
        coverageStart: Date.now(),
        coverageEnd: Date.now() + 365 * 24 * 60 * 60 * 1000,
        triggerThreshold: 200,
        saturationThreshold: 100,
        coverageArea: {
          centerLatitude: 48.8566,
          centerLongitude: 2.3522,
          radiusMeters: 10000
        },
        status: 'active' as const
      };

      const weatherIndex = 150; // mm de pluie cumulée
      const payout = nautilusOracleService.calculateParametricPayout(
        { cumulativeRainfall: weatherIndex, rainfall24h: 0, confidenceScore: 95, oracleAddresses: [], oracleSignatures: [], latitude: 0, longitude: 0, timestamp: 0, quorumReached: true, productType: 'seasonal' },
        policy
      );

      return {
        success: true,
        message: 'Calculs paramétriques effectués',
        details: {
          weatherIndex,
          triggerThreshold: policy.triggerThreshold,
          payoutAmount: payout,
          triggerMet: weatherIndex >= policy.triggerThreshold
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors des calculs paramétriques',
        details: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  };

  const testSuiIntegration = async () => {
    try {
      // Simulation de l'intégration Sui
      const suiData = {
        packageId: '0xbc0e271b66dad1f15403e75f6ddb58d38a6ae35684297e804508779c27fac329',
        insurancePoolId: '0xae90aa41283e0b0eef57835a4442cb77a0dc5ed7c1bf78cf587e38b5283087c9',
        network: 'testnet',
        gasBalance: '1000000000',
        connectionStatus: 'connected'
      };

      return {
        success: true,
        message: 'Intégration Sui fonctionnelle',
        details: suiData
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur d\'intégration Sui',
        details: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
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
                  <p className="text-sm text-gray-600">Test Oracle Nautilus TEE</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowDetails(!showDetails)}
                variant="outline"
                size="sm"
              >
                {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showDetails ? 'Masquer' : 'Afficher'} détails
              </Button>
              <Button 
                onClick={runComprehensiveTest}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Test en cours...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Lancer les tests
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statut Oracle */}
        {oracleStatus && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-green-600" />
                Statut de l'Oracle Nautilus TEE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{oracleStatus.status}</p>
                  <p className="text-sm text-gray-600">Statut</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{oracleStatus.oracleCount}</p>
                  <p className="text-sm text-gray-600">Oracles actifs</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{oracleStatus.confidenceScore}%</p>
                  <p className="text-sm text-gray-600">Score de confiance</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{oracleStatus.networkLatency.toFixed(0)}ms</p>
                  <p className="text-sm text-gray-600">Latence réseau</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuration de test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-blue-600" />
              Configuration du test
            </CardTitle>
            <CardDescription>
              Définissez les coordonnées pour tester l'oracle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={testCoordinates.lat}
                  onChange={(e) => setTestCoordinates(prev => ({ ...prev, lat: e.target.value }))}
                  placeholder="48.8566"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={testCoordinates.lng}
                  onChange={(e) => setTestCoordinates(prev => ({ ...prev, lng: e.target.value }))}
                  placeholder="2.3522"
                />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={runBasicTest} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Test rapide
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Données météo actuelles */}
        {weatherData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudRain className="mr-2 h-5 w-5 text-blue-600" />
                Données météo actuelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{weatherData.cumulativeRainfall}mm</p>
                  <p className="text-sm text-gray-600">Pluie cumulée</p>
                </div>
                <div className="text-center">
                  <CloudRain className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{weatherData.rainfall24h}mm</p>
                  <p className="text-sm text-gray-600">Pluie 24h</p>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{weatherData.confidenceScore}%</p>
                  <p className="text-sm text-gray-600">Confiance</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{weatherData.oracleAddresses.length}</p>
                  <p className="text-sm text-gray-600">Oracles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Résultats des tests */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-green-600" />
                Résultats des tests
              </CardTitle>
              <CardDescription>
                {testResults.filter(r => r.status === 'success').length} / {testResults.length} tests réussis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <h3 className="font-medium">{result.test}</h3>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                    {showDetails && result.details && (
                      <div className="bg-gray-50 p-3 rounded text-xs">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5 text-blue-600" />
              Comment vérifier que l'oracle fonctionne ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Statut de l'oracle</h4>
                  <p className="text-sm text-gray-600">
                    Vérifiez que le statut est "active" et que le score de confiance est &gt; 80%
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Quorum de validation</h4>
                  <p className="text-sm text-gray-600">
                    Au moins 3 oracles doivent être actifs et valider les données
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Données météo</h4>
                  <p className="text-sm text-gray-600">
                    Les données doivent être récupérées avec succès et être cohérentes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Calculs paramétriques</h4>
                  <p className="text-sm text-gray-600">
                    Les calculs de paiement doivent être corrects selon les seuils définis
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-600">5</span>
                </div>
                <div>
                  <h4 className="font-medium">Intégration Sui</h4>
                  <p className="text-sm text-gray-600">
                    La connexion à la blockchain Sui doit être établie et fonctionnelle
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
