import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [

  {
    path: '/index',
    name: 'index',//与index无关
    component: () => import('../views/IndexView.vue'),
    // 将原本的页面定义为当前index页面的子页面
    children: [
      {
        path: '/warehouse',
        name: 'warehouse',//与index无关
        component: () => import('../views/WarehouseView.vue')
      },
      {
        path: '/warehousearea',
        name: 'warehousearea',//与index无关
        component: () => import('../views/WarehouseAreaView.vue')
      },
      {
        path: '/material',
        name: 'material',//与index无关
        component: () => import('../views/MaterialView.vue')
      },
      {
        path: '/waofwh',
        name: 'waofwh',//与index无关
        component: () => import('../views/WaOfWhView.vue')
      },
      {
        path: '/capacity',
        name: 'capacity',//与index无关
        component: () => import('../views/CapacityOfWhView.vue')
      },
      {
        path: '/input',
        name: 'input',//与index无关
        component: () => import('../views/InputRecordView.vue')
      },
      {
        path: '/output',
        name: 'output',//与index无关
        component: () => import('../views/OutputRecordView.vue')
      },
     
    ]
  },
  {
    path: '/register',
    name: 'register',//与index无关
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/login',
    name: 'login',//与index无关
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/',
    redirect: "login"
  }
]

const router = new VueRouter({
  routes
})

export default router
