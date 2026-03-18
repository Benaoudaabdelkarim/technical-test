<script setup lang="ts">
/**
 * Composant de liste des candidatures.
 * Gère l'affichage en grille, l'état vide (empty state) et la pagination.
 */
import { ref, computed } from 'vue';
import { useCandidatureStore } from '@/stores/candidatures';
import CandidatureCard from './CandidatureCard.vue';
import CandidatureDetail from './CandidatureDetail.vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const store = useCandidatureStore();

// État pour la gestion du panneau de détails (Detail View / Modal)
const selectedId = ref<number | null>(null);
const isDetailOpen = ref(false);

/**
 * Ouvre le panneau latéral avec les détails d'un candidat.
 */
const openDetails = (id: number) => {
    selectedId.value = id;
    isDetailOpen.value = true;
};

/**
 * Calcul du nombre total de pages pour la pagination.
 * Se base sur le nombre total d'items et la limite par page (par défaut 10).
 */
const totalPages = computed(() => Math.ceil(store.totalCandidatures / (store.filters._limit || 10)));

/**
 * Gère le changement de page.
 */
const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        store.setFilter('_page', page);
    }
};
</script>

<template>
    <div class="space-y-8">

        <!-- Grille de cartes : Responsive (1 col mobile, 2 tablettes, 3 desktops) -->
        <div v-if="store.candidatures.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CandidatureCard v-for="candidature in store.candidatures" :key="candidature.id" :candidature="candidature"
                @view-details="openDetails" />
        </div>

        <!-- État Vide : Affiché s'il n'y a aucun résultat après filtrage -->
        <div v-else-if="!store.isLoading" class="flex flex-col items-center justify-center py-20 text-center">
            <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Aucun résultat</h3>
            <p class="text-slate-500 dark:text-slate-400 mt-2">Essayez de modifier vos filtres ou votre recherche.</p>
        </div>

        <!-- Pagination : Affichée uniquement s'il y a plus d'une page -->
        <div v-if="totalPages > 1"
            class="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6">

            <!-- Informations de pagination -->
            <div class="text-sm text-slate-600 dark:text-slate-400">
                Affichage de <span class="font-medium text-slate-900 dark:text-white">
                    {{ ((store.filters._page || 1) - 1) * (store.filters._limit || 10) + 1 }}
                </span>
                à <span class="font-medium text-slate-900 dark:text-white">
                    {{ Math.min((store.filters._page || 1) * (store.filters._limit || 10), store.totalCandidatures) }}
                </span>
                sur <span class="font-medium text-slate-900 dark:text-white">{{ store.totalCandidatures }}</span>
                candidatures
            </div>

            <!-- Contrôles de navigation -->
            <div class="flex items-center gap-2">
                <button @click="changePage((store.filters._page || 1) - 1)" :disabled="(store.filters._page || 1) === 1"
                    class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft class="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>

                <div class="flex items-center gap-1">
                    <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                        class="w-10 h-10 rounded-lg text-sm font-medium transition-colors" :class="page === store.filters._page
                            ? 'bg-primary text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'">
                        {{ page }}
                    </button>
                </div>

                <button @click="changePage((store.filters._page || 1) + 1)"
                    :disabled="(store.filters._page || 1) === totalPages"
                    class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <ChevronRight class="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
            </div>
        </div>

        <!-- Panneau latéral de détail (chargé dynamiquement) -->
        <CandidatureDetail v-if="isDetailOpen" :id="selectedId!" @close="isDetailOpen = false" />
    </div>
</template>
