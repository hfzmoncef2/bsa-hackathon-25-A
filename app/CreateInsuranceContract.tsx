'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Droplets, Wind, Thermometer, Shield, ArrowLeft } from "lucide-react";

interface InsurancePlan {
  id: string;
  name: string;
  type: string;
  coverage: number;
  premium: number;
  threshold: number;
  duration: number;
  description: string;
  benefits: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommended: boolean;
}

interface CreateInsuranceContractProps {
  onBack: () => void;
  preSelectedPlan?: InsurancePlan | null;
}

export function CreateInsuranceContract({ onBack, preSelectedPlan }: CreateInsuranceContractProps) {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const rainguardPackageId = useNetworkVariable("rainguardPackageId");
  
  const [contractType, setContractType] = useState<number>(preSelectedPlan ? getContractTypeFromPlan(preSelectedPlan.type) : 0);
  const [coverageAmount, setCoverageAmount] = useState<string>(preSelectedPlan ? preSelectedPlan.coverage.toString() : "");
  const [premium, setPremium] = useState<string>(preSelectedPlan ? preSelectedPlan.premium.toString() : "");
  const [threshold, setThreshold] = useState<string>(preSelectedPlan ? preSelectedPlan.threshold.toString() : "");
  const [duration, setDuration] = useState<string>(preSelectedPlan ? preSelectedPlan.duration.toString() : "90");
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour convertir le type de plan en type de contrat
  function getContractTypeFromPlan(planType: string): number {
    switch (planType) {
      case 'drought': return 0;
      case 'flood': return 1;
      case 'storm': return 2;
      default: return 0;
    }
  }

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

    if (!coverageAmount || !premium || !threshold || !duration) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      // Note: Cette fonction nécessite que le package soit déployé sur le réseau
      // Pour la démo, nous simulons la création
      console.log("Création du contrat d'assurance:", {
        contractType,
        coverageAmount: parseInt(coverageAmount),
        premium: parseInt(premium),
        threshold: parseInt(threshold),
        duration: parseInt(duration),
      });

      // Simulation d'un délai de transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Contrat d'assurance créé avec succès !");
      onBack();
    } catch (error) {
      console.error("Erreur lors de la création du contrat:", error);
      alert("Erreur lors de la création du contrat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
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
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  contractType === type.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setContractType(type.value)}
              >
                <div className="flex items-center gap-3">
                  <type.icon className={`h-5 w-5 ${type.color}`} />
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
              <label className="block text-sm font-medium mb-2">
                Montant de Couverture (SUI)
              </label>
              <Input
                type="number"
                value={coverageAmount}
                onChange={(e) => setCoverageAmount(e.target.value)}
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Prime d'Assurance (SUI)
              </label>
              <Input
                type="number"
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Seuil de Déclenchement
                {contractType === 0 && " (mm de pluie minimum)"}
                {contractType === 1 && " (cm niveau d'eau maximum)"}
                {contractType === 2 && " (km/h vitesse vent maximum)"}
              </label>
              <Input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder={contractType === 0 ? "50" : contractType === 1 ? "100" : "80"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Durée du Contrat (jours)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="90"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résumé et Création */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé du Contrat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>
              <div className="font-medium">{contractTypes[contractType].label}</div>
            </div>
            <div>
              <span className="text-gray-500">Couverture:</span>
              <div className="font-medium">{coverageAmount} SUI</div>
            </div>
            <div>
              <span className="text-gray-500">Prime:</span>
              <div className="font-medium">{premium} SUI</div>
            </div>
            <div>
              <span className="text-gray-500">Durée:</span>
              <div className="font-medium">{duration} jours</div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleCreateContract}
              disabled={isLoading || !currentAccount}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Création en cours..." : "Créer le Contrat"}
            </Button>
            <Button variant="outline" onClick={onBack}>
              Annuler
            </Button>
          </div>

          {!currentAccount && (
            <p className="text-sm text-red-600">
              Veuillez connecter votre portefeuille pour créer un contrat
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}