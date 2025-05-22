import UICubeWrapper from '@/modules/magic/util/cube.wrapper'

export default {
  namespaced: true,

  state: () => ({
    cubes: [],

    cube: null,
    cubeLoaded: false,

    managedCard: null,
  }),

  mutations: {
    manageCard(state, card) {
      state.managedCard = card
    },
  },

  actions: {
    async addCard({ dispatch, state }, { card, comment }) {
      await this.$post('/api/magic/card/create', {
        cardData: card.data,
        cubeId: state.cube._id,
        comment: comment || "Added via cubeStore.addCard",
      })
      await dispatch('magic/cards/reloadDatabase', null, { root: true })
      await dispatch('loadCube', { cubeId: state.cube._id })
    },

    /**
     * Add and remove multiple cards from a cube in a single operation
     * @param {Array<string>} payload.addIds - Array of card IDs to add
     * @param {Array<string>} payload.removeIds - Array of card IDs to remove
     * @param {string} payload.comment - Optional comment for the operations
     */
    async addRemoveCards({ dispatch, state }, { addIds, removeIds, comment }) {
      await this.$post('/api/magic/cube/add_remove_cards', {
        addIds,
        removeIds,
        cubeId: state.cube._id,
        comment: comment || "Changes made via cubeStore.addRemoveCards",
      })
      await dispatch('magic/cards/reloadDatabase', null, { root: true })
      await dispatch('loadCube', { cubeId: state.cube._id })
    },

    async create({ dispatch }) {
      const response = await this.$post('/api/magic/cube/create')
      await dispatch('loadAllCubes')
      return response.cubeId
    },

    async loadCube({ dispatch, state }, { cubeId }) {
      state.cubeLoaded = false

      const response = await this.$post('/api/magic/cube/fetch', { cubeId })
      const cube = new UICubeWrapper(response.cube)

      const cards = await dispatch('magic/cards/getByIds', cube.cardlist, { root: true })
      cube.setCards(cards)

      state.cube = cube
      state.cubeLoaded = true
    },

    async loadAllCubes({ state }) {
      const response = await this.$post('/api/magic/cube/all')
      state.cubes = response.cubes
    },

    async updateSettings({ dispatch }, { cubeId, settings }) {
      await this.$post('/api/magic/cube/update_settings', {
        cubeId,
        settings
      })
      await dispatch('loadCube', { cubeId })
    },

    ////////////////////////////////////////////////////////////////////////////////
    // Achievements

    async claimAchievement({ dispatch }, { cubeId, achievement, user }) {
      achievement.claimedAt = new Date()
      achievement.claimedBy = user._id
      await dispatch('updateAchievement', { cubeId, achievement })
    },

    async deleteAchievement({ dispatch }, { cubeId, achievement }) {
      await this.$post('/api/magic/cube/delete_achievement', {
        cubeId,
        achievement
      })
      await dispatch('loadCube', { cubeId })

    },

    async updateAchievement({ dispatch }, { cubeId, achievement }) {
      await this.$post('/api/magic/cube/update_achievement', {
        cubeId,
        achievement
      })
      await dispatch('loadCube', { cubeId })
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Scars

    async deleteScar({ dispatch }, { cubeId, scar }) {
      await this.$post('/api/magic/cube/delete_scar', {
        cubeId,
        scar
      })
      await dispatch('loadCube', { cubeId })

    },

    async updateScar({ dispatch }, { cubeId, scar }) {
      await this.$post('/api/magic/cube/update_scar', {
        cubeId,
        scar
      })
      await dispatch('loadCube', { cubeId })
    },
  },
}
