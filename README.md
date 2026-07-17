# 🛒 Tech City — Frontend

Application e-commerce frontend développée avec React (Vite), spécialisée dans la vente de composants et périphériques informatiques.

---

## 👤 Auteur

**Hervé N'Goma**

---

## 📋 Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer le projet](#lancer-le-projet)
- [Tests](#tests)
- [CI/CD — GitLab Pipeline](#cicd--gitlab-pipeline)
- [Licence](#licence)

---

## 📖 Aperçu du projet

Tech City est une application e-commerce complète permettant aux utilisateurs de :

- Parcourir un catalogue de produits (clavier, souris, RAM...)
- Gérer un panier d'achat (ajout, suppression, quantités, synchronisé avec le backend)
- Sauvegarder des articles en favoris
- Créer un compte, se connecter et gérer leur profil (informations, adresses, sécurité)
- Consulter l'historique de leurs commandes et télécharger leurs factures
- Payer en ligne de façon sécurisée via Stripe
- Contacter l'équipe via un formulaire de contact

Une interface d'administration dédiée permet également la gestion des produits, articles, commandes et utilisateurs.

---

## 🛠️ Technologies utilisées

| Technologie | Rôle |
|---|---|
| React 19 | Framework UI |
| Vite | Bundler / Dev server |
| React Router v7 | Navigation SPA |
| Context API | Gestion d'état global (utilisateur, articles) |
| react-helmet-async | Gestion des balises SEO (title, meta, Open Graph) |
| SweetAlert2 | Alertes et confirmations utilisateur |
| Stripe.js | Intégration du paiement en ligne |
| Axios | Appels HTTP vers l'API |
| Vitest | Tests unitaires |
| React Testing Library | Tests de composants React |

---

## 🗂️ Architecture du projet

```
MyProjectWebFrontend/
│
├── public/
│   ├── Images/                    # Images statiques
│   └── robots.txt                 # Directives pour les moteurs de recherche
│
├── src/
│   ├── __mocks__/                 # Mocks des contextes pour les tests
│   │   ├── ArticleContext.js
│   │   └── UserContext.js
│   │
│   ├── Composants/                # Composants réutilisables
│   │   ├── List/                  # ArticlesItem, FavorisItem
│   │   ├── Menu/                  # Menu, MenuLateral (client/admin)
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   │
│   ├── Context/                   # Contextes React globaux
│   │   ├── ArticleContext.jsx     # État des articles
│   │   └── UserContext.jsx        # État utilisateur, panier, favoris
│   │
│   ├── Database/
│   │   └── UserDataAPI.js         # Appels vers l'API (panier, favoris)
│   │
│   ├── Navigation/
│   │   ├── RouterNavigator.jsx    # Routeur de l'application
│   │   └── ProtectedRoute.jsx     # Protection des routes (auth / admin)
│   │
│   ├── Pages/
│   │   ├── Admin/                 # Articles, Commandes, Produits, Utilisateurs
│   │   ├── Client/                # Adresses, Commandes, Sécurité, Profil
│   │   ├── CataloguePage.jsx
│   │   ├── ConnexionFormPage.jsx
│   │   ├── InscriptionFormPage.jsx
│   │   ├── FavorisPage.jsx
│   │   ├── PanierPage.jsx
│   │   └── ContactPage.jsx
│   │
│   ├── Styles/
│   │   └── Style.css
│   │
│   └── Test/                      # Tests unitaires
│
├── .gitlab-ci.yml                 # Pipeline CI/CD GitLab
├── vite.config.js
└── vitest.config.js
```

---

## ✅ Prérequis

Avant de commencer, assure-toi d'avoir installé :

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [mkcert](https://github.com/FiloSottile/mkcert) pour générer des certificats SSL locaux (développement en HTTPS)
- Une instance du [backend Tech City](https://github.com/HNGA91/Projet-Insta-Back) fonctionnelle
- [Git](https://git-scm.com/)

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/HNGA91/Projet-Insta-Web-Front.git
cd Projet-Insta-Web-Front
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Générer les certificats SSL locaux (mkcert)

Le projet utilise HTTPS en local (nécessaire pour tester les cookies sécurisés). Si les certificats n'existent pas encore, `vite.config.js` bascule automatiquement en HTTP simple — pense à générer les tiens si tu veux un environnement identique à la production :

```bash
mkcert -install
mkcert localhost
```

---

## 🔐 Variables d'environnement

> ⚠️ Ne jamais committer le fichier `.env` — il contient des données sensibles.

### Frontend — `.env`
```env
VITE_SERVER_URL=https://localhost:3000
```

---

## ▶️ Lancer le projet

### Frontend (port 5173)
```bash
pnpm run dev
```

### Backend (port 3000)
Voir le [README du backend](https://github.com/HNGA91/Projet-Insta-Back) pour les instructions de lancement.

L'application sera accessible sur : **https://localhost:5173**

---

## 🧪 Tests

Les tests unitaires sont écrits avec **Vitest** et **React Testing Library**.

### Lancer les tests
```bash
# Lancer les tests une fois
pnpm run test

# Mode watch (relance à chaque modification)
pnpm run test:watch

# Avec rapport de couverture de code
pnpm run test:coverage
```

### Fichiers de tests
```
src/Test/
├── RouterNavigator.test.jsx        # Tests de la navigation
├── ConnexionFormPage.test.jsx      # Tests du formulaire de connexion
├── InscriptionFormPage.test.jsx    # Tests du formulaire d'inscription
├── TestUtils.jsx                   # Utilitaires de rendu avec providers
└── setupTest.js                    # Configuration globale des tests
```

---

## ⚙️ CI/CD — GitLab Pipeline

Chaque push sur le dépôt GitLab déclenche automatiquement le pipeline défini dans `.gitlab-ci.yml`.

### Étapes du pipeline

```
install → lint → test → build → deploy
```

| Étape | Description |
|---|---|
| `install` | Installation des dépendances via `pnpm install` |
| `lint` | Vérification qualité du code avec ESLint |
| `test` | Exécution des tests Vitest + rapport de couverture |
| `build` | Build de production avec Vite |
| `deploy` | Déploiement sur GitLab Pages |

### Règles
- Le pipeline s'exécute sur les branches `master`, `develop` et les `merge requests`
- Le build et le déploiement ne s'exécutent que sur `master`
- Un échec aux tests **bloque** le build et le déploiement

---

## 📄 Licence

Ce projet est sous licence **MIT**.
Toute réutilisation doit mentionner l'auteur original.

> ⚠️ Toute reproduction ou présentation de ce projet comme étant le vôtre sans attribution constitue une violation de la licence.