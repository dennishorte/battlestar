import cards from './cardStore.js'
import cube from './cubeStore.js'
import dm from './deckManagerStore.js'
import file from './fileStore.js'

export default {
  namespaced: true,
  modules: {
    cards: cards,
    cube: cube,
    dm: dm,
    file: file,
  },

  state: () => ({
    mouseoverCard: null,
    mouseoverX: 0,
    mouseoverY: 0,
  }),

  mutations: {
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
}
