import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/warehouse',
    name: 'warehouse',//与index无关
    component: () => import('../views/WarehouseView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
