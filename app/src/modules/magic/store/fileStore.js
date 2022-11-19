import axios from 'axios'
import { util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    filelist: [],
  }),

  getters: {

  },

  mutations: {
    removeOne(state, file) {
      util.array.remove(state.filelist, file)
    },

    setFiles(state, filelist) {
      state.filelist = filelist
    },

    updateOne(state, data) {
      const file = state.filelist.find(f => f === data.file)
      file.name = data.newName
      file.path = data.newPath
    },
  },

  actions: {
    async create({ dispatch, rootGetters }, data) {
      data.userId = rootGetters['auth/userId']
      const requestResult = await axios.post('/api/magic/file/create', data)

      if (requestResult.data.status === 'success') {
        await dispatch('fetchAll')
      }
      else {
        alert(requestResult.message)
      }
    },

    async delete({ commit }, data) {
      const requestResult = await axios.post('/api/magic/file/delete', {
        fileId: data.file._id,
        kind: data.file.kind
      })

      if (requestResult.data.status === 'success') {
        commit('removeOne', data.file)
      }
      else {
        alert(requestResult.message)
      }
    },

    async duplicate({ dispatch }, data) {
      const requestResult = await axios.post('/api/magic/file/duplicate', {
        fileId: data.file._id,
        kind: data.file.kind
      })

      if (requestResult.data.status === 'success') {
        await dispatch('fetchAll')
      }
      else {
        alert(requestResult.message)
      }
    },

    async fetchAll({ commit, rootGetters }) {
      const requestResult = await axios.post('/api/user/magic/files', {
        userId: rootGetters['auth/userId'],
      })
      if (requestResult.data.status === 'success') {
        commit('setFiles', requestResult.data.files)
      }
    },

    async update({ commit }, data) {
      // Dispatch the changes to the server
      const updatedFile = { ...data.file }
      updatedFile.name = data.newName
      updatedFile.path = data.newPath
      const requestResult = await axios.post('/api/magic/file/update', {
        file: updatedFile,
      })

      // Update the local data to be reflected in the UI
      if (requestResult.data.status === 'success') {
        commit('updateOne', data)
      }
      else {
        alert(requestResult.message)
      }
    }
  },
}
