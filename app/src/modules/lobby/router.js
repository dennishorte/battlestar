import GameLobby from './components/GameLobby.vue'
import lobbyUtil from './util'

export default [
  {
    path: '/lobby/create',
    name: 'Create Lobby',
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
    title: 'Lobby',
    component: GameLobby,
  },
]
