'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calculator,
  MapPin,
  Wheat,
  Droplets,
  Sun,
  Wind,
  Snowflake,
  CloudRain
} from 'lucide-react';
import Link from 'next/link';

export default function InsurancePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Étape 2: Informations agricoles
    farmName: '',
    farmSize: '',
    location: '',
    cropType: '',
    
    // Étape 3: Risques à couvrir
    selectedRisks: [] as string[],
    
    // Étape 4: Montant de couverture
    coverageAmount: '',
    premiumAmount: '',
  });

  const riskTypes = [
    { id: 'drought', name: 'Sécheresse', icon: Sun, color: 'bg-yellow-100 text-yellow-800', price: 50 },
    { id: 'flood', name: 'Inondation', icon: Droplets, color: 'bg-blue-100 text-blue-800', price: 75 },
    { id: 'hail', name: 'Grêle', icon: Snowflake, color: 'bg-gray-100 text-gray-800', price: 100 },
    { id: 'storm', name: 'Tempête', icon: Wind, color: 'bg-purple-100 text-purple-800', price: 60 },
    { id: 'frost', name: 'Gel', icon: CloudRain, color: 'bg-cyan-100 text-cyan-800', price: 80 }
  ];

  const cropTypes = [
    'Blé', 'Maïs', 'Riz', 'Orge', 'Avoine', 'Seigle', 'Tournesol', 'Colza', 'Soja', 'Pommes de terre'
  ];

  const handleRiskToggle = (riskId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRisks: prev.selectedRisks.includes(riskId)
        ? prev.selectedRisks.filter(id => id !== riskId)
        : [...prev.selectedRisks, riskId]
    }));
  };

  const calculatePremium = () => {
    const basePremium = 100;
    const riskPremium = formData.selectedRisks.reduce((total, riskId) => {
      const risk = riskTypes.find(r => r.id === riskId);
      return total + (risk?.price || 0);
    }, 0);
    const farmSizeMultiplier = parseFloat(formData.farmSize) || 1;
    return Math.round((basePremium + riskPremium) * farmSizeMultiplier);
  };

  const totalPremium = calculatePremium();

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Ici vous intégreriez avec le contrat Sui
    console.log('Souscription:', formData);
    alert('Souscription en cours de traitement...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RainGuard</h1>
                  <p className="text-sm text-gray-600">Souscription d'assurance</p>
                </div>
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              Étape {step} sur 4
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Informations personnelles */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Renseignez vos informations pour créer votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Informations agricoles */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wheat className="mr-2 h-5 w-5 text-green-600" />
                Informations agricoles
              </CardTitle>
              <CardDescription>
                Décrivez votre exploitation agricole
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'exploitation *
                </label>
                <Input
                  value={formData.farmName}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmName: e.target.value }))}
                  placeholder="Nom de votre ferme"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille de l'exploitation (hectares) *
                  </label>
                  <Input
                    type="number"
                    value={formData.farmSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de culture *
                  </label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => setFormData(prev => ({ ...prev, cropType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionnez une culture</option>
                    {cropTypes.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Ville, Région, France"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Retour
                </Button>
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Risques à couvrir */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-green-600" />
                Risques à couvrir
              </CardTitle>
              <CardDescription>
                Sélectionnez les risques que vous souhaitez couvrir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {riskTypes.map((risk) => {
                  const Icon = risk.icon;
                  const isSelected = formData.selectedRisks.includes(risk.id);
                  
                  return (
                    <div
                      key={risk.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleRiskToggle(risk.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full ${risk.color} flex items-center justify-center`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{risk.name}</h3>
                            <p className="text-sm text-gray-600">+{risk.price}€/mois</p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={prevStep}>
                  Retour
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={formData.selectedRisks.length === 0}
                >
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Récapitulatif et paiement */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-green-600" />
                Récapitulatif et paiement
              </CardTitle>
              <CardDescription>
                Vérifiez vos informations et finalisez votre souscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Récapitulatif */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Récapitulatif de votre assurance</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Exploitation:</span>
                    <span className="font-medium">{formData.farmName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Localisation:</span>
                    <span className="font-medium">{formData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Culture:</span>
                    <span className="font-medium">{formData.cropType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surface:</span>
                    <span className="font-medium">{formData.farmSize} hectares</span>
                  </div>
                </div>
                
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between">
                    <span>Risques couverts:</span>
                    <div className="flex flex-wrap gap-1">
                      {formData.selectedRisks.map(riskId => {
                        const risk = riskTypes.find(r => r.id === riskId);
                        return risk ? (
                          <Badge key={riskId} variant="outline" className="text-xs">
                            {risk.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Calcul de la prime */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Calcul de votre prime</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Prime de base:</span>
                    <span>100€</span>
                  </div>
                  {formData.selectedRisks.map(riskId => {
                    const risk = riskTypes.find(r => r.id === riskId);
                    return risk ? (
                      <div key={riskId} className="flex justify-between">
                        <span>{risk.name}:</span>
                        <span>+{risk.price}€</span>
                      </div>
                    ) : null;
                  })}
                  <div className="flex justify-between">
                    <span>Multiplicateur surface ({formData.farmSize}ha):</span>
                    <span>×{formData.farmSize || 1}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Prime mensuelle:</span>
                      <span className="text-green-600">{totalPremium}€</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Retour
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Souscrire maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
