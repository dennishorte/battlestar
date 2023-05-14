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
    loadGame({ commit, rootGetters, rootState }, { doFunc, gameData }) {
      commit('setReady', false)
      const actor = rootGetters['auth/user']
      const game = new mag.draft.cube.CubeDraft(gameData, actor.name)
      game.cardLookupFunc = rootGetters['magic/cards/getLookupFunc']
      game.doFunc = doFunc
      game.run()

      commit('setGame', game)
      commit('setReady', true)
    },
  },
}
