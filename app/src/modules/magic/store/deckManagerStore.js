import axios from 'axios'

import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    cardManager: {
      card: null,
    },

    // State
    activeDeck: null,
    modified: false
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
    setModified(state, value) {
      state.modified = Boolean(value)
    },
    setDeckName(state, value) {
      state.activeDeck.name = value.trim()
      state.modified = true
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
    removeCardFromZone(state, { card, zoneName }) {
      state.activeDeck.removeCard(card, zoneName)
      state.modified = true
    },

    setManagedCard(state, card) {
      state.cardManager.card = card
    },
  },

  actions: {
    ////////////////////
    // Manage Cards
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
      }
      else {
        deck = null
      }

      commit('setActiveDeck', deck)
    },

    setActiveDecklist({ commit, rootGetters }, cards) {
      const lookupFunc = rootGetters['magic/cards/getLookupFunc']
      mag.util.card.insertCardData(cards, lookupFunc)
      commit('setActiveDecklist', cards)
    }
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
