# 🏠 Social Housing Management System

Un système moderne de gestion de logement social avec interface web interactive, authentification sécurisée et gestion complète des contrats de location.

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies Utilisées](#-technologies-utilisées)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du Projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Licence](#-licence)

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- **Authentification JWT** sécurisée avec tokens
- **Rôles utilisateurs** : Propriétaires et Locataires
- **Pages de connexion/inscription** modernisées avec UI/UX améliorée
- **Navigation conditionnelle** selon le rôle utilisateur
- **Protection des routes** avec composants dédiés

### 🏘️ Gestion des Propriétés
- **Ajout/Modification/Suppression** de maisons et chambres
- **Géolocalisation** avec coordonnées GPS précises
- **Cartographie interactive** pour chaque propriété
- **Descriptions détaillées** et informations complètes
- **Gestion des chambres** par propriété

### 👥 Gestion des Utilisateurs
- **Profils utilisateurs** personnalisés et modifiables
- **Interface moderne** avec avatar et informations détaillées
- **Gestion des rôles** (propriétaires, locataires)
- **Tableau de bord** personnalisé selon le rôle

### 📋 Gestion des Contrats
- **Création de contrats** avec assistant multi-étapes
- **Validation en temps réel** des informations
- **Gestion des paiements** et cautions
- **Suivi des contrats** pour propriétaires et locataires
- **Annulation de contrats** (locataires uniquement)

### 🎨 Interface Utilisateur
- **Design moderne** avec Tailwind CSS
- **Navigation responsive** avec barre de navigation conditionnelle
- **Feedback visuel** avec animations et états de chargement
- **Formulaires intuitifs** avec validation
- **Cartes interactives** pour les propriétés

### 📱 Expérience Utilisateur
- **Navigation fluide** sans rechargement de page
- **États de chargement** avec spinners animés
- **Messages d'erreur** clairs et informatifs
- **Interface adaptative** selon le rôle utilisateur
- **Validation en temps réel** des formulaires

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React moderne avec App Router
- **TypeScript** - Typage statique pour la robustesse
- **Tailwind CSS** - Framework CSS utilitaire pour le design
- **OpenStreetMap** - Cartographie interactive gratuite
- **React Hooks** - Gestion d'état moderne
- **ESLint** - Linting et qualité de code

### Backend (API)
- **Django REST Framework** - API REST robuste
- **JWT Authentication** - Authentification sécurisée
- **PostgreSQL** - Base de données relationnelle
- **Docker** - Conteneurisation et déploiement

### Outils de Développement
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formatage automatique de code
- **Git** - Contrôle de version
- **Docker Compose** - Orchestration de conteneurs

## 🚀 Installation

### Prérequis
- **Node.js 18+** 
- **Docker et Docker Compose**
- **Git**

### 1. Cloner le Repository
```bash
git clone https://github.com/your-username/social_housing_frontend.git
cd social_housing_frontend
```

### 2. Installer les Dépendances
```bash
npm install
```

### 3. Configuration de l'Environnement
```bash
cp .env.example .env.local
```

Éditez le fichier `.env.local` avec vos configurations :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### 4. Lancer en Mode Développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🐳 Déploiement avec Docker

### Construction et Lancement
```bash
# Construire et démarrer les conteneurs
docker-compose up -d --build

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f
```

### Arrêt des Services
```bash
docker-compose down
```

## 📁 Structure du Projet

```
social_housing_frontend/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── (with-navbar)/      # Pages avec navigation
│   │   │   ├── page.tsx        # Page d'accueil (locataires)
│   │   │   ├── layout.tsx      # Layout avec navbar
│   │   │   ├── dashboard/      # Tableau de bord
│   │   │   ├── maisons/        # Gestion des propriétés
│   │   │   │   ├── ajouter/    # Ajout de propriété
│   │   │   │   ├── editer/     # Modification de propriété
│   │   │   │   └── [id]/       # Détails et chambres
│   │   │   │       └── chambres/
│   │   │   │           ├── ajouter/
│   │   │   │           ├── [chambreId]/
│   │   │   │           │   ├── louer/    # Assistant de location
│   │   │   │           │   └── modifier/
│   │   │   │           └── page.tsx
│   │   │   ├── contrats/       # Gestion des contrats
│   │   │   └── profile/        # Profil utilisateur
│   │   ├── login/              # Page de connexion
│   │   ├── register/           # Page d'inscription
│   │   └── layout.tsx          # Layout racine
│   ├── components/             # Composants réutilisables
│   │   ├── Navbar.tsx          # Barre de navigation
│   │   ├── BodyWithNavbar.tsx  # Wrapper conditionnel navbar
│   │   ├── ProtectedRoute.tsx  # Protection des routes
│   │   ├── ChambreCard.tsx     # Carte de chambre
│   │   ├── ContratCard.tsx     # Carte de contrat
│   │   ├── ChambreForm.tsx     # Formulaire de chambre
│   │   └── MapView.tsx         # Composant carte interactive
│   ├── hooks/                  # Hooks personnalisés
│   │   └── useAuth.ts          # Hook d'authentification
│   └── services/               # Services API
│       ├── api.ts              # Configuration API
│       ├── auth.ts             # Service d'authentification
│       ├── maison.ts           # Service des propriétés
│       ├── chambre.ts          # Service des chambres
│       ├── contrat.ts          # Service des contrats
│       └── user.ts             # Service utilisateurs
├── public/                     # Fichiers statiques
├── docker-compose.yml          # Configuration Docker
├── Dockerfile                  # Image Docker
└── package.json                # Dépendances et scripts
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login/` - Connexion utilisateur
- `POST /api/auth/register/` - Inscription utilisateur
- `POST /api/auth/logout/` - Déconnexion

### Propriétés
- `GET /api/maisons/` - Liste des propriétés
- `POST /api/maisons/` - Créer une propriété
- `GET /api/maisons/{id}/` - Détails d'une propriété
- `PUT /api/maisons/{id}/` - Modifier une propriété
- `DELETE /api/maisons/{id}/` - Supprimer une propriété

### Chambres
- `GET /api/maisons/{id}/chambres/` - Chambres d'une propriété
- `POST /api/maisons/{id}/chambres/` - Créer une chambre
- `GET /api/chambres/{id}/` - Détails d'une chambre
- `PUT /api/chambres/{id}/` - Modifier une chambre
- `DELETE /api/chambres/{id}/` - Supprimer une chambre

### Contrats
- `GET /api/contrats/` - Liste des contrats
- `POST /api/contrats/` - Créer un contrat
- `GET /api/contrats/{id}/` - Détails d'un contrat
- `DELETE /api/contrats/{id}/` - Annuler un contrat

### Utilisateurs
- `GET /api/utilisateurs/profile/` - Profil utilisateur
- `PUT /api/utilisateurs/profile/` - Modifier le profil

## 🎯 Utilisation

### 1. Connexion et Inscription
- **Connexion** : Accédez à `http://localhost:3000/login`
- **Inscription** : Accédez à `http://localhost:3000/register`
- **Interface moderne** avec validation en temps réel
- **Redirection automatique** selon le rôle utilisateur

### 2. Navigation selon le Rôle

#### 👨‍💼 Propriétaires
- **Mes maisons** : Gestion des propriétés
- **Contrats** : Suivi des contrats de location
- **Profil** : Gestion du compte

#### 🏠 Locataires
- **Accueil** : Voir les chambres disponibles
- **Contrats** : Mes contrats de location
- **Profil** : Gestion du compte

### 3. Gestion des Propriétés
- **Voir les propriétés** : Accédez à `/maisons`
- **Ajouter une propriété** : Cliquez sur "Ajouter une maison"
- **Gérer les chambres** : Accédez aux détails d'une maison
- **Modifier/Supprimer** : Actions disponibles selon les permissions

### 4. Location de Chambres
- **Parcourir** : Voir les chambres disponibles sur la page d'accueil
- **Louer** : Assistant multi-étapes pour la création de contrat
- **Validation** : Vérification des informations en temps réel
- **Confirmation** : Récapitulatif avant finalisation

### 5. Gestion des Contrats
- **Voir mes contrats** : Accédez à `/contrats`
- **Détails complets** : Informations sur le locataire/propriétaire
- **Annulation** : Possibilité d'annuler (locataires uniquement)

### 6. Profil Utilisateur
- **Accédez à `/profile`** pour modifier vos informations
- **Interface moderne** avec avatar et sections organisées
- **Sauvegarde** avec feedback visuel

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Lancer le serveur de développement
npm run build        # Construire pour la production
npm run start        # Lancer en mode production
npm run lint         # Vérifier le code avec ESLint
npm run lint:fix     # Corriger automatiquement les erreurs ESLint

# Docker
docker-compose up    # Lancer avec Docker
docker-compose down  # Arrêter les conteneurs
```

## 🚀 Fonctionnalités Avancées

### Navigation Conditionnelle
- **Barre de navigation** qui s'adapte selon l'utilisateur
- **Masquage automatique** sur les pages d'authentification
- **Mise à jour en temps réel** sans rechargement

### Assistant de Location
- **Étapes guidées** pour la création de contrat
- **Validation progressive** des informations
- **Récapitulatif** avant finalisation
- **Feedback visuel** à chaque étape

### Gestion des États
- **États de chargement** avec spinners animés
- **Messages d'erreur** contextuels
- **Succès** avec animations
- **Validation** en temps réel

## 🤝 Contribution

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité
3. **Commitez** vos changements
4. **Poussez** vers la branche
5. **Ouvrez** une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation de l'API
- Contactez l'équipe de développement

---

**Développé avec ❤️ pour améliorer la gestion du logement social**
