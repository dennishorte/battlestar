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
    activeFolder: '/',
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
    setActiveFolder(state, path) {
      state.activeFolder = path
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
      const breakdown = state.activeDeck.breakdown
      const zone = breakdown[zoneName]
      const existing = findCardInZone(card, zone)

      if (existing) {
        existing.count += 1
      }
      else {
        const value = {
          card,
          name: card.name,
          count: 1,
          setCode: card.set,
          collectorNumber: card.collector_number,
        }
        zone.push(value)
      }

      state.activeDeck.setBreakdown(breakdown)
      state.activeDeck.modified = true
    },
    removeCardFromZone(state, { card, zoneName }) {
      const breakdown = state.activeDeck.breakdown
      const zone = breakdown[zoneName]
      const existing = findCardInZone(card, zone)

      if (existing) {
        if (existing.count > 1) {
          existing.count -= 1
        }
        else {
          util.array.remove(zone, existing)
        }
        state.activeDeck.setBreakdown(breakdown)
        state.activeDeck.modified = true
      }
      else {
        throw new Error(`Card not found in deck: ${card.name}`)
      }
    },

    setManagedCard(state, card) {
      state.cardManager.card = card
    },

    setManagedCardSource(state, source) {
      state.cardManager.source = source
    },

    setCardLock(state, value) {
      state.cardlock = value
    },
  },

  actions: {
    ////////////////////
    // Manage Cards
    addCurrentCard({ commit, state }, zoneName) {
      // If cardlock is on, steal the card from the sideboard,
      // or, if adding to sideboard, from the maindeck.
      if (state.cardlock) {
        throw new Error('not implemented: adding card when cardlock is enabled')
      }

      // Otherwise, just add the card.
      else {
        commit('addCardToZone', {
          card: state.cardManager.card,
          zoneName,
        })
      }
    },
    removeCurrentCard({ commit, state }, zoneName) {
      // If cardlock is on, steal the card from the sideboard,
      // or, if adding to sideboard, from the maindeck.
      if (state.cardlock) {
        throw new Error('not implemented: removing card when cardlock is enabled')
      }

      // Otherwise, just remove the card.
      else {
        commit('removeCardFromZone', {
          card: state.cardManager.card,
          zoneName,
        })
      }
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

    manageNextCardInIndex({ dispatch, state, rootState }) {
      if (state.cardManager.source === 'CardList') {
        const names = state.cardList.searchedNames
        const index = names.findIndex(name => name === state.cardManager.card.name)
        const nextIndex = (index + 1) % names.length
        const nextName = names[nextIndex].toLowerCase()

        const lookup = rootState.magic.cards.lookup
        const nextCard = lookup[nextName][0]
        dispatch('manageCard', {
          card: nextCard,
          source: null
        })
      }
      else if (state.cardManager.source === 'DeckList') {
        console.log('hello')
      }
      else {
        throw new Error('Unhandled card manager source: ' + state.cardManager.source)
      }
    },

    managePrevCardInIndex({ dispatch, state, rootState }) {
      const names = state.cardList.searchedNames
      const index = names.findIndex(name => name === state.cardManager.card.name)
      const nextIndex = (index - 1 + names.length) % names.length
      const nextName = names[nextIndex].toLowerCase()

      const lookup = rootState.magic.cards.lookup
      const nextCard = lookup[nextName][0]
      dispatch('manageCard', {
        card: nextCard,
        source: null
      })
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
      commit('setActiveFolder', null)
    },

    selectFolder({ commit }, path) {
      commit('setActiveDeck', null)
      commit('setActiveFolder', path)
    },

    toggleCardLock({ commit, state }) {
      commit('setCardLock', !state.cardlock)
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Actions that wrap API calls

    /* async saveActiveDeck({ commit, dispatch, state }) {
     *   const requestResult = await axios.post('/api/magic/deck/save', {
     *     deck: state.activeDeck.serialize()
     *   })

     *   if (requestResult.data.status === 'success') {
     *     commit('setModified', false)
     *     dispatch('fetchDecks')
     *   }
     *   else {
     *     alert('Error saving changes to deck')
     *   }
     * }, */
  },
}


function createCardLookup(cards) {
  return util.array.collect(cards, cardUtil.allCardNames)
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
