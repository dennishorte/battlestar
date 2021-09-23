import axios from 'axios'
import seedrandom from 'seedrandom'
import Vue from 'vue'


import bsgutil from './lib/util.js'
import decks from './lib/decks.js'
import factory from './lib/factory.js'
import locations from './res/location.js'
import util from '@/util.js'


////////////////////////////////////////////////////////////////////////////////
// Compatibility helpers.
// Can be removed once backwards compatibility is established.

function compatCrisisHelp(player) {
  if (player.crisisHelp === undefined) {
    Vue.set(player, 'crisisHelp', '')
  }
}


////////////////////////////////////////////////////////////////////////////////
// Private functions

function admiralName(state) {
  return playerWithCard(state, 'Admiral').name
}

function cardAdjustVisibility(state, card, zoneName) {
  const zone = zoneGet(state, zoneName)
  const zoneVis = zone.visibility || zone.kind

  if (zoneVis === 'open') {
    card.visibility = 'all'
  }
  else if (zoneVis === 'president') {
    card.visibility = [presidentName(state)]
  }
  else if (zoneVis === 'owner') {
    if (card.visibility !== 'all') {
      pushUnique(card.visibility, zone.owner)
    }
  }
  else if (zoneVis === 'deck'
           || zoneVis === 'hidden'
           || zoneVis === 'bag') {
    card.visibility = []
  }
  else {
    throw `Unknown zone visibility (${zoneVis}) for zone ${zone.name}`
  }
}

function cardReveal(state, card) {
  card.visibility = state.game.players.map(p => p.name)
}

function cardView(state, card, player) {
  pushUnique(card.visibility, player.name)
}

function commonCrisis(state) {
  const zone = zoneGet(state, 'common')
  const crisis = zone.cards.find(c => c.kind === 'crisis' || c.kind === 'superCrisis')
  return crisis
}

function deckGet(state, deckName) {
  const deck = state.game.zones.decks[deckName]
  if (!deck) {
    throw `Unknown deck name: ${deckName}`
  }
  return deck
}

function discardGet(state, deckName) {
  const deck = state.game.zones.discard[deckName]
  if (!deck) {
    throw `Unknown deck name: ${deckName}`
  }
  return deck
}

function getDiscardName(state, deckName) {
  if (deckName.startsWith('decks.')) {
    return deckName.replace('decks.', 'discard.')
  }

  throw `Unable to get discard for ${deckName}`
}

function getRng(state) {
  const rng = seedrandom(state.game.seed)
  state.game.seed = 'battlestar-galactica' + rng()
  return rng
}

function grabCancel(state) {
  state.ui.grab.source = ''
  state.ui.grab.index = -1
}

function isRevealed(state, card) {
  return card.visibility.length === state.game.players.length
}

function isVisible(state, card) {
  return (
    card.visibility === 'all'
    || (card.visibility === 'president' && presidentName(state) === state.ui.player.name)
    || card.visibility.includes(state.ui.player.name)
  )
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
  if (state.ui.redoing) {
    return
  }

  logEnrichArgClasses(msgObject)
  msgObject.actor = state.ui.player.name

  const log = state.game.log
  msgObject.id = log.length
  log.push(msgObject)

  if (!state.ui.undoing) {
    state.ui.newLogs.push(msgObject)
  }
}

function maybeReshuffleDiscard(state, zone) {
  if (zone.cards.length > 0)
    return

  if (!zone.discard)
    return

  const discardName = zone.name.replace('decks.', 'discard.')
  const discard = zoneGet(state, discardName)

  zone.cards = shuffleArray(state, [...discard.cards])
  discard.cards = []

  log(state, {
    template: "Shuffled discard pile back into {zone}",
    classes: ['skill-deck-shuffle'],
    args: {
      zone: zone.name
    },
  })
}

