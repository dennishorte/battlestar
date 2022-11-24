import axios from 'axios'
import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    cardlist: [],
    lookup: {},

    loadedOnce: false,
    loading: true,
  }),

  getters: {
    getByIdDict: (state) => (dict) => {
      return mag.util.card.lookup.getByIdDict(dict, state.lookup)
    }
  },

  mutations: {
    setCardList(state, cardlist) {
      state.cardlist = cardlist
    },

    setCardLookup(state, cardLookup) {
      state.lookup = cardLookup
    },

    setCardsLoaded(state) {
      state.loading = false
    },

    setCardsLoading(state) {
      state.loading = true
    },

    setLoadedOnce(state) {
      state.loadedOnce = true
    },
  },

  actions: {
    ensureLoaded({ dispatch, state }) {
      if (!state.loadedOnce) {
        dispatch('loadCardsFromLocalDatabase')
      }
    },

    loadCardsFromLocalDatabase({ commit, dispatch }) {
      commit('setLoadedOnce')
      commit('setCardsLoading')
      loadCardsFromDatabase(
        cards => dispatch('loadCardDatabaseSuccess', cards),
        error => { throw new Error(error) }
      )
    },

    async loadCardDatabaseSuccess({ commit, dispatch }, cards) {
      commit('setCardList', cards)
      commit('setCardLookup', mag.util.card.createCardLookup(cards))
      //await dispatch('applyCardFilters')

      commit('setCardsLoaded')
      console.log('Card database ready')
    },

    async updateLocalCardDatabase({ commit }) {
      commit('setCardsLoading')
      await updateLocalCards()
    },
  },
}


////////////////////////////////////////////////////////////////////////////////
// Private functions

async function loadCardsFromDatabase(successFunc, errorFunc) {
  console.log('loadCardsFromDatabase')

  openLocalStorage(
    // Success func
    db => {
      const objectStore = db.transaction('cards').objectStore('cards')
      const cursor = objectStore.openCursor()

      let cards = []

      cursor.addEventListener('success', (e) => {
        const cursor = e.target.result

        if (cursor) {
          console.log('Cursor iteration')
          cards = cursor.value.json_data
          cursor.continue()
        }
        else {
          console.log('all values loaded', cards.length)
          db.close()
          successFunc(cards)
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
    const db = e.target.result

    console.log(`Upgrading database to version ${db.version}`)

    // Create an objectStore in our database to store notes and an auto-incrementing key
    // An objectStore is similar to a 'table' in a relational database
    const objectStore = db.createObjectStore('cards', {
      keyPath: 'id',
      autoIncrement: true,
    })

    // Define what data items the objectStore will contain
    objectStore.createIndex('json_data', 'json_data', { unique: false })

    console.log('Database setup complete')
  })
}

// This fetches the latest card data from the database and stores it locally
// in an IndexedDB.
async function updateLocalCards() {
  getLatestCardDataFromServer(
    cards => { saveCardsToDatabase(cards) },
    error => { throw new Error(error) },
  )
}

async function getLatestCardDataFromServer(successFunc, errorFunc) {
  console.log('fetching card data')
  const requestResult = await axios.post('/api/magic/card/all')
  console.log('card data fetched')

  if (requestResult.data.status === 'success') {
    successFunc(requestResult.data.cards)
  }
  else {
    errorFunc('Error fetching card data from server. ' + requestResult.data.message)
  }
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
        alert('Reload page to see changes')
      })
    },
    error => { throw new Error(error) }
  )
}
