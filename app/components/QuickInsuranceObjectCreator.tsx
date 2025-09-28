'use client';

import React, { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Droplets, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { suiInsuranceObjectsService } from '@/services/sui-insurance-objects';

export function QuickInsuranceObjectCreator() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  
  const [coverageAmount, setCoverageAmount] = useState<string>('');
  const [premiumAmount, setPremiumAmount] = useState<string>('');
  const [riskType, setRiskType] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [createdObjects, setCreatedObjects] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const riskTypes = [
    { value: 1, label: 'Sécheresse', icon: Droplets, color: 'text-orange-500' },
    { value: 2, label: 'Inondation', icon: Droplets, color: 'text-blue-500' },
    { value: 3, label: 'Tempête', icon: AlertTriangle, color: 'text-red-500' },
  ];

  const handleCreateObject = async () => {
    if (!currentAccount) {
      setError('Veuillez connecter votre wallet');
      return;
    }

    if (!coverageAmount || !premiumAmount) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await suiInsuranceObjectsService.createInsuranceObject(
        parseInt(coverageAmount),
        parseInt(premiumAmount),
        riskType,
        signAndExecute,
        currentAccount
      );

      setCreatedObjects(result);
      console.log('Objets créés:', result);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la création des objets');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCoverageAmount('');
    setPremiumAmount('');
    setRiskType(1);
    setCreatedObjects(null);
    setError(null);
  };

  if (!currentAccount) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Veuillez connecter votre wallet pour créer des objets d'assurance.
        </AlertDescription>
      </Alert>
    );
  }

  if (createdObjects) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            Objets d'assurance créés avec succès !
          </CardTitle>
          <CardDescription>
            Vos objets ont été ajoutés à votre wallet Sui
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">InsurancePolicy</h4>
              <p className="text-xs font-mono text-gray-600 break-all">
                {createdObjects.policyObject.objectId}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">PolicyCap</h4>
              <p className="text-xs font-mono text-gray-600 break-all">
                {createdObjects.capObject.objectId}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={resetForm} variant="outline" size="sm">
              Créer un autre objet
            </Button>
            <Button onClick={() => window.location.reload()} variant="default" size="sm">
              Actualiser la page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Créer un objet d'assurance Sui
        </CardTitle>
        <CardDescription>
          Créez un objet d'assurance qui sera stocké dans votre wallet Sui
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de risque
            </label>
            <div className="grid grid-cols-3 gap-2">
              {riskTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setRiskType(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      riskType === type.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-4 w-4 mx-auto mb-1 ${type.color}`} />
                    <p className="text-xs font-medium">{type.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant de couverture (SUI)
              </label>
              <Input
                type="number"
                value={coverageAmount}
                onChange={(e) => setCoverageAmount(e.target.value)}
                placeholder="1000"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prime (SUI)
              </label>
              <Input
                type="number"
                value={premiumAmount}
                onChange={(e) => setPremiumAmount(e.target.value)}
                placeholder="50"
                className="w-full"
              />
            </div>
          </div>

          <Button 
            onClick={handleCreateObject}
            disabled={isLoading || !coverageAmount || !premiumAmount}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Créer l'objet d'assurance
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
