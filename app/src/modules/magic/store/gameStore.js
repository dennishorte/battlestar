import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    game: null,
    ready: false,
    selectedCard: null,

    doubleClick: {
      card: null,
      time: null,
    },
  }),

  getters: {
  },

  mutations: {
    setDoubleClick(state, data) {
      state.doubleClick = data
    },

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
      // Check for double click
      if (
        state.doubleClick.card === card
        && state.doubleClick.time
        && Date.now() - state.doubleClick.time < 500  // 500 ms
      ) {
        state.game.doFunc(null, {
          name: card.tapped ? 'untap' : 'tap',
          cardId: card.id,
        })
        commit('setSelectedCard', null)
        commit('setDoubleClick', {
          card: null,
          time: null,
        })
        return
      }

      else {
        commit('setDoubleClick', {
          card,
          time: Date.now(),
        })
        // Fall through.
      }

      // Handle single clicks
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

    clickZone({ commit, state }, { zone, position }) {
      if (state.selectedCard) {
        const index = position === 'top' ? 0 : zone.cards().length

        state.game.doFunc(null, {
          name: 'move card',
          cardId: state.selectedCard.id,
          destId: zone.id,
          destIndex: index,
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
