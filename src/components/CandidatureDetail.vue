<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCandidatureStore } from '@/stores/candidatures';
import { ApiService } from '@/api/api.service';
import type { Candidature } from '@/types';
import {
    X,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    Download,
    Send,
    Loader2,
    Briefcase,
    Quote
} from 'lucide-vue-next';

const props = defineProps<{
    id: number;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const store = useCandidatureStore();
const candidature = ref<Candidature | null>(null);
const isLoading = ref(true);
const newComment = ref('');
const isSubmitting = ref(false);

onMounted(async () => {
    try {
        candidature.value = await ApiService.getCandidatureById(props.id);
    } catch (err) {
        console.error(err);
    } finally {
        isLoading.value = false;
    }
});

const handleStatusChange = async (e: Event) => {
    const newStatus = (e.target as HTMLSelectElement).value;
    if (candidature.value) {
        const oldStatus = candidature.value.statut;
        candidature.value.statut = newStatus;
        try {
            await store.updateCandidatureStatus(props.id, newStatus);
        } catch {
            candidature.value.statut = oldStatus;
        }
    }
};

const addComment = async () => {
    if (!newComment.value.trim() || !candidature.value) return;

    isSubmitting.value = true;
    try {
        const comment = {
            id: Date.now(),
            auteur: "Marie Recruteuse",
            date: new Date().toISOString(),
            contenu: newComment.value.trim()
        };

        const updatedComments = [...(candidature.value.commentaires || []), comment];
        await ApiService.updateCandidature(props.id, { commentaires: updatedComments });
        candidature.value.commentaires = updatedComments;
        newComment.value = '';
    } catch (err) {
        console.error(err);
    } finally {
        isSubmitting.value = false;
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<template>
    <div class="fixed inset-0 z-[60] flex justify-end">
        <!-- Backdrop with fade transition -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            @click="emit('close')"></div>

        <!-- Drawer Content with slide transition -->
        <div
            class="relative w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 translate-x-0 animate-in slide-in-from-right">

            <!-- Drawer Header -->
            <div
                class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                <div v-if="candidature" class="flex items-center gap-4">
                    <div
                        class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl shadow-sm rotate-3">
                        {{ candidature.nom.charAt(0) }}
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ candidature.nom
                            }}</h2>
                        <div class="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <Briefcase class="w-3.5 h-3.5 text-primary" />
                            {{ candidature.poste }}
                        </div>
                    </div>
                </div>
                <button @click="emit('close')" type="button"
                    class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-red-500">
                    <X class="w-6 h-6" />
                </button>
            </div>

            <!-- Drawer Body -->
            <div class="grow overflow-y-auto custom-scrollbar">
                <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
                    <Loader2 class="w-12 h-12 animate-spin text-primary opacity-20" />
                    <p class="mt-4 text-slate-400 font-medium animate-pulse">Chargement du profil...</p>
                </div>

                <div v-else-if="candidature" class="p-8 space-y-10">
                    <!-- Information Sidebar Style Section -->
                    <div
                        class="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Statut
                                    de la Candidature</label>
                                <select :value="candidature.statut" @change="handleStatusChange"
                                    class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-bold transition-all cursor-pointer shadow-sm text-slate-900 dark:text-white">
                                    <option v-for="statut in store.statuts" :key="statut.id" :value="statut.nom">
                                        {{ statut.nom }}
                                    </option>
                                </select>
                            </div>
                            <div class="flex flex-col justify-end">
                                <a v-if="candidature.cv" :href="candidature.cv" target="_blank"
                                    class="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm">
                                    <Download class="w-3.5 h-3.5" />
                                    Consulter le CV
                                </a>
                            </div>
                        </div>

                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                            <div class="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <div class="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                    <Mail class="w-4 h-4 text-primary" />
                                </div>
                                <span class="text-sm font-medium truncate">{{ candidature.email }}</span>
                            </div>
                            <div class="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <div class="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                    <Phone class="w-4 h-4 text-primary" />
                                </div>
                                <span class="text-sm font-medium">{{ candidature.telephone }}</span>
                            </div>
                            <div class="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <div class="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                    <MapPin class="w-4 h-4 text-primary" />
                                </div>
                                <span class="text-sm font-medium">{{ candidature.localisation }}</span>
                            </div>
                            <div class="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <div class="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                    <DollarSign class="w-4 h-4 text-primary" />
                                </div>
                                <span class="text-sm font-medium">{{ candidature.salaireSouhaite.toLocaleString() }} € /
                                    an</span>
                            </div>
                        </div>
                    </div>

                    <!-- Letter Section -->
                    <section>
                        <div class="flex items-center gap-3 mb-6">
                            <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Motivations</h3>
                            <div class="h-px grow bg-slate-100 dark:bg-slate-800"></div>
                        </div>
                        <div
                            class="relative bg-primary/5 dark:bg-primary/10 p-8 rounded-3xl group transition-all duration-300 hover:bg-primary/[0.08]">
                            <Quote
                                class="absolute -top-3 -left-3 w-10 h-10 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                            <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                                "{{ candidature.lettreMotivation }}"
                            </p>
                        </div>
                    </section>

                    <!-- Skills Section -->
                    <section>
                        <div class="flex items-center gap-3 mb-6">
                            <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Compétences clés</h3>
                            <div class="h-px grow bg-slate-100 dark:bg-slate-800"></div>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="skill in candidature.competences" :key="skill"
                                class="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors cursor-default">
                                {{ skill }}
                            </span>
                        </div>
                    </section>

                    <!-- Timeline / Stats -->
                    <div class="grid grid-cols-2 gap-4">
                        <div
                            class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                            <p class="text-[10px] uppercase font-black text-slate-400 mb-1">Disponibilité</p>
                            <p class="text-sm font-bold text-slate-900 dark:text-white">{{ candidature.disponibilite }}
                            </p>
                        </div>
                        <div
                            class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                            <p class="text-[10px] uppercase font-black text-slate-400 mb-1">Expérience</p>
                            <p class="text-sm font-bold text-slate-900 dark:text-white">{{ (candidature as
                                any).experience || 'N/A' }}</p>
                        </div>
                    </div>

                    <!-- Comments Section -->
                    <section class="pb-10">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Historique des notes</h3>
                            <span
                                class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 rounded-md">{{
                                    candidature.commentaires?.length || 0 }}</span>
                        </div>

                        <div class="space-y-6">
                            <!-- Add Comment Input -->
                            <div
                                class="bg-white dark:bg-slate-800/50 ring-2 ring-slate-100 dark:ring-slate-700 p-4 rounded-3xl shadow-sm focus-within:ring-primary/40 transition-shadow">
                                <div class="flex gap-4">
                                    <div class="grow">
                                        <textarea v-model="newComment"
                                            placeholder="Ajouter une note ou un avis interne..."
                                            class="w-full p-2 bg-transparent outline-none text-sm transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                            rows="2"></textarea>
                                    </div>
                                    <button @click="addComment" type="button"
                                        :disabled="!newComment.trim() || isSubmitting"
                                        class="self-end p-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                                        <Send v-if="!isSubmitting" class="w-5 h-5" />
                                        <Loader2 v-else class="w-5 h-5 animate-spin" />
                                    </button>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div v-for="comment in candidature.commentaires?.slice().reverse()" :key="comment.id"
                                    class="p-5 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative group">
                                    <div class="flex justify-between items-start mb-3">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-7 h-7 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-[11px] uppercase font-black text-slate-500 shadow-sm">
                                                {{ comment.auteur.charAt(0) }}
                                            </div>
                                            <span class="font-black text-xs text-slate-900 dark:text-white">{{
                                                comment.auteur }}</span>
                                        </div>
                                        <span
                                            class="text-[10px] text-slate-400 font-bold uppercase tracking-tight bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700">{{
                                            formatDate(comment.date) }}</span>
                                    </div>
                                    <p
                                        class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-10 border-l-2 border-slate-100 dark:border-slate-700">
                                        {{ comment.contenu }}
                                    </p>
                                </div>

                                <div v-if="!candidature.commentaires?.length"
                                    class="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p class="text-slate-400 text-xs font-medium italic">Aucun commentaire pour le
                                        moment.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.2);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.5);
}

@keyframes slide-in-from-right {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}

.animate-in {
    animation-duration: 300ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-fill-mode: forwards;
}

.slide-in-from-right {
    animation-name: slide-in-from-right;
}
</style>
