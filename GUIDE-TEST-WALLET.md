# GUIDE DE TEST SIMPLE - Objets dans le Wallet

## 🎯 OBJECTIF
Vérifier que les objets `InsurancePolicy` et `PolicyCap` apparaissent dans votre wallet Sui.

## 📋 ÉTAPES DE CORRECTION

### 1. CORRIGER LA CONFIGURATION
```bash
# Vérifiez que Move.toml contient:
[package]
name = "rainguard"  # ← CORRECT
version = "0.0.1"

[addresses]
rainguard = "0x0"
```

### 2. DÉPLOYER LE CONTRAT
```powershell
# Exécutez le script corrigé
.\deploy-corrected.ps1
```

### 3. TESTER VIA L'INTERFACE WEB
```bash
# Lancez l'application
npm run dev

# Allez sur http://localhost:3000
# Connectez votre wallet Sui
# Utilisez le composant "Test d'Affichage dans le Wallet"
# Cliquez sur "Créer une Police de Test"
```

### 4. VÉRIFIER DANS LE WALLET
- Ouvrez votre wallet Sui (Suiet, Sui Wallet, etc.)
- Allez dans l'onglet "Objects" ou "Assets"
- Recherchez les objets :
  - `InsurancePolicy`
  - `PolicyCap`

## 🔍 DIAGNOSTIC DES PROBLÈMES

### Si les objets n'apparaissent pas :

1. **Vérifiez la console du navigateur** (F12)
   - Regardez les erreurs
   - Vérifiez les logs de transaction

2. **Vérifiez le Package ID**
   - Le Package ID doit correspondre à celui déployé
   - Il doit être dans `package_id.txt`

3. **Vérifiez le réseau**
   - Wallet connecté au devnet
   - Frontend configuré pour devnet

4. **Vérifiez la fonction appelée**
   - Doit être `create_simple_policy`
   - Avec seulement 2 arguments : coverage et premium

## 🚨 ERREURS COURANTES

### Erreur : "Module not found"
- **Cause** : Mauvais Package ID ou mauvais module
- **Solution** : Vérifiez le Package ID et le nom du module

### Erreur : "Invalid arguments"
- **Cause** : Trop d'arguments passés à `create_simple_policy`
- **Solution** : Utilisez seulement coverage et premium

### Erreur : "Transaction failed"
- **Cause** : Problème de gas ou de signature
- **Solution** : Vérifiez votre wallet et votre solde

## ✅ VÉRIFICATION FINALE

Si tout fonctionne, vous devriez voir :
1. ✅ Transaction réussie dans la console
2. ✅ Objets créés avec leurs IDs
3. ✅ Objets visibles dans votre wallet Sui
4. ✅ Types : `InsurancePolicy` et `PolicyCap`

## 🆘 SI RIEN NE MARCHE

1. **Redéployez** avec le script corrigé
2. **Vérifiez** que le Package ID est correct
3. **Testez** avec une nouvelle adresse wallet
4. **Regardez** les logs détaillés dans la console

## 📞 SUPPORT

Si vous avez encore des problèmes :
1. Copiez les logs d'erreur de la console
2. Vérifiez le Package ID dans `package_id.txt`
3. Testez avec le script `test-policy-creation.js`

