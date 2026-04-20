# 🛒 MyProject Web Fullstack

Projet e-commerce fullstack développé avec React JS (frontend), Node.js / Express (backend), MongoDB et MySQL (bases de données).

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

MyProject est une application e-commerce complète permettant aux utilisateurs de :

- Parcourir un catalogue d'articles
- Gérer un panier d'achat (ajout, suppression, quantités)
- Sauvegarder des articles en favoris
- Créer un compte et se connecter
- Consulter et modifier leur profil

---

## 🛠️ Technologies utilisées

### Frontend
| Technologie | Rôle |
|
| React JS | Framework UI |
| Vite | Bundler / Dev server |
| React Router | Navigation SPA |
| Context API | Gestion d'état global |
| Vitest | Tests unitaires |
| Testing Library | Tests de composants React |

### Backend
| Technologie | Rôle |
|
| Node.js | Environnement d'exécution |
| Express | Framework HTTP |
| MongoDB | Base de données NoSQL (favoris, panier) |
| MySQL | Base de données relationnelle (articles, utilisateurs) |
| JWT | Authentification par token |

---

## 🗂️ Architecture du projet

```
MyProjectWebFullstack/
│
├── MyProjectWebFrontend/          # Application React
│   ├── src/
│   │   ├── assets/                # Images, icônes
│   │   ├── Composants/            # Composants réutilisables
│   │   │   ├── List/              # ArticlesItem, FavorisItem
│   │   │   └── Menu/              # Menu, MenuLateral1, MenuLateral2
│   │   ├── Context/               # Contextes React globaux
│   │   │   ├── ArticleContext.jsx # État des articles
│   │   │   └── UserContext.jsx    # État utilisateur, panier, favoris
│   │   ├── Database/              # Couche API
│   │   │   └── UserDataAPI.js     # Appels vers le backend
│   │   ├── Navigation/            # Routeur de l'application
│   │   ├── Pages/                 # Pages de l'application
│   │   │   ├── CataloguePage.jsx
│   │   │   ├── ConnexionFormPage.jsx
│   │   │   ├── FavorisPage.jsx
│   │   │   ├── InscriptionFormPage.jsx
│   │   │   ├── PanierPage.jsx
│   │   │   └── ProfilPage.jsx
│   │   ├── Styles/                # CSS global
│   │   └── Test/                  # Tests unitaires
│   ├── .gitlab-ci.yml             # Pipeline CI/CD GitLab
│   ├── vite.config.js
│   └── vitest.config.js
│
└── MyProjectBackend/              # API Node.js / Express
    ├── src/
    │   ├── Middleware/            # Authentification JWT
    │   ├── Models/                # Modèles de données
    │   │   ├── Article.js
    │   │   ├── Produit.js
    │   │   ├── User.js
    │   │   └── UserData.js
    │   ├── Routes/                # Routes de l'API
    │   │   ├── Articles.js
    │   │   ├── AuthRoutes.js
    │   │   ├── Produits.js
    │   │   └── UserData.js
    │   ├── DB.js                  # Connexion bases de données
    │   ├── ExpressApp.js          # Configuration Express
    │   └── Server.js              # Point d'entrée serveur
    └── .env                       # Variables d'environnement (non versionné)
```

---

## ✅ Prérequis

Avant de commencer, assure-toi d'avoir installé :

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)
- [MySQL](https://www.mysql.com/) (local ou cloud)
- [Git](https://git-scm.com/)

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://gitlab.com/myprojectwebfullstack/myprojectwebfrontend.git
cd myprojectwebfrontend
```

### 2. Installer les dépendances

**Frontend :**
```bash
cd MyProjectWebFrontend
pnpm install
```

**Backend :**
```bash
cd MyProjectBackend
npm install
```

---

## 🔐 Variables d'environnement

> ⚠️ Ne jamais committer le fichier `.env` — il contient des données sensibles.

### Frontend — `.env`
```env
VITE_API_URL=http://localhost:5000
```

### Backend — `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myproject
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=ton_mot_de_passe
MYSQL_DATABASE=myproject
JWT_SECRET=ta_clef_secrete_jwt
```

---

## ▶️ Lancer le projet

### Frontend (port 5173)
```bash
cd MyProjectWebFrontend
pnpm run dev
```

### Backend (port 5000)
```bash
cd MyProjectBackend
npm run start
```

L'application sera accessible sur : **http://localhost:5173**

---

## 🧪 Tests

Les tests unitaires sont écrits avec **Vitest** et **Testing Library**.

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
├── RouterNavigator.test.jsx      # Tests la navigation au sein de l'application
├── ConnexionFormPage.Test.jsx    # Tests formulaire de connexion
├── InscriptionFormPage.Test.jsx  # Tests formulaire d'inscription
└── setupTest.js                  # Configuration globale des tests
```

---

## ⚙️ CI/CD — GitLab Pipeline

Chaque push sur le dépôt GitLab déclenche automatiquement le pipeline défini dans `.gitlab-ci.yml`.

### Étapes du pipeline

```
install → lint → test → build → deploy
```

| Étape | Description |
|
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