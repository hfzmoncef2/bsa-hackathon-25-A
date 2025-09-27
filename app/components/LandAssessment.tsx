'use client'
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "./ui/badge";
import { ArrowLeft, MapPin, Wheat, Droplets, Thermometer, Wind, Shield, CheckCircle } from "lucide-react";

interface LandAssessmentProps {
  onBack: () => void;
  onComplete: (assessment: LandAssessmentData) => void;
}

interface LandAssessmentData {
  location: {
    country: string;
    region: string;
    coordinates: string;
  };
  land: {
    size: number;
    soilType: string;
    irrigation: string;
    elevation: number;
  };
  crops: {
    primary: string;
    secondary: string[];
    season: string;
  };
  risks: {
    drought: boolean;
    flood: boolean;
    storm: boolean;
    pests: boolean;
  };
  experience: {
    years: number;
    previousClaims: boolean;
  };
}

export function LandAssessment({ onBack, onComplete }: LandAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessment, setAssessment] = useState<LandAssessmentData>({
    location: {
      country: "",
      region: "",
      coordinates: ""
    },
    land: {
      size: 0,
      soilType: "",
      irrigation: "",
      elevation: 0
    },
    crops: {
      primary: "",
      secondary: [],
      season: ""
    },
    risks: {
      drought: false,
      flood: false,
      storm: false,
      pests: false
    },
    experience: {
      years: 0,
      previousClaims: false
    }
  });

  const steps = [
    { id: 1, title: "Localisation", icon: MapPin },
    { id: 2, title: "Caractéristiques", icon: Wheat },
    { id: 3, title: "Cultures", icon: Droplets },
    { id: 4, title: "Risques", icon: Shield },
    { id: 5, title: "Expérience", icon: CheckCircle }
  ];

  const soilTypes = [
    "Argileux", "Sableux", "Limoneux", "Calcaire", "Volcanique", "Tourbeux"
  ];

  const irrigationTypes = [
    "Pluie naturelle", "Irrigation goutte à goutte", "Aspersion", "Inondation", "Pivot central"
  ];

  const cropTypes = [
    "Blé", "Maïs", "Riz", "Orge", "Avoine", "Soja", "Tournesol", "Coton", "Tomates", "Pommes de terre", "Légumes verts", "Fruits"
  ];

  const seasons = [
    "Printemps", "Été", "Automne", "Hiver", "Toute l'année"
  ];

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(assessment);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAssessment = (section: keyof LandAssessmentData, field: string, value: any) => {
    setAssessment(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleRisk = (risk: keyof LandAssessmentData['risks']) => {
    setAssessment(prev => ({
      ...prev,
      risks: {
        ...prev.risks,
        [risk]: !prev.risks[risk]
      }
    }));
  };

  const toggleSecondaryCrop = (crop: string) => {
    setAssessment(prev => ({
      ...prev,
      crops: {
        ...prev.crops,
        secondary: prev.crops.secondary.includes(crop)
          ? prev.crops.secondary.filter(c => c !== crop)
          : [...prev.crops.secondary, crop]
      }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <Input
                placeholder="Maroc"
                value={assessment.location.country}
                onChange={(e) => updateAssessment('location', 'country', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région/Province
              </label>
              <Input
                placeholder="Marrakech-Safi"
                value={assessment.location.region}
                onChange={(e) => updateAssessment('location', 'region', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordonnées GPS (optionnel)
              </label>
              <Input
                placeholder="31.6295° N, 7.9811° W"
                value={assessment.location.coordinates}
                onChange={(e) => updateAssessment('location', 'coordinates', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Superficie (hectares)
              </label>
              <Input
                type="number"
                placeholder="10"
                value={assessment.land.size || ""}
                onChange={(e) => updateAssessment('land', 'size', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de sol
              </label>
              <div className="grid grid-cols-2 gap-2">
                {soilTypes.map((type) => (
                  <Button
                    key={type}
                    variant={assessment.land.soilType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAssessment('land', 'soilType', type)}
                    className={assessment.land.soilType === type ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Système d'irrigation
              </label>
              <div className="grid grid-cols-1 gap-2">
                {irrigationTypes.map((type) => (
                  <Button
                    key={type}
                    variant={assessment.land.irrigation === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAssessment('land', 'irrigation', type)}
                    className={assessment.land.irrigation === type ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altitude (mètres)
              </label>
              <Input
                type="number"
                placeholder="500"
                value={assessment.land.elevation || ""}
                onChange={(e) => updateAssessment('land', 'elevation', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Culture principale
              </label>
              <div className="grid grid-cols-3 gap-2">
                {cropTypes.map((crop) => (
                  <Button
                    key={crop}
                    variant={assessment.crops.primary === crop ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAssessment('crops', 'primary', crop)}
                    className={assessment.crops.primary === crop ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {crop}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cultures secondaires
              </label>
              <div className="grid grid-cols-3 gap-2">
                {cropTypes.map((crop) => (
                  <Button
                    key={crop}
                    variant={assessment.crops.secondary.includes(crop) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSecondaryCrop(crop)}
                    className={assessment.crops.secondary.includes(crop) ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {crop}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saison de culture
              </label>
              <div className="grid grid-cols-2 gap-2">
                {seasons.map((season) => (
                  <Button
                    key={season}
                    variant={assessment.crops.season === season ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAssessment('crops', 'season', season)}
                    className={assessment.crops.season === season ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {season}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Quels sont les risques climatiques auxquels votre région est exposée ?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    assessment.risks.drought ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleRisk('drought')}
                >
                  <div className="flex items-center gap-3">
                    <Droplets className={`h-6 w-6 ${assessment.risks.drought ? 'text-red-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="font-semibold">Sécheresse</h3>
                      <p className="text-sm text-gray-600">Manque de pluie prolongé</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    assessment.risks.flood ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleRisk('flood')}
                >
                  <div className="flex items-center gap-3">
                    <Droplets className={`h-6 w-6 ${assessment.risks.flood ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="font-semibold">Inondation</h3>
                      <p className="text-sm text-gray-600">Excès de pluie</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    assessment.risks.storm ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleRisk('storm')}
                >
                  <div className="flex items-center gap-3">
                    <Wind className={`h-6 w-6 ${assessment.risks.storm ? 'text-orange-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="font-semibold">Tempête</h3>
                      <p className="text-sm text-gray-600">Vents violents</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    assessment.risks.pests ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleRisk('pests')}
                >
                  <div className="flex items-center gap-3">
                    <Shield className={`h-6 w-6 ${assessment.risks.pests ? 'text-yellow-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="font-semibold">Ravageurs</h3>
                      <p className="text-sm text-gray-600">Insectes, maladies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Années d'expérience en agriculture
              </label>
              <Input
                type="number"
                placeholder="5"
                value={assessment.experience.years || ""}
                onChange={(e) => updateAssessment('experience', 'years', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Avez-vous déjà fait des réclamations d'assurance agricole ?
              </label>
              <div className="flex gap-4">
                <Button
                  variant={assessment.experience.previousClaims ? "default" : "outline"}
                  onClick={() => updateAssessment('experience', 'previousClaims', true)}
                  className={assessment.experience.previousClaims ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  Oui
                </Button>
                <Button
                  variant={!assessment.experience.previousClaims ? "default" : "outline"}
                  onClick={() => updateAssessment('experience', 'previousClaims', false)}
                  className={!assessment.experience.previousClaims ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  Non
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
        <h2 className="text-2xl font-bold text-gray-900">Évaluation de vos terres</h2>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentStep >= step.id ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
            }`}>
              <step.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${
                currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 text-green-600" })}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Précédent
        </Button>
        <Button
          onClick={nextStep}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {currentStep === 5 ? "Terminer l'évaluation" : "Suivant"}
        </Button>
      </div>
    </div>
  );
}
