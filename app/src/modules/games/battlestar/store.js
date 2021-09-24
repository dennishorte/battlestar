import actions from './store/actions.js'
import mutations from './store/mutations.js'

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
    playerNext: (state) => $.playerNext(state),
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
    ...actions,

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
