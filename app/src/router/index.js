import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import authRoutes from '@/modules/auth/router.js'
import authUtil from '@/modules/auth/util.js'

Vue.use(Router)


const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    ...authRoutes,
  ]
})


router.beforeEach((to, from, next) => {
  if (to.matched.every(authUtil.canAccess)) {
    next()
  }
  else {
    next({ name: 'Login' })
  }
})


export default router
