'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateInsuranceContract } from "../CreateInsuranceContract";
import { InsuranceContractList } from "./InsuranceContractList";
import { WeatherData } from "./WeatherData";
import { TrendingUp, Shield, Droplets, Wind, Thermometer } from "lucide-react";

export function InsuranceDashboard() {
  const [view, setView] = useState<'dashboard' | 'create' | 'contracts' | 'weather'>('dashboard');

  const stats = [
    {
      title: "Contrats Actifs",
      value: "12",
      change: "+2 ce mois",
      icon: Shield,
      color: "text-green-600"
    },
    {
      title: "Couverture Totale",
      value: "45,000 SUI",
      change: "+5,000 SUI",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Pluviométrie Actuelle",
      value: "32mm",
      change: "Ce mois",
      icon: Droplets,
      color: "text-cyan-600"
    },
    {
      title: "Température",
      value: "24°C",
      change: "Moyenne",
      icon: Thermometer,
      color: "text-orange-600"
    }
  ];

  if (view === 'create') {
    return <CreateInsuranceContract onBack={() => setView('dashboard')} />;
  }

  if (view === 'contracts') {
    return <InsuranceContractList onBack={() => setView('dashboard')} />;
  }

  if (view === 'weather') {
    return <WeatherData onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="default"
          onClick={() => setView('create')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Nouveau Contrat
        </Button>
        <Button
          variant="outline"
          onClick={() => setView('contracts')}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Mes Contrats
        </Button>
        <Button
          variant="outline"
          onClick={() => setView('weather')}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Données Météo
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contrats récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Contrats Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Assurance Sécheresse - Blé</h3>
                <p className="text-sm text-gray-600">Seuil: 50mm • Couverture: 2,000 SUI</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Actif</p>
                <p className="text-xs text-gray-500">Expire: 15/08/2024</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Assurance Tempête - Maïs</h3>
                <p className="text-sm text-gray-600">Seuil: 80 km/h • Couverture: 1,500 SUI</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-600">En attente</p>
                <p className="text-xs text-gray-500">Expire: 20/09/2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes météo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-orange-600" />
            Alertes Météo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Sécheresse imminente</p>
                <p className="text-xs text-gray-600">Pluviométrie actuelle: 32mm (seuil: 50mm)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Tempête prévue</p>
                <p className="text-xs text-gray-600">Vents jusqu'à 75 km/h attendus demain</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