function moveCard(state, data) {
  const sourceZone = zoneGet(state, data.source)
  const targetZone = zoneGet(state, data.target)

  if (data.reshuffle) {
    maybeReshuffleDiscard(state, sourceZone)
  }

  const source = sourceZone.cards
  const target = targetZone.cards

  const sourceIdx = data.cardId
                  ? source.findIndex(x => x.id === data.cardId)
                  : data.sourceIndex
  const targetIdx = data.targetIndex || target.length

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

  // If the new zone is a 'bag', randomize it automatically
  if (targetZone.kind === 'bag') {
    zoneShuffle(state, data.target)
  }

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

function playerByName(state, name) {
  return state.game.players.find(p => p.name === name)
}

function playerCharacter(state, playerName) {
  const hand = playerZone(state, playerName).cards
  for (const card of hand) {
    if (card.kind === 'character') {
      return card
    }
  }
}

function playerFollowing(state, player) {
  const players = state.game.players
  for (let i = 0; i < players.length; i++) {
    if (players[i].name === player.name) {
      const nextIndex = (i + 1) % players.length
      return players[nextIndex]
    }
  }

  throw `Player not found: ${player.name}`
}

function playerWithCard(state, cardName) {
  for (const player of state.game.players) {
    const zone = zoneGet(state, `players.${player.name}`)
    if (zone.cards.find(c => c.name === cardName)) {
      return player
    }
  }
  return {}
}

function playerZone(state, playerName) {
  return state.game.zones.players[playerName]
}

function presidentName(state) {
  return playerWithCard(state, 'President').name
}

function pushUnique(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}

function setupInitialShips(state) {
  log(state, {
    template: 'Setting up initial ships',
    classes: ['admin-action'],
    args: {},
  })

  // Raiders
  for (let i = 0; i < 3; i++) {
    moveCard(state, {
      source: 'ships.raiders',
      target: 'space.space0',
    })
  }

  // Basestar
  moveCard(state, {
    source: 'ships.basestarA',
    target: 'space.space0',
  })

  // Vipers
  moveCard(state, {
    source: 'ships.vipers',
    target: 'space.space5',
  })
  moveCard(state, {
    source: 'ships.vipers',
    target: 'space.space4',
  })

  // Civilians
  for (let i = 0; i < 2; i++) {
    moveCard(state, {
      source: 'decks.civilian',
      target: 'space.space3',
    })
  }

}

function shuffleArray(state, array) {
  return util.shuffleArray(array, getRng(state))
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

function zoneShuffle(state, zoneName) {
  const cards = zoneGet(state, zoneName).cards
  cards.forEach(c => c.visibility = [])
  shuffleArray(state, cards)
}


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

    cardAt: (state) => (source, index) => zoneGet(state, source).cards[index],
    commonCrisis: (state) => commonCrisis(state),
    deck: (state) => (key) => deckGet(state, key),
    discard: (state) => (key) => discardGet(state, key),
    hand: (state) => (playerName) => playerZone(state, playerName),
    phase: (state) => state.game.phase,
    player: (state) => (name) => playerByName(state, name),
    playerActive: (state) => state.game.activePlayer,
    playerCharacter: (state) => (playerName) => playerCharacter(state, playerName),
    players: (state) => state.game.players,
    visible: (state) => (card) => isVisible(state, card),
    zone: (state) => (key) => zoneGet(state, key),
    zones: (state) => state.game.zones,

    setupLoyaltyComplete: (state) => state.game.setupLoyaltyComplete,

    viewerCanSeeCard: (state) => (card) => viewerCanSeeCard(state, card),
    viewerIsPresident: (state) => viewerIsPresident(state),

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
    uiModalZone: (state) => state.ui.modalZone,
    uiUnsaved: (state) => state.ui.unsavedActions,
    uiViewer: (state) => state.ui.player,
  },

  mutations: {
    compatDamageDiscard(state) {
      const damage = zoneGet(state, 'decks.damageGalactica')
      const discard = zoneGet(state, 'discard.damageGalactica')

      for (const card of discard.cards) {
        damage.cards.push(card)
      }

      Vue.delete(damage, 'discard')
      Vue.delete(state.game.zones.discard, 'damageGalactica')

      log(state, {
        template: 'ship damage hack',
        classes: ['hacks'],
        args: {},
      })
    },

    compatShipZoneUpdates(state) {
      for (const zone of Object.values(state.game.zones.ships)) {
        zone.kind = 'open'
        delete zone.visibility
      }

      log(state, {
        template: 'ship zone visibility hack',
        classes: ['hacks'],
        args: {},
      })
    },

    crisisHelp(state, { playerName, amount }) {
      const player = playerByName(state, playerName)
      compatCrisisHelp(player)
      player.crisisHelp = amount

      log(state, {
        template: `I can help {amount}`,
        classes: ['crisis-help'],
        args: { amount },
      })
    },

    playerNext(state) {
      const activePlayer = playerByName(state, state.game.activePlayer)
      state.game.activePlayer = playerFollowing(state, activePlayer).name
      log(state, {
        template: `Start turn of {player}`,
        classes: ['pass-turn'],
        args: {
          player: state.game.activePlayer,
        },
      })
    },

    move(state, data) {
      moveCard(state, data)
    },

    passTo(state, name) {
      state.game.waitingFor = name
      log(state, {
        template: `Pass to {player}`,
        classes: ['pass-priority'],
        args: {
          player: name,
        },
      })
    },

    resourceChange(state, { name, amount }) {
      const before = state.game.counters[name]
      state.game.counters[name] += amount

      log(state, {
        template: "{counter} adjusted from {before} to {after}",
        classes: ['counter-change'],
        args: {
          counter: name,
          before: before,
          after: before + amount
        },
      })
    },

    userSet(state, user) {
      state.ui.player = user
    },

    zoneDiscardAll(state, zoneName) {
      const zone = zoneGet(state, zoneName)
      for (const card of zone.cards) {
        const discardName = getDiscardName(state, card.deck)
        const discard = zoneGet(state, discardName)
        discard.cards.push(card)
      }

      zone.cards = []

      log(state, {
        template: `All cards from {zone} discarded`,
        classes: [],
        args: {
          zone: zoneName,
        },
      })
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
      zoneShuffle(state, zoneName)

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
      grabCancel(state)
    },

    grabInfo({ state, getters }) {
      const grab = getters.grab
      const card = getters.cardAt(grab.source, grab.index)
      grabCancel(state)

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
      const player = playerByName(state, name)
      state.ui.player._id = player._id
      state.ui.player.name = player.name
    },

    async load({ dispatch, state }, data) {
      // Load the static deck data (used in info panels)
      state.data.decks = decks.factory(data.options.expansions)
      state.data.locations = bsgutil.expansionFilter(locations, data.options.expansions)
      state.game = data

      if (!data.initialized) {
        log(state, {
          template: 'Initializing game',
          classes: ['admin-action'],
          args: {},
        })

        await factory.initialize(data)
        setupInitialShips(state)
        await dispatch('save')
        await dispatch('snapshotCreate')
      }
    },

    async pass({ commit, dispatch, getters, state }, nameIn) {
      let name = nameIn

      if (name === 'president') {
        name = presidentName(state)
      }
      else if (name === 'admiral') {
        name = admiralName(state)
      }
      else if (name === 'next') {
        name = playerFollowing(state, getters.uiViewer).name
      }

      if (!name) {
        throw `Unknown player. in: ${nameIn} final: ${name}`
      }

      const user = playerByName(state, name)
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
      log(state, {
        template: "Phase set to {phase}",
        classes: ['phase-change'],
        args: { phase },
      })

      state.game.phase = phase

      if (phase === 'main-crisis') {
        if (zoneGet(state,'crisisPool').cards.length === 0) {
          state.game.players.forEach(p => p.crisisHelp = '')
        }
      }
    },

    refillDestiny({ commit, state }) {
      log(state, {
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

        grabCancel(state)
      }
      else {
        const zone = zoneGet(state, data.source)
        if (topDeck && zone.noTopDeck) {
          return
        }

        maybeReshuffleDiscard(state, zone)

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
