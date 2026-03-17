<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCandidatureStore } from '@/stores/candidatures';
import { ApiService } from '@/api/api.service';
import {
    Plus,
    Trash2,
    Briefcase,
    Loader2,
    AlertCircle
} from 'lucide-vue-next';

const store = useCandidatureStore();
const isSubmitting = ref(false);
const error = ref<string | null>(null);

const newPoste = ref({
    titre: '',
    description: '',
    competencesRequises: [] as string[]
});

const resetForm = () => {
    newPoste.value = {
        titre: '',
        description: '',
        competencesRequises: []
    };
};

const handleAddPoste = async () => {
    if (!newPoste.value.titre.trim()) return;

    isSubmitting.value = true;
    error.value = null;

    try {
        const response = await ApiService.createPoste(newPoste.value);
        store.postes.push(response);
        resetForm();
    } catch (err) {
        error.value = "Erreur lors de l'ajout du poste";
        console.error(err);
    } finally {
        isSubmitting.value = false;
    }
};

const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce poste ?')) return;

    try {
        await ApiService.deletePoste(id);
        store.postes = store.postes.filter(p => p.id !== id);
    } catch (err) {
        console.error(err);
    }
};

onMounted(() => {
    if (store.postes.length === 0) store.fetchMetadata();
    resetForm();
});
</script>

<template>
    <main class="p-6 sm:p-8 space-y-8 w-full">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Briefcase class="w-8 h-8 text-primary" />
                    Offres & Postes
                </h1>
                <p class="text-slate-500 dark:text-slate-400 font-medium font-inter mt-1">Définissez les postes ouverts
                    au recrutement.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <!-- Add Section -->
            <div
                class="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-24">
                <h3
                    class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <Plus class="w-5 h-5 text-primary" />
                    Nouveau poste
                </h3>

                <form @submit.prevent="handleAddPoste" class="space-y-4">
                    <div>
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Intitulé
                            du poste</label>
                        <input v-model="newPoste.titre" type="text" placeholder="Ex: Lead Developer Vue.js"
                            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-semibold text-slate-900 dark:text-white"
                            required />
                    </div>

                    <div>
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                        <textarea v-model="newPoste.description" rows="3" placeholder="Description brève du rôle..."
                            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-semibold resize-none text-slate-900 dark:text-white"></textarea>
                    </div>

                    <button type="submit" :disabled="isSubmitting || !newPoste.titre"
                        class="w-full py-3 bg-primary text-white font-black text-sm rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
                        <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                        <span v-else>Enregistrer le poste</span>
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
                <div v-for="poste in store.postes" :key="poste.id"
                    class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary/40 transition-all">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center gap-4">
                            <div
                                class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                                <Briefcase class="w-6 h-6" />
                            </div>
                            <div>
                                <h4 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {{ poste.titre }}</h4>
                                <p class="text-xs font-medium text-slate-400">ID: #{{ poste.id }}</p>
                            </div>
                        </div>

                        <button @click="handleDelete(poste.id!)" type="button"
                            class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                            <Trash2 class="w-5 h-5" />
                        </button>
                    </div>

                    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        {{ poste.description || "Aucune description fournie." }}
                    </p>

                    <div class="flex flex-wrap gap-2">
                        <span v-for="skill in poste.competencesRequises" :key="skill"
                            class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-black text-slate-500 rounded-lg">
                            {{ skill }}
                        </span>
                    </div>
                </div>

                <div v-if="store.postes.length === 0"
                    class="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                    <p class="text-sm font-medium italic">Aucun poste enregistré.</p>
                </div>
            </div>
        </div>
    </main>
</template>
