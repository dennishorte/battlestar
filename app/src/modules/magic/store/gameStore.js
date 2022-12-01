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
        state.game.doFunc(null, {
          name: 'move card',
          cardId: state.selectedCard.id,
          destId: card.zone,
          destIndex: state.game.getZoneIndexByCard(card),
        })
        commit('setSelectedCard', null)
      }
    },

    clickZone({ commit, state }, zone) {
      if (state.selectedCard) {
        state.game.doFunc(null, {
          name: 'move card',
          cardId: state.selectedCard.id,
          destId: zone.id,
          destIndex: 0,
        })
        commit('setSelectedCard', null)
      }
    },

    loadGame({ commit, rootGetters, rootState }, { doFunc, gameData }) {
      commit('setReady', false)
      const actor = rootGetters['auth/user']
      const game = new mag.Magic(gameData, actor.name)
      game.cardLookupFunc = rootGetters['magic/cards/getLookupFunc']
      game.doFunc = doFunc
      game.run()

      commit('setGame', game)
      commit('setReady', true)
    },

    unselectCard({ commit }) {
      commit('setSelectedCard', null)
    },
  },
}
