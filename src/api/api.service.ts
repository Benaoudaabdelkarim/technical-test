import axios from 'axios'
import type { Candidature, Statut, Poste, Competence, ApiParams } from '@/types'

const API_BASE_URL = 'http://localhost:3000'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const ApiService = {
  // Candidatures
  async getCandidatures(params: ApiParams = {}) {
    const transformedParams: Record<string, unknown> = { ...params }

    // JSON Server v1.0+ compatibility
    // If we have _limit, convert it to _per_page and delete _limit
    if (transformedParams._limit) {
      transformedParams._per_page = transformedParams._limit
      delete transformedParams._limit
    }

    // If we have _sort and _order, convert it to the new -key format and delete _order
    if (transformedParams._sort) {
      if (transformedParams._order === 'desc') {
        transformedParams._sort = `-${transformedParams._sort}`
      }
      delete transformedParams._order
    }

    const response = await client.get<unknown>('/candidatures', { params: transformedParams })

    // Handle both array (v0.x) and object (v1.x) responses
    if (Array.isArray(response.data)) {
      const data = response.data as Candidature[]
      // In v0.x, total is in x-total-count header
      // In v1.x unpaginated, it's just the length
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

  async getCandidatureById(id: number) {
    const response = await client.get<Candidature>(`/candidatures/${id}?_embed=commentaires`)
    return response.data
  },

  async updateCandidature(id: number, data: Partial<Candidature>) {
    const response = await client.patch<Candidature>(`/candidatures/${id}`, data)
    return response.data
  },

  async deleteCandidature(id: number) {
    await client.delete(`/candidatures/${id}`)
  },

  // Statuts, Postes, Competences
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
