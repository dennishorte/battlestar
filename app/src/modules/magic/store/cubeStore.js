import cubeUtil from '../util/cubeUtil.js'


export default {
  namespaced: true,

  state: () => ({
    cube: null,
    cubeLoaded: false,

    achievements: [],
    scars: [],

    managedCard: null,
    managedScar: null,
    managedAchievement: null,
    managedAchievementShowAll: false,

    cardFilters: [],
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

    setFilters(state, filters) {
      state.cardFilters = filters
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

      await dispatch('loadScars')
      await dispatch('loadAchievements')

      state.cubeLoaded = true
    },

    async loadScars({ state }) {
      const { scars } = await this.$post('/api/magic/scar/fetchAll', {
        cubeId: state.cube._id,
      })
      state.scars = scars
    },

    async loadAchievements({ state }) {
      const { achievements } = await this.$post('/api/magic/achievement/all', {
        cubeId: state.cube._id,
      })
      state.achievements = achievements
    },

    async save({ dispatch }, cube) {
      await dispatch('magic/file/save', cube.serialize(), { root: true })
    },
  },
}
