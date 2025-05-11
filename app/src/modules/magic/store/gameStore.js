export default {
  namespaced: true,

  state: () => ({
    game: null,
    linkedDraft: null,

    ready: false,

    chooseTargetCallback: null,
    movingAllSource: null,
    movingRevealedSource: null,
    selectedCardId: null,

    doubleClick: {
      card: null,
      time: null,
    },
  }),

  getters: {
    importZoneIds(state, _1, _2, rootGetters) {
      const ids = []

      const actor = rootGetters['auth/user']
      const actorPlayer = state.game.getPlayerByName(actor.name)

      for (const player of state.game.getPlayersStarting(actorPlayer)) {
        for (const name of ['attacking', 'battlefield', 'blocking', 'command', 'creatures', 'land', 'stack']) {
          ids.push(`players.${player.name}.${name}`)
        }
      }

      return ids
    },

    isChoosingTarget(state) {
      return Boolean(state.chooseTargetCallback)
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
    cancelChooseTarget(state) {
      state.chooseTargetCallback = null
    },

    setChooseTargetCallback(state, callback) {
      state.chooseTargetCallback = callback
    },

    setDoubleClick(state, data) {
      state.doubleClick = data
    },

    setGame(state, game) {
      state.game = game
    },

    setLinkedDraft(state, draft) {
      state.linkedDraft = draft
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
      state.selectedCardId = card ? card.g.id : null
    },
  },

  actions: {
    clickCard({ commit, dispatch, getters, state }, card) {
      commit('magic/clearMouseoverCard', null, { root: true })

      if (getters.isChoosingTarget) {
        state.chooseTargetCallback(card)
        state.chooseTargetCallback = null
        return
      }

      if (getters.isMovingAll) {
        dispatch('moveAll', card.zone)
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
          name: card.g.tapped ? 'untap' : 'tap',
          cardId: card.g.id,
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

      else if (state.selectedCardId === card.g.id) {
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

    async fetchLinkedDraft({ commit, dispatch, state }) {
      if (state.game.settings.linkedDraftId) {
        const { game } = await this.$post('/api/game/fetch', {
          gameId: state.game.settings.linkedDraftId,
        })
        commit('setLinkedDraft', game)

        // Loading the cube ensures the achievements will be available to render on relevant cards.
        if (state.linkedDraft.settings.cubeId) {
          await dispatch('magic/cube/loadCube', {
            cubeId: state.linkedDraft.settings.cubeId
          }, { root: true })
        }
      }
    },

    async loadGame({ commit, dispatch }, { doFunc, game }) {
      commit('setReady', false)
      game.doFunc = doFunc
      game.run()

      commit('setGame', game)
      commit('setReady', true)

      await dispatch('fetchLinkedDraft')
    },

    moveAll({ commit, state }, targetZone) {
      state.game.doFunc(null, {
        name: 'move all',
        sourceId: state.movingAllSource,
        targetId: targetZone.id,
      })
      commit('setMovingAllSource', null)
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
