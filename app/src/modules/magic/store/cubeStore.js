import cubeUtil from '../util/cubeUtil.js'


export default {
  namespaced: true,

  state: () => ({
    managedCard: null,
    managedScar: null,
    managedAchievement: null,
    managedAchievementShowAll: false,
  }),

  getters: {
  },

  mutations: {
    manageCard(state, card) {
      state.managedCard = card
    },

    manageScar(state, scar) {
      state.managedScar = scar
    },

    manageAchievement(state, { achievement, showAll }) {
      state.managedAchievement = achievement
      state.managedAchievementShowAll = showAll
    },
  },

  actions: {
    async load(context, { cubeId }) {
      const response = await this.$post('/api/magic/cube/fetch', { cubeId })
      const cube = cubeUtil.deserialize(response.cube)
      return cube
    },

    async save({ dispatch }, cube) {
      await dispatch('magic/file/save', cube.serialize(), { root: true })
    },
  },
}
