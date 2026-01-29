import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/components/HomePage.vue'
import GameBase from '@/components/GameBase.vue'
import GameEditor from '@/modules/games/common/components/GameEditor.vue'

import TyrantsTileEditor from '@/modules/games/tyrants/components/tileEditor/TileEditor.vue'
import TyrantsTest from '@/modules/games/tyrants/components/hexmap/HexMap.vue'

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
      component: HomePage,
    },
    {
      path: '/game/:id',
      name: 'game',
      component: GameBase,
    },
    {
      path: '/game/editor/:id',
      name: 'Game Editor',
      component: GameEditor,
    },
    {
      path: '/tyrants/test',
      name: 'Tyrants Test',
      title: 'Tyrants Test',
      component: TyrantsTest,
    },
    {
      path: '/tyrants/tile_editor',
      name: 'Tyrants Tile Editor',
      title: 'Tyrants Tile Editor',
      component: TyrantsTileEditor,
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
    next({ name: 'SiteLogin' })
  }
})


export default router
