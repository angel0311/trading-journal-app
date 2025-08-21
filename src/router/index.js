import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TradeForm from '../views/TradeForm.vue'
import TradeList from '../views/TradeList.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/trades',
    name: 'tradeList',
    component: TradeList
  },
  {
    path: '/add',
    name: 'addTrade',
    component: TradeForm
  },
    {
    path: '/about',
    name: 'aboutView',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router