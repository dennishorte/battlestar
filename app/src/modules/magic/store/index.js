import cards from './cardStore.js'
import cube from './cubeStore.js'
import cubeDraft from './cubeDraftStore.js'
import dm from './deckManagerStore.js'
import game from './gameStore.js'

export default {
  namespaced: true,
  modules: {
    cards: cards,
    cube: cube,
    cubeDraft: cubeDraft,
    dm: dm,
    game: game,
  },

  state: () => ({
    mouseoverCard: null,
    mouseoverX: 0,
    mouseoverY: 0,

    users: [],
  }),

  mutations: {
    clearMouseoverCard(state) {
      state.mouseoverCard = null
    },

    setMouseoverCard(state, card) {
      state.mouseoverCard = card
    },

    setMouseoverPosition(state, { x, y }) {
      state.mouseoverX = x
      state.mouseoverY = y
    },

    unsetMouseoverCard(state, card) {
      if (state.mouseoverCard === card) {
        state.mouseoverCard = null
      }
    },
  },

  actions: {
    async loadUsers({ state }) {
      const { users } = await this.$post('/api/user/all')
      state.users = users
    },
  },
}
