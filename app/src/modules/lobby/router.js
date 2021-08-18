import Lobby from './view/Lobby'
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
    name: 'Lobby',
    title: 'Lobby',
    component: Lobby,
  },
]
