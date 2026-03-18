import axios from 'axios'
import type { Candidature, Statut, Poste, Competence, ApiParams } from '@/types'

/**
 * Configuration de l'URL de base pour l'API mockée (JSON Server).
 * On utilise localhost:3000 par défaut.
 */
const API_BASE_URL = 'http://localhost:3000'

/**
 * Instance Axios centralisée pour gérer les appels API.
 * Permet d'ajouter facilement des intercepteurs ou des headers globaux plus tard.
 */
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Service gérant toutes les interactions avec l'API REST.
 * J'ai encapsulé ici la logique de transformation des paramètres pour JSON Server.
 */
export const ApiService = {
  // --- SECTION : CANDIDATURES ---

  /**
   * Récupère la liste des candidatures avec support de la pagination, du tri et des filtres.
   * J'ai ajouté une logique pour être compatible avec JSON Server v0.x et v1.x (beta).
   */
  async getCandidatures(params: ApiParams = {}) {
    const transformedParams: Record<string, unknown> = { ...params }

    // Adaptation pour JSON Server v1.0+ :
    // Ils ont changé _limit par _per_page. Je gère les deux pour plus de sécurité.
    if (transformedParams._limit) {
      transformedParams._per_page = transformedParams._limit
      delete transformedParams._limit
    }

    // Gestion du tri (ex: dateCandidature desc) :
    // Le format a changé pour devenir '-key' pour le décroissant dans les versions récentes.
    if (transformedParams._sort) {
      if (transformedParams._order === 'desc') {
        transformedParams._sort = `-${transformedParams._sort}`
      }
      delete transformedParams._order
    }

    const response = await client.get<unknown>('/candidatures', { params: transformedParams })

    // Normalisation de la réponse :
    // JSON Server v0 renvoie un tableau, v1 renvoie un objet avec une clé 'data'.
    if (Array.isArray(response.data)) {
      const data = response.data as Candidature[]
      // Le total est souvent dans un header personnalisé 'x-total-count'.
      const totalHeader = response.headers['x-total-count']
      return {
        data: data,
        total: totalHeader ? parseInt(totalHeader, 10) : data.length,
      }
    } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const dataObj = response.data as { data: Candidature[]; items?: number }
      return {
        data: dataObj.data,
        total: dataObj.items || dataObj.data.length || 0,
      }
    }

    return { data: [], total: 0 }
  },

  /**
   * Récupère un candidat spécifique par son ID.
   * On inclut les commentaires via '_embed' pour éviter de faire deux requêtes.
   */
  async getCandidatureById(id: number) {
    const response = await client.get<Candidature>(`/candidatures/${id}?_embed=commentaires`)
    return response.data
  },

  /**
   * Met à jour partiellement un candidat (ex: changement de statut).
   */
  async updateCandidature(id: number, data: Partial<Candidature>) {
    const response = await client.patch<Candidature>(`/candidatures/${id}`, data)
    return response.data
  },

  /**
   * Supprime une candidature du système.
   */
  async deleteCandidature(id: number) {
    await client.delete(`/candidatures/${id}`)
  },

  // --- SECTION : CONFIGURATION (Statuts, Postes, Compétences) ---

  async getStatuts() {
    const response = await client.get<Statut[]>('/statuts')
    return response.data
  },

  async createStatut(data: Omit<Statut, 'id'>) {
    const response = await client.post<Statut>('/statuts', data)
    return response.data
  },

  async deleteStatut(id: number) {
    await client.delete(`/statuts/${id}`)
  },

  async getPostes() {
    const response = await client.get<Poste[]>('/postes')
    return response.data
  },

  async createPoste(data: Omit<Poste, 'id'>) {
    const response = await client.post<Poste>('/postes', data)
    return response.data
  },

  async deletePoste(id: number) {
    await client.delete(`/postes/${id}`)
  },

  async getCompetences() {
    const response = await client.get<Competence[]>('/competences')
    return response.data
  },

  async createCompetence(data: Omit<Competence, 'id'>) {
    const response = await client.post<Competence>('/competences', data)
    return response.data
  },

  async deleteCompetence(id: number) {
    await client.delete(`/competences/${id}`)
  },
}
