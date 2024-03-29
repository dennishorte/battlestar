import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    cardManager: {
      card: null,
    },

    // State
    activeDeck: null,
    modified: false,

    editMode: 'sideboard',
  }),

  mutations: {
    ////////////////////
    // Decks
    setActiveDeck(state, deck) {
      state.activeDeck = deck
    },
    setActiveDecklist(state, cardlist) {
      state.activeDeck.setDecklist(cardlist)
      state.modified = true
    },
    setEditMode(state, mode) {
      state.editMode = mode
    },
    setModified(state, value) {
      state.modified = Boolean(value)
    },
    setDeckName(state, value) {
      state.activeDeck.name = value.trim()
      state.modified = true
    },
    setDeckFiters(state, value) {
      if (state.activeDeck) {
        state.activeDeck.filters = value
      }
    },
    setDeckPath(state, value) {
      state.activeDeck.path = value.trim()
      state.modified = true
    },

    ////////////////////
    // Managed Card
    addCardToZone(state, { card, zoneName }) {
      state.activeDeck.addCard(card, zoneName)
      state.modified = true
    },

    removeCard(state, card) {
      util.assert(card.zone, 'Card does not have a zone specified.')
      state.activeDeck.removeCard(card, card.zone)
      state.modified = true
    },

    removeCardFromZone(state, { card, zoneName }) {
      state.activeDeck.removeCard(card, zoneName)
      state.modified = true
    },

    setManagedCard(state, card) {
      state.cardManager.card = card
    },

    ////////////////////
    // Other
    setCardZone(state, { card, zoneName }) {
      state.activeDeck.removeCard(card, card.zone)
      state.activeDeck.addCard(card, zoneName)
    },

    swapZone(state, card) {
      if (card.zone === 'side') {
        state.activeDeck.removeCard(card, 'side')
        state.activeDeck.addCard(card, 'main')
      }
      else if (card.zone === 'main') {
        state.activeDeck.removeCard(card, 'main')
        state.activeDeck.addCard(card, 'side')
      }

      state.modified = true
    },
  },

  actions: {
    clickCard({ commit, dispatch, state }, card) {
      if (state.editMode === 'build') {
        dispatch('manageCard', card)
      }
      else if (state.editMode === 'sideboard') {
        commit('swapZone', card)
      }
    },

    ////////////////////
    // Manage Cards
    addCard({ commit }, { card, zoneName }) {
      commit('addCardToZone', { card, zoneName })
    },
    addCurrentCard({ commit, state }, zoneName) {
      commit('addCardToZone', {
        card: state.cardManager.card,
        zoneName,
      })
    },
    removeCurrentCard({ commit, state }, zoneName) {
      commit('removeCardFromZone', {
        card: state.cardManager.card,
        zoneName,
      })
    },
    manageCard({ commit }, card) {
      commit('setManagedCard', card)
    },
    unmanageCard({ commit }) {
      commit('setManagedCard', null)
    },

    ////////////////////
    // Misc

    async saveActiveDeck({ commit, dispatch, state }) {
      const file = state.activeDeck.serialize()
      await dispatch('magic/file/save', file, { root: true })
      commit('setModified', false)
    },

    selectDeck({ commit, rootGetters }, rawDeck) {
      let deck
      if (rawDeck) {
        deck = mag.util.deck.deserialize(rawDeck)
        const lookupFunc = rootGetters['magic/cards/getLookupFunc']
        mag.util.card.lookup.insertCardData(deck.cardlist, lookupFunc)

        for (const card of deck.cardlist) {
          const missingData = []
          if (!card.data) {
            missingData.push(card)
          }

          if (missingData.length > 0) {
            console.log('Missing data for some cards')
            for (const card of missingData) {
              console.log(card)
            }
            throw new Error('Missing data for some cards. See console for details.')
          }
        }
      }
      else {
        deck = null
      }

      commit('setActiveDeck', deck)
    },

    setActiveDecklist({ commit, rootGetters }, cards) {
      const lookupFunc = rootGetters['magic/cards/getLookupFunc']
      mag.util.card.lookup.insertCardData(cards, lookupFunc)
      commit('setActiveDecklist', cards)
    },

    storeFiltersOnDeck({ commit }, filters) {
      commit('setDeckFiters', filters)
    },
  },
}


function findCardInZone(card, zone) {
  return zone.find(data => (
    data.card === card
    || (
      data.name === card.name
      && data.setCode === card.set
      && data.collectorNumber === card.collector_number
    )
  ))
}
