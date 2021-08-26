export default {
  namespaced: true,

  state() {
    return {
      charactersModal: {
        selected: '',
      },
    }
  },

  mutations: {
    character_request(state, name) {
      state.charactersModal.selected = name
    }
  },
}
