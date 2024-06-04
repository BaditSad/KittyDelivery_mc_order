import { createRouter, createWebHistory } from 'vue-router'
import CommercialPage from '../components/CommercialPage.vue'
import AccountsPage from '../components/AccountsPage.vue'
import DashboardPage from '../components/DashboardPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/commercial'
  },
  {
    path: '/commercial',
    name: 'commercial',
    component: CommercialPage
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: AccountsPage
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
