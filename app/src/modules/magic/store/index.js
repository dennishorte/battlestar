import deckManagerStore from './deckManagerStore.js'
import root from './root.js'

export default {
  namespaced: true,
  modules: {
    dm: deckManagerStore,
  },

  ...root,
}
