import axios from 'axios'


export default {
  state: () => ({
    filelist: [],
  }),

  getters: {

  },

  mutations: {
    setFiles(state, filelist) {
      state.filelist = filelist
    }
  },

  actions: {
    async loadFiles({ commit, rootGetters }) {
      const requestResult = await axios.post('/api/user/magic/files', {
        userId: rootGetters['auth/userId'],
      })
      if (requestResult.data.status === 'success') {
        commit('setFiles', requestResult.data.files)
      }
    },
  },
}
