export default {
  namespaced: true,

  state: () => ({
    activeDeck: null,
    cardLock: false,
    managedCard: null,
  }),

  getters: {

  },

  mutations: {
    setActiveDeck(state, deck) {
      state.activeDeck = deck
    },

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

    selectDeck({ commit }, deck) {
      commit('setActiveDeck', deck)
    },

    toggleCardLock({ commit, state }) {
      commit('setCardLock', !state.cardLock)
    },

    unmanageCard({ commit }) {
      commit('setManagedCard', null)
    },
  },
}
