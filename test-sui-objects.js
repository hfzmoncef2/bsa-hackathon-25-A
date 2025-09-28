// Script de test pour vérifier les objets d'assurance Sui
// Exécutez ce script dans la console du navigateur après avoir créé un objet

console.log('🔍 Test des objets d\'assurance Sui');
console.log('=====================================');

// Vérifier si les objets sont dans localStorage
const policyId = localStorage.getItem('insurancePolicyId');
const capId = localStorage.getItem('insuranceCapId');

if (policyId && capId) {
  console.log('✅ Objets trouvés dans localStorage:');
  console.log('🛡️ InsurancePolicy ID:', policyId);
  console.log('🔑 PolicyCap ID:', capId);
  
  // Générer les liens SuiScan
  const policyUrl = `https://suiscan.xyz/object/${policyId}`;
  const capUrl = `https://suiscan.xyz/object/${capId}`;
  
  console.log('🔗 Liens SuiScan:');
  console.log('InsurancePolicy:', policyUrl);
  console.log('PolicyCap:', capUrl);
  
  // Vérifier la structure des objets
  console.log('📋 Structure des objets:');
  console.log('- InsurancePolicy: Contient les détails de l\'assurance');
  console.log('- PolicyCap: Capability pour gérer la police');
  
} else {
  console.log('❌ Aucun objet trouvé dans localStorage');
  console.log('💡 Créez d\'abord un objet d\'assurance avec le formulaire');
}

// Fonction pour vérifier un objet sur SuiScan
function checkObjectOnSuiScan(objectId) {
  if (!objectId) {
    console.log('❌ Aucun Object ID fourni');
    return;
  }
  
  const url = `https://suiscan.xyz/object/${objectId}`;
  console.log(`🔍 Vérification de l'objet: ${url}`);
  
  // Ouvrir le lien dans un nouvel onglet
  window.open(url, '_blank');
}

// Fonction pour vérifier une adresse sur SuiScan
function checkAddressOnSuiScan(address) {
  if (!address) {
    console.log('❌ Aucune adresse fournie');
    return;
  }
  
  const url = `https://suiscan.xyz/address/${address}`;
  console.log(`🔍 Vérification de l'adresse: ${url}`);
  
  // Ouvrir le lien dans un nouvel onglet
  window.open(url, '_blank');
}

// Exporter les fonctions pour utilisation
window.checkObjectOnSuiScan = checkObjectOnSuiScan;
window.checkAddressOnSuiScan = checkAddressOnSuiScan;

console.log('🛠️ Fonctions disponibles:');
console.log('- checkObjectOnSuiScan(objectId) : Vérifier un objet spécifique');
console.log('- checkAddressOnSuiScan(address) : Vérifier une adresse');

// Exemple d'utilisation
if (policyId) {
  console.log('💡 Exemple: checkObjectOnSuiScan("' + policyId + '")');
}
