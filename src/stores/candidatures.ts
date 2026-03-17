import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Candidature, Statut, Poste, Competence, ApiParams } from '@/types'
import { ApiService } from '@/api/api.service'

export const useCandidatureStore = defineStore('candidature', () => {
  const candidatures = ref<Candidature[]>([])
  const totalCandidatures = ref(0)
  const statuts = ref<Statut[]>([])
  const postes = ref<Poste[]>([])
  const competences = ref<Competence[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const filters = ref<ApiParams>({
    _page: 1,
    _limit: 10,
    _sort: 'dateCandidature',
    _order: 'desc',
    q: '',
    statut: '',
    poste: '',
  })

  const fetchCandidatures = async () => {
    isLoading.value = true
    error.value = null
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([_, v]) => v !== '' && v !== null),
      )
      const { data, total } = await ApiService.getCandidatures(cleanFilters)
      candidatures.value = data
      totalCandidatures.value = total
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Une erreur est survenue'
      error.value = errorMsg
    } finally {
      isLoading.value = false
    }
  }

  const fetchMetadata = async () => {
    try {
      const [s, p, c] = await Promise.all([
        ApiService.getStatuts(),
        ApiService.getPostes(),
        ApiService.getCompetences(),
      ])
      statuts.value = s
      postes.value = p
      competences.value = c
    } catch (err) {
      console.error('Failed to fetch metadata', err)
    }
  }

  const updateCandidatureStatus = async (id: number, newStatut: string) => {
    // Optimistic update
    const originalCandidatures = [...candidatures.value]
    const index = candidatures.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      candidatures.value[index].statut = newStatut
    }

    try {
      await ApiService.updateCandidature(id, { statut: newStatut })
    } catch (err) {
      candidatures.value = originalCandidatures
      error.value = 'Échec de la mise à jour du statut'
    }
  }

  const setFilter = (key: keyof ApiParams, value: any) => {
    filters.value[key] = value
    if (key !== '_page') {
      filters.value._page = 1
    }
    fetchCandidatures()
  }

  return {
    candidatures,
    totalCandidatures,
    statuts,
    postes,
    competences,
    isLoading,
    error,
    filters,
    fetchCandidatures,
    fetchMetadata,
    updateCandidatureStatus,
    setFilter,
  }
})
