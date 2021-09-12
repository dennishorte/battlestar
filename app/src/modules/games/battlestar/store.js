import axios from 'axios'
import bsgutil from './lib/util.js'
import decks from './lib/decks.js'
import factory from './lib/factory.js'
import util from '@/util.js'


function cardAdjustVisibility(state, card, zoneName) {
  const zone = zoneGet(state, zoneName)

  if (zone.visibility === 'open') {
    card.visibility = 'all'
  }
  else if (zone.visibility === 'president') {
    card.visibility = [presidentName()]
  }
  else if (zone.visibility === 'owner') {
    if (card.visibility !== 'all') {
      pushUnique(card.visibility, zone.owner)
    }
  }
  else if (zone.visibility === 'deck'
           || zone.visibility === 'bag') {
    card.visibility = []
  }
  else {
    throw `Unknown zone visibility (${zone.visibility}) for zone ${zone.name}`
  }
}

function cardReveal(state, card) {
  card.visibility = state.game.players.map(p => p.name)
}

function cardView(state, card, player) {
  pushUnique(card.visibility, player.name)
}

function deckGet(state, deckName) {
  const deck = state.game.zones.decks[deckName]
  if (!deck) {
    throw `Unknown deck name: ${deckName}`
  }
  return deck
}

function drawTop(state, path) {
  maybeReshuffleDiscard(state, path)
  const deck = deckGet(state, path).cards
  return deck.shift()
}

function handGet(state, playerId) {
  const player = playerById(state, playerId)
  const hand = state.game.zones.players[player.name]
  return hand
}

function isRevealed(state, card) {
  return card.visibility.length === state.game.players.length
}

function isVisible(state, card) {
  return card.visibility.includes(state.ui.player.name)
}

function logEnrichArgClasses(msg) {
  if (!msg.args)
    return

  for (const key of Object.keys(msg.args)) {
    // Convert string args to a dict
    if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }

    // Ensure the dict has a classes entry
    const classes = msg.args[key].classes || []
    msg.args[key].classes = classes

    if (key === 'player') {
      pushUnique(classes, 'player-name')
    }
    else if (key === 'character') {
      pushUnique(classes, 'character-name')
      pushUnique(classes, bsgutil.characterNameToCssClass(msg.args[key].value))
    }
    else if (key === 'location') {
      pushUnique(classes, 'location-name')
    }
    else if (key === 'phase') {
      pushUnique(classes, 'phase-name')
    }
    else if (key === 'title') {
      pushUnique(classes, 'title-name')
    }
    else if (key === 'card') {
      const card = msg.args['card']
      if (typeof card !== 'object') {
        throw `Pass whole card object to log for better logging. Got: ${card}`
      }
      msg.args['card'] = {
        value: card.name,
        visibility: card.visibility,
        kind: card.kind,
        classes: [`card-${card.kind}`],
      }
    }
  }
}

function log(state, msgObject) {
  logEnrichArgClasses(msgObject)
  msgObject.actor = state.ui.player.name

  const log = state.game.log
  msgObject.id = log.length
  log.push(msgObject)
}

function maybeReshuffleDiscard(state, path) {
  if (!path.endsWith('deck'))
    return

  const discardPath = path.replace('deck', 'discard')

  let deck = deckGet(state, path)
  let discard = deckGet(state, discardPath)

  if (deck.length == 0 && discard.length > 0) {
    deck = util.shuffleArray([...discard])
    discard = []

    log(state, {
      template: "Shuffled this discard pile back into {deck}",
      classes: ['admin-action', 'skill-deck-shuffle'],
      args: {
        deck: path,
      },
    })
  }
}

function moveCard(state, data) {
  const source = zoneGet(state, data.source).cards
  const target = zoneGet(state, data.target).cards

  const sourceIdx = data.cardId
                  ? source.findIndex(x => x.id === data.cardId)
                  : data.sourceIndex
  const targetIdx = data.targetIdx || target.length

  if (sourceIdx === -1) {
    throw `Card not found in source. ${data.cardId}, ${data.source}`
  }

  // The actual state updates
  const card = source.splice(sourceIdx, 1)[0]
  target.splice(targetIdx, 0, card)

  // Adjust the card's visibility based on its new zone
  cardAdjustVisibility(
    state,
    card,
    data.target,
  )

  log(state, {
    template: "{card} moved from {source} to {target}",
    classes: ['card-move'],
    args: {
      card,
      source: data.source,
      target: data.target,
    },
  })
}

function playerCanSeeCard(state, player, card) {
  return card.visibility === 'all'
      || (card.visibility === 'president' && playerIsPresident(state, player))
      || card.visibility.includes(player.name)
}

function playerIsPresident(state, player) {
  return player.name === presidentName(state)
}

function playerById(state, playerId) {
  return state.game.players.find(p => p._id === playerId)
}

function pushUnique(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}

