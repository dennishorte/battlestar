export default {
  namespaced: true,

  state: () => ({
    saving: false,
  }),

  getters: {
    isSaving: state => state.saving,
  },

  mutations: {
    setSaving(state, value) {
      state.saving = value
    },
  },
}
