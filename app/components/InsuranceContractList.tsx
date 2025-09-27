'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Droplets, Wind, Thermometer, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface InsuranceContractListProps {
  onBack: () => void;
}

interface Contract {
  id: string;
  type: string;
  coverage: number;
  premium: number;
  threshold: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'claimed' | 'triggered';
  isClaimable: boolean;
}

export function InsuranceContractList({ onBack }: InsuranceContractListProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des contrats
  useEffect(() => {
    const loadContracts = async () => {
      // Dans une vraie application, vous récupéreriez les contrats depuis la blockchain
      const mockContracts: Contract[] = [
        {
          id: "0x123...abc",
          type: "Sécheresse",
          coverage: 2000,
          premium: 200,
          threshold: 50,
          startDate: "2024-01-15",
          endDate: "2024-04-15",
          status: "active",
          isClaimable: false
        },
        {
          id: "0x456...def",
          type: "Tempête",
          coverage: 1500,
          premium: 150,
          threshold: 80,
          startDate: "2024-02-01",
          endDate: "2024-05-01",
          status: "triggered",
          isClaimable: true
        },
        {
          id: "0x789...ghi",
          type: "Inondation",
          coverage: 3000,
          premium: 300,
          threshold: 100,
          startDate: "2023-10-01",
          endDate: "2024-01-01",
          status: "expired",
          isClaimable: false
        },
        {
          id: "0xabc...jkl",
          type: "Sécheresse",
          coverage: 2500,
          premium: 250,
          threshold: 45,
          startDate: "2023-06-01",
          endDate: "2023-09-01",
          status: "claimed",
          isClaimable: false
        }
      ];

      setTimeout(() => {
        setContracts(mockContracts);
        setLoading(false);
      }, 1000);
    };

    loadContracts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'triggered': return 'bg-yellow-100 text-yellow-800';
      case 'claimed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'triggered': return 'Déclenché';
      case 'claimed': return 'Réclamé';
      case 'expired': return 'Expiré';
      default: return 'Inconnu';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Sécheresse': return Droplets;
      case 'Inondation': return Droplets;
      case 'Tempête': return Wind;
      default: return Shield;
    }
  };

  const handleClaim = async (contractId: string) => {
    // Dans une vraie application, vous appelleriez la fonction claim_payout du smart contract
    alert(`Réclamation du contrat ${contractId} en cours...`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Mes contrats d'assurance</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de vos contrats...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Mes contrats d'assurance</h2>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{contracts.length}</div>
              <div className="text-sm text-gray-600">Total contrats</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {contracts.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Actifs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {contracts.filter(c => c.isClaimable).length}
              </div>
              <div className="text-sm text-gray-600">Réclamables</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {contracts.reduce((sum, c) => sum + c.coverage, 0)} SUI
              </div>
              <div className="text-sm text-gray-600">Couverture totale</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des contrats */}
      <div className="space-y-4">
        {contracts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun contrat trouvé</h3>
                <p className="text-gray-600 mb-4">Vous n'avez pas encore de contrats d'assurance.</p>
                <Button onClick={onBack} className="bg-green-600 hover:bg-green-700 text-white">
                  Créer un nouveau contrat
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          contracts.map((contract) => {
            const TypeIcon = getTypeIcon(contract.type);
            return (
              <Card key={contract.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <TypeIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contract.type}</h3>
                        <p className="text-sm text-gray-600">ID: {contract.id.slice(0, 8)}...{contract.id.slice(-8)}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Couverture: {contract.coverage} SUI</span>
                          <span>Prime: {contract.premium} SUI</span>
                          <span>Seuil: {contract.threshold}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={getStatusColor(contract.status)}>
                          {getStatusText(contract.status)}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {contract.startDate} - {contract.endDate}
                        </div>
                      </div>
                      
                      {contract.isClaimable && (
                        <Button
                          onClick={() => handleClaim(contract.id)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Réclamer
                        </Button>
                      )}
                      
                      {contract.status === 'active' && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">En cours</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onBack}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Nouveau contrat
            </Button>
            <Button variant="outline">
              Exporter les données
            </Button>
            <Button variant="outline">
              Historique des réclamations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
