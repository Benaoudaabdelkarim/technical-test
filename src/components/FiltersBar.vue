<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCandidatureStore } from '@/stores/candidatures';
import { Search, X } from 'lucide-vue-next';

const store = useCandidatureStore();
const searchQuery = ref(store.filters.q || '');

// Debounced search
let timeout: ReturnType<typeof setTimeout>;
watch(searchQuery, (newVal) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        store.setFilter('q', newVal);
    }, 300);
});

const clearFilters = () => {
    searchQuery.value = '';
    store.setFilter('q', '');
    store.setFilter('statut', '');
    store.setFilter('poste', '');
};

const hasActiveFilters = () => {
    return store.filters.q || store.filters.statut || store.filters.poste;
};
</script>

<template>
    <div
        class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div class="flex flex-col md:flex-row gap-4">
            <!-- Search Input -->
            <div class="relative grow">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input v-model="searchQuery" type="text" placeholder="Rechercher un candidat, un poste..."
                    class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white" />
            </div>

            <!-- Status Filter -->
            <div class="w-full md:w-48">
                <select :value="store.filters.statut"
                    @change="(e) => store.setFilter('statut', (e.target as HTMLSelectElement).value)"
                    class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white appearance-none cursor-pointer">
                    <option value="">Tous les statuts</option>
                    <option v-for="statut in store.statuts" :key="statut.id" :value="statut.nom">
                        {{ statut.nom }}
                    </option>
                </select>
            </div>

            <!-- Poste Filter -->
            <div class="w-full md:w-64">
                <select :value="store.filters.poste"
                    @change="(e) => store.setFilter('poste', (e.target as HTMLSelectElement).value)"
                    class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white appearance-none cursor-pointer">
                    <option value="">Tous les postes</option>
                    <option v-for="poste in store.postes" :key="poste.id" :value="poste.titre">
                        {{ poste.titre }}
                    </option>
                </select>
            </div>

            <!-- Clear Button -->
            <button v-if="hasActiveFilters()" @click="clearFilters"
                class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X class="w-4 h-4" />
                Réinitialiser
            </button>
        </div>
    </div>
</template>
