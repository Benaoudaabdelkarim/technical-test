<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import TheSidebar from './components/TheSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <TheNavbar />
    <TheSidebar />
    <div class="lg:pl-64 flex flex-col pt-16 h-full">
      <RouterView />
    </div>
  </div>
</template>

<style>
/* Style is already imported in main.ts */
</style>
