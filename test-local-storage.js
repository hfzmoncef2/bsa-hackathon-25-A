// Script de test pour vérifier le stockage local
console.log('🔍 Test du stockage local des objets d\'assurance');
console.log('================================================');

// Fonction pour vérifier le stockage local
function checkLocalStorage() {
  console.log('📦 Vérification du localStorage...');
  
  // Vérifier si l'objet existe
  const storedObject = localStorage.getItem('demoInsuranceObject');
  
  if (storedObject) {
    console.log('✅ Objet trouvé dans localStorage:');
    const obj = JSON.parse(storedObject);
    console.log('📋 Détails de l\'objet:', obj);
    console.log('🆔 Object ID:', obj.objectId);
    console.log('💰 Couverture:', obj.coverageAmount, 'SUI');
    console.log('💳 Prime:', obj.premiumAmount, 'SUI');
    console.log('⚠️ Type de risque:', obj.riskType);
    console.log('📅 Créé le:', new Date(obj.createdAt).toLocaleString());
    
    // Vérifier l'unicité de l'ID
    const isUnique = obj.objectId.startsWith('demo_') && obj.objectId.includes('_');
    console.log('🔑 ID unique:', isUnique ? '✅ Oui' : '❌ Non');
    
    return obj;
  } else {
    console.log('❌ Aucun objet trouvé dans localStorage');
    console.log('💡 Créez d\'abord un objet d\'assurance avec le formulaire');
    return null;
  }
}

// Fonction pour créer un objet de test
function createTestObject() {
  console.log('🧪 Création d\'un objet de test...');
  
  const testObject = {
    objectId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    coverageAmount: Math.floor(Math.random() * 1000) + 100,
    premiumAmount: Math.floor(Math.random() * 100) + 10,
    riskType: Math.floor(Math.random() * 3) + 1,
    status: 1,
    createdAt: Date.now()
  };
  
  localStorage.setItem('demoInsuranceObject', JSON.stringify(testObject));
  console.log('✅ Objet de test créé:', testObject);
  
  return testObject;
}

// Fonction pour nettoyer le stockage
function clearStorage() {
  console.log('🗑️ Nettoyage du localStorage...');
  localStorage.removeItem('demoInsuranceObject');
  localStorage.removeItem('insurancePolicyId');
  console.log('✅ Stockage nettoyé');
}

// Fonction pour comparer deux objets
function compareObjects(obj1, obj2) {
  console.log('🔄 Comparaison des objets...');
  console.log('Objet 1:', obj1);
  console.log('Objet 2:', obj2);
  
  const sameId = obj1.objectId === obj2.objectId;
  const sameCoverage = obj1.coverageAmount === obj2.coverageAmount;
  const samePremium = obj1.premiumAmount === obj2.premiumAmount;
  
  console.log('🆔 Même ID:', sameId ? '✅ Oui' : '❌ Non');
  console.log('💰 Même couverture:', sameCoverage ? '✅ Oui' : '❌ Non');
  console.log('💳 Même prime:', samePremium ? '✅ Oui' : '❌ Non');
  
  return { sameId, sameCoverage, samePremium };
}

// Exporter les fonctions pour utilisation
window.checkLocalStorage = checkLocalStorage;
window.createTestObject = createTestObject;
window.clearStorage = clearStorage;
window.compareObjects = compareObjects;

console.log('🛠️ Fonctions disponibles:');
console.log('- checkLocalStorage() : Vérifier l\'objet stocké');
console.log('- createTestObject() : Créer un objet de test');
console.log('- clearStorage() : Nettoyer le stockage');
console.log('- compareObjects(obj1, obj2) : Comparer deux objets');

// Vérification automatique
console.log('🔍 Vérification automatique...');
const currentObject = checkLocalStorage();

if (currentObject) {
  console.log('✅ Stockage local fonctionne correctement !');
} else {
  console.log('💡 Créez un objet d\'assurance pour tester le stockage local');
}
