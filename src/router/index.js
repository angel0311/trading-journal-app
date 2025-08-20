import { createRouter, createWebHistory } from 'vue-router'
import TradeForm from '../views/TradeForm.vue'
import TradeList from '../views/TradeList.vue'

const routes = [
  {
    path: '/',
    name: 'tradeList',
    component: TradeList
  },
  {
    path: '/add',
    name: 'addTrade',
    component: TradeForm
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router