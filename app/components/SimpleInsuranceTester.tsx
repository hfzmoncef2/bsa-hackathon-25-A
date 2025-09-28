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
  Loader2,
  ExternalLink,
  Copy,
  Eye
} from 'lucide-react';
import { suiSimpleObjectsService } from '@/services/sui-simple-objects';

export function SimpleInsuranceTester() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  
  const [coverageAmount, setCoverageAmount] = useState<string>('100');
  const [premiumAmount, setPremiumAmount] = useState<string>('10');
  const [riskType, setRiskType] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [createdObject, setCreatedObject] = useState<any>(null);
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
    setCreatedObject(null);

    try {
      console.log('🎯 Début du test de création d\'objet simple...');
      console.log('👤 Compte connecté:', currentAccount.address);
      
      const result = await suiSimpleObjectsService.createSimpleInsuranceObject(
        parseInt(coverageAmount),
        parseInt(premiumAmount),
        riskType,
        signAndExecute,
        currentAccount
      );

      setCreatedObject(result);
      console.log('✅ Objet créé avec succès:', result);
    } catch (err: any) {
      console.error('❌ Erreur lors de la création:', err);
      setError(err.message || 'Erreur lors de la création de l\'objet');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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

  if (createdObject) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            Objet d'assurance créé avec succès !
          </CardTitle>
          <CardDescription>
            Votre objet d'assurance a été créé et stocké localement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>
              <strong>Note :</strong> Cet objet est stocké localement pour la démonstration. 
              Pour un déploiement réel, vous devrez déployer le contrat Move.
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-gray-700">Objet d'Assurance</h4>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(createdObject.objectId)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-xs font-mono text-gray-600 break-all">
              {createdObject.objectId}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm text-blue-800 mb-2">📋 Détails de l'objet :</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><strong>Couverture:</strong> {createdObject.coverageAmount} SUI</div>
              <div><strong>Prime:</strong> {createdObject.premiumAmount} SUI</div>
              <div><strong>Type de risque:</strong> {suiSimpleObjectsService.getRiskTypeLabel(createdObject.riskType)}</div>
              <div><strong>Statut:</strong> {suiSimpleObjectsService.getStatusLabel(createdObject.status)}</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => window.location.reload()} className="flex-1">
              Créer un autre objet
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
          Test Simple d'Objets d'Assurance
        </CardTitle>
        <CardDescription>
          Créez un objet d'assurance simple (version de démonstration)
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
                placeholder="100"
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
                placeholder="10"
                className="w-full"
              />
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Version de démonstration :</strong> Cet objet sera stocké localement. 
              Pour un déploiement réel, déployez d'abord le contrat Move.
            </AlertDescription>
          </Alert>

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
