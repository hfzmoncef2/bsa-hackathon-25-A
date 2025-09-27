'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, TrendingUp, AlertTriangle } from "lucide-react";

export function InsuranceDashboard() {
  // Données simulées pour la démo
  const contracts = [
    {
      id: "1",
      type: "Sécheresse",
      coverage: "1000 SUI",
      premium: "50 SUI",
      status: "Actif",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
    },
    {
      id: "2", 
      type: "Inondation",
      coverage: "1500 SUI",
      premium: "75 SUI", 
      status: "Expiré",
      startDate: "2023-09-01",
      endDate: "2024-02-28",
    }
  ];

  const stats = {
    totalCoverage: "2500 SUI",
    activePolicies: 1,
    totalClaims: 0,
    totalPremiums: "125 SUI"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord Assurance</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Contrat
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Couverture Totale</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoverage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Polices Actives</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePolicies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réclamations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClaims}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primes Payées</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPremiums}</div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Contrats d'Assurance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Assurance {contract.type}</div>
                  <div className="text-sm text-gray-500">
                    {contract.startDate} - {contract.endDate}
                  </div>
                  <div className="text-sm">
                    Couverture: {contract.coverage} | Prime: {contract.premium}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={contract.status === "Actif" ? "default" : "secondary"}
                  >
                    {contract.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}