import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      admin: true,
      control: true,
      seller: true
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "about" */ '../components/User.vue'),
    meta: {
      admin: true
    }
  },
  {
    path: '/my-profile',
    name: 'my-profile',
    component: () => import(/* webpackChunkName: "about" */ '../components/currentUser.vue'),
    meta: {
      free: true
    }
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import(/* webpackChunkName: "about" */ '../components/Customer.vue'),
    meta: {
      admin: true,
      seller: true
    }
  },
  {
    path: '/providers',
    name: 'providers',
    component: () => import(/* webpackChunkName: "about" */ '../components/Provider.vue'),
    meta: {
      admin: true,
      seller: true
    }
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import(/* webpackChunkName: "about" */ '../components/Category.vue'),
    meta: {
      admin: true,
      control: true
    }
  },
  {
    path: '/products',
    name: 'products',
    component: () => import(/* webpackChunkName: "about" */ '../components/Product.vue'),
    meta: {
      admin: true,
      control: true
    }
  },
  {
    path: '/entries',
    name: 'entries',
    component: () => import(/* webpackChunkName: "about" */ '../components/Entry.vue'),
    meta: {
      admin: true,
      control: true
    }
  },
  {
    path: '/sales',
    name: 'sales',
    component: () => import(/* webpackChunkName: "about" */ '../components/Sale.vue'),
    meta: {
      admin: true,
      seller: true
    }
  },
  {
    path: '/statics/sales',
    name: 'statics-sales',
    component: () => import(/* webpackChunkName: "about" */ '../components/SalesChart.vue'),
    meta: {
      admin: true,
      seller: true
    }
  },
  {
    path: '/statics/entries',
    name: 'statics-entries',
    component: () => import(/* webpackChunkName: "about" */ '../components/EntriesChart.vue'),
    meta: {
      admin: true,
      seller: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue'),
    meta: {
      free: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Verificar acceso a las rutas
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.free)){
    next();
  } else if(store.state.user && store.state.user.rol == 'admin') {
    if(to.matched.some(record => record.meta.admin)){
      next();
    }
  } else if(store.state.user && store.state.user.rol == 'seller') {
    if(to.matched.some(record => record.meta.seller)){
      next();
    }
  } else if(store.state.user && store.state.user.rol == 'control') {
    if(to.matched.some(record => record.meta.control)){
      next();
    }
  } else {
    next({name: 'login'})
  }
})

export default router
