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
    cardFilters: [],
    cardLock: false,
    decks: mag.Deck.buildHierarchy([testDeck, testDeckCmd]),
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
    },

    setActiveDeck(state, rawDeck) {
      state.activeDeck = mag.Deck.deserialize(rawDeck, state.cardDatabase.lookup)
    },
    setDecks(state, decks) {
      state.decks = decks
    },

    setManagedCard(state, card) {
      state.managedCard = card
    },

    setCardLock(state, value) {
      state.cardLock = value
    },
  },

  actions: {
    ////////////////////
    // Card Filters
    applyCardFilters({ commit }) {

    },
    addCardFilter({ commit, state }, filter) {
      // There is only ever a single color or identity filter
      if (filter.kind === 'identity' || filter.kind === 'color') {
        const existing = state.cardFilters.find(f => f.kind === filter.kind)
        commit('removeCardFilter', existing)
      }

      commit('addCardFilter', filter)
    },
    clearCardFilters({ commit }) {
      commit('setCardFilters', [])
    },
    removeCardFilter({ commit }, filter) {
      commit('removeCardFilter', filter)
    },

    ////////////////////
    // Manage Cards
    manageCard({ commit }, card) {
      commit('setManagedCard', card)
    },
    unmanageCard({ commit }) {
      commit('setManagedCard', null)
    },

    ////////////////////
    // Misc

    fetchDecks({ commit, rootGetters }) {
      const requestResult = axios.post('/api/user/decks', {
        userId: rootGetters.auth.userId,
      })
      if (requestResult.data.status === 'success') {
        const deckHierarchy = mag.Deck.buildHierarchy(requestResult.data.decks)
        this.commit('setDecks', deckHierarchy)
      }
    },

    selectDeck({ commit }, deck) {
      commit('setActiveDeck', deck)
    },

    toggleCardLock({ commit, state }) {
      commit('setCardLock', !state.cardLock)
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
