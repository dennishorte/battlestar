import axios from 'axios'

import mutations from './store/mutations.js'

import bsgutil from './lib/util.js'
import decks from './lib/decks.js'
import factory from './lib/factory.js'
import locations from './res/location.js'

import * as $ from './store/helpers.js'


export default {
  namespaced: true,

  state() {
    return {
      ////////////////////////////////////////////////////////////
      // Data

      data: {
        decks: {},  // All of the raw decks, for displaying information.
        locations: [],  // Raw location data
      },

      ////////////////////////////////////////////////////////////
      // UI State

      ui: {
        charactersModal: {
          selected: '',
        },

        skillCardsModal: {
          selected: '',
        },

        grab: {
          source: '',
          index: -1,
        },

        newLogs: [],

        modalCard: {
          card: {},
        },

        modalLocation: {
          name: '',
        },

        modalZone: {
          name: '',
        },

        player: {},

        unsavedActions: false,

        undone: [],
        undoing: false,
        redoing: false,
      },

      ////////////////////////////////////////////////////////////
      // Game State

      game: {},
    }
  },

  getters: {
    ////////////////////////////////////////////////////////////
    // Game

    countersFood: (state) => state.game.counters.food,
    countersFuel: (state) => state.game.counters.fuel,
    countersMorale: (state) => state.game.counters.morale,
    countersPopulation: (state) => state.game.counters.population,
    countersRaptors: (state) => state.game.counters.raptors,
    countersNukes: (state) => state.game.counters.nukes,
    countersDistance: (state) => state.game.counters.distance,
    countersJumpTrack: (state) => state.game.counters.jumpTrack,

    cardAt: (state) => (source, index) => $.zoneGet(state, source).cards[index],
    commonCrisis: (state) => $.commonCrisis(state),
    deck: (state) => (key) => $.deckGet(state, key),
    discard: (state) => (key) => $.discardGet(state, key),
    hand: (state) => (playerName) => $.playerZone(state, playerName),
    phase: (state) => state.game.phase,
    player: (state) => (name) => $.playerByName(state, name),
    playerActive: (state) => state.game.activePlayer,
    playerCharacter: (state) => (playerName) => $.playerCharacter(state, playerName),
    players: (state) => state.game.players,
    visible: (state) => (card) => $.isVisible(state, card),
    zone: (state) => (key) => $.zoneGet(state, key),
    zones: (state) => state.game.zones,

    setupLoyaltyComplete: (state) => state.game.setupLoyaltyComplete,

    viewerCanSeeCard: (state) => (card) => $.viewerCanSeeCard(state, card),
    viewerIsPresident: (state) => $.viewerIsPresident(state),

    waitingFor: (state) => state.game.waitingFor,


    ////////////////////////////////////////////////////////////
    // Data

    dataCharacter: (state) => (name) => state.data.decks.character.cards.find(c => c.name === name ),
    dataLocations: (state) => state.data.locations,
    dataDeck: (state) => (key) => state.data.decks[key],


    ////////////////////////////////////////////////////////////
    // UI

    grab: (state) => state.ui.grab,
    uiModalCard: (state) => state.ui.modalCard,
    uiModalLocation: (state) => state.ui.modalLocation,
    uiModalZone: (state) => state.ui.modalZone,
    uiUnsaved: (state) => state.ui.unsavedActions,
    uiViewer: (state) => state.ui.player,
  },

  mutations: {
    ...mutations,
  },

  actions: {
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

    async load({ dispatch, state }, data) {
      // Load the static deck data (used in info panels)
      state.data.decks = decks.factory(data.options.expansions)
      state.data.locations = bsgutil.expansionFilter(locations, data.options.expansions)
      state.game = data

      if (!data.initialized) {

        await factory.initialize(data)
        $.setupInitialShips(state)
        $.log(state, {
          template: 'Game Initialized',
          classes: ['admin-action'],
          args: {},
        })
        await dispatch('save')
        await dispatch('snapshotCreate')
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

    async snapshotCreate({ state }) {
      const requestResult = await axios.post('/api/snapshot/create', { gameId: state.game._id })
      if (requestResult.data.status !== 'success') {
        throw requestResult.data.message
      }
    },

    async snapshotFetch({ state }) {
      const requestResult = await axios.post('/api/snapshot/fetch', { gameId: state.game._id })
      if (requestResult.data.status !== 'success') {
        throw requestResult.data.message
      }
      return requestResult.data.snapshots
    },

    skillCardInfoRequest({ state }, cardName) {
      state.ui.skillCardsModal.selected = cardName
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
        if (topDeck && zone.noTopDeck) {
          return false
        }

        $.maybeReshuffleDiscard(state, zone)

        state.ui.grab = data

        return true
      }
    },

    zoneViewer({ state }, zoneName) {
      state.ui.modalZone.name = zoneName
    },

    async undo({ state, commit, dispatch }) {
      if (state.game.history.length === 0) {
        return
      }

      state.ui.undoing = true

      state.ui.undone.push(state.game.history.pop())
      const history = [...state.game.history]

      await dispatch('reset')
      for (const mutation of history) {
        commit(mutation.type, mutation.payload)
      }

      // Restore the log from the original history, because it will have the original actor
      // for each of the actions taken.
      const logs = []
      for (const hist of history) {
        if (hist.logs) {
          for (const log of hist.logs) {
            logs.push(log)
          }
        }
      }

      state.game.log = logs
      state.game.history = history
      state.ui.undoing = false
    },

    redo({ state, commit }) {
      if (state.ui.undone.length === 0) {
        return
      }

      state.ui.redoing = true

      const mutation = state.ui.undone.pop()
      commit(mutation.type, mutation.payload)

      if (mutation.logs) {
        for (const log of mutation.logs) {
          state.game.log.push(log)
        }
      }

      state.ui.redoing = false
    },

    async reset({ state, dispatch }) {
      const snapshots = await dispatch('snapshotFetch')
      const oldest = snapshots[0]
      state.game = oldest.game
    },

  },
}
