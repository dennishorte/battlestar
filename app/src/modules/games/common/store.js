export default {
  namespaced: true,

  state: () => ({
    game: null,

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
    setSaveQueued: (state, value) => state.saveQueued = value,
    setSaving: (state, value) => state.saving = value,
  },

  actions: {
    async goto({}, path) {
      throw new Error('not implemented')
    },

    async load({ commit, dispatch }, gameId) {
      this.game = null
      await nextTick()

      if (!this.id) {
        alert('No game id specified in path')
        dispatch('goto', '/')
      }

      const { game } = await this.$post('/api/game/fetch', {
        gameId: this.id,
      })

      this.game = fromData(game, this.actor.name)
      this.game.run()
    },

    async next({ commit }) {
      const { gameId } = await this.$post('/api/user/next', {
        userId: this.actor._id,
        gameId: null,
      })

      if (gameId) {
        if (this.$route.path === `/game/${gameId}`) {
          this.$router.go()
        }
        else {
          this.$router.push(`/game/${gameId}`)
        }
      }
      else {
        this.$router.push('/')
      }
    },

    async save({ commit, state }) {
      const game = state.game

      while (state.saving) {
        console.log('blocked')
        commit('setSaveQueued', true)
        await delay(500)
      }

      commit('setSaveQueued', false)
      commit('setSaving', true)

      // If the player used undo, first execute and save the undone state.
      // This is done so that, in the general case, we only ever need to save the latest action of the
      // user and there is no need to save the whole state. This allows actions to be played asynchronously
      // in games like Cube Draft, where the relative order of the user actions doesn't matter.
      if (game.undoCount > 0) {
        await this.$post('/api/game/undo', {
          gameId: game._id,
          count: game.undoCount,
        })
      }

      const response = await this.$post('/api/game/saveFull', game.serialize())
      game.undoCount = 0
      game.branchId = response.branchId
      commit('setSaving', false)
    },
  },
}

function delay(milliseconds){
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}
