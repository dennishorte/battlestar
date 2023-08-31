import axios from 'axios'
import cubeUtil from '../util/cubeUtil.js'


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
    async load(context, { cubeId }) {
      console.log(cubeId)
      const requestResult = await axios.post('/api/magic/cube/fetch', { cubeId })

      if (requestResult.data.status === 'success') {
        const cube = cubeUtil.deserialize(requestResult.data.cube)
        return cube
      }
      else {
        alert('Unable to load cube: ' + cubeId)
        throw new Error('Unable to load cube')
      }
    },

    async save({ dispatch }, cube) {
      await dispatch('magic/file/save', cube.serialize(), { root: true })
    },
  },
}
