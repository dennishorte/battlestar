export default {
  namespaced: true,

  state: () => ({
    managedCard: null,
  }),

  getters: {
  },

  mutations: {
    manageCard(state, card) {
      state.managedCard = card
    },
  },

  actions: {
    manageCard({ commit }, card) {
      commit('manageCard', card)
    },
  },
}
