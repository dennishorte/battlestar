import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    game: null,
    ready: false,
    selectedCard: null,
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

    setSelectedCard(state, card) {
      state.selectedCard = card
    },
  },

  actions: {
    clickCard({ commit, state }, card) {
      if (state.selectedCard === null) {
        commit('setSelectedCard', card)
      }

      else if (state.selectedCard === card) {
        commit('setSelectedCard', null)
      }

      else {
        const destIndex = state.game.getZoneIndexByCard(card)
        state.game.aMoveCard(null, state.selectedCard.id, card.zone, destIndex)
        commit('setSelectedCard', null)
      }
    },

    clickZone({ commit, state }, zone) {
      if (state.selectedCard) {
        state.game.aMoveCard(null, state.selectedCard.id, zone.id, 0)
        commit('setSelectedCard', null)
      }
    },

    loadGame({ commit, rootGetters, rootState }, gameData) {
      commit('setReady', false)
      const actor = rootGetters['auth/user']
      const game = new mag.Magic(gameData, actor.name)
      game.cardLookup = rootState.magic.cards.lookup
      game.run()
      commit('setGame', game)
      commit('setReady', true)
    },
  },
}
