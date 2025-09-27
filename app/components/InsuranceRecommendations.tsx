'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Droplets, Wind, Thermometer, CheckCircle, Star, TrendingUp } from "lucide-react";

interface InsuranceRecommendationsProps {
  assessment: any;
  onBack: () => void;
  onSelectPlan: (plan: InsurancePlan) => void;
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

export function InsuranceRecommendations({ assessment, onBack, onSelectPlan }: InsuranceRecommendationsProps) {
  // Générer des recommandations basées sur l'évaluation
  const generateRecommendations = (assessment: any): InsurancePlan[] => {
    const plans: InsurancePlan[] = [];
    
    // Plan de base pour la sécheresse
    if (assessment.risks.drought) {
      plans.push({
        id: "drought-basic",
        name: "Protection Sécheresse Essentielle",
        type: "drought",
        coverage: 2000,
        premium: 200,
        threshold: 50, // mm de pluie
        duration: 90,
        description: "Protection contre les pertes dues à la sécheresse",
        benefits: [
          "Paiement automatique si pluviométrie < 50mm",
          "Couverture de 2000 SUI",
          "Durée: 3 mois",
          "Prime: 200 SUI"
        ],
        riskLevel: 'medium',
        recommended: true
      });
    }

    // Plan avancé pour la sécheresse
    if (assessment.risks.drought && assessment.land.size > 5) {
      plans.push({
        id: "drought-premium",
        name: "Protection Sécheresse Premium",
        type: "drought",
        coverage: 5000,
        premium: 450,
        threshold: 60,
        duration: 120,
        description: "Protection étendue contre la sécheresse pour grandes exploitations",
        benefits: [
          "Paiement automatique si pluviométrie < 60mm",
          "Couverture de 5000 SUI",
          "Durée: 4 mois",
          "Prime: 450 SUI",
          "Support prioritaire"
        ],
        riskLevel: 'high',
        recommended: true
      });
    }

    // Plan pour les inondations
    if (assessment.risks.flood) {
      plans.push({
        id: "flood-basic",
        name: "Protection Inondation",
        type: "flood",
        coverage: 3000,
        premium: 300,
        threshold: 100, // mm de pluie en 24h
        duration: 90,
        description: "Protection contre les dommages causés par les inondations",
        benefits: [
          "Paiement automatique si pluviométrie > 100mm/24h",
          "Couverture de 3000 SUI",
          "Durée: 3 mois",
          "Prime: 300 SUI"
        ],
        riskLevel: 'medium',
        recommended: false
      });
    }

    // Plan pour les tempêtes
    if (assessment.risks.storm) {
      plans.push({
        id: "storm-basic",
        name: "Protection Tempête",
        type: "storm",
        coverage: 2500,
        premium: 250,
        threshold: 80, // km/h
        duration: 90,
        description: "Protection contre les dommages causés par les vents violents",
        benefits: [
          "Paiement automatique si vent > 80 km/h",
          "Couverture de 2500 SUI",
          "Durée: 3 mois",
          "Prime: 250 SUI"
        ],
        riskLevel: 'medium',
        recommended: false
      });
    }

    // Plan combiné
    if (assessment.risks.drought && assessment.risks.storm) {
      plans.push({
        id: "comprehensive",
        name: "Protection Complète",
        type: "comprehensive",
        coverage: 4000,
        premium: 400,
        threshold: 0,
        duration: 120,
        description: "Protection contre sécheresse et tempêtes",
        benefits: [
          "Protection sécheresse (seuil: 50mm)",
          "Protection tempête (seuil: 80 km/h)",
          "Couverture de 4000 SUI",
          "Durée: 4 mois",
          "Prime: 400 SUI",
          "Économie de 10%"
        ],
        riskLevel: 'high',
        recommended: true
      });
    }

    return plans;
  };

  const recommendations = generateRecommendations(assessment);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'drought': return Droplets;
      case 'flood': return Droplets;
      case 'storm': return Wind;
      case 'comprehensive': return Shield;
      default: return Shield;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Recommandations d'assurance</h2>
      </div>

      {/* Résumé de l'évaluation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Résumé de votre évaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Localisation</h3>
              <p className="text-sm text-blue-600">{assessment.location.region}, {assessment.location.country}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Superficie</h3>
              <p className="text-sm text-green-600">{assessment.land.size} hectares</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Culture principale</h3>
              <p className="text-sm text-orange-600">{assessment.crops.primary}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Risques identifiés :</h4>
            <div className="flex flex-wrap gap-2">
              {assessment.risks.drought && <Badge className="bg-red-100 text-red-800">Sécheresse</Badge>}
              {assessment.risks.flood && <Badge className="bg-blue-100 text-blue-800">Inondation</Badge>}
              {assessment.risks.storm && <Badge className="bg-orange-100 text-orange-800">Tempête</Badge>}
              {assessment.risks.pests && <Badge className="bg-yellow-100 text-yellow-800">Ravageurs</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans recommandés */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Plans d'assurance recommandés
        </h3>
        
        {recommendations.map((plan) => {
          const TypeIcon = getTypeIcon(plan.type);
          return (
            <Card key={plan.id} className={`${plan.recommended ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TypeIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.recommended && (
                      <Badge className="bg-green-100 text-green-800">
                        <Star className="h-3 w-3 mr-1" />
                        Recommandé
                      </Badge>
                    )}
                    <Badge className={getRiskColor(plan.riskLevel)}>
                      Risque {plan.riskLevel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800">Couverture</h4>
                    <p className="text-lg font-bold text-green-600">{plan.coverage} SUI</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800">Prime</h4>
                    <p className="text-lg font-bold text-blue-600">{plan.premium} SUI</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800">Durée</h4>
                    <p className="text-lg font-bold text-purple-600">{plan.duration} jours</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Avantages :</h4>
                  <ul className="space-y-1">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => onSelectPlan(plan)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Choisir ce plan
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Note d'information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Comment ça marche ?</h4>
              <p className="text-sm text-blue-700">
                Les contrats d'assurance RainGuard sont basés sur des indices météo objectifs. 
                Les données sont collectées automatiquement via des stations météo et des satellites. 
                Si les conditions météo atteignent les seuils définis, le paiement est déclenché automatiquement 
                par le smart contract, sans intervention manuelle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
