# TalentFlow - Gestion des Candidatures

TalentFlow est une interface moderne de gestion de recrutement construite avec **Vue 3**, **Pinia**, et **Tailwind CSS v4**. Elle permet aux recruteurs de trier, filtrer et suivre les candidatures de manière fluide et intuitive.

## 🚀 Fonctionnalités

- **Dashboard Dynamique** : Vue d'ensemble des candidatures avec statistiques.
- **Filtrage Avancé** : Recherche full-text et filtres par statut/poste synchronisés avec l'API.
- **Pagination** : Gestion performante des grands volumes de données via JSON Server.
- **Détails Candidat** : Side-panel modal avec informations complètes, CV et historique des commentaires.
- **Actions Rapides** : Mise à jour du statut et ajout de commentaires en temps réel.
- **Expérience Premium** :
  - Mode Sombre natif.
  - Animations fluides et feedback visuel (loaders, transitions).
  - Design responsive (Mobile-first).
  - Mises à jour optimistes de l'interface.

## 🛠️ Stack Technique

- **Frontend** : Vue 3 (Composition API + Script Setup), TypeScript.
- **State Management** : Pinia.
- **Styling** : Tailwind CSS v4.
- **API Client** : Axios.
- **Backend (Mock)** : JSON Server.
- **Icons** : Lucide-Vue-Next.

## 📦 Installation et Lancement

### 1. Prérequis

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

### 2. Installation des dépendances

```bash
npm install
```

### 3. Lancer l'application

Le projet utilise `concurrently` pour lancer simultanément l'API JSON Server et le serveur de développement Vite.

```bash
npm start
```

- **Interface** : `http://localhost:5173`
- **API** : `http://localhost:3000`

## 📂 Architecture

- `src/api` : Services de communication avec l'API REST.
- `src/stores` : Gestion de l'état global avec Pinia.
- `src/types` : Définitions TypeScript pour la cohérence des données.
- `src/components` : Composants UI atomiques et modulaires.
- `src/views` : Pages principales de l'application.

## 📝 Choix Techniques & Justifications

- **Tailwind CSS v4** : Choisi pour sa rapidité d'exécution et ses nouvelles capacités de configuration CSS-first, permettant un design haut de gamme sans surcharge de bundle.
- **Pinia** : Préféré à Vuex pour sa simplicité, son excellente intégration avec TypeScript et son API reactive.
- **Optimistic UI** : Les mises à jour de statut sont appliquées immédiatement au store local avant la confirmation de l'API pour une sensation de réactivité instantanée.
- **Debouncing** : La recherche full-text patiente 300ms avant de lancer une requête pour limiter la charge serveur.

## ⏱️ Temps Passé

- Analyse & Diagnostic : 30 min
- Configuration & Setup : 30 min
- Développement Core (Store/API) : 1h
- Développement UI & Composants : 2h
- Polissage & Documentation : 1h
- **Total : ~5 heures**

---

Réalisé par Antigravity pour le test technique Développeur Vue.js.
