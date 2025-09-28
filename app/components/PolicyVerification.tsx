'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Shield, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

export function PolicyVerification() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [policies, setPolicies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  const client = new SuiClient({ url: getFullnodeUrl('devnet') });

  // Fonction pour créer une police de test
  const createTestPolicy = async () => {
    if (!currentAccount) {
      alert("Veuillez connecter votre portefeuille");
      return;
    }

    setIsLoading(true);

    try {
      const tx = new Transaction();
      
      tx.moveCall({
        target: "0xd28e4cf0eeaa232ceb08f293cc8d2f76ea719aa8b31a691fe11a9966b862b566::rainguard::create_policy",
        arguments: [
          tx.pure.address(currentAccount.address), // policyholder
          tx.pure.u64(1000000000000), // coverage_amount: 1000 SUI en MIST
          tx.pure.u64(100000000000), // premium_amount: 100 SUI en MIST
          tx.pure.u64(365), // coverage_period_days
          tx.pure(new Uint8Array([1])), // risk_types: [1] = sécheresse
          tx.pure.u64(10), // land_area_hectares
          tx.pure(new Uint8Array(new TextEncoder().encode("Maize"))), // crop_type en vector<u8>
          tx.pure(new Uint8Array(new TextEncoder().encode("Farm_001"))), // location en vector<u8>
          tx.pure.u64(50000000000), // deductible en MIST
          tx.pure(new Uint8Array([1])), // weather_thresholds: [1] = sécheresse
          tx.pure.vector('u64', [50000000000]), // threshold_values: [50 SUI en MIST]
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log("Transaction réussie:", result);
      setLastTransaction(result.digest);
      
      // Extraire les objets créés
      const createdObjects = (result.effects as any)?.created || [];
      const policyObject = createdObjects.find((obj: any) => 
        obj.reference?.objectType?.includes('InsurancePolicy')
      );
      const capObject = createdObjects.find((obj: any) => 
        obj.reference?.objectType?.includes('PolicyHolderCap')
      );

      if (policyObject) {
        console.log("✅ Objet InsurancePolicy créé avec l'ID:", policyObject.reference?.objectId);
      }
      if (capObject) {
        console.log("✅ Objet PolicyHolderCap créé avec l'ID:", capObject.reference?.objectId);
      }
      
      // Vérifier immédiatement après création
      setTimeout(() => {
        checkPolicies();
      }, 2000);

      alert(`✅ Police créée !\n\nInsurancePolicy ID: ${policyObject?.reference?.objectId || 'N/A'}\nPolicyHolderCap ID: ${capObject?.reference?.objectId || 'N/A'}\n\nTransaction: ${result.digest}`);
      
    } catch (error) {
      console.error("Erreur:", error);
      alert(`❌ Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour vérifier les polices existantes
  const checkPolicies = async () => {
    if (!currentAccount) return;

    setIsChecking(true);

    try {
      // Récupérer tous les objets de l'utilisateur
      const objects = await client.getOwnedObjects({
        owner: currentAccount.address,
        options: {
          showContent: true,
          showType: true,
        },
      });

      // Filtrer les objets InsurancePolicy
      const insurancePolicies = objects.data.filter((obj: any) => 
        obj.data?.type?.includes('InsurancePolicy')
      );

      setPolicies(insurancePolicies);
      console.log("Polices trouvées:", insurancePolicies);

    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // Vérifier automatiquement au chargement
  useEffect(() => {
    if (currentAccount) {
      checkPolicies();
    }
  }, [currentAccount]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Vérification des Polices d'Assurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={createTestPolicy}
              disabled={isLoading || !currentAccount}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              {isLoading ? "Création..." : "Créer une Police de Test"}
            </Button>
            
            <Button
              onClick={checkPolicies}
              disabled={isChecking || !currentAccount}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isChecking ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isChecking ? "Vérification..." : "Vérifier les Polices"}
            </Button>
          </div>

          {lastTransaction && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Dernière transaction:</span>
              </div>
              <p className="text-sm text-green-700 mt-1 break-all">
                {lastTransaction}
              </p>
              <a 
                href={`https://suiscan.xyz/devnet/tx/${lastTransaction}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1 mt-2"
              >
                <ExternalLink className="h-3 w-3" />
                Voir sur Suiscan
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Polices Trouvées ({policies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {policies.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucune police d'assurance trouvée</p>
              <p className="text-sm text-gray-500">
                Créez une police de test pour voir les objets apparaître ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {policies.map((policy, index) => (
                <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-green-100 text-green-800">
                      InsurancePolicy
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Version: {policy.data?.version}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Object ID:</span>
                      <p className="text-sm text-gray-600 break-all">
                        {policy.data?.objectId}
                      </p>
                    </div>
                    
                    {policy.data?.content && 'fields' in policy.data.content && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <span className="font-medium text-gray-700">Policy ID:</span>
                          <p className="text-sm text-gray-600">
                            {policy.data.content.fields.policy_id}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <p className="text-sm text-gray-600">
                            {policy.data.content.fields.status === '1' ? 'Actif' : 'Inactif'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Couverture:</span>
                          <p className="text-sm text-gray-600">
                            {policy.data.content.fields.coverage_amount} MIST
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Prime:</span>
                          <p className="text-sm text-gray-600">
                            {policy.data.content.fields.premium_amount} MIST
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <a 
                        href={`https://suiscan.xyz/devnet/object/${policy.data?.objectId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Voir sur Suiscan
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Comment vérifier manuellement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">1. Dans le Terminal (CLI Sui):</h4>
            <code className="block p-2 bg-gray-100 rounded text-sm">
              sui client objects
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Cherchez les objets avec le type contenant "InsurancePolicy"
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">2. Dans votre Wallet Sui:</h4>
            <p className="text-sm text-gray-600">
              Ouvrez votre wallet Sui et vérifiez la section "Objects" ou "NFTs"
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">3. Sur Suiscan:</h4>
            <p className="text-sm text-gray-600">
              Allez sur <a href="https://suiscan.xyz/devnet" target="_blank" className="text-blue-600">suiscan.xyz/devnet</a> et recherchez votre adresse
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
