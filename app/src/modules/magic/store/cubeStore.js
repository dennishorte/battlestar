import { mag } from 'battlestar-common'

import cubeUtil from '../util/cubeUtil.js'


export default {
  namespaced: true,

  state: () => ({
    cube: null,
    cubeLoaded: false,

    scars: [],
    achievements: [],

    managedCard: null,

    cardFilters: [],
    filteredCards: [],
  }),

  getters: {
    achievementsForCard(state) {
      return (card) => {
        return state
          .achievements
          .filter(ach => !ach.claimed)
          .filter(ach => ach.filters && ach.filters.length > 0)
          .filter(ach => mag.util.card.filtersMatchCard(ach.filters, card))
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

    async deleteAchievement({ dispatch }, ach) {
      await this.$post('/api/magic/achievement/delete', { achId: ach._id })
      await dispatch('loadAchievements')
    },

    async getById(context, { cubeId }) {
      const response = await this.$post('/api/magic/cube/fetch', { cubeId })
      const cube = cubeUtil.deserialize(response.cube)
      return cube
    },

    async loadCube({ dispatch, state }, { cubeId }) {
      state.cubeLoaded = false
      state.cube = await dispatch('getById', { cubeId })
      state.filteredCards = state.cube.cards

      state.cubeLoaded = true
    },

    async save({ dispatch }, cube) {
      await dispatch('magic/file/save', cube.serialize(), { root: true })
    },

    async setFilters({ state }, filters) {
      state.cardFilters = filters || []
      if (filters.length === 0) {
        state.filteredCards = state.cube.cardlist
      }
      else {
        state.filteredCards = state
          .cube
          .cardlist
          .filter(card => mag.util.card.filtersMatchCard(filters, card))
      }
    }
  },
}
