# Cinéphoria mobile

Application **spectateur** pour réserver une séance : cinéma, film, formule, places et ticket.

Client React Native / Expo de l'API [Cinéphoria](https://github.com/Meriem1403/Cinephoria).

<p align="center">
  <img src="https://img.shields.io/badge/react%20native-0.7x-61DAFB?logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/expo-000020?logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/javascript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
</p>

<p align="center">
  <strong>Dépôt :</strong> <a href="https://github.com/Meriem1403/cinephoria-mobile">github.com/Meriem1403/cinephoria-mobile</a>
</p>

---

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Sécurité](#sécurité)
- [Structure du projet](#structure-du-projet)
- [Scripts disponibles](#scripts-disponibles)

---

## Présentation

Le parcours tient sur un téléphone : créer un compte, choisir un cinéma et un film, sélectionner une formule, réserver des places, puis retrouver le ticket. L'application ne stocke pas le catalogue en local de façon durable : elle interroge l'API.

---

## Fonctionnalités

| Écran | Rôle |
|-------|------|
| **Accueil** | Entrée dans le catalogue |
| **Cinémas** | Liste des cinémas |
| **Recherche** | Films et séances |
| **Fiche film** | Détail avant réservation |
| **Formule** | Choix de la formule |
| **Réservation** | Places |
| **Confirmation** | Récapitulatif |
| **Tickets** | Billets du compte |
| **Connexion / inscription** | Compte spectateur |
| **Compte** | Profil |

---

## Stack technique

| Couche | Technologies |
|--------|----------------|
| Application | React Native, Expo |
| Navigation | React Navigation (pile et onglets) |
| Réseau | Axios vers l'API Cinéphoria |
| Persistance locale | AsyncStorage (session) |
| Langage | JavaScript |

---

## Prérequis

- **Node.js** 20 et npm
- **Expo Go** ou un simulateur iOS / Android
- L'API Cinéphoria démarrée et joignable depuis le téléphone

---

## Installation

```bash
git clone https://github.com/Meriem1403/cinephoria-mobile.git
cd cinephoria-mobile
npm install
npx expo start
```

Depuis Expo : `i` pour le simulateur iOS, `a` pour Android, ou le QR code avec Expo Go.

---

## Configuration

L'adresse de l'API est lue dans `api.js`. La remplacer par l'URL de l'environnement avant de lancer l'application sur un appareil physique. Un téléphone ne joint pas `localhost` de l'ordinateur : utiliser l'adresse du poste ou de l'API déployée.

Ne pas committer une adresse de réseau privé ni un jeton.

---

## Sécurité

- Le dossier `security/` décrit les points d'attention du client.
- Jeton de session en local, pas de mot de passe en dur.
- Les règles d'accès restent celles de l'API (rôle visiteur).

---

## Structure du projet

```
cinephoria-mobile/
├── App.js
├── api.js                 # Client HTTP
├── navigation/            # Piles et onglets
├── screens/               # Parcours spectateur
└── security/
```

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Metro / Expo |
| `npm run android` | Lancement Android |
| `npm run ios` | Lancement iOS |
| `npm run web` | Aperçu web Expo |

---

<p align="center">
  <sub>Client mobile de Cinéphoria. Le catalogue et les réservations viennent de l'API.</sub>
</p>
