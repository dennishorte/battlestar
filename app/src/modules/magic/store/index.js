import dm from './deckManagerStore.js'
import file from './fileStore.js'

export default {
  namespaced: true,
  modules: {
    dm: dm,
    file: file,
  },
}
