# 🛡️ RainGuard Insurance - Contrat qui FONCTIONNE

## 🎯 Problème Résolu

Ce contrat résout le problème où les objets `InsurancePolicy` n'apparaissaient pas dans le wallet Sui. 

### ✅ Solution Implémentée

1. **Objets `owned`** : Les objets `InsurancePolicy` et `PolicyCap` sont correctement définis avec `has key` et transférés au propriétaire
2. **Fonctions d'entrée** : Utilisation de `public entry fun` pour garantir l'exécution correcte
3. **Transferts explicites** : `transfer::transfer()` utilisé pour chaque objet créé
4. **Structure simplifiée** : Code épuré sans complexité inutile

## 🚀 Déploiement Rapide

### 1. Déployer le contrat
```bash
# Copier le fichier Move.toml
cp Move_working.toml Move.toml

# Déployer
sui client publish --gas-budget 100000000
```

### 2. Créer une police d'assurance
```bash
# Remplacer PACKAGE_ID par l'ID de votre package déployé
sui client call \
  --package PACKAGE_ID \
  --module working_insurance \
  --function create_simple_policy \
  --args 1000000 100000 \
  --gas-budget 10000000
```

### 3. Vérifier dans le wallet
```bash
sui client objects
```

## 📋 Fonctions Disponibles

### Création de Police
- `create_simple_policy()` - Police basique (recommandé pour les tests)
- `create_policy_entry()` - Police complète avec tous les paramètres

### Gestion des Réclamations
- `submit_claim()` - Soumettre une réclamation
- `approve_claim()` - Approuver une réclamation (admin)

### Utilitaires
- `cancel_policy()` - Annuler une police
- `get_policy_details()` - Obtenir les détails d'une police
- `is_policy_active()` - Vérifier si une police est active

## 🔧 Utilisation depuis le Frontend

```typescript
import { createSimpleInsurancePolicy } from './services/working-insurance';

// Créer une police
const result = await createSimpleInsurancePolicy(
  1000000, // Montant de couverture
  100000,  // Montant de la prime
  keypair  // Votre clé privée
);

// L'objet InsurancePolicy apparaîtra dans le wallet !
```

## 🎯 Garanties

✅ **Les objets `InsurancePolicy` apparaîtront dans votre wallet**  
✅ **Les objets `PolicyCap` apparaîtront dans votre wallet**  
✅ **Code testé et fonctionnel**  
✅ **Compatible avec Sui DevNet**  

## 🐛 Dépannage

### Si les objets n'apparaissent toujours pas :

1. **Vérifiez l'adresse** : Assurez-vous d'utiliser la bonne adresse
2. **Vérifiez le package** : Utilisez le bon PACKAGE_ID
3. **Vérifiez les permissions** : Assurez-vous d'avoir les droits d'écriture
4. **Rafraîchissez le wallet** : Rechargez votre wallet Sui

### Commandes de diagnostic :
```bash
# Vérifier votre adresse
sui client active-address

# Vérifier vos objets
sui client objects

# Vérifier les événements
sui client events
```

## 📊 Structure des Objets

### InsurancePolicy
```move
public struct InsurancePolicy has key {
    id: UID,
    policy_id: u64,
    policyholder: address,
    coverage_amount: u64,
    premium_amount: u64,
    coverage_period_days: u64,
    start_date: u64,
    end_date: u64,
    risk_type: u8,
    status: u8,
    land_area_hectares: u64,
    crop_type: vector<u8>,
    location: vector<u8>,
    deductible: u64,
    max_payout: u64,
}
```

### PolicyCap
```move
public struct PolicyCap has key {
    id: UID,
    policy_id: u64,
}
```

## 🎉 Résultat Attendu

Après avoir créé une police, vous devriez voir dans votre wallet :
- 1 objet `InsurancePolicy` 
- 1 objet `PolicyCap`

Ces objets seront visibles dans l'interface de votre wallet Sui et pourront être utilisés pour les interactions futures !
