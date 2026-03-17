<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCandidatureStore } from '@/stores/candidatures';
import { ApiService } from '@/api/api.service';
import {
    Plus,
    Trash2,
    Settings2,
    Loader2,
    AlertCircle
} from 'lucide-vue-next';

const store = useCandidatureStore();
const isSubmitting = ref(false);
const error = ref<string | null>(null);

const newStatut = ref({
    nom: '',
    couleur: '#3b82f6',
    ordre: 1
});

const resetForm = () => {
    newStatut.value = {
        nom: '',
        couleur: '#3b82f6',
        ordre: (store.statuts.length > 0 ? Math.max(...store.statuts.map(s => s.ordre)) + 1 : 1)
    };
};

const handleAddStatut = async () => {
    if (!newStatut.value.nom.trim()) return;

    isSubmitting.value = true;
    error.value = null;

    try {
        const response = await ApiService.createStatut(newStatut.value);
        store.statuts.push(response);
        resetForm();
    } catch (err) {
        error.value = "Erreur lors de l'ajout du statut";
        console.error(err);
    } finally {
        isSubmitting.value = false;
    }
};

const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce statut ?')) return;

    try {
        await ApiService.deleteStatut(id);
        store.statuts = store.statuts.filter(s => s.id !== id);
    } catch (err) {
        console.error(err);
    }
};

onMounted(() => {
    if (store.statuts.length === 0) store.fetchMetadata();
    resetForm();
});
</script>

<template>
    <main class="p-6 sm:p-8 space-y-8 w-full">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Settings2 class="w-8 h-8 text-primary" />
                    Gestion des Statuts
                </h1>
                <p class="text-slate-500 dark:text-slate-400 font-medium font-inter mt-1">Configurez les étapes de votre
                    tunnel de recrutement.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <!-- Add Section -->
            <div
                class="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-24">
                <h3
                    class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <Plus class="w-5 h-5 text-primary" />
                    Ajouter un statut
                </h3>

                <form @submit.prevent="handleAddStatut" class="space-y-4">
                    <div>
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nom
                            du statut</label>
                        <input v-model="newStatut.nom" type="text" placeholder="Ex: Entretien Final"
                            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-semibold text-slate-900 dark:text-white"
                            required />
                    </div>

                    <div>
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Couleur</label>
                        <div class="flex items-center gap-3">
                            <input v-model="newStatut.couleur" type="color"
                                class="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" />
                            <input v-model="newStatut.couleur" type="text"
                                class="grow px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs font-mono text-slate-900 dark:text-white" />
                        </div>
                    </div>

                    <div>
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Ordre
                            d'affichage</label>
                        <input v-model.number="newStatut.ordre" type="number"
                            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-semibold text-slate-900 dark:text-white"
                            required />
                    </div>

                    <button type="submit" :disabled="isSubmitting || !newStatut.nom"
                        class="w-full py-3 bg-primary text-white font-black text-sm rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
                        <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                        <span v-else>Créer le statut</span>
                    </button>

                    <div v-if="error"
                        class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold">
                        <AlertCircle class="w-4 h-4" />
                        {{ error }}
                    </div>
                </form>
            </div>

            <!-- List Section -->
            <div class="lg:col-span-2 space-y-4">
                <div v-for="statut in store.statuts.sort((a, b) => a.ordre - b.ordre)" :key="statut.id"
                    class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary/30 transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                            :style="{ backgroundColor: statut.couleur }">
                            {{ statut.ordre }}
                        </div>
                        <div>
                            <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{
                                statut.nom }}</h4>
                            <p class="text-[10px] font-mono text-slate-400">{{ statut.couleur }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button @click="handleDelete(statut.id!)" type="button"
                            class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div v-if="store.statuts.length === 0"
                    class="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                    <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <Settings2 class="w-8 h-8 opacity-20" />
                    </div>
                    <p class="text-sm font-medium italic">Aucun statut configuré.</p>
                </div>
            </div>
        </div>
    </main>
</template>
