'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Play,
  Pause,
  Settings,
  BarChart3,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { oracleMonitoringService, OracleStatus } from '@/services/oracle-monitoring';

export default function OracleMonitoringPage() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [oracleStatus, setOracleStatus] = useState<OracleStatus | null>(null);
  const [statusHistory, setStatusHistory] = useState<OracleStatus[]>([]);
  const [healthReport, setHealthReport] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Démarrer le monitoring au montage
  useEffect(() => {
    startMonitoring();
    
    // Callback pour recevoir les mises à jour
    const handleStatusUpdate = (status: OracleStatus) => {
      setOracleStatus(status);
      setStatusHistory(prev => [status, ...prev.slice(0, 49)]); // Garder les 50 derniers
    };

    oracleMonitoringService.onStatusUpdate(handleStatusUpdate);

    return () => {
      oracleMonitoringService.removeCallback(handleStatusUpdate);
      stopMonitoring();
    };
  }, []);

  const startMonitoring = () => {
    oracleMonitoringService.startMonitoring(10000); // Toutes les 10 secondes
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    oracleMonitoringService.stopMonitoring();
    setIsMonitoring(false);
  };

  const generateHealthReport = async () => {
    try {
      const report = await oracleMonitoringService.generateHealthReport();
      setHealthReport(report);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusTrend = () => {
    if (statusHistory.length < 2) return 'stable';
    
    const recent = statusHistory.slice(0, 5);
    const healthyCount = recent.filter(s => s.status === 'healthy').length;
    
    if (healthyCount === recent.length) return 'improving';
    if (healthyCount === 0) return 'declining';
    return 'stable';
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
                  <p className="text-sm text-gray-600">Monitoring Oracle Nautilus TEE</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={isMonitoring ? stopMonitoring : startMonitoring}
                  variant={isMonitoring ? "destructive" : "default"}
                  size="sm"
                >
                  {isMonitoring ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Arrêter
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Démarrer
                    </>
                  )}
                </Button>
                <Button
                  onClick={generateHealthReport}
                  variant="outline"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Rapport
                </Button>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Monitoring</p>
                <p className="font-medium text-green-600">
                  {isMonitoring ? 'Actif' : 'Inactif'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statut global */}
        {oracleStatus && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="mr-2 h-5 w-5 text-green-600" />
                  Statut Oracle Nautilus TEE
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(oracleStatus.status)}
                  <Badge className={getStatusColor(oracleStatus.status)}>
                    {oracleStatus.status}
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Dernière mise à jour: {new Date(oracleStatus.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Test de connexion */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Connexion</h3>
                    {oracleStatus.details.connection?.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {oracleStatus.details.connection?.message || 'Test en cours...'}
                  </p>
                  {oracleStatus.details.connection?.details?.responseTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      {oracleStatus.details.connection.details.responseTime}ms
                    </p>
                  )}
                </div>

                {/* Données météo */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Données Météo</h3>
                    {oracleStatus.details.weather?.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {oracleStatus.details.weather?.message || 'Test en cours...'}
                  </p>
                  {oracleStatus.details.weather?.details?.confidenceScore && (
                    <p className="text-xs text-gray-500 mt-1">
                      Confiance: {oracleStatus.details.weather.details.confidenceScore.toFixed(1)}%
                    </p>
                  )}
                </div>

                {/* Quorum */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Quorum</h3>
                    {oracleStatus.details.quorum?.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {oracleStatus.details.quorum?.message || 'Test en cours...'}
                  </p>
                  {oracleStatus.details.quorum?.details?.activeOracles && (
                    <p className="text-xs text-gray-500 mt-1">
                      {oracleStatus.details.quorum.details.activeOracles}/{oracleStatus.details.quorum.details.requiredOracles} oracles
                    </p>
                  )}
                </div>

                {/* Sui */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Sui</h3>
                    {oracleStatus.details.sui?.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {oracleStatus.details.sui?.message || 'Test en cours...'}
                  </p>
                  {oracleStatus.details.sui?.details?.network && (
                    <p className="text-xs text-gray-500 mt-1">
                      Réseau: {oracleStatus.details.sui.details.network}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Historique des statuts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-600" />
                Historique des statuts
              </CardTitle>
              <CardDescription>
                Dernières 50 mises à jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {statusHistory.map((status, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status.status)}
                      <div>
                        <p className="text-sm font-medium">{status.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(status.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(status.status)}>
                      {status.status}
                    </Badge>
                  </div>
                ))}
                {statusHistory.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Aucun historique disponible
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rapport de santé */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
                Rapport de santé
              </CardTitle>
              <CardDescription>
                Analyse détaillée de l'oracle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthReport ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Statut global</span>
                    <Badge className={getStatusColor(healthReport.overallStatus)}>
                      {healthReport.overallStatus}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {healthReport.summary.passedTests}
                      </p>
                      <p className="text-sm text-gray-600">Tests réussis</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {healthReport.summary.failedTests}
                      </p>
                      <p className="text-sm text-gray-600">Tests échoués</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {healthReport.summary.totalTests}
                      </p>
                      <p className="text-sm text-gray-600">Total tests</p>
                    </div>
                  </div>

                  {healthReport.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommandations</h4>
                      <ul className="space-y-1">
                        {healthReport.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun rapport disponible</p>
                  <Button 
                    onClick={generateHealthReport}
                    className="mt-4"
                    size="sm"
                  >
                    Générer un rapport
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Indicateurs de performance */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              Indicateurs de performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {statusHistory.length > 0 ? 
                    Math.round(statusHistory.reduce((acc, s) => {
                      const testResults = Object.values(s.details).filter((d: any) => d.success);
                      return acc + (testResults.length / Object.keys(s.details).length);
                    }, 0) / statusHistory.length * 100) : 0}%
                </p>
                <p className="text-sm text-gray-600">Taux de réussite</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{statusHistory.length}</p>
                <p className="text-sm text-gray-600">Vérifications effectuées</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {getStatusTrend() === 'improving' ? '↗️' : 
                   getStatusTrend() === 'declining' ? '↘️' : '→'}
                </p>
                <p className="text-sm text-gray-600">Tendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
