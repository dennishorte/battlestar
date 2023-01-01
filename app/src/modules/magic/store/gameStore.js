import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    game: null,
    movingAllSource: null,
    movingRevealedSource: null,
    ready: false,
    selectedCardId: null,

    doubleClick: {
      card: null,
      time: null,
    },
  }),

  getters: {
    importZoneIds(state) {
      const ids = []

      for (const player of state.game.getPlayersStarting(state.game.getPlayerViewer())) {
        for (const name of ['battlefield', 'command', 'creatures', 'land', 'stack']) {
          ids.push(`players.${player.name}.${name}`)
        }
      }

      return ids
    },

    isMovingAll(state) {
      return Boolean(state.movingAllSource)
    },

    isMovingCards(state) {
      return Boolean(state.movingRevealedSource) || Boolean(state.movingAllSource)
    },

    isMovingRevealed(state) {
      return Boolean(state.movingRevealedSource)
    },
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

    setMovingAllSource(state, value) {
      state.movingAllSource = value
    },

    setMovingRevealedSource(state, value) {
      state.movingRevealedSource = value
    },

    setSelectedCard(state, card) {
      state.selectedCardId = card ? card.id : null
    },
  },

  actions: {
    clickCard({ commit, dispatch, getters, state }, card) {
      commit('magic/clearMouseoverCard', null, { root: true })

      if (getters.isMovingAll) {
        dispatch('moveAll', zone)
        return
      }

      if (getters.isMovingRevealed) {
        dispatch('moveRevealed', state.game.getZoneByCard(card))
        return
      }

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
      if (state.selectedCardId === null) {
        commit('setSelectedCard', card)
      }

      else if (state.selectedCardId === card.id) {
        commit('setSelectedCard', null)
      }

      else {
        state.game.doFunc(null, {
          name: 'move card',
          cardId: state.selectedCardId,
          destId: card.zone,
          destIndex: state.game.getZoneIndexByCard(card),
        })
        commit('setSelectedCard', null)
      }
    },

    clickZone({ commit, dispatch, getters, state }, { zone, position }) {
      commit('magic/clearMouseoverCard', null, { root: true })

      if (getters.isMovingAll) {
        dispatch('moveAll', zone)
        return
      }

      if (getters.isMovingRevealed) {
        dispatch('moveRevealed', zone)
        return
      }

      if (state.selectedCardId) {
        const index = position === 'top' ? 0 : zone.cards().length

        state.game.doFunc(null, {
          name: 'move card',
          cardId: state.selectedCardId,
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

    moveAll({ commit, state }, targetZone) {
      state.game.doFunc(null, {
        name: 'move all',
        sourceId: state.movingAllSource,
        targetId: targetZone.id,
      })
    },

    moveRevealed({ commit, state }, targetZone) {
      state.game.doFunc(null, {
        name: 'move revealed',
        sourceId: state.movingRevealedSource,
        targetId: targetZone.id,
      })
      commit('setMovingRevealedSource', null)
    },

    unselectCard({ commit }) {
      commit('setSelectedCard', null)
    },
  },
}
