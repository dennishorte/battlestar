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

  cleanCommonCrisis({ commit, getters }) {
    const crisis = getters['commonCrisis']
    commit('move', {
      source: 'common',
      cardId: crisis.id,
      target: 'discard.crisis',
    })
  },

  drawSkills({ commit }, { playerName, kinds }) {
    for (const kind of kinds) {
      const deckName = `decks.${kind}`
      const playerZone = `players.${playerName}`

      commit('move', {
        source: deckName,
        target: playerZone,
      })
    }
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
      state.game = data
    }

    else {
      await factory.initialize(data)
      state.game = data

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
    const requestResult = await axios.post('/api/game/notify', {
      gameId: state.game._id,
      userId: user._id,
    })

    if (requestResult.data.status !== 'success') {
      throw requestResult.data.message
    }
  },

  phaseSet({ state }, phase) {
    $.log(state, {
      template: "Phase set to {phase}",
      classes: ['phase-change'],
      args: { phase },
    })

    state.game.phase = phase

    if (phase === 'main-crisis') {
      if ($.zoneGet(state,'crisisPool').cards.length === 0) {
        state.game.players.forEach(p => p.crisisHelp = '')
      }
    }
  },

  playerAdvance({ dispatch, state }) {
    const activePlayer = $.playerByName(state, state.game.activePlayer)
    state.game.activePlayer = $.playerFollowing(state, activePlayer).name
    $.log(state, {
      template: `Start turn of {player}`,
      classes: ['pass-turn'],
      args: {
        player: state.game.activePlayer,
      },
    })

    dispatch('phaseSet', 'main-receive-skills')
  },

  refillDestiny({ commit, state }) {
    $.log(state, {
      template: 'Refilling destiny deck',
      classes: ['admin-action'],
      args: {},
    })

    for (const skill of bsgutil.skillList) {
      for (let i = 0; i < 2; i++) {
        if (skill === 'treachery')
          continue

        commit('move', {
          source: `decks.${skill}`,
          sourceIndex: 0,
          target: `destiny`,
          reshuffle: true,
        })
      }
    }
  },

  removeShips({ commit, state }) {
    $.log(state, {
      template: 'Removing all ships',
      classes: ['admin-action'],
      args: {}
    })

    for (const zone of Object.values(state.game.zones.space)) {
      const cardsCopy = [...zone.cards]

      for (const card of cardsCopy) {
        let deck
        if (card.kind.startsWith('ships.')) {
          deck = card.kind
        }
        else if (card.kind === 'player-token') {
          deck = 'locations.galactica.hangarDeck'
        }
        else if (card.kind === 'civilian') {
          deck = 'decks.civilian'
        }
        else {
          alert(`Unknown ship kind '${card.kind}'. Can't clean up. Do not save. Please reload.`)
          return
        }

        commit('move', {
          source: `space.${zone.name}`,
          cardId: card.id,
          target: deck,
        })
      }
    }
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
