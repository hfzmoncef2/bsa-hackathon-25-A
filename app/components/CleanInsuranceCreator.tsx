'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { suiInsuranceCleanService } from '../services/sui-insurance-clean';

export default function CleanInsuranceCreator() {
  const [coverageAmount, setCoverageAmount] = useState<number>(1000);
  const [premiumAmount, setPremiumAmount] = useState<number>(100);
  const [riskType, setRiskType] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [contractCreated, setContractCreated] = useState(false);
  const [createdObjects, setCreatedObjects] = useState<any>(null);
  const [packageIdInput, setPackageIdInput] = useState<string>('');
  
  // Conditions météo
  const [maxTemperature, setMaxTemperature] = useState<number>(35);
  const [maxRainfall, setMaxRainfall] = useState<number>(50);
  const [maxHumidity, setMaxHumidity] = useState<number>(80);
  const [locationLat, setLocationLat] = useState<number>(48.8566); // Paris par défaut
  const [locationLng, setLocationLng] = useState<number>(2.3522);

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const handleCreateContract = async () => {
    if (!currentAccount) {
      alert('❌ Wallet non connecté. Veuillez connecter votre wallet Sui.');
      return;
    }

    if (!suiInsuranceCleanService.isDeployed()) {
      alert('❌ Contrat non déployé. Veuillez d\'abord déployer le contrat Move.');
      return;
    }

    setIsCreating(true);
    try {
      const result = await suiInsuranceCleanService.createInsuranceObject(
        coverageAmount,
        premiumAmount,
        riskType,
        maxTemperature,
        5, // minTemperature fixe
        maxRainfall,
        30, // minHumidity fixe
        maxHumidity,
        locationLat,
        locationLng,
        signAndExecute,
        currentAccount
      );

      setCreatedObjects(result);
      setContractCreated(true);
      
      // Stocker dans localStorage pour la démo
      localStorage.setItem('suiInsuranceObject', JSON.stringify(result.policyObject));
      localStorage.setItem('suiPolicyCap', JSON.stringify(result.capObject));
      
      alert(`✅ Contrat d'assurance créé avec succès !
      
🛡️ Police ID: ${result.policyObject.objectId}
🔑 Cap ID: ${result.capObject.objectId}
💰 Couverture: ${coverageAmount} SUI
💳 Prime: ${premiumAmount} SUI
🎯 Type de risque: ${riskType}

Les objets sont maintenant dans votre wallet Sui !`);
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
      alert(`❌ Erreur lors de la création du contrat: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSetPackageId = () => {
    if (packageIdInput) {
      suiInsuranceCleanService.setPackageId(packageIdInput);
      alert('✅ Package ID défini avec succès !');
    } else {
      alert('❌ Veuillez entrer un Package ID valide.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🛡️ Créateur d'Assurance Sui
      </h2>
      
      <div className="space-y-4">
        {/* Configuration Package ID */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Configuration Contrat</h4>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={packageIdInput}
              onChange={(e) => setPackageIdInput(e.target.value)}
              placeholder="Package ID du contrat (ex: 0x...)"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              onClick={handleSetPackageId}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Définir
            </button>
          </div>
          {suiInsuranceCleanService.isDeployed() && (
            <p className="mt-2 text-xs text-green-600">
              ✅ Contrat configuré : {suiInsuranceCleanService.getPackageId()?.slice(0, 8)}...{suiInsuranceCleanService.getPackageId()?.slice(-8)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant de couverture (SUI)
          </label>
          <input
            type="number"
            value={coverageAmount}
            onChange={(e) => setCoverageAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant de la prime (SUI)
          </label>
          <input
            type="number"
            value={premiumAmount}
            onChange={(e) => setPremiumAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de risque
          </label>
          <select
            value={riskType}
            onChange={(e) => setRiskType(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Risques Météo</option>
          </select>
        </div>

        {/* Conditions météo simplifiées */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🌤️ Conditions Météo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Température max (°C)
              </label>
              <input
                type="number"
                value={maxTemperature}
                onChange={(e) => setMaxTemperature(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="35"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pluviométrie max (mm)
              </label>
              <input
                type="number"
                value={maxRainfall}
                onChange={(e) => setMaxRainfall(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humidité max (%)
              </label>
              <input
                type="number"
                value={maxHumidity}
                onChange={(e) => setMaxHumidity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="80"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position (Latitude, Longitude)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.0001"
                value={locationLat}
                onChange={(e) => setLocationLat(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="48.8566"
              />
              <input
                type="number"
                step="0.0001"
                value={locationLng}
                onChange={(e) => setLocationLng(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2.3522"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleCreateContract}
            disabled={isCreating || !suiInsuranceCleanService.isDeployed() || !currentAccount}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
          >
            {isCreating ? '⏳ Création...' : '🚀 Créer Contrat d\'Assurance'}
          </button>
        </div>

        {currentAccount && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">
              ✅ <strong>Wallet connecté :</strong> {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-8)}
            </p>
          </div>
        )}

        {!currentAccount && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              ❌ <strong>Wallet non connecté.</strong> Veuillez connecter votre wallet Sui.
            </p>
          </div>
        )}

        {contractCreated && createdObjects && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ✅ Contrat créé avec succès !
            </h3>
            <div className="text-sm text-green-700">
              <p><strong>Police ID:</strong> {createdObjects.policyObject.objectId}</p>
              <p><strong>Cap ID:</strong> {createdObjects.capObject.objectId}</p>
              <p><strong>Couverture:</strong> {coverageAmount} SUI</p>
              <p><strong>Prime:</strong> {premiumAmount} SUI</p>
            </div>
          </div>
        )}

        {!suiInsuranceCleanService.isDeployed() && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              ⚠️ <strong>Contrat non déployé.</strong> Veuillez d'abord déployer le contrat Move et définir le Package ID.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
