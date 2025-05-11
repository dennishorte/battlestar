import { fromData } from 'battlestar-common'
import { nextTick } from 'vue'
import router from '@/router'


export default {
  namespaced: true,

  state: () => ({
    game: null,
    gameReady: false,

    // These two values are used by the save action and SavingOverlay to tell the user they are acting faster
    // than the server is responding, and need to wait a moment.
    saveQueued: false,
    saving: false,
  }),

  getters: {
    getGame: state => state.game,
    isSaveQueued: state => state.saveQueued,
    isSaving: state => state.saving,
  },

  mutations: {
    setGame: (state, value) => state.game = value,
    setGameReady: (state, value) => state.gameReady = value,
    setSaveQueued: (state, value) => state.saveQueued = value,
    setSaving: (state, value) => state.saving = value,
  },

  actions: {
    async load({ commit }, { gameId, actor }) {
      commit('setGameReady', false)
      await nextTick()

      const response = await this.$post('/api/game/fetch', { gameId })
      const game = fromData(response.game, actor.name)
      game.run()
      commit('setGame', game)
      commit('setGameReady', true)
    },

    async next(_, { actor }) {
      const { gameId } = await this.$post('/api/user/next', {
        userId: actor._id,
        gameId: null,
      })

      if (gameId) {
        if (router.path === `/game/${gameId}`) {
          router.go()
        }
        else {
          router.push(`/game/${gameId}`)
        }
      }
      else {
        router.push('/')
      }
    },

    async save({ dispatch, state }) {
      await dispatch('_acquireLock')

      const game = state.game

      // If the player used undo, first execute and save the undone state.
      // This is done so that, in the general case, we only ever need to save the latest action of the
      // user and there is no need to save the whole state. This allows actions to be played asynchronously
      // in games like Cube Draft, where the relative order of the user actions doesn't matter.
      if (game.undoCount > 0) {
        const undoResponse = await this.$post('/api/game/undo', {
          gameId: game._id,
          count: game.undoCount,
        })

        game.branchId = undoResponse.serializedGame.branchId
        _ensureServerAndClientAgreeOnGameState(game.serialize(), undoResponse.serializedGame)
      }

      const response = await this.$post('/api/game/save_full', game.serialize())
      game.undoCount = 0
      game.branchId = response.serializedGame.branchId
      _ensureServerAndClientAgreeOnGameState(game.serialize(), response.serializedGame)

      await dispatch('_releaseLock')
    },

    async submitAction(context, action) {
      await context.dispatch('_acquireLock')

      const game = context.state.game
      const response = await this.$post('/api/game/save_response', {
        gameId: game._id,
        response: action,
      })
      game.respondToInputRequest(action)
      game.branchId = response.serializedGame.branchId
      _ensureServerAndClientAgreeOnGameState(game.serialize(), response.serializedGame)

      await context.dispatch('_releaseLock')
    },

    async _acquireLock({ commit, state }) {
      while (state.saving) {
        // If the user tries to submit another action before the current action completes,
        // then show a spinner telling them to wait.
        commit('setSaveQueued', true)
        await delay(500)
      }

      commit('setSaveQueued', false)
      commit('setSaving', true)
    },

    async _releaseLock({ commit }) {
      commit('setSaving', false)
    },
  },
}

function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

function _ensureServerAndClientAgreeOnGameState(client, server) {
  if (JSON.stringify(client) !== JSON.stringify(server)) {
    console.log('game states', { client, server })
    alert('State mismatch with server. Try reloading the page.')
    throw new Error('state mismatch')
  }
}
