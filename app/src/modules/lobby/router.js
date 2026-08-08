import GameLobby from './components/GameLobby.vue'
import lobbyUtil from './util'

export default [
  {
    path: '/lobby/create',
    name: 'Create Lobby',
    meta: { title: 'Lobby' },
    component: {
      async beforeRouteEnter(to, from, next) {
        const lobbyId = await lobbyUtil.create()
        next({ path: '/lobby/' + lobbyId })
      }
    }
  },
  {
    path: '/lobby/:id',
    name: 'GameLobby',
    meta: { title: 'Lobby' },
    component: GameLobby,
  },
]
