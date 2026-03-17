<script setup lang="ts">
import { Moon, Sun, Briefcase } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

const isDark = ref(false);

const toggleDark = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

const updateTheme = () => {
  if (typeof document !== 'undefined') {
    const el = document.documentElement;
    if (isDark.value) {
      el.classList.add('dark');
    } else {
      el.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
    <div class="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
          <Briefcase class="w-6 h-6 text-white" />
        </div>
        <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Talent<span class="text-primary">Flow</span>
        </span>
      </div>

      <div class="flex items-center gap-4">
        <button @click="toggleDark" type="button"
          class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all duration-300 ring-1 ring-slate-200 dark:ring-slate-700"
          aria-label="Toggle Dark Mode">
          <Sun v-if="isDark" class="w-5 h-5 transition-transform hover:rotate-45" />
          <Moon v-else class="w-5 h-5 transition-transform hover:-rotate-12" />
        </button>

        <div class="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div
            class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-800">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
          <span class="hidden sm:inline text-sm font-semibold text-slate-700 dark:text-slate-300">Marie
            R.</span>
        </div>
      </div>
    </div>
  </nav>
</template>
