'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Droplets, 
  Sun, 
  Wind, 
  CloudRain, 
  Snowflake,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { CleanInsuranceCreator } from './components/CleanInsuranceCreator';
import { WalletDisplayTest } from './components/WalletDisplayTest';
import { DemoInsuranceTester } from './components/DemoInsuranceTester';

export default function HomePage() {
  const [selectedRisk, setSelectedRisk] = useState<string>('');

  const riskTypes = [
    { id: 'drought', name: 'Sécheresse', icon: Sun, color: 'bg-yellow-100 text-yellow-800', description: 'Protection contre le manque de pluie' },
    { id: 'flood', name: 'Inondation', icon: Droplets, color: 'bg-blue-100 text-blue-800', description: 'Protection contre les excès d\'eau' },
    { id: 'hail', name: 'Grêle', icon: Snowflake, color: 'bg-gray-100 text-gray-800', description: 'Protection contre les dommages de grêle' },
    { id: 'storm', name: 'Tempête', icon: Wind, color: 'bg-purple-100 text-purple-800', description: 'Protection contre les vents violents' },
    { id: 'frost', name: 'Gel', icon: CloudRain, color: 'bg-cyan-100 text-cyan-800', description: 'Protection contre le gel' }
  ];

  const stats = [
    { label: 'Fermiers protégés', value: '1,250+', icon: Users },
    { label: 'Réclamations traitées', value: '98%', icon: CheckCircle },
    { label: 'Taux de satisfaction', value: '4.8/5', icon: TrendingUp },
    { label: 'Paiements rapides', value: '< 24h', icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RainGuard</h1>
                <p className="text-sm text-gray-600">Assurance Agricole Intelligente</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                Se connecter
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Protégez vos récoltes avec{' '}
              <span className="text-green-600">RainGuard</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              L'assurance agricole basée sur les données météo en temps réel. 
              Protection automatique contre la sécheresse, les inondations, la grêle et plus encore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                <Link href="/parametric-insurance">
                  <Shield className="mr-2 h-5 w-5" />
                  Assurance Paramétrique
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 text-lg px-8 py-4">
                <Link href="/field-specification">
                  Spécifier mon champ
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                <Link href="/verification">
                  🔍 Vérifier les Polices
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Test Rapide - Création de Police */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              🚀 Test Rapide - Créer une Police d'Assurance
            </h3>
            <p className="text-lg text-gray-600">
              Créez une police d'assurance directement depuis le frontend et voyez-la apparaître dans votre wallet !
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CleanInsuranceCreator />
            <WalletDisplayTest />
          </div>
        </div>
      </section>

      {/* Risk Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Types de risques couverts
            </h3>
            <p className="text-lg text-gray-600">
              Choisissez la protection adaptée à vos besoins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskTypes.map((risk) => {
              const Icon = risk.icon;
              return (
                <Card 
                  key={risk.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedRisk === risk.id ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setSelectedRisk(risk.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full ${risk.color} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{risk.name}</CardTitle>
                    <CardDescription>{risk.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        À partir de 50€/mois
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              RainGuard en chiffres
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Assurance Paramétrique Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Assurance Paramétrique avec Oracle Nautilus TEE
            </h3>
            <p className="text-lg text-gray-600">
              Protection automatique basée sur les données météo sécurisées
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Assurance Saisonnière
                </CardTitle>
                <CardDescription>
                  Protection basée sur la pluie cumulée sur une période
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Pluie cumulée sur la saison
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Seuil de déclenchement personnalisé
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Paiement proportionnel
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Couverture longue durée
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CloudRain className="mr-2 h-5 w-5 text-red-600" />
                  Assurance Événementielle
                </CardTitle>
                <CardDescription>
                  Protection basée sur les événements météo extrêmes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Pluie en 24h
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Déclenchement immédiat
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Paiement rapide
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Protection événements
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/parametric-insurance">
                <Shield className="mr-2 h-5 w-5" />
                Découvrir l'assurance paramétrique
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h3>
            <p className="text-lg text-gray-600">
              Un processus simple en 3 étapes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Souscrivez</h4>
              <p className="text-gray-600">
                Choisissez votre type de culture et les risques à couvrir
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Surveillance</h4>
              <p className="text-gray-600">
                Nos capteurs surveillent en temps réel les conditions météo
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Indemnisation</h4>
              <p className="text-gray-600">
                Paiement automatique en cas de dommages détectés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Section - Objets Sui */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Test des Objets d'Assurance Sui
            </h3>
            <p className="text-lg text-gray-600">
              Créez et gérez vos objets d'assurance directement dans votre wallet Sui
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DemoInsuranceTester />
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avantages des objets Sui</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Stockage direct dans le wallet
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Pas de smart contract complexe
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Transfert facile entre wallets
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Métadonnées intégrées
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Types d'objets créés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">InsurancePolicy</p>
                        <p className="text-sm text-gray-600">Contient les détails de l'assurance</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">PolicyCap</p>
                        <p className="text-sm text-gray-600">Capability pour gérer la police</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Prêt à protéger vos récoltes ?
          </h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'agriculteurs qui font confiance à RainGuard
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
            <Shield className="mr-2 h-5 w-5" />
            Commencer maintenant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">RainGuard</span>
              </div>
              <p className="text-gray-400">
                L'assurance agricole intelligente basée sur la blockchain.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produits</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Assurance Sécheresse</li>
                <li>Assurance Inondation</li>
                <li>Assurance Grêle</li>
                <li>Assurance Tempête</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Centre d'aide</li>
                <li>Contact</li>
                <li>FAQ</li>
                <li>Réclamations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Conditions générales</li>
                <li>Politique de confidentialité</li>
                <li>Mentions légales</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RainGuard. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}