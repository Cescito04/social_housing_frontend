# 🏠 Social Housing Management System

Un système moderne de gestion de logement social avec interface web interactive et cartographie intégrée.

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

### 🏘️ Gestion des Propriétés
- **Ajout/Modification/Suppression** de maisons et appartements
- **Géolocalisation** avec coordonnées GPS précises
- **Cartographie interactive** pour chaque propriété
- **Descriptions détaillées** et informations complètes

### 👥 Gestion des Utilisateurs
- **Authentification sécurisée** avec JWT
- **Rôles et permissions** (propriétaires, administrateurs)
- **Profils utilisateurs** personnalisés
- **Tableau de bord** personnalisé

### 📅 Gestion des Rendez-vous
- **Planification** de visites de propriétés
- **Calendrier interactif**
- **Notifications** automatiques

### 💰 Gestion Financière
- **Suivi des paiements** de loyer
- **Historique des transactions**
- **Génération de rapports**

### 🔧 Gestion des Problèmes
- **Signalement** de problèmes techniques
- **Suivi des réparations**
- **Communication** propriétaire-locataire

### 📋 Gestion des Contrats
- **Création et suivi** des contrats de location
- **Renouvellements** automatiques
- **Archivage** sécurisé

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React moderne
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **OpenStreetMap** - Cartographie interactive
- **React Hooks** - Gestion d'état

### Backend
- **Django** - Framework Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de données
- **Docker** - Conteneurisation
- **JWT** - Authentification

### Outils de Développement
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formatage de code
- **Git** - Contrôle de version

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- Docker et Docker Compose
- Git

### 1. Cloner le Repository
```bash
git clone https://github.com/Cescito04/social_housing_frontend.git
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
│   │   ├── dashboard/         # Tableau de bord
│   │   ├── login/            # Page de connexion
│   │   ├── register/         # Page d'inscription
│   │   ├── maisons/          # Gestion des propriétés
│   │   │   ├── ajouter/      # Ajout de propriété
│   │   │   └── editer/       # Modification de propriété
│   │   └── profile/          # Profil utilisateur
│   ├── components/           # Composants réutilisables
│   │   ├── MapView.tsx       # Composant carte interactive
│   │   └── ProtectedRoute.tsx # Protection des routes
│   ├── hooks/               # Hooks personnalisés
│   │   └── useAuth.ts       # Hook d'authentification
│   └── services/            # Services API
│       ├── api.ts           # Configuration API
│       ├── auth.ts          # Service d'authentification
│       ├── maison.ts        # Service des propriétés
│       └── user.ts          # Service utilisateurs
├── public/                  # Fichiers statiques
├── docker-compose.yml       # Configuration Docker
├── Dockerfile              # Image Docker
└── package.json            # Dépendances et scripts
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

### Utilisateurs
- `GET /api/utilisateurs/profile/` - Profil utilisateur
- `PUT /api/utilisateurs/profile/` - Modifier le profil

## 🎯 Utilisation

### 1. Connexion
- Accédez à `http://localhost:3000/login`
- Entrez vos identifiants
- Vous serez redirigé vers le tableau de bord

### 2. Gestion des Propriétés
- **Voir les propriétés** : Accédez à `/maisons`
- **Ajouter une propriété** : Cliquez sur "Ajouter une maison"
- **Modifier** : Cliquez sur l'icône d'édition
- **Supprimer** : Cliquez sur l'icône de suppression

### 3. Cartographie
- Chaque propriété affiche sa **carte interactive**
- **Zoom et déplacement** pour explorer la zone
- **Coordonnées GPS** affichées

### 4. Profil Utilisateur
- Accédez à `/profile` pour modifier vos informations
- Changez votre mot de passe
- Gérez vos préférences

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Construction pour production
npm run start        # Serveur de production
npm run lint         # Vérification du code
npm run type-check   # Vérification TypeScript

# Docker
docker-compose up -d --build  # Construction et lancement
docker-compose down           # Arrêt des services
```

## 🚀 Déploiement en Production

### Variables d'Environnement
```env
NEXT_PUBLIC_API_URL=https://votre-api.com/api
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
NODE_ENV=production
```

### Construction pour Production
```bash
npm run build
npm run start
```

### Avec Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribution

1. **Fork** le projet
2. Créez une **branche** pour votre fonctionnalité
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```
3. **Commitez** vos changements
   ```bash
   git commit -m "feat: ajouter nouvelle fonctionnalité"
   ```
4. **Poussez** vers la branche
   ```bash
   git push origin feature/nouvelle-fonctionnalite
   ```
5. Ouvrez une **Pull Request**

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrez une **issue** sur GitHub
- Contactez l'équipe de développement

---

**Développé avec ❤️ pour améliorer la gestion du logement social**
