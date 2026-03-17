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
      // Create clean filters for the API
      const cleanFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([_, v]) => v !== '' && v !== null),
      )

      // Get data from API
      // Note: If q is broken in the backend (json-server v1.0 beta),
      // it might return 0 results or ignore it.
      let { data, total } = await ApiService.getCandidatures(cleanFilters)

      // Client-side search fallback
      // If q is present, we check if the results are actually filtered.
      // If the server ignored q, it will return more items than expected.
      // If the server doesn't support q, we might want to fetch without q and filter here.
      if (filters.value.q) {
        const query = filters.value.q.toLowerCase()
        const filtered = data.filter(
          (c) =>
            c.nom.toLowerCase().includes(query) ||
            c.poste.toLowerCase().includes(query) ||
            c.competences.some((comp) => comp.toLowerCase().includes(query)),
        )

        // If the server ignored the q filter (returned unfiltered data),
        // we use our filtered version.
        if (filtered.length < data.length) {
          data = filtered
          total = filtered.length
        }
        // If the server returned 0 results but we have q,
        // it might be because q is broken in the backend.
        else if (data.length === 0) {
          // Optional: Retry without q and filter client-side
          const filtersWithoutQ = { ...cleanFilters }
          delete filtersWithoutQ.q
          const retry = await ApiService.getCandidatures(filtersWithoutQ)
          const refiltered = retry.data.filter(
            (c) =>
              c.nom.toLowerCase().includes(query) ||
              c.poste.toLowerCase().includes(query) ||
              c.competences.some((comp) => comp.toLowerCase().includes(query)),
          )
          data = refiltered
          total = refiltered.length
        }
      }

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
    const index = candidatures.value.findIndex((c) => String(c.id) === String(id))
    if (index !== -1 && candidatures.value[index]) {
      candidatures.value[index].statut = newStatut
    }

    try {
      await ApiService.updateCandidature(id, { statut: newStatut })
    } catch (err) {
      candidatures.value = originalCandidatures
      error.value = 'Échec de la mise à jour du statut'
    }
  }

  const setFilter = (key: keyof ApiParams, value: string | number | null | undefined) => {
    filters.value[key] = value as never
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
