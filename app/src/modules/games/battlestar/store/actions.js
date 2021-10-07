import axios from 'axios'
import { bsg } from 'battlestar-common'

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

  async load({ commit, state }, data) {
    const locations = bsg.res.locations

    // Load the static deck data (used in info panels)
    state.data.decks = bsg.deckbuilder(data.options.expansions)
    state.data.locations = bsg.util.expansionFilter(locations, data.options.expansions)

    commit('load', data)
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
      state.ui.errorMessage = requestResult.data.message
    }
    else {
      state.ui.unsavedActions = false
    }
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
