/**
 * Définition des types globaux pour l'application.
 * Garantit la cohérence des données entre l'API, les stores et les composants.
 */

/**
 * Représente un commentaire laissé par un recruteur sur une candidature.
 */
export interface Commentaire {
  id: string | number
  auteur: string
  date: string // Format ISO 8601 (ex: 2024-03-18T10:00:00Z)
  contenu: string
}

/**
 * Entité principale de l'application : la Candidature.
 */
export interface Candidature {
  id: number
  nom: string
  poste: string
  statut: string
  competences: string[]
  experience: string
  dateCandidature: string // Format ISO 8601
  email: string
  telephone: string
  cv: string // URL vers le document PDF/Word
  lettreMotivation: string
  salaireSouhaite: number
  disponibilite: string
  localisation: string
  commentaires: Commentaire[]
}

/**
 * Définition d'un statut possible (ex: Nouveau, Entretien, Refusé).
 */
export interface Statut {
  id: number
  nom: string
  couleur: string // Code hexadécimal pour l'affichage des badges
  ordre: number // Utilisé pour trier les statuts dans le workflow
}

/**
 * Métadonnées d'un poste ouvert au recrutement.
 */
export interface Poste {
  id: number
  titre: string
  description: string
  competencesRequises: string[]
}

/**
 * Compétence individuelle (Hard ou Soft skill).
 */
export interface Competence {
  id: number
  nom: string
  categorie: string
}

/**
 * Paramètres autorisés pour les requêtes vers l'API.
 * Supporte les filtres, la recherche globale (q) et la pagination.
 */
export interface ApiParams {
  q?: string
  statut?: string
  poste?: string
  _page?: number
  _limit?: number
  _sort?: string
  _order?: 'asc' | 'desc'
  [key: string]: any // Pour supporter les paramètres spécifiques de JSON Server
}
