# 🌤️ Guide pour obtenir une clé API OpenWeatherMap

## 📋 Étapes pour obtenir votre clé API

### 1. **Inscription sur OpenWeatherMap**
1. Allez sur [https://openweathermap.org/api](https://openweathermap.org/api)
2. Cliquez sur "Sign Up" en haut à droite
3. Remplissez le formulaire d'inscription
4. Confirmez votre email

### 2. **Activation de votre compte**
1. Vérifiez votre boîte email
2. Cliquez sur le lien de confirmation
3. Connectez-vous à votre compte

### 3. **Génération de votre clé API**
1. Une fois connecté, allez dans "My API Keys"
2. Vous verrez votre clé API par défaut
3. Copiez cette clé (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 4. **Configuration dans l'application**
1. Ouvrez l'application
2. Dans la section "Test Oracle Météo"
3. Collez votre clé API dans le champ "Clé API OpenWeatherMap"
4. Cliquez sur "Données Réelles"

## 🔑 **Votre clé API actuelle**
```
0dbe8612a65b424ffc1c4b394171a388
```

## ⚠️ **Problèmes courants**

### **Erreur 401 - Invalid API key**
- Vérifiez que votre clé API est correcte
- Assurez-vous que votre compte est activé
- Attendez quelques minutes après l'inscription

### **Erreur 429 - Too many requests**
- Vous avez dépassé la limite gratuite (1000 appels/jour)
- Attendez 24h ou passez à un plan payant

### **Pas de données de pluie**
- OpenWeatherMap ne fournit pas toujours les données de précipitation
- L'application utilise des données de fallback cohérentes

## 🆓 **Limites du plan gratuit**
- **1000 appels API par jour**
- **Données météo actuelles uniquement**
- **Pas de données historiques**

## 🚀 **Fonctionnalités de l'oracle**

### **Cache intelligent**
- Les données sont mises en cache pendant 5 minutes
- Évite les appels API répétés
- Données cohérentes pour la même position

### **Fallback automatique**
- Si l'API échoue, utilise des données déterministes
- Basées sur la position, l'heure et la saison
- Pas d'aléatoire - données cohérentes

### **Indicateur de source**
- Affiche si les données viennent de l'API ou du cache
- Permet de vérifier le fonctionnement

## 📊 **Test de l'oracle**

1. **Même position** → **Mêmes données** (pendant 5 minutes)
2. **Position différente** → **Données différentes**
3. **Heure différente** → **Température différente**
4. **Saison différente** → **Conditions différentes**

## 🔧 **Dépannage**

Si l'API ne fonctionne toujours pas :
1. Vérifiez votre connexion internet
2. Testez avec une autre clé API
3. Utilisez le mode fallback (données cohérentes)
4. Contactez le support OpenWeatherMap

## 📞 **Support**
- [Documentation OpenWeatherMap](https://openweathermap.org/api)
- [FAQ OpenWeatherMap](https://openweathermap.org/faq)
- [Support OpenWeatherMap](https://openweathermap.org/support)
