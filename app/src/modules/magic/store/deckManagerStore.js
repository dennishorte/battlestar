export default {
  namespaced: true,

  state: () => ({
    managedCard: null,
  }),

  getters: {

  },

  mutations: {
    setManagedCard(state, card) {
      state.managedCard = card
    }
  },

  actions: {
    manageCard({ commit }, card) {
      commit('setManagedCard', card)
    },
  },
}
