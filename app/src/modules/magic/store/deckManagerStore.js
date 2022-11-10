import axios from 'axios'

import { mag, util } from 'battlestar-common'

import cardUtil from '../util/cardUtil.js'
import testDeck from '../res/test_deck.js'
import testDeckCmd from '../res/test_deck_commander.js'


export default {
  namespaced: true,

  state: () => ({
    // Constants
    colors: ['white', 'blue', 'black', 'red', 'green'],

    // card database
    cardDatabase: {
      db: null,
      loaded: false,
      cards: [],
      lookup: {},
    },

    // State
    activeDeck: null,
    activeFolder: '/',

    cardFilters: [],
    cardlock: false,
    decks: mag.Deck.buildHierarchy([testDeck, testDeckCmd]),
    filteredCards: [],
    managedCard: null,
  }),

  getters: {
    // Decklist Methods
    //dlCards: decklistCards,

    // Managed Card Methods
    mcName: state => state.managedCard.name,
  },

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
    // Card Database
    setCardsLoaded(state, value) {
      state.cardDatabase.loaded = value
    },
    setDatabase(state, cards) {
      state.cardDatabase.cards = cards
      state.cardDatabase.lookup = createCardLookup(cards)
      state.filteredCards = cards
    },

    ////////////////////
    // Decks
    setActiveDeck(state, rawDeck) {
      if (rawDeck) {
        state.activeDeck = mag.Deck.deserialize(rawDeck, state.cardDatabase.lookup)
      }
      else {
        state.activeDeck = null
      }
    },
    setActiveFolder(state, path) {
      state.activeFolder = path
    },
    setDecks(state, decks) {
      state.decks = decks
    },

    ////////////////////
    // Managed Card
    addCardToZone(state, { card, zoneName }) {
      const zone = state.activeDeck.breakdown[zoneName]

      // Already exists?
      const existing = findCardInZone(card, zone)

      if (existing) {
        existing.count += 1
      }
      else {
        zone.push({
          card,
          name: card.name,
          count: 1,
          setCode: card.set,
          collectorNumber: card.collector_number,
        })
      }
      state.activeDeck.modified = true
    },
    removeCardFromZone(state, { card, zoneName }) {
      const zone = state.activeDeck.breakdown[zoneName]
      const existing = findCardInZone(card, zone)

      if (existing) {
        if (existing.count > 1) {
          existing.count -= 1
        }
        else {
          util.array.remove(zone, existing)
        }
        state.activeDeck.modified = true
      }
      else {
        throw new Error(`Card not found in deck: ${card.name}`)
      }
    },

    setManagedCard(state, card) {
      state.managedCard = card
    },

    setCardLock(state, value) {
      state.cardlock = value
    },
  },

  actions: {

    ////////////////////
    // Card Filters

    applyCardFilters({ commit, state }) {
      const filtered = filterCards(state.cardDatabase.cards, state.cardFilters)
      commit('setFilteredCards', filtered)
    },
    addCardFilter({ commit, state }, filter) {
      // There is only ever a single color or identity filter
      if (filter.kind === 'identity' || filter.kind === 'color') {
        const existing = state.cardFilters.find(f => f.kind === filter.kind)
        commit('removeCardFilter', existing)
      }

      commit('addCardFilter', filter)
    },
    clearCardFilters({ commit, state }) {
      commit('setCardFilters', [])
      commit('setFilteredCards', state.cardDatabase.cards)
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
          card: state.managedCard,
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
          card: state.managedCard,
          zoneName,
        })
      }
    },
    manageCard({ commit }, card) {
      commit('setManagedCard', card)
    },
    unmanageCard({ commit }) {
      commit('setManagedCard', null)
    },

    ////////////////////
    // Misc

    async fetchDecks({ commit, rootGetters }) {
      const requestResult = await axios.post('/api/user/decks', {
        userId: rootGetters['auth/userId'],
      })
      if (requestResult.data.status === 'success') {
        const deckHierarchy = mag.Deck.buildHierarchy(requestResult.data.decks)
        commit('setDecks', deckHierarchy)
      }
    },

    selectDeck({ commit }, deck) {
      commit('setActiveDeck', deck)
      commit('setActiveFolder', null)
    },

    selectDeckByPath({ dispatch, state }, { path, name }) {
      const tokens = mag.Deck.pathTokens(path)
      let node = this.decks
      for (const token of tokens) {
        node = node.folders.find(f => f.name === token)
      }

      const deck = node.decks.find(d => d.name === name)
      dispatch('selectDeck', deck)
    },

    selectFolder({ commit }, path) {
      commit('setActiveDeck', null)
      commit('setActiveFolder', path)
    },

    toggleCardLock({ commit, state }) {
      commit('setCardLock', !state.cardlock)
    },

    ////////////////////////////////////////////////////////////////////////////////
    // Card Database

    loadCardDatabase({ dispatch }) {
      loadCardsFromDatabase(
        cards => dispatch('loadCardDatabaseSuccess', cards),
        error => { throw new Error(error) }
      )
    },

    loadCardDatabaseSuccess({ commit, state }, cards) {
      const cleanedCards = cards
        .filter(card => Boolean(card.type_line) && !card.type_line.startsWith('Card'))

      commit('setDatabase', cleanedCards)
      commit('setCardsLoaded', true)
      console.log('Card database ready')
    },

    updateCardDatabase({ commit, dispatch }) {
      commit('setCardsLoaded', false)
      updateLocalCards()
      dispatch('loadCardDatabase')
    },
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

