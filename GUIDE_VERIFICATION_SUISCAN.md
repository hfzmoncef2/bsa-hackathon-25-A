# 🔍 Guide de Vérification sur SuiScan.xyz

## 🎯 Objectif
Vérifier que vos objets d'assurance apparaissent correctement dans votre wallet sur SuiScan.xyz

## 📋 Étapes de Vérification

### 1. **Créer un Objet d'Assurance**
1. Connectez votre wallet sur l'application
2. Allez sur la page d'accueil
3. Utilisez le formulaire "Test de Création d'Objets d'Assurance Sui"
4. Remplissez les champs :
   - **Type de risque** : Sécheresse, Inondation, ou Tempête
   - **Couverture** : Montant en SUI (ex: 100)
   - **Prime** : Montant en SUI (ex: 10)
5. Cliquez sur "Créer l'objet d'assurance"
6. Signez la transaction dans votre wallet

### 2. **Vérifier sur SuiScan.xyz**

#### A. Aller sur SuiScan
1. Ouvrez [https://suiscan.xyz](https://suiscan.xyz)
2. Dans la barre de recherche, tapez votre adresse wallet
3. Cliquez sur votre adresse dans les résultats

#### B. Vérifier les Objets
1. **Onglet "Objects"** : Cliquez sur l'onglet "Objects"
2. **Rechercher vos objets** : Vous devriez voir :
   - Un objet `InsurancePolicy`
   - Un objet `PolicyCap`
3. **Vérifier les détails** : Cliquez sur chaque objet pour voir :
   - **Object ID** : Identifiant unique
   - **Type** : `InsurancePolicy` ou `PolicyCap`
   - **Owner** : Votre adresse wallet
   - **Fields** : Détails de l'assurance (couverture, prime, type de risque, etc.)

#### C. Vérifier la Transaction
1. **Onglet "Transactions"** : Voir l'historique des transactions
2. **Dernière transaction** : Devrait être la création de vos objets
3. **Détails** : Cliquez sur la transaction pour voir :
   - **Transaction ID**
   - **Gas fees**
   - **Objects Created** : Liste des objets créés

### 3. **Ce que vous devriez voir**

#### ✅ **Objets dans votre wallet :**
```
Objects (2)
├── InsurancePolicy
│   ├── Object ID: 0x...
│   ├── Type: InsurancePolicy
│   └── Fields: coverage_amount, premium_amount, risk_type, etc.
└── PolicyCap
    ├── Object ID: 0x...
    ├── Type: PolicyCap
    └── Fields: policy_id
```

#### ✅ **Détails de l'InsurancePolicy :**
```json
{
  "policy_id": "0x...",
  "client_address": "0x...",
  "coverage_amount": "1000000000000", // 100 SUI en MIST
  "premium_amount": "100000000000",   // 10 SUI en MIST
  "risk_type": 1,                     // 1=Sécheresse, 2=Inondation, 3=Tempête
  "status": 1,                        // 1=Actif, 2=Expiré, 3=Réclamé
  "created_at": "1703123456789"
}
```

### 4. **Dépannage**

#### ❌ **Si vous ne voyez pas vos objets :**
1. **Vérifiez la transaction** : Assurez-vous qu'elle a réussi
2. **Actualisez la page** : Parfois il faut attendre quelques secondes
3. **Vérifiez l'adresse** : Assurez-vous d'être sur la bonne adresse
4. **Vérifiez le réseau** : Assurez-vous d'être sur le bon réseau Sui

#### ❌ **Si la transaction échoue :**
1. **Vérifiez votre balance SUI** : Vous devez avoir assez de SUI pour les frais
2. **Vérifiez la connexion** : Assurez-vous que votre wallet est connecté
3. **Vérifiez les logs** : Ouvrez la console du navigateur (F12) pour voir les erreurs

### 5. **Fonctionnalités Avancées**

#### 🔗 **Liens directs :**
- **Objet spécifique** : `https://suiscan.xyz/object/{OBJECT_ID}`
- **Transaction** : `https://suiscan.xyz/tx/{TRANSACTION_ID}`
- **Adresse** : `https://suiscan.xyz/address/{ADDRESS}`

#### 📱 **Partage :**
- Vous pouvez partager les liens vers vos objets
- Les objets sont publics et vérifiables
- Possibilité de transférer les objets à d'autres wallets

### 6. **Vérifications Supplémentaires**

#### ✅ **Dans l'application :**
1. **Dashboard** : Onglet "Wallet Sui" devrait afficher vos objets
2. **Logs de la console** : Ouvrez F12 pour voir les logs détaillés
3. **Notifications** : L'application devrait confirmer la création

#### ✅ **Sur SuiScan :**
1. **Object Explorer** : Utilisez l'explorateur d'objets
2. **Search** : Recherchez par Object ID
3. **History** : Voir l'historique complet

## 🎉 **Résultat Attendu**

Si tout fonctionne correctement, vous devriez voir :
- ✅ 2 nouveaux objets dans votre wallet SuiScan
- ✅ Détails complets de l'assurance
- ✅ Transaction confirmée
- ✅ Objets visibles dans l'application

## 🆘 **Support**

Si vous rencontrez des problèmes :
1. **Vérifiez les logs** dans la console du navigateur
2. **Vérifiez votre balance SUI**
3. **Vérifiez la connexion wallet**
4. **Contactez le support** avec les détails de l'erreur

---

**Note :** Ce guide vous permet de vérifier que le système d'objets d'assurance Sui fonctionne correctement et que vos objets apparaissent bien dans votre wallet sur SuiScan.xyz ! 🚀
