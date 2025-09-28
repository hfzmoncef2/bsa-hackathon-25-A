'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Shield, CheckCircle } from "lucide-react";

export function QuickInsuranceCreator() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  
  const [coverageAmount, setCoverageAmount] = useState<string>("1000");
  const [premiumAmount, setPremiumAmount] = useState<string>("100");
  const [isLoading, setIsLoading] = useState(false);
  const [lastCreatedPolicy, setLastCreatedPolicy] = useState<string | null>(null);

  const handleCreateSimplePolicy = async () => {
    if (!currentAccount) {
      alert("Veuillez connecter votre portefeuille");
      return;
    }

    if (!coverageAmount || !premiumAmount) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      // Créer une transaction Sui avec le contrat RainGuard
      const tx = new Transaction();
      
      // Utiliser une approche plus simple - créer d'abord un pool si nécessaire
      // Utiliser le module rainguard qui est plus simple
      tx.moveCall({
        target: "0xd28e4cf0eeaa232ceb08f293cc8d2f76ea719aa8b31a691fe11a9966b862b566::rainguard::create_policy",
        arguments: [
          tx.pure.address(currentAccount.address), // policyholder
          tx.pure.u64(parseInt(coverageAmount) * 1000000000), // coverage_amount en MIST
          tx.pure.u64(parseInt(premiumAmount) * 1000000000), // premium_amount en MIST
          tx.pure.u64(365), // coverage_period_days
          tx.pure(new Uint8Array([1])), // risk_types: [1] = sécheresse
          tx.pure.u64(10), // land_area_hectares
          tx.pure(new Uint8Array(new TextEncoder().encode("Maize"))), // crop_type en vector<u8>
          tx.pure(new Uint8Array(new TextEncoder().encode("Farm_001"))), // location en vector<u8>
          tx.pure.u64(50000000000), // deductible en MIST
          tx.pure(new Uint8Array([1])), // weather_thresholds: [1] = sécheresse
          tx.pure.vector('u64', [50000000000]), // threshold_values: [50 SUI en MIST]
          // Le pool sera trouvé automatiquement car il est partagé
        ],
      });

      // Exécuter la transaction
      const result = await signAndExecute({
        transaction: tx,
      });

      console.log("Résultat TX:", result);
      
      // Extraire les objets créés
      const createdObjects = (result.effects as any)?.created || [];
      const policyObject = createdObjects.find((obj: any) => 
        obj.reference?.objectType?.includes('InsurancePolicy')
      );
      const capObject = createdObjects.find((obj: any) => 
        obj.reference?.objectType?.includes('PolicyHolderCap')
      );

      if (policyObject) {
        setLastCreatedPolicy(policyObject.reference?.objectId || '');
        localStorage.setItem('lastInsurancePolicyId', policyObject.reference?.objectId || '');
        console.log("✅ Objet InsurancePolicy créé avec l'ID:", policyObject.reference?.objectId);
      }
      if (capObject) {
        localStorage.setItem('lastPolicyCapId', capObject.reference?.objectId || '');
        console.log("✅ Objet PolicyCap créé avec l'ID:", capObject.reference?.objectId);
      }

      alert(`🎉 Police d'assurance créée avec succès !\n\nInsurancePolicy ID: ${policyObject?.reference?.objectId || 'N/A'}\nPolicyHolderCap ID: ${capObject?.reference?.objectId || 'N/A'}\n\nVérifiez votre wallet Sui !`);
      
    } catch (error) {
      console.error("Erreur lors de la création de la police:", error);
      alert(`❌ Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Créer une Police d'Assurance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant de couverture (SUI)
            </label>
            <Input
              type="number"
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prime (SUI)
            </label>
            <Input
              type="number"
              value={premiumAmount}
              onChange={(e) => setPremiumAmount(e.target.value)}
              placeholder="100"
            />
          </div>

          <Button
            onClick={handleCreateSimplePolicy}
            disabled={isLoading || !currentAccount}
            className="w-full"
          >
            {isLoading ? "Création en cours..." : "Créer la Police"}
          </Button>

          {lastCreatedPolicy && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Dernière police créée:</span>
              </div>
              <p className="text-sm text-green-700 mt-1 break-all">
                {lastCreatedPolicy}
              </p>
            </div>
          )}

          {!currentAccount && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Veuillez connecter votre wallet pour créer une police
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
