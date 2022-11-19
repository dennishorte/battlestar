import cards from './cardStore.js'
import dm from './deckManagerStore.js'
import file from './fileStore.js'

export default {
  namespaced: true,
  modules: {
    cards: cards,
    dm: dm,
    file: file,
  },
}
