import axios from 'axios'
import util from '@/util.js'

import Decks from '../lib/decks.js'


export default {
  initialize,
}

async function initialize(game) {
  if (game.initialized) {
    throw "Game already initialized"
  }

  // Top-level values
  game.initialized = true
  game.phase = 'setup-character-creation'
  game.log = []

  // Counters
  game.counters = {
    food: 8,
    fuel: 8,
    morale: 10,
    population: 12,

    raptors: 4,
    damaged_vipers: 0,

    nukes: 2,

    jump_track: 0,
  }

  // Players
  game.players = await makePlayers(game.userIds, (user) => {
    return {
      _id: user._id,
      index: 0,
      name: user.name,
      location: '',
      active: false,
      oncePerGameActionUsed: false,
    }
  })
  game.players[0].active = true

  // Zones
  const decks = Decks.factory(game.options.expansions)
  game.zones = {
    common: {
      name: 'common',
      cards: [],
      visiblility: 'visible',
    },
    decks: makeDeckZones(decks),
    exile: {
      name: 'exile',
      cards: [],
      visibility: 'visible',
    },
    quorum: {
      name: 'quorum',
      cards: [],
      visibility: 'president',
    },
    players: makePlayerZones(game.players),
    ships: {}, // TODO
    space: makeSpaceZones(),
  }

  ////////////////////////////////////////////////////////////


  game.destination = {
    admiralViewing: [],
    chosen: [],
    bonusDistance: 0,
  }

  game.loyaltyDeck = []

  game.skillCheck = {
    past: [],
    active: {
      card: {},
      logIds: [],  // List of log ids that were created during resolution
      skillCards: {},
    }
  }

  game.space = {
    ships: {
      civilian: {
        max: 12,
        destroyed: 0,
      },
      viper: {
        max: 6,
        damaged: 0,
        destroyed: 0,
        piloted: 0,
      },
      galactica: {
        damage: [],
      },
      basestarA: {
        max: 1,
        damage: [],
        name: 'Basestar A',
      },
      basestarB: {
        max: 1,
        damage: [],
        name: 'Basestar B',
      },
      raider: { max: 16 },
      heavyRaider: { max: 2 },
    },

    deployed: [
      [],
      [],
      [ 'civilian', 'civilian' ],
      [ 'viper' ],
      [ 'viper' ],
      [ 'basestarA', 'raider', 'raider', 'raider' ],
    ],
  }

  game.titles = {
    admiral: '',
    president: '',
  }

  return game
}


////////////////////////////////////////////////////////////////////////////////
// Helper Functions

async function makePlayers(userIds, factory) {
  const requestResponse = await axios.post('/api/user/fetch_many', {
    userIds,
  })
  const users = requestResponse.data.users
  const players = users.map(factory)
  return util.shuffleArray(players)
}

function makeDeckZones(decks) {
  const zones = {}

  for (const [name, value] of Object.entries(decks)) {
    zones[name] = {
      name: `${name}.deck`,
      cards: value,
      visibility: 'hidden',
    }
  }

  return zones
}

function makePlayerZones(players) {
  const zones = {}

  for (const player of players) {
    zones[player.name] = {
      name: player.name,
      cards: [],
      visibility: 'hidden',
    }
  }

  return zones
}

function makeSpaceZones() {
  const zones = {}
  for (let i = 0; i < 6; i++) {
    const name = `zone${i}`
    zones[name] = {
      name,
      cards: [],
      visibility: 'visible',
    }
  }
  return zones
}
