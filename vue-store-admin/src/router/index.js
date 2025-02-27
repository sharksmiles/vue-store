import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Layout from '../layout/Layout.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    redirect:'products',
    children: [
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/products/Index.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/orders/Index.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/users/Index.vue')
      }
    ]
  },
  {
    path: '*',
    redirect: '/products'
  }
]

const router = new VueRouter({
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 