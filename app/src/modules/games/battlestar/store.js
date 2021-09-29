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
    crisisDestinyAdded: (state) => state.game.crisisDestinyAdded,
    crisisStep: (state) => state.game.crisisStep,
    deck: (state) => (key) => $.deckGet(state, key),
    discard: (state) => (key) => $.discardGet(state, key),
    hand: (state) => (playerName) => $.playerZone(state, playerName),
    phase: (state) => state.game.phase,
    player: (state) => (name) => $.playerByName(state, name),
    playerActive: (state) => $.playerByName(state, state.game.activePlayer),
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

    uiCanRedo: (state) => state.game.hasUndone,
    uiCanUndo: (state) => state.game.history.length > 0,

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
  },
}
