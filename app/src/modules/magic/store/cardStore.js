import { get as getKey, set as setKey } from 'idb-keyval'
import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    cardlist: [],
    lookup: {},

    localVersions: '__NOT_READY__',
    remoteVersions: '__NOT_READY__',

    cardsReady: false,
    log: [],
  }),

  getters: {
    all(state) {
      return state.cardlist
    },

    byDatabaseId(state) {
      return (id) => state.cardlist.find(card => card._id === id)
    },

    cardLink(state) {
      return (databaseId) => '/magic/card/' + databaseId
    },

    cardNames(state) {
      return Object.keys(state.lookup).sort()
    },

    getLookupFunc(state) {
      return (cardId, opts) => {
        return mag.util.card.lookup.getByIdDict(cardId, state.lookup, opts)
      }
    },
  },

  mutations: {
    clearLog(state) {
      state.log = []
    },

    logError(state, msg) {
      state.log.push(msg)
    },

    logInfo(state, msg) {
      state.log.push(msg)
    },

    setCardList(state, cardlist) {
      state.cardlist = cardlist
    },

    setCardLookup(state, cardLookup) {
      state.lookup = cardLookup
    },

    setCardsReady(state, value=true) {
      state.cardsReady = value
    },

    setLocalVersions(state, versions) {
      state.localVersions = versions
    },

    setRemoteVersions(state, versions) {
      state.remoteVersions = versions
    },

    setUpdateNeededCustom(state, value) {
      state.updateNeededCustom = value
    },

    setUpdateNeededScryfall(state, value) {
      state.updateNeededScryfall = value
    },
  },

  actions: {
    insertCardData({ getters }, cardlist) {
      const lookupFunc = getters['getLookupFunc']
      mag.util.card.lookup.insertCardData(cardlist, lookupFunc)

      const missingData = []
      for (const card of cardlist) {
        if (!card.data) {
          missingData.push(card)
        }
      }

      if (missingData.length > 0) {
        console.log(missingData)
        alert('Unable to fetch data for some cards')
      }
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Data loading

    async ensureLoaded({ commit, dispatch, state, getters }) {
      console.log('ensureLoaded')
      commit('clearLog')
      commit('logInfo', 'Loading card data')

      if (state.cardsReady) {
        console.log('...already loaded once')
        commit('logInfo', 'Cards were previously loaded')
      }
      else {
        await dispatch('ensureLatest')
        await dispatch('loadCards')
      }
    },

    async ensureLatest({ dispatch, state }) {
      const localVersions = await getLocalVersions()
      const remoteVersions = await getRemoteVersions.call(this)

      const toUpdate = Object
        .keys(remoteVersions)
        .filter(source => remoteVersions[source] !== localVersions[source])

      for (const source of toUpdate) {
        await dispatch('updateLocalDatabase', source)
      }
    },

    async loadCards({ commit, dispatch }) {
      try {
        console.log('...load cards')
        commit('logInfo', 'Loading cards from database')

        const cards = await loadCardsFromDatabase()

        for (const card of cards) {
          if (card.data) {
            console.log(card)
            break
          }
        }

        commit('setCardList', cards)
        commit('setCardLookup', mag.util.card.lookup.dictFactory(cards))
        commit('setCardsReady')

        console.log('...card database ready')
        commit('logInfo', 'Cards successfully loaded from local database')
      }
      catch (err) {
        commit('logInfo', 'ERROR')
        throw err
      }
    },

    async reloadDatabase({ commit, dispatch }) {
      commit('setCardsReady', false)
      await dispatch('ensureLoaded')
    },

    async updateLocalDatabase({ commit, state }, source) {
      commit('logInfo', `Updating card database: ${source}. This can take several minutes.`)
      const { cards, version } = await getLatestCardDataFromServer.call(this, source)
      await setKey('cards_' + source, cards)
      await setKey('version_' + source, version)
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Card editing

    async save({ dispatch }, { cubeId, updated, comment }) {
      updated = updated.data ? updated.data : updated

      let response

      if (updated._id) {
        response = await this.$post('/api/magic/card/updated', {
          cardId: updated._id,
          cardData: updated.data,
          comment,
        })
      }

      else {
        response = await this.$post('/api/magic/card/create', {
          cardData: updated,
          cubeId,
          comment,
        })
      }

      // In either case, update the local card database.
      await dispatch('reloadDatabase')

      return response.card
    },
  },
}


////////////////////////////////////////////////////////////////////////////////
// Private functions

async function getLocalVersions() {
  return {
    custom: await getKey('version_custom'),
    scryfall: await getKey('version_scryfall'),
  }
}

async function getRemoteVersions() {
  const { versions } = await this.$post('/api/magic/card/versions')
  return versions
}

async function loadCardsFromDatabase() {
  const custom = await getKey('cards_custom')
  const scryfall = await getKey('cards_scryfall')

  return [
    ...(custom || []),
    ...(scryfall || []),
  ]
}

async function getLatestCardDataFromServer(source) {
  const response = await this.$post('/api/magic/card/fetch_all', { source })
  return response[source]
}
