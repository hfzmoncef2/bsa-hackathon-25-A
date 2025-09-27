'use client'
import App from "./App";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🌾 RainGuard - Assurance Agricole Indexée
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
            Protégez vos récoltes avec des contrats d'assurance intelligents basés sur des indices météo. 
            Paiements automatiques, transparents et équitables grâce à la blockchain Sui.
          </p>
          
          {/* Call to Action */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Trouvez le plan d'assurance parfait pour vos terres
            </h2>
            <p className="text-gray-600 mb-6">
              Répondez à quelques questions sur votre exploitation et recevez des recommandations personnalisées d'assurance agricole.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  // Ce bouton sera géré par le composant App
                  const button = document.querySelector('[data-start-assessment]') as HTMLButtonElement;
                  if (button) button.click();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                🌱 Évaluer mes terres
              </button>
              <button 
                onClick={() => {
                  // Scroll vers la section des exemples
                  const examplesSection = document.getElementById('examples-section');
                  if (examplesSection) {
                    examplesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                📊 Voir les exemples
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <App />
        </div>

        {/* Section des exemples */}
        <div id="examples-section" className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Exemples concrets d'utilisation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Exemple 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌾</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ahmed - Maroc</h3>
                  <p className="text-sm text-gray-600">Fermier de blé, 10 hectares</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Problème :</strong> Sécheresse récurrente</p>
                <p><strong>Solution :</strong> Assurance sécheresse</p>
                <p><strong>Contrat :</strong> 2000 SUI de couverture</p>
                <p><strong>Résultat :</strong> Paiement automatique de 2000 SUI</p>
              </div>
            </div>

            {/* Exemple 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌽</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fatima - Sénégal</h3>
                  <p className="text-sm text-gray-600">Fermière de maïs, 5 hectares</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Problème :</strong> Tempêtes violentes</p>
                <p><strong>Solution :</strong> Assurance tempête</p>
                <p><strong>Contrat :</strong> 1500 SUI de couverture</p>
                <p><strong>Résultat :</strong> Protection contre les vents &gt; 80 km/h</p>
              </div>
            </div>

            {/* Exemple 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌾</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mohamed - Tunisie</h3>
                  <p className="text-sm text-gray-600">Fermier de riz, 15 hectares</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Problème :</strong> Inondations saisonnières</p>
                <p><strong>Solution :</strong> Assurance inondation</p>
                <p><strong>Contrat :</strong> 3000 SUI de couverture</p>
                <p><strong>Résultat :</strong> Paiement si pluie &gt; 100mm/24h</p>
              </div>
            </div>
          </div>

          {/* Processus en 3 étapes */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Comment ça marche en 3 étapes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Évaluez vos terres</h4>
                <p className="text-sm text-gray-600">
                  Répondez à quelques questions sur votre exploitation, vos cultures et les risques climatiques.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Recevez des recommandations</h4>
                <p className="text-sm text-gray-600">
                  Notre IA analyse vos données et vous propose les plans d'assurance les plus adaptés.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Protégez vos récoltes</h4>
                <p className="text-sm text-gray-600">
                  Souscrivez un contrat et recevez des paiements automatiques en cas de sinistre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}