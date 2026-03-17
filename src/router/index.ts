import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/candidatures',
    },
    {
      path: '/candidatures',
      name: 'candidatures',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/statuts',
      name: 'statuts',
      component: () => import('../views/StatutsView.vue'),
    },
    {
      path: '/postes',
      name: 'postes',
      component: () => import('../views/PostesView.vue'),
    },
    {
      path: '/competences',
      name: 'competences',
      component: () => import('../views/CompetencesView.vue'),
    },
  ],
})

export default router
