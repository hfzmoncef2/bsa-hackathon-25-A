'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { suiInsuranceCleanService } from '../services/sui-insurance-clean';

export function CleanInsuranceCreator() {
  const [coverageAmount, setCoverageAmount] = useState<number>(1000);
  const [premiumAmount, setPremiumAmount] = useState<number>(100);
  const [riskType, setRiskType] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [contractCreated, setContractCreated] = useState(false);
  const [createdObjects, setCreatedObjects] = useState<any>(null);

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
    const packageId = prompt('Entrez le Package ID du contrat déployé:');
    if (packageId) {
      suiInsuranceCleanService.setPackageId(packageId);
      alert('✅ Package ID défini avec succès !');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🛡️ Créateur d'Assurance Sui
      </h2>
      
      <div className="space-y-4">
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
            <option value={1}>Sécheresse</option>
            <option value={2}>Inondation</option>
            <option value={3}>Tempête</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSetPackageId}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            📦 Définir Package ID
          </button>
          
          <button
            onClick={handleCreateContract}
            disabled={isCreating || !suiInsuranceCleanService.isDeployed() || !currentAccount}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? '⏳ Création...' : '🚀 Créer Contrat'}
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
