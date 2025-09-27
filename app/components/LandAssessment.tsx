'use client'
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Wheat, Droplets, Thermometer, Wind, Shield, CheckCircle } from "lucide-react";

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

interface LandAssessmentProps {
  onAssessmentComplete: (data: LandAssessmentData) => void;
  onBack: () => void;
}

export function LandAssessment({ onAssessmentComplete, onBack }: LandAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LandAssessmentData>({
    country: "",
    region: "",
    gpsCoordinates: "",
    area: "",
    soilType: "",
    irrigationSystem: "",
    altitude: "",
    mainCrop: "",
    secondaryCrops: "",
    farmingSeason: "",
    droughtRisk: false,
    floodRisk: false,
    stormRisk: false,
    pestDiseaseRisk: false,
    yearsExperience: "",
    previousClaims: "",
  });

  const steps = [
    { id: 1, title: "Localisation", icon: MapPin },
    { id: 2, title: "Caractéristiques", icon: Wheat },
    { id: 3, title: "Cultures", icon: Wheat },
    { id: 4, title: "Risques", icon: Shield },
    { id: 5, title: "Expérience", icon: CheckCircle },
  ];

  const handleInputChange = (field: keyof LandAssessmentData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onAssessmentComplete(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Pays</label>
              <Input
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="France"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Région</label>
              <Input
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="Bretagne"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Coordonnées GPS (optionnel)</label>
              <Input
                value={formData.gpsCoordinates}
                onChange={(e) => handleInputChange('gpsCoordinates', e.target.value)}
                placeholder="48.8566, 2.3522"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Surface (hectares)</label>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type de sol</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.soilType}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
              >
                <option value="">Sélectionnez...</option>
                <option value="argileux">Argileux</option>
                <option value="sableux">Sableux</option>
                <option value="limoneux">Limoneux</option>
                <option value="calcaire">Calcaire</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Système d'irrigation</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.irrigationSystem}
                onChange={(e) => handleInputChange('irrigationSystem', e.target.value)}
              >
                <option value="">Sélectionnez...</option>
                <option value="goutte-a-goutte">Goutte à goutte</option>
                <option value="aspersion">Aspersion</option>
                <option value="gravitaire">Gravitaire</option>
                <option value="aucun">Aucun</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Altitude (mètres)</label>
              <Input
                type="number"
                value={formData.altitude}
                onChange={(e) => handleInputChange('altitude', e.target.value)}
                placeholder="200"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Culture principale</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.mainCrop}
                onChange={(e) => handleInputChange('mainCrop', e.target.value)}
              >
                <option value="">Sélectionnez...</option>
                <option value="ble">Blé</option>
                <option value="mais">Maïs</option>
                <option value="orge">Orge</option>
                <option value="colza">Colza</option>
                <option value="tournesol">Tournesol</option>
                <option value="vigne">Vigne</option>
                <option value="fruits">Fruits</option>
                <option value="legumes">Légumes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cultures secondaires</label>
              <Input
                value={formData.secondaryCrops}
                onChange={(e) => handleInputChange('secondaryCrops', e.target.value)}
                placeholder="Orge, avoine..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Saison agricole</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.farmingSeason}
                onChange={(e) => handleInputChange('farmingSeason', e.target.value)}
              >
                <option value="">Sélectionnez...</option>
                <option value="printemps-ete">Printemps-Été</option>
                <option value="automne-hiver">Automne-Hiver</option>
                <option value="toute-annee">Toute l'année</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Quels sont les principaux risques climatiques dans votre région ?
            </p>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.droughtRisk}
                  onChange={(e) => handleInputChange('droughtRisk', e.target.checked)}
                  className="w-4 h-4"
                />
                <Droplets className="h-4 w-4 text-orange-500" />
                <span>Sécheresse</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.floodRisk}
                  onChange={(e) => handleInputChange('floodRisk', e.target.checked)}
                  className="w-4 h-4"
                />
                <Droplets className="h-4 w-4 text-blue-500" />
                <span>Inondations</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.stormRisk}
                  onChange={(e) => handleInputChange('stormRisk', e.target.checked)}
                  className="w-4 h-4"
                />
                <Wind className="h-4 w-4 text-gray-500" />
                <span>Tempêtes/Grêle</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.pestDiseaseRisk}
                  onChange={(e) => handleInputChange('pestDiseaseRisk', e.target.checked)}
                  className="w-4 h-4"
                />
                <Shield className="h-4 w-4 text-red-500" />
                <span>Maladies/Parasites</span>
              </label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Années d'expérience en agriculture</label>
              <Input
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                placeholder="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Réclamations d'assurance précédentes</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.previousClaims}
                onChange={(e) => handleInputChange('previousClaims', e.target.value)}
              >
                <option value="">Sélectionnez...</option>
                <option value="aucune">Aucune</option>
                <option value="1-2">1-2 réclamations</option>
                <option value="3-5">3-5 réclamations</option>
                <option value="plus-de-5">Plus de 5 réclamations</option>
              </select>
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
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Évaluation de vos Terres Agricoles</h2>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
              ${index + 1 === currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}
              ${index + 1 < currentStep ? 'bg-green-500 text-white' : ''}
            `}>
              {index + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            <span className={`text-xs mt-1 ${index + 1 === currentStep ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
              {step.title}
            </span>
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

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handlePreviousStep}>
            Précédent
          </Button>
        )}
        {currentStep < steps.length ? (
          <Button onClick={handleNextStep} className="ml-auto bg-green-600 hover:bg-green-700">
            Suivant
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="ml-auto bg-blue-600 hover:bg-blue-700">
            Voir les Recommandations
          </Button>
        )}
      </div>
    </div>
  );
}