function presidentName(state) {
  for (const player of state.game.players) {
    const zone = zoneGet(state, `players.${player.name}`)
    if (zone.cards.find(c => c.name === 'President')) {
      return player.name
    }
  }
  return ''
}

function viewerCanSeeCard(state, card) {
  return playerCanSeeCard(state, state.ui.player, card)
}

function viewerIsPresident(state) {
  return playerIsPresident(state, state.ui.player)
}

function zoneGet(state, name) {
  const tokens = name.split('.')
  let zone = state.game.zones
  while (tokens.length) {
    const next = tokens.shift()
    zone = zone[next]
    if (!zone) {
      throw `Error loading ${next} of zone ${name}.`
    }
  }

  return zone
}


export default {
  namespaced: true,

  state() {
    return {
      ////////////////////////////////////////////////////////////
      // Data

      data: {
        decks: {},  // All of the raw decks, for displaying information.
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
          sourceIndex: -1,
        },

        modalZone: {
          name: '',
        },

        player: {},

        undone: [],
        undoing: false,
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
    countersNukes: (state) => state.game.counters.nukes,
    countersJumpTrack: (state) => state.game.counters.jumpTrack,

    deck: (state) => (key) => deckGet(state, key),
    hand: (state) => (playerName) => state.game.zones.players[playerName],
    players: (state) => state.game.players,
    visible: (state) => (card) => isVisible(state, card),
    zone: (state) => (key) => zoneGet(state, key),
    zones: (state) => state.game.zones,

    setupLoyaltyComplete: (state) => state.game.setupLoyaltyComplete,

    viewerCanSeeCard: (state) => (card) => viewerCanSeeCard(state, card),
    viewerIsPresident: (state) => viewerIsPresident(state),


    ////////////////////////////////////////////////////////////
    // Data

    deckData: (state) => (key) => state.data.decks[key],


    ////////////////////////////////////////////////////////////
    // UI

    grab: (state) => state.ui.grab,
    uiModalZone: (state) => state.ui.modalZone,
  },

  mutations: {

    draw(state, { playerId, deckName }) {
      const card = drawTop(state, deckName)
      handGet(state, playerId).cards.push(card)

      const playerName = playerById(state, playerId).name

      log(state, {
        template: "{player} draw a card from {deck}",
        classes: ['player-action', 'draw'],
        args: {
          player: playerName,
          deck: deckName,
        },
      })
    },

    move(state, data) {
      moveCard(state, data)
    },

    phaseSet(state, phase) {
      state.game.phase = phase

      log(state, {
        template: "Phase set to {phase}",
        classes: ['phase-change'],
        args: { phase },
      })
    },

    resourceChange(state, { name, amount }) {
      state.game.counters[name] += amount
    },

    userSet(state, user) {
      state.ui.player = user
    },

    zoneRevealAll(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      for (const card of cards) {
        if (!isRevealed(state, card)) {
          cardReveal(state, card)
        }
      }
    },

    zoneRevealNext(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      for (const card of cards) {
        if (!isRevealed(state, card)) {
          cardReveal(state, card)
          break
        }
      }
    },

    zoneShuffle(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      cards.forEach(c => c.visibility = [])
      util.shuffleArray(cards)

      log(state, {
        template: "{zone} shuffled",
        classes: [],
        args: {
          zone: zoneName,
        },
      })
    },

    zoneViewAll(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      for (const card of cards) {
        if (!isVisible(state, card)) {
          cardView(state, card, state.ui.player)
        }
      }
    },

    zoneViewNext(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      for (const card of cards) {
        if (!isVisible(state, card)) {
          cardView(state, card, state.ui.player)
          break
        }
      }
    },
  },

  actions: {
    characterInfoRequest({ state }, name) {
      state.ui.charactersModal.selected = name
    },

    async load({ dispatch, state }, data) {
      // Load the static deck data (used in info panels)
      state.data.decks = decks.factory(data.options.expansions)
      state.game = data

      if (!data.initialized) {
        await factory.initialize(data)
        await dispatch('save')
        await dispatch('snapshotCreate')
      }
    },

    async save({ state }) {
      const requestResult = await axios.post('/api/game/save', state.game)
      if (requestResult.data.status !== 'success') {
        throw requestResult.data.message
      }
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

    zoneClick({ commit, state }, data) {
      if (state.ui.grab.source) {
        if (state.ui.grab.source !== data.source) {
          commit('move', {
            source: state.ui.grab.source,
            sourceIndex: state.ui.grab.sourceIndex,
            target: data.source,
            targetIndex: data.sourceIndex,
          })
        }

        state.ui.grab = {}
      }
      else {
        state.ui.grab = data
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

      state.ui.redoing = false
    },

    async reset({ state, dispatch }) {
      const snapshots = await dispatch('snapshotFetch')
      const oldest = snapshots[0]
      state.game = oldest.game
    },

  },
}
