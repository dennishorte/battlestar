import axios from 'axios'
import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    cardlist: [],
    lookup: {},

    localVersion: '__NOT_LOADED__',
    remoteVersion: '__NOT_LOADED__',
    declinedCardUpdate: false,

    loadedOnce: false,
    loading: true,
  }),

  getters: {
    getByIdDict: (state) => (dict) => {
      return mag.util.card.lookup.getByIdDict(dict, state.lookup)
    },

    versionMismatch(state) {
      const value = (
        state.localVersion !== '__NOT_LOADED__'
        && state.remoteVersion !== '__NOT_LOADED__'
        && state.localVersion !== state.remoteVersion
      )
      return value
    },
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

    setCardVersion(state, version) {
      state.localVersion = version
    },

    setRemoteVersion(state, version) {
      state.remoteVersion = version
    },

    setLoadedOnce(state) {
      state.loadedOnce = true
    },
  },

  actions: {
    ensureLoaded({ dispatch, state }) {
      if (!state.loadedOnce) {
        dispatch('loadCards')
        dispatch('getRemoteVersion')
      }
    },

    async getRemoteVersion({ commit }) {
      const requestResult = await axios.post('/api/magic/card/version')
      if (requestResult.data.status === 'success') {
        commit('setRemoteVersion', requestResult.data.version)
      }
      else {
        alert('Error fetching remote cards verion.\n' + requestResult.data.message)
      }
    },

    async loadCards({ commit, dispatch }) {
      commit('setLoadedOnce')
      commit('setCardsLoading')

      const data = await loadCardsFromDatabase()

      commit('setCardVersion', data.version)
      commit('setCardList', data.cards)
      commit('setCardLookup', mag.util.card.createCardLookup(data.cards))
      //await dispatch('applyCardFilters')

      commit('setCardsLoaded')
      console.log('Card database ready')
    },

    async updateCards({ commit }) {
      commit('setCardsLoading')
      await updateLocalCards()
    },
  },
}


////////////////////////////////////////////////////////////////////////////////
// Private functions

function loadCardsFromDatabase() {
  return new Promise(async (resolve, reject) => {
    console.log('loadCardsFromDatabase')

    const db = await openLocalStorage()

    const objectStore = db.transaction('cards').objectStore('cards')
    const cursor = objectStore.openCursor()

    let cards = []
    let version = '__NO_VERSION__'

    cursor.addEventListener('success', (e) => {
      const cursor = e.target.result

      if (cursor) {
        console.log('Cursor iteration')
        cards = cursor.value.json_data
        version = cursor.value.version
        cursor.continue()
      }
      else {
        console.log('all values loaded', cards.length)
        db.close()

        resolve({ cards, version })
      }
    })
  })
}

async function openLocalStorage(handlers) {
  return new Promise((resolve, reject) => {
    const openRequest = window.indexedDB.open('cards', 1)

    openRequest.addEventListener('error', () => {
      reject(new Error('Unable to open local card database'))
    })

    openRequest.addEventListener('success', () => {
      console.log('Database opened successfully')
      resolve(openRequest.result)
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
  })
}

// This fetches the latest card data from the database and stores it locally
// in an IndexedDB.
async function updateLocalCards() {
  getLatestCardDataFromServer(
    (cards, version) => { saveCardsToDatabase(cards, version) },
    error => { throw new Error(error) },
  )
}

async function getLatestCardDataFromServer(successFunc, errorFunc) {
  console.log('fetching card data')
  const requestResult = await axios.post('/api/magic/card/all')
  console.log('card data fetched')

  if (requestResult.data.status === 'success') {
    console.log(requestResult.data)
    const { cards, version } = requestResult.data
    successFunc(cards, version)
  }
  else {
    errorFunc('Error fetching card data from server. ' + requestResult.data.message)
  }
}

async function saveCardsToDatabase(cards, version) {
  const newItem = {
    json_data: cards,
    version,
  }

  console.log('saving data with version:', newItem.version)

  const db = await openLocalStorage()
  const transaction = db.transaction(['cards'], 'readwrite')
  const objectStore = transaction.objectStore('cards')
  const addRequest = objectStore.add(newItem)

  // What is the difference between success and complete?
  addRequest.addEventListener('success', () => {})

  transaction.addEventListener('complete', () => {
    console.log('Transaction completed: database modification finished.')
    alert('Reload page to see changes')
  })
}
