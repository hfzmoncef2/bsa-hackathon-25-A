# Système d'Objets d'Assurance Sui

## Vue d'ensemble

Ce système permet de créer des objets d'assurance directement dans le wallet Sui, au lieu de créer des smart contracts complexes. Chaque contrat d'assurance devient un objet NFT-like stocké dans le wallet de l'utilisateur.

## Architecture

### 1. Smart Contract Move (`sources/simple_insurance.move`)

Le contrat Move définit deux types d'objets :

- **`InsurancePolicy`** : Contient les détails de l'assurance
  - `policy_id`: Identifiant unique
  - `client_address`: Adresse du client
  - `coverage_amount`: Montant de couverture
  - `premium_amount`: Montant de la prime
  - `risk_type`: Type de risque (1=Sécheresse, 2=Inondation, 3=Tempête)
  - `status`: Statut (1=Actif, 2=Expiré, 3=Réclamé)
  - `created_at`: Timestamp de création

- **`PolicyCap`** : Capability pour gérer la police
  - `policy_id`: Référence à la police
  - Permet au propriétaire de gérer sa police

### 2. Service Frontend (`app/services/sui-insurance-objects.ts`)

Service pour interagir avec les objets d'assurance :

- `createInsuranceObject()` : Crée un nouvel objet d'assurance
- `getInsuranceObjects()` : Récupère tous les objets du wallet
- `getPolicyCapabilities()` : Récupère les capabilities
- `getInsuranceObjectDetails()` : Détails d'un objet spécifique

### 3. Composants UI

- **`InsuranceWalletObjects`** : Affiche tous les objets d'assurance du wallet
- **`QuickInsuranceObjectCreator`** : Interface simple pour créer des objets
- **`CreateInsuranceContract`** : Modifié pour utiliser les objets Sui

## Avantages

### ✅ Simplicité
- Pas besoin de déployer un smart contract par contrat
- Les objets sont créés instantanément
- Gestion native par Sui

### ✅ Flexibilité
- Transfert facile entre wallets
- Métadonnées intégrées dans l'objet
- Possibilité de créer des collections

### ✅ Performance
- Pas de gas fees pour la création de contrats
- Lecture directe des objets
- Mise à jour efficace

### ✅ UX Améliorée
- Les objets apparaissent directement dans le wallet
- Interface familière pour les utilisateurs de NFTs
- Gestion centralisée

## Utilisation

### 1. Créer un objet d'assurance

```typescript
const result = await suiInsuranceObjectsService.createInsuranceObject(
  coverageAmount,    // Montant de couverture en SUI
  premiumAmount,     // Prime en SUI
  riskType,         // Type de risque (1, 2, ou 3)
  signAndExecute,   // Fonction de signature
  currentAccount    // Compte connecté
);
```

### 2. Récupérer les objets du wallet

```typescript
const objects = await suiInsuranceObjectsService.getInsuranceObjects(
  suiClient,
  currentAccount
);
```

### 3. Afficher dans l'interface

Le composant `InsuranceWalletObjects` affiche automatiquement :
- Liste de tous les objets d'assurance
- Détails de chaque police
- Statut et métadonnées
- Bouton de rafraîchissement

## Interface Utilisateur

### Page d'accueil
- Section de test pour créer des objets
- Explication des avantages
- Interface simple et intuitive

### Dashboard
- Onglet "Wallet Sui" pour voir les objets
- Intégration avec les autres fonctionnalités
- Navigation fluide

### Création de contrat
- Interface modifiée pour utiliser les objets
- Validation des données
- Feedback utilisateur

## Configuration

### Package ID
Le système utilise le package ID : `0xd28e4cf0eeaa232ceb08f293cc8d2f76ea719aa8b31a691fe11a9966b862b566`

### Types de risque
- `1` : Sécheresse
- `2` : Inondation  
- `3` : Tempête

### Statuts
- `1` : Actif
- `2` : Expiré
- `3` : Réclamé

## Développement

### Structure des fichiers
```
app/
├── services/
│   └── sui-insurance-objects.ts    # Service principal
├── components/
│   ├── InsuranceWalletObjects.tsx   # Affichage des objets
│   └── QuickInsuranceObjectCreator.tsx # Créateur simple
├── CreateInsuranceContract.tsx     # Interface modifiée
└── dashboard/page.tsx              # Dashboard avec onglet wallet
```

### Tests
- Interface de test sur la page d'accueil
- Création d'objets en temps réel
- Vérification dans le wallet Sui

## Prochaines étapes

1. **Fonctionnalités avancées**
   - Mise à jour du statut des objets
   - Système de réclamations
   - Transfert d'objets

2. **Améliorations UX**
   - Notifications push
   - Historique des transactions
   - Export des données

3. **Intégrations**
   - Oracle météo
   - Système de paiement
   - API externe

## Conclusion

Ce système d'objets d'assurance Sui offre une approche moderne et simplifiée pour la gestion des contrats d'assurance. En utilisant les capacités natives de Sui, nous évitons la complexité des smart contracts tout en offrant une expérience utilisateur supérieure.
