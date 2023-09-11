import cubeUtil from '../util/cubeUtil.js'


export default {
  namespaced: true,

  state: () => ({
    cube: null,
    cubeLoaded: false,

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
    async getById(context, { cubeId }) {
      const response = await this.$post('/api/magic/cube/fetch', { cubeId })
      const cube = cubeUtil.deserialize(response.cube)
      return cube
    },

    async loadCube({ dispatch, state }, { cubeId }) {
      state.cubeLoaded = false
      state.cube = await dispatch('getById', { cubeId })
      state.cubeLoaded = true
    },

    async save({ dispatch }, cube) {
      await dispatch('magic/file/save', cube.serialize(), { root: true })
    },
  },
}
