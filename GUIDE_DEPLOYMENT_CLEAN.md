# 🚀 Guide de Déploiement - Contrat d'Assurance Sui

## 📋 Prérequis

1. **Sui CLI installé** : `sui --version`
2. **Wallet Sui configuré** : `sui client active-address`
3. **Fonds de test** : Pour payer les frais de déploiement

## 🛠️ Étapes de Déploiement

### 1. Déployer le Contrat

```bash
# Exécuter le script de déploiement
./deploy-insurance.sh
```

**OU manuellement :**

```bash
sui client publish --gas-budget 100000000 sources/insurance.move
```

### 2. Récupérer le Package ID

Après le déploiement, copiez le **Package ID** affiché dans le terminal.

Exemple de sortie :
```
Published Objects:
  ┌──
  │ PackageID: 0x1234567890abcdef...
  │ Transaction: 0xabcdef1234567890...
  └──
```

### 3. Configurer l'Application

1. Ouvrez l'application sur `http://localhost:3001`
2. Cliquez sur **"📦 Définir Package ID"**
3. Collez le Package ID récupéré
4. Cliquez sur **"🚀 Créer Contrat"**

## ✅ Vérification

### Dans l'Application
- Les objets d'assurance apparaissent dans l'interface
- Les données sont stockées dans localStorage

### Dans SuiScan
1. Allez sur [SuiScan.xyz](https://suiscan.xyz)
2. Recherchez votre adresse wallet
3. Vérifiez que les objets `InsurancePolicy` et `PolicyCap` sont présents

### Dans le Wallet Sui
- Les objets apparaissent comme des NFTs dans votre wallet
- Vous pouvez les transférer à d'autres adresses

## 🔧 Dépannage

### Erreur "Contrat non déployé"
- Vérifiez que le Package ID est correct
- Redéployez le contrat si nécessaire

### Erreur de transaction
- Vérifiez que votre wallet a des fonds
- Vérifiez que vous êtes sur le bon réseau (testnet)

### Objets non visibles
- Attendez quelques secondes pour la synchronisation
- Vérifiez dans SuiScan.xyz
- Rafraîchissez votre wallet

## 📱 Utilisation

1. **Créer une police** : Remplissez le formulaire et cliquez "Créer Contrat"
2. **Voir les objets** : Les objets apparaissent automatiquement dans votre wallet
3. **Transférer** : Utilisez votre wallet Sui pour transférer les objets
4. **Vérifier** : Consultez SuiScan.xyz pour voir les détails

## 🎯 Avantages

- ✅ **Objets natifs Sui** : Pas de smart contract complexe
- ✅ **Stockage direct** : Dans votre wallet Sui
- ✅ **Transfert facile** : Entre wallets
- ✅ **Métadonnées intégrées** : Toutes les infos dans l'objet
- ✅ **Visible sur SuiScan** : Transparence totale

## 🔗 Liens Utiles

- [SuiScan.xyz](https://suiscan.xyz) - Explorer Sui
- [Sui Wallet](https://sui.io/wallet) - Wallet officiel
- [Sui CLI](https://docs.sui.io/build/cli) - Documentation CLI
