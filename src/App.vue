<script setup lang="ts">
/**
 * Racine de l'application (Layout Principal).
 * Structure la page avec une barre de navigation, une barre latérale et la vue Router.
 */
import { RouterView } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import TheSidebar from './components/TheSidebar.vue'
</script>

<template>
  <!-- Conteneur principal avec support du mode sombre -->
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

    <!-- Barre de navigation supérieure (Navbar) -->
    <TheNavbar />

    <!-- Barre de navigation latérale (Sidebar) -->
    <TheSidebar />

    <!-- Contenu principal repoussé par la sidebar sur Desktop -->
    <div class="lg:pl-64 flex flex-col pt-16 h-full">
      <RouterView />
    </div>
  </div>
</template>

<style>
/*
Note : Le style global est géré via Tailwind 4 et importé dans main.ts.
On utilise ici une structure simple sans styles spécifiques à ce composant.
*/
</style>
