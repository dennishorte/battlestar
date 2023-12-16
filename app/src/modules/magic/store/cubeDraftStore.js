import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    game: null,
    ready: false,
  }),

  getters: {
  },

  mutations: {
    setGame(state, game) {
      state.game = game
    },

    setReady(state, value) {
      state.ready = value
    },
  },

  actions: {
    loadGame({ commit, rootGetters, rootState }, { doFunc, game }) {
      commit('setReady', false)

      game.cardLookupFunc = rootGetters['magic/cards/getLookupFunc']
      game.doFunc = doFunc
      game.run()

      commit('setGame', game)
      commit('setReady', true)
    },
  },
}
