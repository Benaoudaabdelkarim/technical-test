# Document Technique - Test Technique Vue.js

Ce document détaille les choix d'architecture, la gestion de l'API et les défis rencontrés lors du développement de l'application de gestion de candidatures.

## 🏗️ Choix d'Architecture

L'application a été conçue comme une **Single Page Application (SPA)** moderne en utilisant **Vue 3** avec la **Composition API**.

### Structure du Projet

Le projet suit une organisation modulaire pour favoriser la maintenabilité et la séparation des responsabilités :

- **`/src/api`** : Centralisation des appels HTTP via une instance Axios configurée.
- **`/src/stores`** : Gestion de l'état global avec **Pinia**. L'état est divisé par domaine (ex: `candidatureStore`, `configStore`).
- **`/src/views`** : Composants de page principaux mappés sur les routes.
- **`/src/components`** : Composants réutilisables (UI Atomique et composants métiers).
- **`/src/types`** : Définitions TypeScript pour garantir une cohérence des données dans toute l'application.
- **`/src/composables`** : Logique métier partagée et réutilisable entre les composants.

### Technologies Clés

- **Vue 3 (Composition API)** : Pour une meilleure organisation du code et la réutilisation de la logique.
- **Tailwind CSS 4** : Pour un styling rapide, responsive et moderne sans quitter le HTML.
- **Lucide Vue Next** : Bibliothèque d'icônes légère et élégante.
- **Vite** : Pour un tooling rapide et performant.

---

## 🌐 Gestion de l'API

L'application communique avec un serveur mock (**JSON Server**). La gestion de l'API a été particulièrement travaillée pour être flexible.

### Service Centralisé

Le fichier `src/api/api.service.ts` encapsule toute la logique de communication. Une instance **Axios** est configurée pour définir l'URL de base et les headers communs.

### Compatibilité JSON Server

Une des complexités a été de gérer la transition entre les versions de JSON Server (v0.x vs v1.x beta). Le service transforme dynamiquement les paramètres de requête :

- Conversion de `_limit` en `_per_page`.
- Transformation du tri (`_sort` et `_order`) vers le nouveau format `-key`.
- Gestion hybride des réponses (Array vs Object avec métadonnées de pagination).

### Typage Strong

Chaque appel API est typé via TypeScript, ce qui réduit les erreurs de manipulation de données et facilite l'auto-complétion lors du développement.

---

## 🛠️ Difficultés Rencontrées

1. **Pagination JSON Server** : L'adaptation aux changements de paramètres entre les versions de JSON Server a nécessité une abstraction robuste dans le `ApiService`.
2. **Recherche et Filtrage Dynamique** : La mise en œuvre d'une recherche performante combinée à plusieurs filtres (statut, poste) tout en conservant la pagination synchrone avec le serveur.
3. **Transition Tailwind CSS 4** : L'utilisation de la toute nouvelle version de Tailwind CSS a demandé un temps d'adaptation, notamment pour la configuration via Vite.
4. **Accessibilité** : Garantir que les formulaires et les listes soient utilisables par tous, tout en maintenant un design "Premium".

---

## ⏱️ Temps Réel Passé

_Note : Ces temps sont des estimations basées sur le travail accompli._

| Partie                          | Temps estimé | Temps réel |
| :------------------------------ | :----------- | :--------- |
| Configuration & Initialisation  | 15 min       | 15 min     |
| Architecture & API Service      | 1h           | 1h         |
| UI & Composants de base         | 1h 30        | 1h 45      |
| Logique de filtrage & Recherche | 1h           | 1h 15      |
| Tests & Polissage               | 1h           | 45 min     |
| Tests Unitaires (Vitest)        | -            | 1h         |
| **Total**                       | **5h**       | **6h**     |

---

## 🚀 Démo

### Lancer l'application localement

1. Installer les dépendances : `npm install`
2. Lancer le serveur de développement et l'API : `npm start`
3. L'application est disponible sur : `http://localhost:5173`

_(Une vidéo de démonstration peut être jointe au rendu final pour illustrer les fonctionnalités clés)_
