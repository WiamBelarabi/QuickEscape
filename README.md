# QuickEscape

Application web de réservation de voyages (Node.js + Express + EJS + MariaDB).

## Fonctionnalités
- Authentification (client / admin)
- Gestion des voyages (admin)
- Réservations de voyages (client)

## Prérequis
- Node.js (>= 18 recommandé)
- MariaDB installé et démarré

## Installation
1. Installer les dépendances:
```bash
npm install
```

2. Configurer la base de données:
- La configuration est dans `src/db/sequelize.js`
- Par défaut: database `quickescape`, user `root`, mot de passe vide

3. Démarrer l’application:
```bash
npm start
```

L’app tourne sur: `http://localhost:3030`

## Compte admin par défaut
Au premier lancement, un admin est créé si aucun n’existe:
- **username:** admin
- **password:** admin

## Upload de photos
- Les photos sont stockées en base (format base64).
- Le formulaire admin accepte **plusieurs images** par voyage.
- La liste des voyages affiche la **première photo** comme couverture.

## Structure du projet
- `app.js` : serveur Express
- `src/models` : modèles Sequelize
- `src/routes` : routes API
- `views` : templates EJS
- `public` : assets statiques (JS/CSS)

## Scripts utiles
- `npm start` : lance le serveur (nodemon)

## Remarques
- Si vous avez l’erreur `PayloadTooLargeError`, augmentez la limite dans `app.js` (body-parser).

## Author
5th-year Computer Engineering Student
ENSA Oujda — Morocco
wiambelarabi10@gmail.com
