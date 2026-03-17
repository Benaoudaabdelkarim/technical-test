<script setup lang="ts">
import {
  Users,
  Settings2,
  Briefcase,
  Code2,
  ChevronRight
} from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const route = useRoute();

const navigation = [
  { name: 'Candidatures', href: '/candidatures', icon: Users },
  { name: 'Statuts', href: '/statuts', icon: Settings2 },
  { name: 'Postes', href: '/postes', icon: Briefcase },
  { name: 'Compétences', href: '/competences', icon: Code2 },
];
</script>

<template>
  <aside
    class="hidden lg:flex w-64 flex-col fixed inset-y-0 pt-16 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30 transition-colors duration-300">
    <div class="grow flex flex-col pt-5 pb-4 overflow-y-auto">
      <nav class="mt-5 flex-1 px-3 space-y-1">
        <router-link v-for="item in navigation" :key="item.name" :to="item.href"
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200" :class="[
            route.path.startsWith(item.href)
              ? 'bg-primary/10 text-primary dark:bg-primary/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          ]">
          <component :is="item.icon" class="mr-3 shrink-0 h-5 w-5 transition-transform duration-200" :class="[
            route.path.startsWith(item.href) ? 'text-primary scale-110' : 'text-slate-400 group-hover:text-slate-500'
          ]" />
          <span class="flex-1">{{ item.name }}</span>
          <ChevronRight v-if="route.path.startsWith(item.href)" class="ml-auto w-4 h-4 text-primary opacity-50" />
        </router-link>
      </nav>
    </div>

    <!-- Footer Section -->
    <div class="p-4 border-t border-slate-200 dark:border-slate-800">
      <div class="px-3 py-2 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <div
          class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-800">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marie" alt="Marie" />
        </div>
        <div class="grow overflow-hidden">
          <p class="text-xs font-bold text-slate-900 dark:text-white truncate">Marie Recu...</p>
          <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Recruteur Pro
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