async function loadCardsFromDatabase(successFunc, errorFunc) {
  console.log('loadCardsFromDatabase')

  openLocalStorage(
    // Success func
    db => {
      const objectStore = db.transaction('cards').objectStore('cards')
      const cursor = objectStore.openCursor()

      let cards = null

      cursor.addEventListener('success', (e) => {
        const cursor = e.target.result

        if (cursor) {
          console.log('Cursor iteration')
          cards = cursor.value.json_data
          cursor.continue()
        }
        else if (cards ){
          console.log('all values loaded', cards.length)
          db.close()
          successFunc(cards)
        }
        else {
          // Do nothing.
        }
      })
    },

    // Error func (not implemented)
  )
}

async function openLocalStorage(successFunc, errorFunc) {
  const openRequest = window.indexedDB.open('cards', 1)

  openRequest.addEventListener('error', () => {
    errorFunc('Unable to open database')
  })

  openRequest.addEventListener('success', () => {
    console.log('Database opened successfully')
    successFunc(openRequest.result)
  })

  openRequest.addEventListener('upgradeneeded', (e) => {
    this.cardDatabase.db = e.target.result

    console.log(`Upgrading database to version ${this.cardDatabase.db.version}`)

    // Create an objectStore in our database to store notes and an auto-incrementing key
    // An objectStore is similar to a 'table' in a relational database
    const objectStore = this.cardDatabase.db.createObjectStore('cards', {
      keyPath: 'id',
      autoIncrement: true,
    })

    // Define what data items the objectStore will contain
    objectStore.createIndex('json_data', 'json_data', { unique: false })

    console.log('Database setup complete')
  })
}

async function saveCardsToDatabase(cards) {
  const newItem = { json_data: cards }

  openLocalStorage(
    db => {
      const transaction = db.transaction(['cards'], 'readwrite')
      const objectStore = transaction.objectStore('cards')
      const addRequest = objectStore.add(newItem)

      // What is the difference between success and complete?
      addRequest.addEventListener('success', () => {})

      transaction.addEventListener('complete', () => {
        console.log('Transaction completed: database modification finished.')
        this.loadCardsFromDatabase()
      })
    },
    error => { throw new Error(error) }
  )
}

async function getLatestCardDataFromServer(successFunc, errorFunc) {
  console.log('fetching card data')
  const requestResult = await axios.post('/api/card/all')
  console.log('card data fetched')

  if (requestResult.data.status === 'success') {
    successFunc(requestResult.data.cards)
  }
  else {
    errorFunc('Error fetching card data from server. ' + requestResult.data.message)
  }
}

// This fetches the latest card data from the database and stores it locally
// in an IndexedDB.
async function updateLocalCards() {
  getLatestCardDataFromServer(
    cards => { saveCardsToDatabase(cards) },
    error => { throw new Error(error) },
  )
}
