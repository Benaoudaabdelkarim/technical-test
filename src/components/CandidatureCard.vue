<script setup lang="ts">
/**
 * Carte de candidature individuelle.
 * Affiche les informations clés d'un candidat dans un format compact.
 */
import type { Candidature } from '@/types';
import { useCandidatureStore } from '@/stores/candidatures';
import { Calendar, MapPin, Briefcase, Eye } from 'lucide-vue-next';

// Définition des props : on attend un objet candidature complet.
defineProps<{
  candidature: Candidature;
}>();

// Définition des événements : on notifie quand l'utilisateur veut voir plus de détails.
const emit = defineEmits<{
  (e: 'view-details', id: number): void;
}>();

const store = useCandidatureStore();

/**
 * Récupère la couleur associée à un statut depuis le store global.
 * Si le statut n'est pas trouvé (peu probable), on met une couleur grise par défaut.
 */
const getStatusColor = (statutNom: string) => {
  const statut = store.statuts.find(s => s.nom === statutNom);
  return statut?.couleur || '#94a3b8';
};

/**
 * Formate la date ISO en format français lisible (ex: 15 mars 2024).
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
</script>

<template>
  <!-- Conteneur principal avec hover effect pour une sensation "Premium" -->
  <div
    class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
    <div class="p-6">
      <!-- Entête : Nom, Poste et Badge de Statut -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ candidature.nom }}</h3>
          <p class="text-sm text-primary font-medium flex items-center gap-1 mt-1">
            <Briefcase class="w-3.5 h-3.5" />
            {{ candidature.poste }}
          </p>
        </div>
        <!-- Badge dynamique basé sur la couleur du statut -->
        <span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
          :style="{ backgroundColor: getStatusColor(candidature.statut) }">
          {{ candidature.statut }}
        </span>
      </div>

      <!-- Infos secondaires : Localisation et Date -->
      <div class="space-y-2 mb-6">
        <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <MapPin class="w-4 h-4" />
          {{ candidature.localisation }}
        </div>
        <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Calendar class="w-4 h-4" />
          Postulé le {{ formatDate(candidature.dateCandidature) }}
        </div>
      </div>

      <!-- Tags de compétences (limités aux 3 premiers pour ne pas surcharger la vue) -->
      <div class="flex flex-wrap gap-1.5 mb-6">
        <span v-for="skill in candidature.competences.slice(0, 3)" :key="skill"
          class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">
          {{ skill }}
        </span>
        <!-- Indique s'il y a d'autres compétences non affichées -->
        <span v-if="candidature.competences.length > 3" class="text-xs text-slate-400 font-medium self-center">
          +{{ candidature.competences.length - 3 }}
        </span>
      </div>

      <!-- Bouton d'action pour ouvrir le panneau de détails -->
      <button @click="emit('view-details', candidature.id)" type="button"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
        <Eye class="w-4 h-4" />
        Voir le profil
      </button>
    </div>
  </div>
</template>
