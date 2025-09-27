'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Shield, Droplets, Wind, Thermometer, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface InsuranceContractListProps {
  onBack: () => void;
}

interface Contract {
  id: string;
  type: number;
  typeName: string;
  coverageAmount: number;
  premiumPaid: number;
  threshold: number;
  startDate: string;
  endDate: string;
  isTriggered: boolean;
  isClaimed: boolean;
  status: 'active' | 'triggered' | 'expired' | 'claimed';
}

export function InsuranceContractList({ onBack }: InsuranceContractListProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de données - dans une vraie app, ceci viendrait de la blockchain
    const mockContracts: Contract[] = [
      {
        id: "0x123...abc",
        type: 0,
        typeName: "Sécheresse",
        coverageAmount: 2000,
        premiumPaid: 100,
        threshold: 50,
        startDate: "2024-06-01",
        endDate: "2024-08-31",
        isTriggered: true,
        isClaimed: false,
        status: 'triggered'
      },
      {
        id: "0x456...def",
        type: 2,
        typeName: "Tempête",
        coverageAmount: 1500,
        premiumPaid: 75,
        threshold: 80,
        startDate: "2024-07-01",
        endDate: "2024-09-30",
        isTriggered: false,
        isClaimed: false,
        status: 'active'
      },
      {
        id: "0x789...ghi",
        type: 1,
        typeName: "Inondation",
        coverageAmount: 3000,
        premiumPaid: 150,
        threshold: 200,
        startDate: "2024-05-01",
        endDate: "2024-07-31",
        isTriggered: false,
        isClaimed: false,
        status: 'expired'
      }
    ];

    setTimeout(() => {
      setContracts(mockContracts);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'triggered':
        return <Badge className="bg-yellow-100 text-yellow-800">Déclenché</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800">Expiré</Badge>;
      case 'claimed':
        return <Badge className="bg-blue-100 text-blue-800">Réclamé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>;
    }
  };

  const getTypeIcon = (type: number) => {
    switch (type) {
      case 0:
        return <Droplets className="h-5 w-5 text-cyan-600" />;
      case 1:
        return <Droplets className="h-5 w-5 text-blue-600" />;
      case 2:
        return <Wind className="h-5 w-5 text-gray-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleClaim = async (contractId: string) => {
    // Ici, vous appelleriez votre smart contract pour réclamer l'indemnisation
    console.log("Claiming contract:", contractId);
    alert("Indemnisation réclamée avec succès !");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Mes Contrats d'Assurance</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des contrats...</p>
        </div>
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
        <h2 className="text-2xl font-bold text-gray-900">Mes Contrats d'Assurance</h2>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Contrats Actifs</p>
                <p className="text-xl font-bold">{contracts.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Déclenchés</p>
                <p className="text-xl font-bold">{contracts.filter(c => c.status === 'triggered').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Réclamés</p>
                <p className="text-xl font-bold">{contracts.filter(c => c.status === 'claimed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Expirés</p>
                <p className="text-xl font-bold">{contracts.filter(c => c.status === 'expired').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des contrats */}
      <div className="space-y-4">
        {contracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {getTypeIcon(contract.type)}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{contract.typeName}</h3>
                      {getStatusBadge(contract.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Couverture</p>
                        <p className="font-medium">{contract.coverageAmount} SUI</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Prime</p>
                        <p className="font-medium">{contract.premiumPaid} SUI</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Seuil</p>
                        <p className="font-medium">{contract.threshold} {contract.type === 2 ? 'km/h' : 'mm'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expire le</p>
                        <p className="font-medium">{contract.endDate}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      ID: {contract.id}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {contract.status === 'triggered' && !contract.isClaimed && (
                    <Button
                      size="sm"
                      onClick={() => handleClaim(contract.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Réclamer
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contracts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun contrat trouvé</h3>
            <p className="text-gray-600 mb-4">Vous n'avez pas encore de contrats d'assurance.</p>
            <Button onClick={onBack} className="bg-green-600 hover:bg-green-700 text-white">
              Créer un nouveau contrat
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
