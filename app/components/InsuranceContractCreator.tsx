'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { suiInsuranceCleanService } from '../services/sui-insurance-clean';
import { unifiedWeatherService } from '../services/unified-weather-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, MapPin, CloudRain, Thermometer, Droplets, AlertCircle } from 'lucide-react';

export function InsuranceContractCreator() {
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [contractCreated, setContractCreated] = useState(false);
  const [createdObjects, setCreatedObjects] = useState<any>(null);
  const [packageIdInput, setPackageIdInput] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données du contrat
  const [contractData, setContractData] = useState({
    coverageAmount: 1000,
    premiumAmount: 100,
    location: {
      lat: 48.8566,
      lng: 2.3522,
      name: 'Paris, France'
    },
    weatherThresholds: {
      maxTemperature: 35,
      minTemperature: 5,
      maxRainfall: 50,
      minHumidity: 30,
      maxHumidity: 80
    }
  });

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  // Fonction pour récupérer les données météo
  const fetchWeatherData = async (lat: number, lng: number) => {
    setIsLoadingWeather(true);
    try {
      const weather = await unifiedWeatherService.getCurrentWeather(lat, lng);
      setCurrentWeather(weather);
      console.log('🌤️ Données météo récupérées:', weather);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données météo:', error);
      setCurrentWeather(null);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const handleSetPackageId = () => {
    if (packageIdInput) {
      suiInsuranceCleanService.setPackageId(packageIdInput);
      alert('✅ Package ID set successfully!');
    } else {
      alert('❌ Please enter a valid Package ID.');
    }
  };

  const handleCreateContract = async () => {
    if (!currentAccount) {
      setError('❌ Wallet not connected. Please connect your Sui wallet.');
      return;
    }

    if (!suiInsuranceCleanService.isDeployed()) {
      setError('❌ Contract not deployed. Please deploy the Move contract and set the Package ID first.');
      return;
    }

    setIsCreating(true);
    setError(null);
    try {
      // Get current weather data for comparison
      const currentWeather = await unifiedWeatherService.getCurrentWeather(
        contractData.location.lat, 
        contractData.location.lng
      );

      console.log('🌤️ Current weather data:', currentWeather);

      // Create insurance contract
      const result = await suiInsuranceCleanService.createInsuranceObject(
        contractData.coverageAmount,
        contractData.premiumAmount,
        1, // riskType: Weather Risks
        contractData.weatherThresholds.maxTemperature,
        contractData.weatherThresholds.minTemperature,
        contractData.weatherThresholds.maxRainfall,
        contractData.weatherThresholds.minHumidity,
        contractData.weatherThresholds.maxHumidity,
        contractData.location.lat,
        contractData.location.lng,
        signAndExecute,
        currentAccount
      );

      setCreatedObjects(result);
      setContractCreated(true);
      
      // Store in localStorage for demo
      localStorage.setItem('suiInsuranceObject', JSON.stringify(result.policyObject));
      localStorage.setItem('suiPolicyCap', JSON.stringify(result.capObject));
      
      // No alert - interface already shows success
    } catch (error) {
      console.error('Error creating contract:', error);
      setError(`❌ Error creating contract: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Configuration Package ID */}
      {!suiInsuranceCleanService.isDeployed() && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Configuration Requise</CardTitle>
            <CardDescription>
              Définissez le Package ID du contrat déployé pour continuer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                value={packageIdInput}
                onChange={(e) => setPackageIdInput(e.target.value)}
                placeholder="Package ID du contrat (ex: 0x...)"
                className="flex-1"
              />
              <Button onClick={handleSetPackageId} className="bg-orange-600 hover:bg-orange-700">
                Définir
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étapes du formulaire */}
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-600" />
              Create Your Insurance Contract
            </CardTitle>
            <CardDescription>
              Step {step} of 3 - Define your needs and weather conditions
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-6">
          {/* Étape 1: Informations de base */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coverage">Coverage Amount (SUI)</Label>
                  <Input
                    id="coverage"
                    type="number"
                    value={contractData.coverageAmount}
                    onChange={(e) => setContractData({
                      ...contractData,
                      coverageAmount: Number(e.target.value)
                    })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="premium">Monthly Premium (SUI)</Label>
                  <Input
                    id="premium"
                    type="number"
                    value={contractData.premiumAmount}
                    onChange={(e) => setContractData({
                      ...contractData,
                      premiumAmount: Number(e.target.value)
                    })}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Your Field Position</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.0001"
                      value={contractData.location.lat}
                      onChange={(e) => {
                        const newLat = Number(e.target.value);
                        setContractData({
                          ...contractData,
                          location: { ...contractData.location, lat: newLat }
                        });
                        // Fetch weather data if coordinates are valid
                        if (newLat !== 0 && contractData.location.lng !== 0) {
                          fetchWeatherData(newLat, contractData.location.lng);
                        }
                      }}
                      placeholder="48.8566"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.0001"
                      value={contractData.location.lng}
                      onChange={(e) => {
                        const newLng = Number(e.target.value);
                        setContractData({
                          ...contractData,
                          location: { ...contractData.location, lng: newLng }
                        });
                        // Fetch weather data if coordinates are valid
                        if (contractData.location.lat !== 0 && newLng !== 0) {
                          fetchWeatherData(contractData.location.lat, newLng);
                        }
                      }}
                      placeholder="2.3522"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500">
                    📍 Current position: {contractData.location.name}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fetchWeatherData(contractData.location.lat, contractData.location.lng)}
                    disabled={isLoadingWeather || contractData.location.lat === 0 || contractData.location.lng === 0}
                    className="text-xs"
                  >
                    {isLoadingWeather ? (
                      <>
                        <CloudRain className="mr-1 h-3 w-3 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <CloudRain className="mr-1 h-3 w-3" />
                        Refresh Weather
                      </>
                    )}
                  </Button>
                </div>

                {/* Current weather data display */}
                {isLoadingWeather && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-800 text-sm flex items-center">
                      <CloudRain className="mr-2 h-4 w-4 animate-spin" />
                      Fetching weather data...
                    </p>
                  </div>
                )}

                {currentWeather && !isLoadingWeather && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CloudRain className="mr-2 h-4 w-4" />
                      Current Weather Conditions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Temperature</p>
                          <p className="text-lg font-bold text-red-600">{currentWeather.temperature}°C</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Humidity</p>
                          <p className="text-lg font-bold text-blue-600">{currentWeather.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CloudRain className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Precipitation</p>
                          <p className="text-lg font-bold text-gray-600">{currentWeather.rainfall}mm</p>
                        </div>
                      </div>
                    </div>
                    {currentWeather.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Conditions:</strong> {currentWeather.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Data updated: {new Date(currentWeather.timestamp).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Critical weather conditions */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <CloudRain className="mr-2 h-4 w-4" />
                  Critical Weather Conditions
                </h3>
                <p className="text-sm text-blue-600">
                  Define thresholds that will automatically trigger your reimbursement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxTemp">Maximum Temperature (°C)</Label>
                  <Input
                    id="maxTemp"
                    type="number"
                    value={contractData.weatherThresholds.maxTemperature}
                    onChange={(e) => setContractData({
                      ...contractData,
                      weatherThresholds: {
                        ...contractData.weatherThresholds,
                        maxTemperature: Number(e.target.value)
                      }
                    })}
                    placeholder="35"
                  />
                </div>
                <div>
                  <Label htmlFor="minTemp">Minimum Temperature (°C)</Label>
                  <Input
                    id="minTemp"
                    type="number"
                    value={contractData.weatherThresholds.minTemperature}
                    onChange={(e) => setContractData({
                      ...contractData,
                      weatherThresholds: {
                        ...contractData.weatherThresholds,
                        minTemperature: Number(e.target.value)
                      }
                    })}
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="maxRain">Maximum Rainfall (mm)</Label>
                  <Input
                    id="maxRain"
                    type="number"
                    value={contractData.weatherThresholds.maxRainfall}
                    onChange={(e) => setContractData({
                      ...contractData,
                      weatherThresholds: {
                        ...contractData.weatherThresholds,
                        maxRainfall: Number(e.target.value)
                      }
                    })}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="maxHumidity">Maximum Humidity (%)</Label>
                  <Input
                    id="maxHumidity"
                    type="number"
                    value={contractData.weatherThresholds.maxHumidity}
                    onChange={(e) => setContractData({
                      ...contractData,
                      weatherThresholds: {
                        ...contractData.weatherThresholds,
                        maxHumidity: Number(e.target.value)
                      }
                    })}
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Summary and creation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-4 flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Contract Summary
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">💰 Coverage:</p>
                    <p className="text-gray-600">{contractData.coverageAmount} SUI</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">💳 Premium:</p>
                    <p className="text-gray-600">{contractData.premiumAmount} SUI/month</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">📍 Position:</p>
                    <p className="text-gray-600">{contractData.location.lat}, {contractData.location.lng}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">🌡️ Temperature:</p>
                    <p className="text-gray-600">{contractData.weatherThresholds.minTemperature}°C - {contractData.weatherThresholds.maxTemperature}°C</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">🌧️ Max Rain:</p>
                    <p className="text-gray-600">{contractData.weatherThresholds.maxRainfall}mm</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">💧 Humidity:</p>
                    <p className="text-gray-600">{contractData.weatherThresholds.minHumidity}% - {contractData.weatherThresholds.maxHumidity}%</p>
                  </div>
                </div>
              </div>

              {/* Current weather data display with comparison */}
              {currentWeather && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                    <CloudRain className="mr-2 h-5 w-5" />
                    Current Weather vs Thresholds
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-md">
                      <div className="flex items-center justify-center mb-2">
                        <Thermometer className="h-5 w-5 text-red-500 mr-2" />
                        <span className="font-medium">Temperature</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600 mb-1">{currentWeather.temperature}°C</p>
                      <p className="text-xs text-gray-600">
                        Threshold: {contractData.weatherThresholds.minTemperature}°C - {contractData.weatherThresholds.maxTemperature}°C
                      </p>
                      {currentWeather.temperature > contractData.weatherThresholds.maxTemperature || 
                       currentWeather.temperature < contractData.weatherThresholds.minTemperature ? (
                        <p className="text-xs text-red-600 font-medium mt-1">⚠️ Threshold exceeded</p>
                      ) : (
                        <p className="text-xs text-green-600 font-medium mt-1">✅ Within normal range</p>
                      )}
                    </div>

                    <div className="text-center p-3 bg-white rounded-md">
                      <div className="flex items-center justify-center mb-2">
                        <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">Humidity</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mb-1">{currentWeather.humidity}%</p>
                      <p className="text-xs text-gray-600">
                        Threshold: {contractData.weatherThresholds.minHumidity}% - {contractData.weatherThresholds.maxHumidity}%
                      </p>
                      {currentWeather.humidity > contractData.weatherThresholds.maxHumidity || 
                       currentWeather.humidity < contractData.weatherThresholds.minHumidity ? (
                        <p className="text-xs text-red-600 font-medium mt-1">⚠️ Threshold exceeded</p>
                      ) : (
                        <p className="text-xs text-green-600 font-medium mt-1">✅ Within normal range</p>
                      )}
                    </div>

                    <div className="text-center p-3 bg-white rounded-md">
                      <div className="flex items-center justify-center mb-2">
                        <CloudRain className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium">Precipitation</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-600 mb-1">{currentWeather.rainfall}mm</p>
                      <p className="text-xs text-gray-600">
                        Max threshold: {contractData.weatherThresholds.maxRainfall}mm
                      </p>
                      {currentWeather.rainfall > contractData.weatherThresholds.maxRainfall ? (
                        <p className="text-xs text-red-600 font-medium mt-1">⚠️ Threshold exceeded</p>
                      ) : (
                        <p className="text-xs text-green-600 font-medium mt-1">✅ Within normal range</p>
                      )}
                    </div>
                  </div>

                  {currentWeather.description && (
                    <p className="text-sm text-gray-600 mt-3 text-center">
                      <strong>Current conditions:</strong> {currentWeather.description}
                    </p>
                  )}
                </div>
              )}

              {currentAccount && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800">
                    ✅ <strong>Wallet connected:</strong> {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-8)}
                  </p>
                </div>
              )}

              {!currentAccount && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">
                    ❌ <strong>Wallet not connected.</strong> Please connect your Sui wallet.
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">
                    {error}
                  </p>
                </div>
              )}


              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  onClick={handleCreateContract}
                  disabled={isCreating || !suiInsuranceCleanService.isDeployed() || !currentAccount}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                >
                  {isCreating ? '⏳ Creating...' : '🚀 Create Contract'}
                </Button>
              </div>
            </div>
          )}

          {contractCreated && createdObjects && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                ✅ Contract created successfully!
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Policy ID:</strong> {createdObjects.policyObject.objectId}</p>
                <p><strong>Cap ID:</strong> {createdObjects.capObject.objectId}</p>
                <p className="mt-2 text-green-700">
                  Objects are now in your Sui wallet and visible on SuiScan.xyz.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
