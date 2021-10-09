import actions from './store/actions.js'
import mutations from './store/mutations.js'

import * as $ from './store/helpers.js'


export default {
  namespaced: true,

  state() {
    return {
      ////////////////////////////////////////////////////////////
      // Data

      data: {
        decks: {},  // All of the raw decks, for displaying information.
        locations: [],  // Raw location data
      },
    }
  },

  getters: {
    ////////////////////////////////////////////////////////////
    // Data

    dataCharacter: (state) => (name) => state.data.decks.character.cards.find(c => c.name === name ),
    dataLocations: (state) => state.data.locations,
    dataDeck: (state) => (key) => state.data.decks[key],
    dataSkillCards: (state) => $.dataSkillCards(state),
  },

  mutations: {
    ...mutations,
  },

  actions: {
    ...actions,
  },
}
