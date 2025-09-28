# 🚀 Guide de Déploiement du Contrat Move

## 🎯 Objectif
Déployer le contrat `simple_insurance.move` pour pouvoir créer de vrais objets d'assurance sur Sui.

## 📋 Prérequis

### 1. **Installer Sui CLI**
```bash
curl -fsSL https://get.sui.io/install | sh
source ~/.sui/sui_env
```

### 2. **Configurer votre wallet**
```bash
# Créer une nouvelle adresse
sui client new-address ed25519

# Vérifier l'adresse active
sui client active-address

# Obtenir des SUI de test (pour testnet)
sui client faucet
```

## 🔧 Déploiement

### **Option 1 : Déploiement automatique**
```bash
# Rendre le script exécutable
chmod +x deploy-simple-insurance.sh

# Exécuter le déploiement
./deploy-simple-insurance.sh
```

### **Option 2 : Déploiement manuel**
```bash
# Déployer le contrat
sui client publish --gas-budget 100000000 sources/simple_insurance.move
```

## 📋 Après le déploiement

### 1. **Récupérer le Package ID**
Après le déploiement, vous verrez quelque chose comme :
```
Published Objects:
  ┌──
  │ PackageID: 0x1234567890abcdef...
  │ Transaction: 0xabcdef1234567890...
  └──
```

### 2. **Mettre à jour le code**
Modifiez le fichier `app/services/sui-insurance-objects.ts` :
```typescript
private packageId = 'VOTRE_PACKAGE_ID_ICI';
```

### 3. **Tester la création d'objets**
- Allez sur `http://localhost:3001`
- Utilisez le formulaire de test
- Vérifiez sur SuiScan.xyz

## 🔍 Vérification sur SuiScan

### 1. **Aller sur SuiScan**
- Ouvrez [https://suiscan.xyz](https://suiscan.xyz)
- Recherchez votre adresse wallet

### 2. **Vérifier les objets**
- Onglet "Objects" : Vous devriez voir vos objets
- Onglet "Transactions" : Historique des créations

## 🆘 Dépannage

### **Erreur "VMVerificationOrDeserializationError"**
- Le contrat n'est pas déployé
- Le Package ID est incorrect
- Solution : Déployez le contrat et mettez à jour le Package ID

### **Erreur "Insufficient gas"**
- Vous n'avez pas assez de SUI
- Solution : `sui client faucet` (pour testnet)

### **Erreur "Address not found"**
- Votre wallet n'est pas configuré
- Solution : `sui client new-address ed25519`

## 📱 Version de Démonstration

Si vous ne voulez pas déployer le contrat maintenant, vous pouvez utiliser la version de démonstration qui stocke les objets localement.

### **Avantages de la version complète :**
- ✅ Vrais objets Sui sur la blockchain
- ✅ Visibles sur SuiScan.xyz
- ✅ Transferables entre wallets
- ✅ Métadonnées permanentes

### **Avantages de la version de démonstration :**
- ✅ Fonctionne immédiatement
- ✅ Pas besoin de déploiement
- ✅ Parfait pour les tests
- ✅ Interface identique

## 🎯 Prochaines étapes

1. **Déployer le contrat** (si vous voulez la version complète)
2. **Tester la création d'objets**
3. **Vérifier sur SuiScan.xyz**
4. **Intégrer dans votre application**

---

**Note :** La version de démonstration fonctionne parfaitement pour tester l'interface. Pour un déploiement réel, déployez le contrat Move ! 🚀
