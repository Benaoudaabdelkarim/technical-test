export interface Commentaire {
  id: string | number
  auteur: string
  date: string // ISO 8601
  contenu: string
}

export interface Candidature {
  id: number
  nom: string
  poste: string
  statut: string
  competences: string[]
  experience: string
  dateCandidature: string // ISO 8601
  email: string
  telephone: string
  cv: string // URL
  lettreMotivation: string
  salaireSouhaite: number
  disponibilite: string
  localisation: string
  commentaires: Commentaire[]
}

export interface Statut {
  id: number
  nom: string
  couleur: string
  ordre: number
}

export interface Poste {
  id: number
  titre: string
  description: string
  competencesRequises: string[]
}

export interface Competence {
  id: number
  nom: string
  categorie: string
}

export interface ApiParams {
  q?: string
  statut?: string
  poste?: string
  _page?: number
  _limit?: number
  _sort?: string
  _order?: 'asc' | 'desc'
  [key: string]: any
}
