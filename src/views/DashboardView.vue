<script setup lang="ts">
import { onMounted } from 'vue';
import { useCandidatureStore } from '@/stores/candidatures';
import FiltersBar from '@/components/FiltersBar.vue';
import CandidatureList from '@/components/CandidatureList.vue';
import { Loader2, Users } from 'lucide-vue-next';

const store = useCandidatureStore();

onMounted(() => {
  store.fetchMetadata();
  store.fetchCandidatures();
});
</script>

<template>
  <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 items-start gap-4">
      <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
        <Users class="w-8 h-8 text-primary" />
        Gestion des Candidatures
      </h1>
      <p class="text-slate-500 dark:text-slate-400 font-medium font-inter mt-1">
        Suivez et gérez vos talents en toute efficacité.
      </p>
    </div>

    <!-- Stats summary (Optional but nice) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Candidatures</p>
        <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ store.totalCandidatures }}</p>
      </div>
      <!-- Add more stats if needed -->
    </div>

    <div class="space-y-6">
      <FiltersBar />

      <div v-if="store.error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
        <p class="text-red-700 dark:text-red-400 text-sm font-medium">{{ store.error }}</p>
      </div>

      <div class="relative min-h-[400px]">
        <div v-if="store.isLoading"
          class="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
          <Loader2 class="w-8 h-8 animate-spin text-primary" />
        </div>

        <CandidatureList />
      </div>
    </div>
  </main>
</template>
