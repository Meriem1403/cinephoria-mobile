# 📱 Cinéphoria Mobile – Réservation

![Platform](https://img.shields.io/badge/platform-mobile-lightgrey)
![Expo](https://img.shields.io/badge/Expo-managed-blue)
![Status](https://img.shields.io/badge/status-in%20progress-yellow)
![License: MIT](https://img.shields.io/badge/license-MIT-green)


Bienvenue dans l'application mobile **Cinéphoria**, une extension mobile du projet Cinéphoria.  
Cette application permet aux utilisateurs de **réserver des places de cinéma**, de **sélectionner leurs sièges**, et de **générer un ticket avec QR Code**.

---

## 🎯 Objectif du projet

Cette application a été développée dans le cadre du **TP CDA 2025**.  
Elle démontre les compétences suivantes :
- Connexion à une API Symfony sécurisée
- Gestion de l’authentification avec JWT
- Interaction avec des composants dynamiques (sièges, séances, tickets)
- Adaptation multiplateforme (Android, iOS, Web)

---

## 🧩 Technologies utilisées

| Domaine          | Technologies / Bibliothèques                       |
|------------------|----------------------------------------------------|
| Framework Mobile | React Native avec Expo                             |
| Navigation       | React Navigation                                   |
| API & Auth       | Axios, JWT, AsyncStorage                           |
| Plateforme       | Platform API (iOS / Android / Web)                 |
| UI & Icônes      | Expo Vector Icons, Tailwind-like custom styles     |
| Backend          | Symfony 7 (projet web Cinéphoria)                  |

---

## 🚀 Lancer l'application localement

### 🔧 Prérequis

- [Node.js](https://nodejs.org/) v18 ou v19
- [Git](https://git-scm.com/)
- Un smartphone avec **Expo Go** installé  
  ou un **émulateur Android/iOS** configuré

---

### 🛠️ Étapes de démarrage

```bash
# Cloner le projet
git clone https://github.com/Meriem1403/cinephoria-mobile.git
cd cinephoria-mobile

# Installer les dépendances
npm install

# Lancer Expo
npx expo start



📱 Sur ton smartphone :

Installe Expo Go depuis le Play Store ou App Store

Dans le terminal tape en ligne de commande "npx expo start" 

puis "y" puis scanne le QR Code affiché dans le terminal

L’application se lancera automatiquement


📦 Fonctionnalité disponible
Fonction	Statut
Connexion utilisateur	🔄 En cours
Liste des films/séances	✅ Fait
Sélection des sièges	✅ Fait
Choix de formule tarifaire	✅ Fait
Validation de réservation	✅ Fait
Affichage du ticket (QR)	✅ Fait
Envoi ou partage du ticket	🔄 En cours

🔗 Liens utiles
Projet web Symfony Cinéphoria

Expo documentation officielle: https://docs.expo.dev/

- [Documentation API Symfony (Swagger)](http://localhost:8000/api/doc)