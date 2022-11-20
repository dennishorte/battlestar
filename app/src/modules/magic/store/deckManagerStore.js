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

    selectDeck({ commit, rootState }, rawDeck) {
      let deck
      if (rawDeck) {
        const lookup = rootState.magic.cards.lookup
        deck = deckUtil.deserialize(rawDeck, lookup)
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
