'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Droplets, Wind, Thermometer, CheckCircle } from "lucide-react";

interface LandAssessmentData {
  country: string;
  region: string;
  gpsCoordinates: string;
  area: string;
  soilType: string;
  irrigationSystem: string;
  altitude: string;
  mainCrop: string;
  secondaryCrops: string;
  farmingSeason: string;
  droughtRisk: boolean;
  floodRisk: boolean;
  stormRisk: boolean;
  pestDiseaseRisk: boolean;
  yearsExperience: string;
  previousClaims: string;
}

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

interface InsuranceRecommendationsProps {
  assessmentData: LandAssessmentData;
  onSelectPlan: (plan: InsurancePlan) => void;
  onBack: () => void;
}

export function InsuranceRecommendations({ assessmentData, onSelectPlan, onBack }: InsuranceRecommendationsProps) {
  const [recommendedPlans, setRecommendedPlans] = useState<InsurancePlan[]>([]);

  const generateRecommendations = (data: LandAssessmentData): InsurancePlan[] => {
    const plans: InsurancePlan[] = [];
    const area = parseInt(data.area) || 10;
    const baseMultiplier = Math.max(1, area / 10);

    // Plan Sécheresse
    if (data.droughtRisk) {
      plans.push({
        id: 'drought',
        name: 'Protection Sécheresse',
        type: 'drought',
        coverage: Math.round(1000 * baseMultiplier),
        premium: Math.round(50 * baseMultiplier),
        threshold: 50, // mm de pluie minimum
        duration: 180,
        description: 'Protection contre les périodes de sécheresse prolongée',
        benefits: ['Paiement automatique si < 50mm de pluie', 'Couverture 6 mois', 'Données météo fiables'],
        riskLevel: 'high',
        recommended: true,
      });
    }

    // Plan Inondation
    if (data.floodRisk) {
      plans.push({
        id: 'flood',
        name: 'Protection Inondation',
        type: 'flood',
        coverage: Math.round(1200 * baseMultiplier),
        premium: Math.round(60 * baseMultiplier),
        threshold: 100, // cm niveau d'eau
        duration: 180,
        description: 'Protection contre les inondations et excès d\'eau',
        benefits: ['Paiement si niveau d\'eau > 100cm', 'Couverture rapide', 'Indemnisation immédiate'],
        riskLevel: 'medium',
        recommended: data.irrigationSystem === 'aucun',
      });
    }

    // Plan Tempête
    if (data.stormRisk) {
      plans.push({
        id: 'storm',
        name: 'Protection Tempête',
        type: 'storm',
        coverage: Math.round(800 * baseMultiplier),
        premium: Math.round(40 * baseMultiplier),
        threshold: 80, // km/h vitesse vent
        duration: 180,
        description: 'Protection contre tempêtes, grêle et vents violents',
        benefits: ['Paiement si vent > 80km/h', 'Couverture grêle incluse', 'Données météo temps réel'],
        riskLevel: 'medium',
        recommended: false,
      });
    }

    // Plan Protection Totale
    if (data.droughtRisk && data.floodRisk) {
      plans.push({
        id: 'total',
        name: 'Protection Totale',
        type: 'total',
        coverage: Math.round(2000 * baseMultiplier),
        premium: Math.round(120 * baseMultiplier),
        threshold: 0,
        duration: 365,
        description: 'Protection complète contre tous les risques climatiques',
        benefits: ['Couverture multi-risques', 'Durée 1 an', 'Réduction 15% sur primes', 'Support prioritaire'],
        riskLevel: 'low',
        recommended: parseInt(data.yearsExperience) < 5,
      });
    }

    return plans.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
  };

  useEffect(() => {
    if (assessmentData) {
      setRecommendedPlans(generateRecommendations(assessmentData));
    }
  }, [assessmentData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'évaluation
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Plans d'Assurance Recommandés</h2>
      </div>

      <p className="text-gray-600">
        Basé sur l'évaluation de vos terres, voici les plans d'assurance que nous vous recommandons :
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedPlans.map((plan) => (
          <Card key={plan.id} className={plan.recommended ? "border-green-500 shadow-lg" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                {plan.name}
              </CardTitle>
              {plan.recommended && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" /> Recommandé
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{plan.description}</p>
              <div className="text-sm text-gray-700">
                <p>Type: <Badge variant="secondary">{plan.type}</Badge></p>
                <p>Couverture: <span className="font-medium">{plan.coverage} SUI</span></p>
                <p>Prime: <span className="font-medium">{plan.premium} SUI</span></p>
                <p>Seuil de déclenchement: <span className="font-medium">{plan.threshold} {plan.type === 'drought' ? 'mm' : plan.type === 'flood' ? 'cm' : 'km/h'}</span></p>
                <p>Durée: <span className="font-medium">{plan.duration} jours</span></p>
                <p>Niveau de risque: <Badge variant={plan.riskLevel === 'high' ? 'destructive' : plan.riskLevel === 'medium' ? 'secondary' : 'default'}>{plan.riskLevel}</Badge></p>
              </div>
              <Button onClick={() => onSelectPlan(plan)} className="w-full bg-green-600 hover:bg-green-700">
                Sélectionner ce plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}