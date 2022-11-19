import axios from 'axios'

import { util } from 'battlestar-common'

import cardUtil from '../util/cardUtil.js'
import deckUtil from '../util/deckUtil.js'


export default {
  namespaced: true,

  state: () => ({
    // Constants
    colors: ['white', 'blue', 'black', 'red', 'green'],

    cardManager: {
      card: null,
      source: null,
    },

    // State
    activeDeck: null,
    activeFolder: '/',

    cardFilters: [],
    cardlock: false,
  }),

  mutations: {
    ////////////////////
    // cardFilters
    addCardFilter(state, filter) {
      state.cardFilters.push(filter)
    },
    setCardFilters(state, array) {
      state.cardFilters = array
    },
    setFilteredCards(state, cards) {
      state.filteredCards = cards
    },
    removeCardFilter(state, filter) {
      util.array.remove(state.cardFilters, filter)
    },

    ////////////////////
    // Card List
    setSearchedNames(state, value) {
      state.cardList.searchedNames = value
    },
    setSearchPrefix(state, value) {
      state.cardList.searchPrefix = value
    },

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
    // Card Filters

    async applyCardFilters({ commit, dispatch, state, rootState }) {
      const allCards = rootState.magic.cards.cardlist
      const filtered = filterCards(cardlist, state.cardFilters)
      commit('setFilteredCards', filtered)
      await dispatch('applyCardSearch')
    },
    addCardFilter({ commit, state }, filter) {
      // There is only ever a single color or identity filter
      if (filter.kind === 'identity' || filter.kind === 'color') {
        const existing = state.cardFilters.find(f => f.kind === filter.kind)
        commit('removeCardFilter', existing)
      }

      commit('addCardFilter', filter)
    },
    clearCardFilters({ commit, rootState }) {
      commit('setCardFilters', [])
      commit('setFilteredCards', rootState.magic.cards.cardlist)
    },
    removeCardFilter({ commit }, filter) {
      commit('removeCardFilter', filter)
    },


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
    // Search

    async applyCardSearch({ commit, state }) {
      const searchText = state.cardList.searchPrefix.toLowerCase()
      const cardNames = util.array.distinct(state.filteredCards.map(c => c.name)).sort()
      const searchedNames = cardNames
        .filter(name => name.toLowerCase().includes(searchText))
        .slice(0,1000)

      commit('setSearchedNames', searchedNames)
    },

    async setSearchPrefix(context, value) {
      context.commit('setSearchPrefix', value)
      await context.dispatch('applyCardSearch')
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

function filterCards(cards, filters) {
  if (filters.length === 0) {
    return cards
  }

  return cards
    .filter(card => filters.every(filter => applyOneFilter(card, filter)))
}

const numberFields = ['cmc', 'power', 'toughness', 'loyalty']
const textFields = ['name', 'text', 'flavor', 'type']
const fieldMapping = {
  cmc: 'cmc',
  name: 'name',
  text: 'oracle_text',
  flavor: 'flavor_text',
  type: 'type_line',
  power: 'power',
  toughness: 'toughness',
  loyalty: 'loyalty',
  colors: 'colors',
  identity: 'color_identity',
}
const colorNameToSymbol = {
  white: 'W',
  blue: 'U',
  black: 'B',
  red: 'R',
  green: 'G',
}

function applyOneFilter(card, filter) {
  if (filter.kind === 'legality' && 'legalities' in card) {
    return card.legalities[filter.value] === 'legal'
  }
  else if (filter.kind === 'colors' || filter.kind === 'identity') {
    const fieldKey = fieldMapping[filter.kind]
    const fieldValue = fieldKey in card ? card[fieldKey] : []
    const targetValueMatches = ['white', 'blue', 'black', 'red', 'green']
      .map(color => filter[color] ? colorNameToSymbol[color] : undefined)
      .filter(symbol => symbol !== undefined)
      .map(symbol => fieldValue.includes(symbol))

    if (filter.or) {
      if (filter.only) {
        return (
          targetValueMatches.some(x => x)
          && fieldValue.length === targetValueMatches.filter(x => x).length
        )
      }
      else {
        return targetValueMatches.some(x => x)
      }
    }
    else {  // and
      if (filter.only) {
        return (
          targetValueMatches.every(x => x)
          && fieldValue.length === targetValueMatches.length
        )
      }
      else {
        return targetValueMatches.every(x => x)
      }
    }
  }
  else if (textFields.includes(filter.kind)) {
    const fieldKey = fieldMapping[filter.kind]
    const fieldValue = fieldKey in card ? card[fieldKey].toLowerCase() : ''
    const targetValue = filter.value.toLowerCase()

    if (filter.operator === 'and') {
      return fieldValue.includes(targetValue)
    }
    else if (filter.operator === 'not') {
      return !fieldValue.includes(targetValue)
    }
    else {
      throw new Error(`Unhandled string operator: ${filter.operator}`)
    }
  }
  else if (numberFields.includes(filter.kind)) {
    const fieldKey = fieldMapping[filter.kind]
    const fieldValue = fieldKey in card ? parseFloat(card[fieldKey]) : -999
    const targetValue = parseFloat(filter.value)

    if (fieldValue === -999) {
      return false
    }
    else if (filter.operator === '=') {
      return fieldValue === targetValue
    }
    else if (filter.operator === '>=') {
      return fieldValue >= targetValue
    }
    else if (filter.operator === '<=') {
      return fieldValue <= targetValue
    }
    else {
      throw new Error(`Unhandled numeric operator: ${filter.operator}`)
    }
  }
  else {
    throw new Error(`Unhandled filter field: ${filter.kind}`)
  }

  return false
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
