import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/components/HomePage.vue'
import GameBase from '@/components/GameBase.vue'
import GameEditor from '@/modules/games/common/components/GameEditor.vue'

import adminRoutes from '@/modules/admin/router.js'
import authRoutes from '@/modules/auth/router.js'
import dataRoutes from '@/modules/data/router.js'
import lobbyRoutes from '@/modules/lobby/router.js'
import magicRoutes from '@/modules/magic/router.js'
import mapmakerRoutes from '@/modules/mapmaker/router.js'
import profileRoutes from '@/modules/profile/router.js'

import authUtil from '@/modules/auth/util.js'


const APP_TITLE = 'Game Center'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/game/:id',
      name: 'game',
      meta: { title: 'Game' },
      component: GameBase,
    },
    {
      path: '/game/editor/:id',
      name: 'Game Editor',
      meta: { title: 'Game Editor' },
      component: GameEditor,
    },

    ...adminRoutes,
    ...authRoutes,
    ...dataRoutes,
    ...lobbyRoutes,
    ...magicRoutes,
    ...mapmakerRoutes,
    ...profileRoutes,
  ]
})


router.beforeEach((to, from, next) => {
  if (to.matched.every(authUtil.canAccess)) {
    next()
  }
  else {
    next({ name: 'SiteLogin' })
  }
})

router.afterEach((to) => {
  const pageTitle = [...to.matched]
    .reverse()
    .find(record => record.meta?.title)
    ?.meta
    .title

  document.title = pageTitle ? `${APP_TITLE} | ${pageTitle}` : APP_TITLE
})


export default router
