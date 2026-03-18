import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Candidature, Statut, Poste, Competence, ApiParams } from '@/types'
import { ApiService } from '@/api/api.service'

/**
 * Store principal pour la gestion des candidatures.
 * Utilise l'API Composition de Pinia pour une meilleure lisibilité.
 */
export const useCandidatureStore = defineStore('candidature', () => {
  // --- ÉTAT (STATE) ---
  const candidatures = ref<Candidature[]>([])
  const totalCandidatures = ref(0)
  const statuts = ref<Statut[]>([])
  const postes = ref<Poste[]>([])
  const competences = ref<Competence[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Paramètres de filtrage par défaut
  const filters = ref<ApiParams>({
    _page: 1,
    _limit: 10,
    _sort: 'dateCandidature',
    _order: 'desc',
    q: '',
    statut: '',
    poste: '',
  })

  // --- ACTIONS ---

  /**
   * Charge les candidatures depuis le serveur en appliquant les filtres actifs.
   * Inclus une logique de secours (fallback) pour la recherche plein texte si le serveur
   * ne supporte pas bien le paramètre 'q'.
   */
  const fetchCandidatures = async () => {
    isLoading.value = true
    error.value = null
    try {
      // On nettoie les filtres pour ne pas envoyer de valeurs vides à l'API
      const cleanFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([_, v]) => v !== '' && v !== null),
      )

      let { data, total } = await ApiService.getCandidatures(cleanFilters)

      // Fallback client-side search :
      // Si on a une requête 'q' mais que le serveur semble l'avoir ignorée (retourne trop de données),
      // on filtre manuellement côté client pour garantir une expérience utilisateur cohérente.
      if (filters.value.q) {
        const query = filters.value.q.toLowerCase()
        const filtered = data.filter(
          (c) =>
            c.nom.toLowerCase().includes(query) ||
            c.poste.toLowerCase().includes(query) ||
            c.competences.some((comp) => comp.toLowerCase().includes(query)),
        )

        if (filtered.length < data.length) {
          data = filtered
          total = filtered.length
        } else if (data.length === 0) {
          // Si 0 résultat, on tente une récupération globale et on filtre nous-mêmes
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

  /**
   * Charge les données de configuration (postes, statuts, compétences) en parallèle.
   */
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
      console.error('Échec lors du chargement des métadonnées', err)
    }
  }

  /**
   * Met à jour le statut d'une candidature.
   * On utilise ici une "mise à jour optimiste" pour que l'UI réagisse instantanément,
   * puis on annule si l'appel API échoue.
   */
  const updateCandidatureStatus = async (id: number, newStatut: string) => {
    const originalCandidatures = [...candidatures.value]
    const index = candidatures.value.findIndex((c) => String(c.id) === String(id))

    // Modification immédiate dans le store (UI réactive)
    if (index !== -1 && candidatures.value[index]) {
      candidatures.value[index].statut = newStatut
    }

    try {
      await ApiService.updateCandidature(id, { statut: newStatut })
    } catch (err) {
      // Rollback en cas d'erreur
      candidatures.value = originalCandidatures
      error.value = 'Échec de la mise à jour du statut sur le serveur'
    }
  }

  /**
   * Met à jour un filtre et déclenche une nouvelle recherche.
   * Remet automatiquement à la page 1 si un filtre métier change.
   */
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
