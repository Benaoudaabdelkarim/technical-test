<script setup lang="ts">
import type { Candidature } from '@/types';
import { useCandidatureStore } from '@/stores/candidatures';
import { Calendar, MapPin, Briefcase, Eye } from 'lucide-vue-next';

defineProps<{
    candidature: Candidature;
}>();

const emit = defineEmits<{
    (e: 'view-details', id: number): void;
}>();

const store = useCandidatureStore();

const getStatusColor = (statutNom: string) => {
    const statut = store.statuts.find(s => s.nom === statutNom);
    return statut?.couleur || '#94a3b8';
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};
</script>

<template>
    <div
        class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ candidature.nom }}</h3>
                    <p class="text-sm text-primary font-medium flex items-center gap-1 mt-1">
                        <Briefcase class="w-3.5 h-3.5" />
                        {{ candidature.poste }}
                    </p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                    :style="{ backgroundColor: getStatusColor(candidature.statut) }">
                    {{ candidature.statut }}
                </span>
            </div>

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

            <div class="flex flex-wrap gap-1.5 mb-6">
                <span v-for="skill in candidature.competences.slice(0, 3)" :key="skill"
                    class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">
                    {{ skill }}
                </span>
                <span v-if="candidature.competences.length > 3" class="text-xs text-slate-400 font-medium self-center">
                    +{{ candidature.competences.length - 3 }}
                </span>
            </div>

            <button @click="emit('view-details', candidature.id)" type="button"
                class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                <Eye class="w-4 h-4" />
                Voir le profil
            </button>
        </div>
    </div>
</template>
