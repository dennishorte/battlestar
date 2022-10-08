import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Game from '@/components/Game'

import adminRoutes from '@/modules/admin/router.js'
import authRoutes from '@/modules/auth/router.js'
import dataRoutes from '@/modules/data/router.js'
import lobbyRoutes from '@/modules/lobby/router.js'
import mapmakerRoutes from '@/modules/mapmaker/router.js'

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
    {
      path: '/game/:id',
      name: 'game',
      component: Game,
    },
    ...mapmakerRoutes,
    ...adminRoutes,
    ...authRoutes,
    ...dataRoutes,
    ...lobbyRoutes,
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
