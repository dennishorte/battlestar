import axios from 'axios'

import bsgutil from '../lib/util.js'
import decks from '../lib/decks.js'
import factory from '../lib/factory.js'
import locations from '../res/location.js'

import * as $ from './helpers.js'


export default {
  characterInfoRequest({ state }, name) {
    state.ui.charactersModal.selected = name
  },

  grabCancel({ state }) {
    $.grabCancel(state)
  },

  grabInfo({ state, getters }) {
    const grab = getters.grab
    const card = getters.cardAt(grab.source, grab.index)
    $.grabCancel(state)

    if (card.kind === 'character') {
      state.ui.charactersModal.selected = card.name
      return 'characters-modal'
    }
    else if (card.kind === 'skill') {
      state.ui.skillCardsModal.selected = card.name
      return 'skill-cards-modal'
    }
    else {
      state.ui.modalCard.card = card
      return 'card-modal'
    }
  },

  impersonate({ state }, name) {
    const player = $.playerByName(state, name)
    state.ui.player._id = player._id
    state.ui.player.name = player.name
  },

  async load({ commit, dispatch, state }, data) {
    // Load the static deck data (used in info panels)
    state.data.decks = decks.factory(data.options.expansions)
    state.data.locations = bsgutil.expansionFilter(locations, data.options.expansions)

    if (data.initialized) {
      commit('load', data)
    }

    else {
      await factory.initialize(data)
      commit('load', data)

      commit('log', {
        template: 'Initializing Game',
        classes: ['admin-action'],
        args: {},
      })

      commit('log', {
        template: 'Setting up initial ships',
        classes: ['admin-action'],
        args: {},
      })

      // Basestar
      commit('move', {
        source: 'ships.basestarA',
        target: 'space.space0',
      })

      // Raiders
      for (let i = 0; i < 3; i++) {
        commit('move', {
          source: 'ships.raiders',
          target: 'space.space0',
        })
      }

      // Vipers
      commit('move', {
        source: 'ships.vipers',
        target: 'space.space5',
      })
      commit('move', {
        source: 'ships.vipers',
        target: 'space.space4',
      })

      // Civilians
      for (let i = 0; i < 2; i++) {
        commit('move', {
          source: 'decks.civilian',
          target: 'space.space3',
        })
      }

      await dispatch('save')
    }
  },

  locationInfoRequest({ state }, name) {
    state.ui.modalLocation.name = name
  },

  async notify({ state }, playerId) {
    const requestResult = await axios.post('/api/game/notify', {
      gameId: state.game._id,
      userId: playerId,
    })

    if (requestResult.data.status !== 'success') {
      throw requestResult.data.message
    }
  },

  async pass({ commit, dispatch, getters, state }, nameIn) {
    let name = nameIn

    if (name === 'president') {
      name = $.presidentName(state)
    }
    else if (name === 'admiral') {
      name = $.admiralName(state)
    }
    else if (name === 'next') {
      name = $.playerFollowing(state, getters.uiViewer).name
    }

    if (!name) {
      throw `Unknown player. in: ${nameIn} final: ${name}`
    }

    const user = $.playerByName(state, name)
    commit('passTo', name)

    await dispatch('save')
    await dispatch('notify', user._id)
  },

  async save({ state }) {
    const requestResult = await axios.post('/api/game/save', state.game)
    if (requestResult.data.status !== 'success') {
      throw requestResult.data.message
    }
    state.ui.unsavedActions = false
  },

  skillCardInfoRequest({ state }, cardName) {
    state.ui.skillCardsModal.selected = cardName
  },

  userSet({ state }, user) {
    state.ui.player = user
  },

  /*
     If some action was taken, return true. Otherwise, return false.
   */
  zoneClick({ commit, state }, data) {
    const topDeck = data.index === 'top'
    data.index = topDeck ? 0 : data.index

    if (state.ui.grab.source) {
      if (state.ui.grab.source !== data.source) {
        commit('move', {
          source: state.ui.grab.source,
          sourceIndex: state.ui.grab.index,
          target: data.source,
          targetIndex: data.index,
        })
      }

      $.grabCancel(state)

      return true
    }
    else {
      const zone = $.zoneGet(state, data.source)
      if (topDeck) {
        if (zone.noTopDeck) {
          return false
        }
        else {
          commit('maybeReshuffleDiscard', zone.name)
        }
      }

      state.ui.grab = data

      return true
    }
  },

  zoneViewer({ state }, zoneName) {
    state.ui.modalZone.name = zoneName
  },
}
