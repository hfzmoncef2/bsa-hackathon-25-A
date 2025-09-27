'use client'
import { useState } from "react";
import { LandAssessment } from "./components/LandAssessment";
import { InsuranceRecommendations } from "./components/InsuranceRecommendations";
import { CreateInsuranceContract } from "./CreateInsuranceContract";

interface LandAssessmentData {
  country: string;
  region: string;
  gpsCoordinates: string;
  area: string; // in hectares
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

export function LandAssessmentFlow() {
  const [assessmentData, setAssessmentData] = useState<LandAssessmentData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);

  const handleAssessmentComplete = (data: LandAssessmentData) => {
    setAssessmentData(data);
    setSelectedPlan(null); // Reset selected plan when assessment changes
  };

  const handleSelectPlan = (plan: InsurancePlan) => {
    setSelectedPlan(plan);
  };

  const handleBackToRecommendations = () => {
    setSelectedPlan(null);
  };

  const handleBackToAssessment = () => {
    setAssessmentData(null);
    setSelectedPlan(null);
  };

  if (selectedPlan) {
    return (
      <CreateInsuranceContract 
        onBack={handleBackToRecommendations} 
        preSelectedPlan={selectedPlan} 
      />
    );
  }

  if (assessmentData) {
    return (
      <InsuranceRecommendations 
        assessmentData={assessmentData} 
        onSelectPlan={handleSelectPlan} 
        onBack={handleBackToAssessment}
      />
    );
  }

  return (
    <LandAssessment onAssessmentComplete={handleAssessmentComplete} onBack={() => window.location.reload()} />
  );
}