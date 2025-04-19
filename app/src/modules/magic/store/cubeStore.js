import UICubeWrapper from '@/modules/magic/util/cube.wrapper'

export default {
  namespaced: true,

  state: () => ({
    cubes: [],

    cube: null,
    cubeLoaded: false,

    scars: [],
    achievements: [],

    managedCard: null,
  }),

  getters: {
    achievementsForCard(state) {
      return (card) => {
        return state
          .achievements
          .filter(ach => !ach.claimed)
          .filter(ach => ach.filters && ach.filters.length > 0)
          .filter(ach => card.matchesFilters(ach.filters))
      }
    },
  },

  mutations: {
    manageCard(state, card) {
      state.managedCard = card
    },
  },

  actions: {
    async claimAchievement({ commit, dispatch, state }, { achId, userId }) {
      await this.$post('/api/magic/achievement/claim', {
        achId,
        userId,
      })
      await dispatch('loadAchievements')

      if (state.managedAchievement) {
        const updated = state.achievements.find(a => a._id === achId)
        commit('manageAchievement', { achievement: updated })
      }
    },

    async create({ dispatch }) {
      const response = await this.$post('/api/magic/cube/create')
      await dispatch('loadAllCubes')
      return response.cubeId
    },

    async deleteAchievement({ dispatch }, ach) {
      await this.$post('/api/magic/achievement/delete', { achId: ach._id })
      await dispatch('loadAchievements')
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

    async loadAllCubes({ dispatch, state }) {
      const response = await this.$post('/api/magic/cube/all')
      state.cubes = response.cubes
    },

    async save({ dispatch }, cube) {
      await dispatch('magic/file/save', cube.serialize(), { root: true })
    },
  },
}
