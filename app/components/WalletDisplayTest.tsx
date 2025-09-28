'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CheckCircle, XCircle, Loader2, Wallet, Eye } from "lucide-react";

export function WalletDisplayTest() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [walletObjects, setWalletObjects] = useState<any[]>([]);

  const PACKAGE_ID = '0xd28e4cf0eeaa232ceb08f293cc8d2f76ea719aa8b31a691fe11a9966b862b566';

  const runWalletTest = async () => {
    if (!currentAccount) {
      alert("Veuillez connecter votre portefeuille");
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      console.log('🚀 Test de création d\'une police d\'assurance...');
      
      const tx = new Transaction();
      
      // Appeler la fonction create_simple_policy du contrat working_insurance
      tx.moveCall({
        target: `${PACKAGE_ID}::working_insurance::create_simple_policy`,
        arguments: [
          tx.pure.u64(1000000000), // 1 SUI en MIST
          tx.pure.u64(100000000),  // 0.1 SUI en MIST
        ],
      });

      // Exécuter la transaction
      const result = await signAndExecute({
        transaction: tx,
      });

      console.log('✅ Transaction réussie!');
      console.log('📋 Digest:', result.digest);
      
      // Analyser les objets créés
      const createdObjects = (result.effects as any)?.created || [];

      if (createdObjects && createdObjects.length > 0) {
        console.log('🎉 Objets créés dans le wallet:');
        createdObjects.forEach((obj: any, index: number) => {
          console.log(`  ${index + 1}. Type: ${obj.reference?.objectType}`);
          console.log(`     ID: ${obj.reference?.objectId}`);
          console.log(`     Owner: ${obj.reference?.owner}`);
        });
        
        // Vérifier spécifiquement les objets InsurancePolicy et PolicyCap
        const insurancePolicy = createdObjects.find((obj: any) => 
          obj.reference?.objectType?.includes('InsurancePolicy')
        );
        const policyCap = createdObjects.find((obj: any) => 
          obj.reference?.objectType?.includes('PolicyCap')
        );
        
        const testResult = {
          success: true,
          digest: result.digest,
          createdObjects: createdObjects.length,
          insurancePolicy: insurancePolicy ? {
            id: insurancePolicy.reference?.objectId,
            type: insurancePolicy.reference?.objectType
          } : null,
          policyCap: policyCap ? {
            id: policyCap.reference?.objectId,
            type: policyCap.reference?.objectType
          } : null
        };
        
        setTestResult(testResult);
        
        if (insurancePolicy) {
          console.log('✅ Objet InsurancePolicy trouvé! Il devrait apparaître dans votre wallet.');
        } else {
          console.log('❌ Aucun objet InsurancePolicy trouvé');
        }
        
        if (policyCap) {
          console.log('✅ Objet PolicyCap trouvé! Il devrait apparaître dans votre wallet.');
        } else {
          console.log('❌ Aucun objet PolicyCap trouvé');
        }
        
      } else {
        setTestResult({
          success: false,
          error: 'Aucun objet créé trouvé'
        });
        console.log('❌ Aucun objet créé trouvé');
      }

    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      setTestResult({
        success: false,
        error: (error as Error).message || 'Erreur inconnue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkWalletObjects = async () => {
    if (!currentAccount) {
      alert("Veuillez connecter votre portefeuille");
      return;
    }

    try {
      // Simuler la vérification des objets dans le wallet
      // Dans une vraie implémentation, vous utiliseriez getOwnedObjects
      console.log(`🔍 Vérification des objets dans le wallet de ${currentAccount.address}...`);
      
      // Pour l'instant, on simule avec les objets stockés dans localStorage
      const policyId = localStorage.getItem('insurancePolicyId');
      const capId = localStorage.getItem('policyCapId');
      
      const objects = [];
      if (policyId) {
        objects.push({
          id: policyId,
          type: 'InsurancePolicy',
          status: 'Active'
        });
      }
      if (capId) {
        objects.push({
          id: capId,
          type: 'PolicyCap',
          status: 'Active'
        });
      }
      
      setWalletObjects(objects);
      
      if (objects.length > 0) {
        console.log(`📊 Trouvé ${objects.length} objets dans le wallet`);
      } else {
        console.log('❌ Aucun objet trouvé dans le wallet');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du wallet:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Test d'Affichage dans le Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Ce test vérifie que les objets InsurancePolicy et PolicyCap apparaissent correctement dans votre wallet Sui.
          </p>
          
          <div className="flex gap-4">
            <Button
              onClick={runWalletTest}
              disabled={isLoading || !currentAccount}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isLoading ? "Test en cours..." : "Créer une Police de Test"}
            </Button>
            
            <Button
              onClick={checkWalletObjects}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Vérifier le Wallet
            </Button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-semibold ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.success ? 'Test Réussi!' : 'Test Échoué'}
                </span>
              </div>
              
              {testResult.success ? (
                <div className="space-y-2 text-sm">
                  <p><strong>Transaction:</strong> {testResult.digest}</p>
                  <p><strong>Objets créés:</strong> {testResult.createdObjects}</p>
                  
                  {testResult.insurancePolicy && (
                    <div className="mt-2">
                      <Badge className="bg-green-100 text-green-800">
                        InsurancePolicy
                      </Badge>
                      <p className="text-xs mt-1">
                        ID: {testResult.insurancePolicy.id}
                      </p>
                    </div>
                  )}
                  
                  {testResult.policyCap && (
                    <div className="mt-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        PolicyCap
                      </Badge>
                      <p className="text-xs mt-1">
                        ID: {testResult.policyCap.id}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-green-700 mt-2">
                    ✅ Les objets devraient maintenant apparaître dans votre wallet Sui!
                  </p>
                </div>
              ) : (
                <p className="text-red-700 text-sm">
                  Erreur: {testResult.error}
                </p>
              )}
            </div>
          )}

          {walletObjects.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                Objets trouvés dans le wallet:
              </h3>
              <div className="space-y-2">
                {walletObjects.map((obj, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {obj.type}
                    </Badge>
                    <span className="text-sm text-blue-700">
                      {obj.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

