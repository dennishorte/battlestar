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

    replaceOne(state, file) {
      const index = state.filelist.find(f => f.name === file.name && f.path === file.path && f.kind === file.kind)
      state.filelist[index] = file
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
      await this.$post('/api/magic/file/create', data)
      await dispatch('fetchAll')
    },

    async delete({ commit }, data) {
      await this.$post('/api/magic/file/delete', {
        fileId: data.file._id,
        kind: data.file.kind
      })
      commit('removeOne', data.file)
    },

    async duplicate({ dispatch }, data) {
      await this.$post('/api/magic/file/duplicate', {
        fileId: data.file._id,
        kind: data.file.kind
      })
      await dispatch('fetchAll')
    },

    async fetchAll({ commit, rootGetters }) {
      const { files } = await this.$post('/api/user/magic/files', {
        userId: rootGetters['auth/userId'],
      })
      commit('setFiles', files)
    },

    async save({ dispatch }, file) {
      await this.$post('/api/magic/file/save', { file })
      await dispatch('fetchAll')
    },

    async update({ commit }, data) {
      // Dispatch the changes to the server
      const updatedFile = { ...data.file }
      updatedFile.name = data.newName
      updatedFile.path = data.newPath
      await this.$post('/api/magic/file/save', {
        file: updatedFile,
      })
      commit('updateOne', data)
    }
  },
}
