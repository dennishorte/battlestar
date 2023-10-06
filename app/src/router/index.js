import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/components/Home'
import Game from '@/components/Game'
import GameEditor from '@/modules/games/common/components/GameEditor'
import FileManagerTest from '@/components/filemanager/FileManagerTest'
import TyrantsTest from '@/modules/games/tyrants/components/hexmap/HexMap'

import adminRoutes from '@/modules/admin/router.js'
import authRoutes from '@/modules/auth/router.js'
import dataRoutes from '@/modules/data/router.js'
import lobbyRoutes from '@/modules/lobby/router.js'
import magicRoutes from '@/modules/magic/router.js'
import mapmakerRoutes from '@/modules/mapmaker/router.js'

import authUtil from '@/modules/auth/util.js'


const router = createRouter({
  history: createWebHistory(),
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
    {
      path: '/game/next',
      name: 'Next Game',
      component: Game,
    },
    {
      path: '/game/editor/:id',
      name: 'Game Editor',
      component: GameEditor,
    },
    {
      path: '/filemanager',
      name: 'File Manager Test',
      title: 'File Manager Test',
      component: FileManagerTest,
    },

    {
      path: '/tyrantstest',
      name: 'Tyrants Test',
      title: 'Tyrants Test',
      component: TyrantsTest,
    },

    ...adminRoutes,
    ...authRoutes,
    ...dataRoutes,
    ...lobbyRoutes,
    ...magicRoutes,
    ...mapmakerRoutes,
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
