import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

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
      component: DashboardView,
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
