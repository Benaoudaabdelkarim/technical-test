<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCandidatureStore } from '@/stores/candidatures';
import { ApiService } from '@/api/api.service';
import {
    Plus,
    Trash2,
    Code2,
    Loader2,
    AlertCircle
} from 'lucide-vue-next';

const store = useCandidatureStore();
const isSubmitting = ref(false);
const error = ref<string | null>(null);

const newCompetence = ref({
    nom: '',
    categorie: 'Frontend'
});

const categories = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Design', 'Autre'];

const resetForm = () => {
    newCompetence.value = {
        nom: '',
        categorie: 'Frontend'
    };
};

const handleAddCompetence = async () => {
    if (!newCompetence.value.nom.trim()) return;

    isSubmitting.value = true;
    error.value = null;

    try {
        const response = await ApiService.createCompetence(newCompetence.value);
        store.competences.push(response);
        resetForm();
    } catch (err) {
        error.value = "Erreur lors de l'ajout de la compétence";
        console.error(err);
    } finally {
        isSubmitting.value = false;
    }
};

const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return;

    try {
        await ApiService.deleteCompetence(id);
        store.competences = store.competences.filter(c => c.id !== id);
    } catch (err) {
        console.error(err);
    }
};

onMounted(() => {
    if (store.competences.length === 0) store.fetchMetadata();
    resetForm();
});
</script>

<template>
    <main class="p-6 sm:p-8 space-y-8 w-full">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Code2 class="w-8 h-8 text-primary" />
                    Stack Technique
                </h1>
                <p class="text-slate-500 dark:text-slate-400 font-medium font-inter mt-1">Gérez le référentiel de
                    compétences pour vos profils.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <!-- Add Section -->
            <div
                class="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-24">
                <h3
                    class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <Plus class="w-5 h-5 text-primary" />
                    Ajouter une compétence
                </h3>

                <form @submit.prevent="handleAddCompetence" class="space-y-4">
                    <div>
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nom
                            de la compétence</label>
                        <input v-model="newCompetence.nom" type="text" placeholder="Ex: GraphQL, Kubernetes..."
                            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-semibold text-slate-900 dark:text-white"
                            required />
                    </div>

                    <div>
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Catégorie</label>
                        <select v-model="newCompetence.categorie"
                            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-semibold cursor-pointer text-slate-900 dark:text-white">
                            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                    </div>

                    <button type="submit" :disabled="isSubmitting || !newCompetence.nom"
                        class="w-full py-3 bg-primary text-white font-black text-sm rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
                        <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                        <span v-else>Ajouter au référentiel</span>
                    </button>

                    <div v-if="error"
                        class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold">
                        <AlertCircle class="w-4 h-4" />
                        {{ error }}
                    </div>
                </form>
            </div>

            <!-- List Section -->
            <div class="lg:col-span-2 space-y-12">
                <div v-for="cat in categories" :key="cat" class="space-y-4">
                    <template v-if="store.competences.some(c => c.categorie === cat)">
                        <div class="flex items-center gap-3">
                            <h4 class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                {{ cat }}</h4>
                            <div class="h-px grow bg-slate-100 dark:bg-slate-800"></div>
                        </div>

                        <div class="flex flex-wrap gap-3">
                            <div v-for="comp in store.competences.filter(c => c.categorie === cat)" :key="comp.id"
                                class="flex items-center gap-3 pl-4 pr-2 py-2.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-primary/50 transition-all">
                                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ comp.nom }}</span>
                                <button @click="handleDelete(comp.id!)" type="button"
                                    class="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                                    <Trash2 class="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </template>
                </div>

                <div v-if="store.competences.length === 0"
                    class="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                    <p class="text-sm font-medium italic">Aucune compétence référencée.</p>
                </div>
            </div>
        </div>
    </main>
</template>
