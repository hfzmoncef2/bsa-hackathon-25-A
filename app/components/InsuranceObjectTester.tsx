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
import { suiInsuranceObjectsService } from '@/services/sui-insurance-objects';

export function InsuranceObjectTester() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  
  const [coverageAmount, setCoverageAmount] = useState<string>('100');
  const [premiumAmount, setPremiumAmount] = useState<string>('10');
  const [riskType, setRiskType] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [createdObjects, setCreatedObjects] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');

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
    setCreatedObjects(null);
    setTransactionId('');

    try {
      console.log('🎯 Début du test de création d\'objet...');
      console.log('👤 Compte connecté:', currentAccount.address);
      
      const result = await suiInsuranceObjectsService.createInsuranceObject(
        parseInt(coverageAmount),
        parseInt(premiumAmount),
        riskType,
        signAndExecute,
        currentAccount
      );

      setCreatedObjects(result);
      console.log('✅ Objets créés avec succès:', result);
    } catch (err: any) {
      console.error('❌ Erreur lors de la création:', err);
      setError(err.message || 'Erreur lors de la création des objets');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSuiScanUrl = (objectId: string) => {
    return `https://suiscan.xyz/object/${objectId}`;
  };

  const getTransactionUrl = (txId: string) => {
    return `https://suiscan.xyz/tx/${txId}`;
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
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>
              <strong>Comment vérifier sur SuiScan :</strong>
              <br />
              1. Allez sur <a href="https://suiscan.xyz" target="_blank" className="text-blue-600 underline">suiscan.xyz</a>
              <br />
              2. Recherchez votre adresse : <code className="bg-gray-100 px-1 rounded">{currentAccount.address}</code>
              <br />
              3. Cliquez sur l'onglet "Objects" pour voir vos objets d'assurance
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-gray-700">InsurancePolicy</h4>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(createdObjects.policyObject.objectId)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(getSuiScanUrl(createdObjects.policyObject.objectId), '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs font-mono text-gray-600 break-all">
                {createdObjects.policyObject.objectId}
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-gray-700">PolicyCap</h4>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(createdObjects.capObject.objectId)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(getSuiScanUrl(createdObjects.capObject.objectId), '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs font-mono text-gray-600 break-all">
                {createdObjects.capObject.objectId}
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm text-blue-800 mb-2">📋 Détails de l'objet créé :</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><strong>Couverture:</strong> {createdObjects.policyObject.coverageAmount} SUI</div>
              <div><strong>Prime:</strong> {createdObjects.policyObject.premiumAmount} SUI</div>
              <div><strong>Type de risque:</strong> {suiInsuranceObjectsService.getRiskTypeLabel(createdObjects.policyObject.riskType)}</div>
              <div><strong>Statut:</strong> {suiInsuranceObjectsService.getStatusLabel(createdObjects.policyObject.status)}</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => window.open(`https://suiscan.xyz/address/${currentAccount.address}`, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir sur SuiScan
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
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
          Test de Création d'Objets d'Assurance Sui
        </CardTitle>
        <CardDescription>
          Créez un objet d'assurance qui apparaîtra dans votre wallet sur SuiScan.xyz
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
              <strong>Important :</strong> Assurez-vous d'avoir suffisamment de SUI dans votre wallet pour payer les frais de transaction.
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
