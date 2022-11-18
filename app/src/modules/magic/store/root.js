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
    },

    updateFile(state, data) {
      const file = state.filelist.find(f => f === data.file)
      file.name = data.newName
      file.path = data.newPath
    },
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

    async updateFile({ commit }, data) {
      // Dispatch the changes to the server
      const updatedFile = { ...data.file }
      updatedFile.name = data.newName
      updatedFile.path = data.newPath
      const requestResult = await axios.post('/api/magic/file/update', {
        file: updatedFile,
      })

      // Update the local data to be reflected in the UI
      if (requestResult.data.status === 'success') {
        commit('updateFile', data)
      }
      else {
        alert(requestResult.message)
      }
    }
  },
}
