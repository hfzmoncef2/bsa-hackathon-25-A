'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft,
  MapPin,
  Wheat,
  Droplets,
  Sun,
  Wind,
  Snowflake,
  CloudRain,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Save,
  FileText
} from 'lucide-react';
import Link from 'next/link';
// import { useSuiContract } from '@/hooks/useSuiContract';

export default function FieldSpecificationPage() {
  const [step, setStep] = useState(1);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [contractCreated, setContractCreated] = useState(false);
  // const { createInsurancePolicy } = useSuiContract();
  
  const [fieldData, setFieldData] = useState({
    // Étape 1: Informations de base
    fieldName: '',
    location: '',
    coordinates: { lat: '', lng: '' },
    totalArea: '',
    
    // Étape 2: Détails du champ
    soilType: '',
    irrigation: false,
    drainage: '',
    elevation: '',
    slope: '',
    
    // Étape 3: Cultures
    cropType: '',
    plantingDate: '',
    expectedHarvest: '',
    cropVariety: '',
    
    // Étape 4: Risques et couverture
    selectedRisks: [] as string[],
    coverageAmount: '',
    deductible: '',
    
    // Étape 5: Données météo historiques
    historicalWeather: {
      avgRainfall: '',
      avgTemperature: '',
      extremeEvents: [] as string[]
    }
  });

  const riskTypes = [
    { 
      id: 'drought', 
      name: 'Sécheresse', 
      icon: Sun, 
      color: 'bg-yellow-100 text-yellow-800', 
      basePrice: 50,
      description: 'Protection contre le manque de pluie prolongé'
    },
    { 
      id: 'flood', 
      name: 'Inondation', 
      icon: Droplets, 
      color: 'bg-blue-100 text-blue-800', 
      basePrice: 75,
      description: 'Protection contre les excès d\'eau'
    },
    { 
      id: 'hail', 
      name: 'Grêle', 
      icon: Snowflake, 
      color: 'bg-gray-100 text-gray-800', 
      basePrice: 100,
      description: 'Protection contre les dommages de grêle'
    },
    { 
      id: 'storm', 
      name: 'Tempête', 
      icon: Wind, 
      color: 'bg-purple-100 text-purple-800', 
      basePrice: 60,
      description: 'Protection contre les vents violents'
    },
    { 
      id: 'frost', 
      name: 'Gel', 
      icon: CloudRain, 
      color: 'bg-cyan-100 text-cyan-800', 
      basePrice: 80,
      description: 'Protection contre le gel'
    }
  ];

  const soilTypes = [
    'Argile', 'Sable', 'Limon', 'Terreau', 'Calcaire', 'Tourbe'
  ];

  const drainageOptions = [
    'Excellent', 'Bon', 'Moyen', 'Médiocre'
  ];

  const cropTypes = [
    'Blé', 'Maïs', 'Riz', 'Orge', 'Avoine', 'Seigle', 'Tournesol', 'Colza', 'Soja', 'Pommes de terre'
  ];

  const extremeEvents = [
    'Sécheresse 2022', 'Inondation 2021', 'Grêle 2023', 'Tempête 2020', 'Gel 2019'
  ];

  const handleRiskToggle = (riskId: string) => {
    setFieldData(prev => ({
      ...prev,
      selectedRisks: prev.selectedRisks.includes(riskId)
        ? prev.selectedRisks.filter(id => id !== riskId)
        : [...prev.selectedRisks, riskId]
    }));
  };

  const calculatePremium = () => {
    const basePremium = 100;
    const riskPremium = fieldData.selectedRisks.reduce((total, riskId) => {
      const risk = riskTypes.find(r => r.id === riskId);
      return total + (risk?.basePrice || 0);
    }, 0);
    const areaMultiplier = parseFloat(fieldData.totalArea) || 1;
    const coverageMultiplier = parseFloat(fieldData.coverageAmount) / 10000 || 1;
    
    return Math.round((basePremium + riskPremium) * areaMultiplier * coverageMultiplier);
  };

  const totalPremium = calculatePremium();

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const createSmartContract = async () => {
    setIsCreatingContract(true);
    
    try {
      // Appel au service Sui pour créer le contrat
      // const result = await createInsurancePolicy(fieldData, totalPremium);
      
      // console.log('Contrat créé avec succès:', result);
      
      // Stocker les informations du contrat
      localStorage.setItem('rainGuardContract', JSON.stringify({
        // policyId: result.policyId,
        // contractAddress: result.contractAddress,
        // transactionHash: result.transactionHash,
        fieldData,
        premium: totalPremium
      }));
      
      setContractCreated(true);
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
      alert('Erreur lors de la création du contrat. Veuillez réessayer.');
    } finally {
      setIsCreatingContract(false);
    }
  };

  if (contractCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contrat créé avec succès !
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Votre contrat d'assurance RainGuard a été déployé sur la blockchain Sui.
            </p>
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">Détails du contrat</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Champ:</span>
                  <span className="font-medium">{fieldData.fieldName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Surface:</span>
                  <span className="font-medium">{fieldData.totalArea} hectares</span>
                </div>
                <div className="flex justify-between">
                  <span>Couverture:</span>
                  <span className="font-medium">{fieldData.coverageAmount}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Prime mensuelle:</span>
                  <span className="font-medium text-green-600">{totalPremium}€</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  Voir le tableau de bord
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  const contractData = JSON.parse(localStorage.getItem('rainGuardContract') || '{}');
                  if (contractData.transactionHash) {
                    window.open(`https://suiexplorer.com/txblock/${contractData.transactionHash}?network=testnet`, '_blank');
                  }
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Voir sur Sui Explorer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  <p className="text-sm text-gray-600">Spécification du champ</p>
                </div>
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              Étape {step} sur 5
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Étape 1: Informations de base */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                Informations de base du champ
              </CardTitle>
              <CardDescription>
                Renseignez les informations générales de votre champ agricole
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du champ *
                </label>
                <Input
                  value={fieldData.fieldName}
                  onChange={(e) => setFieldData(prev => ({ ...prev, fieldName: e.target.value }))}
                  placeholder="Ex: Champ Nord, Parcelle A, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <Input
                  value={fieldData.location}
                  onChange={(e) => setFieldData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ville, Région, France"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={fieldData.coordinates.lat}
                    onChange={(e) => setFieldData(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lat: e.target.value }
                    }))}
                    placeholder="48.8566"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={fieldData.coordinates.lng}
                    onChange={(e) => setFieldData(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lng: e.target.value }
                    }))}
                    placeholder="2.3522"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface totale (hectares) *
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={fieldData.totalArea}
                  onChange={(e) => setFieldData(prev => ({ ...prev, totalArea: e.target.value }))}
                  placeholder="10.5"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Détails du champ */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wheat className="mr-2 h-5 w-5 text-green-600" />
                Caractéristiques du sol
              </CardTitle>
              <CardDescription>
                Décrivez les caractéristiques physiques de votre champ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de sol *
                </label>
                <select
                  value={fieldData.soilType}
                  onChange={(e) => setFieldData(prev => ({ ...prev, soilType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionnez un type de sol</option>
                  {soilTypes.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Système d'irrigation
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="irrigation"
                      checked={fieldData.irrigation}
                      onChange={(e) => setFieldData(prev => ({ ...prev, irrigation: true }))}
                      className="mr-2"
                    />
                    Oui
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="irrigation"
                      checked={!fieldData.irrigation}
                      onChange={(e) => setFieldData(prev => ({ ...prev, irrigation: false }))}
                      className="mr-2"
                    />
                    Non
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualité du drainage *
                </label>
                <select
                  value={fieldData.drainage}
                  onChange={(e) => setFieldData(prev => ({ ...prev, drainage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionnez la qualité du drainage</option>
                  {drainageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altitude (mètres)
                  </label>
                  <Input
                    type="number"
                    value={fieldData.elevation}
                    onChange={(e) => setFieldData(prev => ({ ...prev, elevation: e.target.value }))}
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pente (degrés)
                  </label>
                  <Input
                    type="number"
                    value={fieldData.slope}
                    onChange={(e) => setFieldData(prev => ({ ...prev, slope: e.target.value }))}
                    placeholder="5"
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

        {/* Étape 3: Cultures */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wheat className="mr-2 h-5 w-5 text-green-600" />
                Informations sur les cultures
              </CardTitle>
              <CardDescription>
                Décrivez les cultures que vous cultivez sur ce champ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de culture principal *
                </label>
                <select
                  value={fieldData.cropType}
                  onChange={(e) => setFieldData(prev => ({ ...prev, cropType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionnez une culture</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variété de culture
                </label>
                <Input
                  value={fieldData.cropVariety}
                  onChange={(e) => setFieldData(prev => ({ ...prev, cropVariety: e.target.value }))}
                  placeholder="Ex: Blé tendre d'hiver, Maïs hybride, etc."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de plantation
                  </label>
                  <Input
                    type="date"
                    value={fieldData.plantingDate}
                    onChange={(e) => setFieldData(prev => ({ ...prev, plantingDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Récolte prévue
                  </label>
                  <Input
                    type="date"
                    value={fieldData.expectedHarvest}
                    onChange={(e) => setFieldData(prev => ({ ...prev, expectedHarvest: e.target.value }))}
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

        {/* Étape 4: Risques et couverture */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-green-600" />
                Risques à couvrir et montant de couverture
              </CardTitle>
              <CardDescription>
                Sélectionnez les risques et définissez votre couverture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Risques à couvrir</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskTypes.map((risk) => {
                    const Icon = risk.icon;
                    const isSelected = fieldData.selectedRisks.includes(risk.id);
                    
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
                              <p className="text-sm text-gray-600">{risk.description}</p>
                              <p className="text-sm text-green-600">+{risk.basePrice}€/mois</p>
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant de couverture souhaité (€) *
                  </label>
                  <Input
                    type="number"
                    value={fieldData.coverageAmount}
                    onChange={(e) => setFieldData(prev => ({ ...prev, coverageAmount: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Franchise (€)
                  </label>
                  <Input
                    type="number"
                    value={fieldData.deductible}
                    onChange={(e) => setFieldData(prev => ({ ...prev, deductible: e.target.value }))}
                    placeholder="5000"
                  />
                </div>
              </div>
              
              {/* Calcul de la prime */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcul de votre prime
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Prime de base:</span>
                    <span>100€</span>
                  </div>
                  {fieldData.selectedRisks.map(riskId => {
                    const risk = riskTypes.find(r => r.id === riskId);
                    return risk ? (
                      <div key={riskId} className="flex justify-between">
                        <span>{risk.name}:</span>
                        <span>+{risk.basePrice}€</span>
                      </div>
                    ) : null;
                  })}
                  <div className="flex justify-between">
                    <span>Multiplicateur surface ({fieldData.totalArea}ha):</span>
                    <span>×{fieldData.totalArea || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multiplicateur couverture:</span>
                    <span>×{parseFloat(fieldData.coverageAmount) / 10000 || 1}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Prime mensuelle estimée:</span>
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
                  onClick={nextStep} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={fieldData.selectedRisks.length === 0}
                >
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 5: Données météo historiques */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudRain className="mr-2 h-5 w-5 text-green-600" />
                Données météo historiques
              </CardTitle>
              <CardDescription>
                Aidez-nous à mieux comprendre les risques de votre région
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pluviométrie moyenne annuelle (mm)
                  </label>
                  <Input
                    type="number"
                    value={fieldData.historicalWeather.avgRainfall}
                    onChange={(e) => setFieldData(prev => ({ 
                      ...prev, 
                      historicalWeather: { ...prev.historicalWeather, avgRainfall: e.target.value }
                    }))}
                    placeholder="800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Température moyenne annuelle (°C)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={fieldData.historicalWeather.avgTemperature}
                    onChange={(e) => setFieldData(prev => ({ 
                      ...prev, 
                      historicalWeather: { ...prev.historicalWeather, avgTemperature: e.target.value }
                    }))}
                    placeholder="12.5"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Événements météo extrêmes récents
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {extremeEvents.map(event => (
                    <label key={event} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={fieldData.historicalWeather.extremeEvents.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFieldData(prev => ({
                              ...prev,
                              historicalWeather: {
                                ...prev.historicalWeather,
                                extremeEvents: [...prev.historicalWeather.extremeEvents, event]
                              }
                            }));
                          } else {
                            setFieldData(prev => ({
                              ...prev,
                              historicalWeather: {
                                ...prev.historicalWeather,
                                extremeEvents: prev.historicalWeather.extremeEvents.filter(ev => ev !== event)
                              }
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Récapitulatif de votre contrat</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Champ:</span>
                    <span className="font-medium">{fieldData.fieldName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surface:</span>
                    <span className="font-medium">{fieldData.totalArea} hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Culture:</span>
                    <span className="font-medium">{fieldData.cropType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Couverture:</span>
                    <span className="font-medium">{fieldData.coverageAmount}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risques couverts:</span>
                    <div className="flex flex-wrap gap-1">
                      {fieldData.selectedRisks.map(riskId => {
                        const risk = riskTypes.find(r => r.id === riskId);
                        return risk ? (
                          <Badge key={riskId} variant="outline" className="text-xs">
                            {risk.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
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
                  onClick={createSmartContract}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isCreatingContract}
                >
                  {isCreatingContract ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création du contrat...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Créer le contrat
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
