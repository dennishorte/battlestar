import { get as getKey, set as setKey } from 'idb-keyval'
import { mag, util } from 'battlestar-common'
import UICardWrapper from '@/modules/magic/util/card.wrapper'


export default {
  namespaced: true,

  state: () => ({
    cards: null,
    cardsReady: false,

    // This is displayed while loading cards in MagicWrapper.vue
    log: [],
  }),

  getters: {
    cards(state) {
      return state.cards
    },

    cardLink(state) {
      return (databaseId) => '/magic/card/' + databaseId
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
  },

  actions: {
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

        return cards.flat().map(c => new UICardWrapper(c))
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
          state.cards = mag.util.card.lookup.create(cards)
          state.cardsReady = true
        }
      }
      catch (err) {
        commit('logInfo', 'ERROR')
        throw err
      }
    },

    getByIds({ state }, cardIds) {
      return cardIds.map(id => state.cards.byId[id])
    },

    async update({ dispatch }, { card, comment }) {
      await this.$post('/api/magic/card/update', {
        cardId: card._id,
        cardData: card.toJSON(),
        comment,
      })
      await dispatch('reloadDatabase')
    },

    async reloadDatabase({ dispatch, state }) {
      state.cardsReady = false
      await dispatch('ensureLoaded')
    },
  },
}
