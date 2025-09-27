'use client'
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { InsuranceDashboard } from "./components/InsuranceDashboard";
import { LandAssessmentFlow } from "./LandAssessmentFlow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function App() {
  const currentAccount = useCurrentAccount();
  const [showLandAssessment, setShowLandAssessment] = useState(false);

  const handleStartAssessment = () => {
    setShowLandAssessment(true);
  };

  const handleBackToHome = () => {
    setShowLandAssessment(false);
  };

  if (showLandAssessment) {
    return (
      <div className="container mx-auto p-6">
        <Card className="min-h-[500px]">
          <CardContent className="pt-6">
            <LandAssessmentFlow />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6" >
      <Card className="min-h-[500px]" >
        <CardContent className="pt-6" >
          {currentAccount ? (
            <InsuranceDashboard />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-black-900 mb-2">🌾 Bienvenue sur RainGuard</h2>
              <p className="text-gray-600 mb-4">Connectez votre portefeuille pour accéder à votre tableau de bord d'assurance agricole</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto mb-6">
                <h3 className="font-semibold text-green-800 mb-2">Protégez vos récoltes</h3>
                <p className="text-sm text-green-700">
                  Souscrivez des contrats d'assurance indexés sur des données météo réelles. 
                  Paiements automatiques et transparents grâce à la blockchain.
                </p>
              </div>
              <Button
                onClick={handleStartAssessment}
                data-start-assessment
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                🌱 Commencer l'évaluation de mes terres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;