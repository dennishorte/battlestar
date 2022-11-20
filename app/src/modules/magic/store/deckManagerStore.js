import axios from 'axios'

import { util } from 'battlestar-common'

import cardUtil from '../util/cardUtil.js'
import deckUtil from '../util/deckUtil.js'


export default {
  namespaced: true,

  state: () => ({
    cardManager: {
      card: null,
      source: null,
    },

    // State
    activeDeck: null,
  }),

  mutations: {
    ////////////////////
    // Decks
    setActiveDeck(state, deck) {
      state.activeDeck = deck
    },
    setActiveDecklist(state, cardlist) {
      state.activeDeck.setDecklist(cardlist)
      state.activeDeck.modified = true
    },
    setModified(state, value) {
      state.activeDeck.modified = Boolean(value)
    },
    setDeckName(state, value) {
      state.activeDeck.name = value.trim()
      state.activeDeck.modified = true
    },
    setDeckPath(state, value) {
      state.activeDeck.path = value.trim()
      state.activeDeck.modified = true
    },

    ////////////////////
    // Managed Card
    addCardToZone(state, { card, zoneName }) {
      state.activeDeck.addCard(card, zoneName)
      state.activeDeck.modified = true
    },
    removeCardFromZone(state, { card, zoneName }) {
      state.activeDeck.removeCard(card, zoneName)
      state.activeDeck.modified = true
    },

    setManagedCard(state, card) {
      state.cardManager.card = card
    },

    setManagedCardSource(state, source) {
      state.cardManager.source = source
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
    manageCard({ commit }, { card, source }) {
      commit('setManagedCard', card)
      if (source) {
        commit('setManagedCardSource', source)
      }
    },
    unmanageCard({ commit }) {
      commit('setManagedCard', null)
      commit('setManagedCardSource', null)
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
        deck = deckUtil.deserialize(rawDeck)

        // Add in the full card data, if we can find it.
        for (const card of deck.cardlist) {
          const data = rootGetters['magic/cards/getByIdDict'](card)
          if (data) {
            card.data = data
          }
        }
      }
      else {
        deck = null
      }

      commit('setActiveDeck', deck)
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
