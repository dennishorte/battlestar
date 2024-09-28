export default {
  namespaced: true,

  state: () => ({
    saveQueued: false,
    saving: false,
  }),

  getters: {
    isSaveQueued: state => state.saveQueued,
    isSaving: state => state.saving,
  },

  mutations: {
    setSaveQueued(state, value) {
      state.saveQueued = value
    },

    setSaving(state, value) {
      state.saving = value
    },
  },
}
