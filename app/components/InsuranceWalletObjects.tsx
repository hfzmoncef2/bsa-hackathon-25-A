'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Droplets, 
  Shield, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { 
  suiInsuranceCleanService, 
  InsurancePolicyObject 
} from '@/services/sui-insurance-clean';

export function InsuranceWalletObjects() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [insuranceObjects, setInsuranceObjects] = useState<InsurancePolicyObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInsuranceObjects = async () => {
    if (!currentAccount) {
      setInsuranceObjects([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // const objects = await suiInsuranceCleanService.getInsuranceObjects(
      //   suiClient,
      //   currentAccount
      // );
      // setInsuranceObjects(objects);
    } catch (err) {
      console.error('Erreur lors du chargement des objets:', err);
      setError('Erreur lors du chargement des contrats d\'assurance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsuranceObjects();
  }, [currentAccount]);

  const getRiskIcon = (riskType: number) => {
    switch (riskType) {
      case 1: return <Droplets className="h-4 w-4 text-orange-500" />;
      case 2: return <Droplets className="h-4 w-4 text-blue-500" />;
      case 3: return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Actif</Badge>;
      case 2:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><Clock className="h-3 w-3 mr-1" />Expiré</Badge>;
      case 3:
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Réclamé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'SUI',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!currentAccount) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Veuillez connecter votre wallet pour voir vos contrats d'assurance.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mes Contrats d'Assurance</h2>
          <p className="text-muted-foreground">
            Vos objets d'assurance stockés dans votre wallet Sui
          </p>
        </div>
        <Button 
          onClick={loadInsuranceObjects} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Chargement des contrats...</span>
        </div>
      )}

      {!loading && insuranceObjects.length === 0 && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Aucun contrat d'assurance trouvé dans votre wallet.
          </AlertDescription>
        </Alert>
      )}

      {!loading && insuranceObjects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insuranceObjects.map((policy) => (
            <Card key={policy.objectId} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getRiskIcon(policy.riskType)}
                    <CardTitle className="text-lg">
                      {/* {suiInsuranceCleanService.getRiskTypeLabel(policy.riskType)} */}
                      Risk Type {policy.riskType}
                    </CardTitle>
                  </div>
                  {getStatusBadge(policy.status)}
                </div>
                <CardDescription className="text-sm">
                  ID: {policy.objectId.slice(0, 8)}...
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>Couverture</span>
                    </div>
                    <p className="font-semibold">{formatAmount(policy.coverageAmount)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>Prime</span>
                    </div>
                    <p className="font-semibold">{formatAmount(policy.premiumAmount)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Créé le</span>
                  </div>
                  <p className="text-sm">{formatDate(policy.createdAt)}</p>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Adresse client</span>
                    <span className="font-mono">
                      {policy.clientAddress.slice(0, 6)}...{policy.clientAddress.slice(-4)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && insuranceObjects.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {insuranceObjects.length} contrat{insuranceObjects.length > 1 ? 's' : ''} trouvé{insuranceObjects.length > 1 ? 's' : ''} dans votre wallet
        </div>
      )}
    </div>
  );
}
