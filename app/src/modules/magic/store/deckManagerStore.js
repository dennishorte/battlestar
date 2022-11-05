export default {
  namespaced: true,

  state: () => ({
    cardLock: false,
    managedCard: null,
  }),

  getters: {

  },

  mutations: {
    setManagedCard(state, card) {
      state.managedCard = card
    },

    setCardLock(state, value) {
      state.cardLock = value
    },
  },

  actions: {
    manageCard({ commit }, card) {
      commit('setManagedCard', card)
    },

    toggleCardLock({ commit, state }) {
      commit('setCardLock', !state.cardLock)
    },

    unmanageCard({ commit }) {
      commit('setManagedCard', null)
    },
  },
}
