import cards from './cardStore.js'
import cube from './cubeStore.js'
import cubeDraft from './cubeDraftStore.js'
import game from './gameStore.js'

export default {
  namespaced: true,
  modules: {
    cards: cards,
    cube: cube,
    cubeDraft: cubeDraft,
    game: game,
  },

  state: () => ({
    mouseoverCard: null,
    mouseoverX: 0,
    mouseoverY: 0,

    users: [],

    loadingCards: true,
    loadingUsers: true,
  }),

  getters: {
    ready(state) {
      return !state.loadingCards && !state.loadingUsers
    },
  },

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
    async loadCards({ dispatch, state }) {
      state.loadingCards = true
      await dispatch('cards/ensureLoaded')
      state.loadingCards = false
    },

    async loadUsers({ state }) {
      state.loadingUsers = true
      const { users } = await this.$post('/api/user/all')
      state.users = users
      state.loadingUsers = false
    },
  },
}
