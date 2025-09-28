'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "./networkConfig";
import { Droplets, Wind, Thermometer, Shield, ArrowLeft, CheckCircle } from "lucide-react";
import { suiInsuranceObjectsService } from "@/services/sui-insurance-objects";

interface InsurancePlan {
  id: string;
  name: string;
  type: string;
  coverage: number;
  premium: number;
  threshold: number;
  duration: number;
  description: string;
}

interface CreateInsuranceContractProps {
  onBack: () => void;
  preSelectedPlan?: InsurancePlan | null;
}

export function CreateInsuranceContract({ onBack, preSelectedPlan }: CreateInsuranceContractProps) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const rainguardPackageId = useNetworkVariable("rainguardPackageId");
  
  const [contractType, setContractType] = useState<number>(preSelectedPlan ? getContractTypeFromPlan(preSelectedPlan.type) : 0);
  const [coverageAmount, setCoverageAmount] = useState<string>(preSelectedPlan ? preSelectedPlan.coverage.toString() : "");
  const [premium, setPremium] = useState<string>(preSelectedPlan ? preSelectedPlan.premium.toString() : "");
  const [threshold, setThreshold] = useState<string>(preSelectedPlan ? preSelectedPlan.threshold.toString() : "");
  const [duration, setDuration] = useState<string>(preSelectedPlan ? preSelectedPlan.duration.toString() : "");
  const [isLoading, setIsLoading] = useState(false);
  const [contractCreated, setContractCreated] = useState(false);
  const [createdObjects, setCreatedObjects] = useState<{ policyObject: any; capObject: any } | null>(null);

  function getContractTypeFromPlan(planType: string): number {
    switch (planType) {
      case 'drought': return 0;
      case 'flood': return 1;
      case 'storm': return 2;
      default: return 0;
    }
  }

  // Map UI -> codes Move
  const RISK_TYPE_BY_UI: Record<number, number> = {
    0: 1, // drought
    1: 2, // flood
    2: 4, // excessive rain / tempête
  };

  const contractTypes = [
    { value: 0, label: "Sécheresse", icon: Droplets, color: "text-orange-500", description: "Protection contre le manque de pluie" },
    { value: 1, label: "Inondation", icon: Droplets, color: "text-blue-500", description: "Protection contre l'excès d'eau" },
    { value: 2, label: "Tempête", icon: Wind, color: "text-gray-500", description: "Protection contre vents violents et grêle" },
  ];

  const handleCreateContract = async () => {
    if (!currentAccount) {
      alert("Veuillez connecter votre portefeuille");
      return;
    }

    if (!coverageAmount || !premium) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);

    try {
      const riskType = RISK_TYPE_BY_UI[contractType] ?? 1;
      
      // Utiliser le service pour créer les objets d'assurance
      const result = await suiInsuranceObjectsService.createInsuranceObject(
        parseInt(coverageAmount),
        parseInt(premium),
        riskType,
        signAndExecute,
        currentAccount
      );

      console.log("Objets d'assurance créés:", result);
      
      setCreatedObjects(result);
      setContractCreated(true);

      // Stocker les IDs dans localStorage pour référence
      localStorage.setItem('insurancePolicyId', result.policyObject.objectId);
      localStorage.setItem('insuranceCapId', result.capObject.objectId);
      
      console.log("Objet InsurancePolicy créé avec l'ID:", result.policyObject.objectId);
      console.log("Objet PolicyCap créé avec l'ID:", result.capObject.objectId);

      // Notification de succès avec les IDs
      alert(`Contrat d'assurance créé ✅\nTransaction terminée avec succès !\n\nInsurancePolicy ID: ${result.policyObject.objectId}\nPolicyCap ID: ${result.capObject.objectId}\n\nVérifiez votre wallet Sui !`);
      
      onBack();
    } catch (error) {
      console.error("Erreur lors de la création du contrat:", error);
      alert(`Erreur lors de la création du contrat: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Nouveau Contrat d'Assurance</h2>
      </div>

      {/* Plan recommandé */}
      {preSelectedPlan && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-5 w-5" />
              Plan Recommandé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900">{preSelectedPlan.name}</h3>
                <p className="text-sm text-green-700">{preSelectedPlan.description}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-green-600">Couverture: {preSelectedPlan.coverage} SUI</span>
                  <span className="text-green-600">Prime: {preSelectedPlan.premium} SUI</span>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Recommandé
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type de contrat */}
        <Card>
          <CardHeader>
            <CardTitle>Type d'Assurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contractTypes.map((type) => (
              <div
                key={type.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors \${
                  contractType === type.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setContractType(type.value)}
              >
                <div className="flex items-center gap-3">
                  <type.icon className={`h-5 w-5 \${type.color}`} />
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Paramètres du contrat */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du Contrat</CardTitle>
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
                placeholder="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prime mensuelle (SUI)
              </label>
              <Input
                type="number"
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seuil de déclenchement (mm)
              </label>
              <Input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (jours)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="365"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résumé et création */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé du Contrat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-lg">{coverageAmount || "0"} SUI</div>
              <div className="text-sm text-gray-600">Couverture</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-lg">{premium || "0"} SUI</div>
              <div className="text-sm text-gray-600">Prime mensuelle</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-lg">{threshold || "0"}mm</div>
              <div className="text-sm text-gray-600">Seuil</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-lg">{duration || "0"} jours</div>
              <div className="text-sm text-gray-600">Durée</div>
            </div>
          </div>

          <Button
            onClick={handleCreateContract}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Création en cours..." : "Créer le Contrat d'Assurance"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}