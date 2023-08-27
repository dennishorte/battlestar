export default {
  namespaced: true,

  state: () => ({
    managedCard: null,
    managedScar: null,
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
  },

  actions: {
    async save({ dispatch }, cube) {
      await dispatch('magic/file/save', cube.serialize(), { root: true })
    },
  },
}
