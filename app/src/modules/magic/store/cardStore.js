import { get as getKey, set as setKey } from 'idb-keyval'
import { mag, util } from 'battlestar-common'


export default {
  namespaced: true,

  state: () => ({
    cardlist: [],
    lookup: {},

    cardsReady: false,

    // This is displayed while loading cards in MagicWrapper.vue
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

    logInfo(state, msg) {
      console.log('info: ', msg)
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

    setUpdateNeededCustom(state, value) {
      state.updateNeededCustom = value
    },

    setUpdateNeededScryfall(state, value) {
      state.updateNeededScryfall = value
    },
  },

  actions: {
    ////////////////////////////////////////////////////////////////////////////////
    // Data loading

    async ensureLoaded({ commit, state }) {
      const post = this.$post

      async function _loadLocalAndRemoteVersions() {
        const remote = await post('/api/magic/card/versions')

        const localVersions = {}
        for (const key of Object.keys(remote.versions)) {
          localVersions[key] = await getKey('version_' + key)
        }

        return {
          local: localVersions,
          remote: remote.versions,
        }
      }

      async function _maybeUpdateLocalDatabase(versions) {
        const toUpdate = Object
          .keys(versions.remote)
          .filter(source => versions.remote[source] !== versions.local[source])

        for (const source of toUpdate) {
          commit('logInfo', `Updating card database: ${source}. This can take several minutes.`)
          const response = await post('/api/magic/card/all', { source })
          await setKey('cards_' + source, response[source].cards)
          await setKey('version_' + source, response[source].version)
        }
      }

      async function _loadCardsFromLocalDatabase(sources) {
        commit('logInfo', 'Loading cards from database')

        const cards = await Promise.all(sources.map(async (source) => {
          const cardData = await getKey('cards_' + source)
          return cardData
        }))

        commit('logInfo', 'Cards successfully loaded from local database')

        return cards
      }

      try {
        commit('clearLog')
        commit('logInfo', 'Loading card data')

        if (state.cardsReady) {
          commit('logInfo', 'Cards were previously loaded')
        }
        else {
          const versions = await _loadLocalAndRemoteVersions()
          await _maybeUpdateLocalDatabase(versions)
          const cards = await _loadCardsFromLocalDatabase(Object.keys(versions.remote))
          commit('setCardList', cards)
          commit('setCardsReady')
        }
      }
      catch (err) {
        commit('logInfo', 'ERROR')
        throw err
      }
    },

    async _reloadDatabase({ commit, dispatch }) {
      commit('setCardsReady', false)
      await dispatch('ensureLoaded')
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
      await dispatch('_reloadDatabase')
      return response.card
    },
  },
}
