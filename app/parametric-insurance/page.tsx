'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft,
  Droplets,
  Sun,
  Calendar,
  MapPin,
  Calculator,
  CheckCircle,
  AlertTriangle,
  CloudRain,
  Wind,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
// import { nautilusOracleService } from '@/services/nautilus-oracle';

export default function ParametricInsurancePage() {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<'seasonal' | 'event' | null>(null);
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
  const [policyCreated, setPolicyCreated] = useState(false);
  
  const [policyData, setPolicyData] = useState({
    // Informations de base
    fieldName: '',
    location: '',
    coordinates: { lat: '', lng: '' },
    area: '',
    
    // Produit d'assurance
    productType: '',
    coverageAmount: '',
    premium: '',
    
    // Seuils paramétriques
    triggerThreshold: '',
    saturationThreshold: '',
    
    // Période de couverture
    coverageStart: '',
    coverageEnd: '',
    
    // Données météo historiques
    historicalData: {
      avgRainfall: '',
      extremeEvents: [] as string[]
    }
  });

  const productTypes = [
    {
      id: 'seasonal',
      name: 'Assurance Saisonnière',
      description: 'Protection basée sur la pluie cumulée sur une période',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800',
      features: [
        'Pluie cumulée sur la saison',
        'Seuil de déclenchement personnalisé',
        'Paiement proportionnel',
        'Couverture longue durée'
      ],
      example: 'Si moins de 200mm de pluie sur 6 mois'
    },
    {
      id: 'event',
      name: 'Assurance Événementielle',
      description: 'Protection basée sur les événements météo extrêmes',
      icon: CloudRain,
      color: 'bg-red-100 text-red-800',
      features: [
        'Pluie en 24h',
        'Déclenchement immédiat',
        'Paiement rapide',
        'Protection événements'
      ],
      example: 'Si plus de 50mm de pluie en 24h'
    }
  ];

  const extremeEvents = [
    'Sécheresse 2022', 'Inondation 2021', 'Grêle 2023', 'Tempête 2020', 'Gel 2019'
  ];

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const selectProduct = (productId: 'seasonal' | 'event') => {
    setSelectedProduct(productId);
    setPolicyData(prev => ({ ...prev, productType: productId }));
  };

  const calculatePremium = () => {
    const basePremium = selectedProduct === 'seasonal' ? 200 : 150;
    const coverageMultiplier = parseFloat(policyData.coverageAmount) / 10000 || 1;
    const areaMultiplier = parseFloat(policyData.area) || 1;
    
    return Math.round(basePremium * coverageMultiplier * areaMultiplier);
  };

  const createParametricPolicy = async () => {
    setIsCreatingPolicy(true);
    
    try {
      // Simulation de la création du contrat paramétrique
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Ici vous intégreriez avec le contrat Sui paramétrique
      console.log('Création du contrat paramétrique:', policyData);
      
      setPolicyCreated(true);
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
      alert('Erreur lors de la création du contrat. Veuillez réessayer.');
    } finally {
      setIsCreatingPolicy(false);
    }
  };

  if (policyCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contrat paramétrique créé !
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Votre assurance paramétrique RainGuard est maintenant active avec l'oracle Nautilus TEE.
            </p>
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">Détails du contrat paramétrique</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Type de produit:</span>
                  <span className="font-medium">
                    {selectedProduct === 'seasonal' ? 'Saisonnière' : 'Événementielle'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Champ:</span>
                  <span className="font-medium">{policyData.fieldName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Couverture:</span>
                  <span className="font-medium">{policyData.coverageAmount}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Seuil de déclenchement:</span>
                  <span className="font-medium">{policyData.triggerThreshold}mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Prime mensuelle:</span>
                  <span className="font-medium text-green-600">{calculatePremium()}€</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  Voir le tableau de bord
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">
                  Retour à l'accueil
                </Link>
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
                  <p className="text-sm text-gray-600">Assurance Paramétrique</p>
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

        {/* Étape 1: Sélection du produit */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Choisissez votre type d'assurance paramétrique
              </CardTitle>
              <CardDescription>
                Sélectionnez le produit qui correspond le mieux à vos besoins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productTypes.map((product) => {
                  const Icon = product.icon;
                  const isSelected = selectedProduct === product.id;
                  
                  return (
                    <div
                      key={product.id}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => selectProduct(product.id as 'seasonal' | 'event')}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full ${product.color} flex items-center justify-center`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.description}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Fonctionnalités :</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-700">
                          <strong>Exemple :</strong> {product.example}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={nextStep} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!selectedProduct}
                >
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Informations du champ */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                Informations de votre champ
              </CardTitle>
              <CardDescription>
                Renseignez les détails de votre exploitation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du champ *
                </label>
                <Input
                  value={policyData.fieldName}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, fieldName: e.target.value }))}
                  placeholder="Ex: Champ Nord, Parcelle A"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <Input
                  value={policyData.location}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ville, Région, France"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={policyData.coordinates.lat}
                    onChange={(e) => setPolicyData(prev => ({ 
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
                    value={policyData.coordinates.lng}
                    onChange={(e) => setPolicyData(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lng: e.target.value }
                    }))}
                    placeholder="2.3522"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface (hectares) *
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={policyData.area}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, area: e.target.value }))}
                    placeholder="10.5"
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

        {/* Étape 3: Configuration paramétrique */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-green-600" />
                Configuration des seuils paramétriques
              </CardTitle>
              <CardDescription>
                Définissez les seuils de déclenchement pour votre assurance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  {selectedProduct === 'seasonal' ? 'Assurance Saisonnière' : 'Assurance Événementielle'}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedProduct === 'seasonal' 
                    ? 'Protection basée sur la pluie cumulée sur la période de couverture'
                    : 'Protection basée sur la pluie en 24 heures'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant de couverture (€) *
                  </label>
                  <Input
                    type="number"
                    value={policyData.coverageAmount}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, coverageAmount: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seuil de déclenchement (mm) *
                  </label>
                  <Input
                    type="number"
                    value={policyData.triggerThreshold}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, triggerThreshold: e.target.value }))}
                    placeholder={selectedProduct === 'seasonal' ? '200' : '50'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedProduct === 'seasonal' 
                      ? 'Pluie cumulée minimale pour déclencher'
                      : 'Pluie en 24h pour déclencher'
                    }
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seuil de saturation (mm)
                  </label>
                  <Input
                    type="number"
                    value={policyData.saturationThreshold}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, saturationThreshold: e.target.value }))}
                    placeholder={selectedProduct === 'seasonal' ? '100' : '25'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Seuil pour paiement complet (optionnel)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Période de couverture
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={policyData.coverageStart}
                      onChange={(e) => setPolicyData(prev => ({ ...prev, coverageStart: e.target.value }))}
                    />
                    <Input
                      type="date"
                      value={policyData.coverageEnd}
                      onChange={(e) => setPolicyData(prev => ({ ...prev, coverageEnd: e.target.value }))}
                    />
                  </div>
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
                    <span>{selectedProduct === 'seasonal' ? '200€' : '150€'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multiplicateur couverture:</span>
                    <span>×{parseFloat(policyData.coverageAmount) / 10000 || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multiplicateur surface:</span>
                    <span>×{policyData.area || 1}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Prime mensuelle estimée:</span>
                      <span className="text-green-600">{calculatePremium()}€</span>
                    </div>
                  </div>
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

        {/* Étape 4: Données historiques et finalisation */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Données historiques et finalisation
              </CardTitle>
              <CardDescription>
                Aidez-nous à calibrer votre assurance avec les données historiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pluviométrie moyenne historique (mm/an)
                </label>
                <Input
                  type="number"
                  value={policyData.historicalData.avgRainfall}
                  onChange={(e) => setPolicyData(prev => ({ 
                    ...prev, 
                    historicalData: { ...prev.historicalData, avgRainfall: e.target.value }
                  }))}
                  placeholder="800"
                />
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
                        checked={policyData.historicalData.extremeEvents.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPolicyData(prev => ({
                              ...prev,
                              historicalData: {
                                ...prev.historicalData,
                                extremeEvents: [...prev.historicalData.extremeEvents, event]
                              }
                            }));
                          } else {
                            setPolicyData(prev => ({
                              ...prev,
                              historicalData: {
                                ...prev.historicalData,
                                extremeEvents: prev.historicalData.extremeEvents.filter(ev => ev !== event)
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
                <h3 className="font-semibold mb-4">Récapitulatif de votre assurance paramétrique</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Type de produit:</span>
                    <span className="font-medium">
                      {selectedProduct === 'seasonal' ? 'Saisonnière' : 'Événementielle'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Champ:</span>
                    <span className="font-medium">{policyData.fieldName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Couverture:</span>
                    <span className="font-medium">{policyData.coverageAmount}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seuil de déclenchement:</span>
                    <span className="font-medium">{policyData.triggerThreshold}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prime mensuelle:</span>
                    <span className="font-medium text-green-600">{calculatePremium()}€</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Retour
                </Button>
                <Button 
                  onClick={createParametricPolicy}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isCreatingPolicy}
                >
                  {isCreatingPolicy ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création du contrat...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Créer l'assurance paramétrique
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
