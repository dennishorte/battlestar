import axios from 'axios'
import util from '@/util.js'

import Decks from '../lib/decks.js'
import bsgutil from '../lib/util.js'
import locations from '../res/location.js'


export default {
  initialize,
}

async function initialize(game) {
  if (game.initialized) {
    throw "Game already initialized"
  }

  // Top-level values
  game.initialized = true
  game.setupLoyaltyComplete = true
  game.phase = 'setup-character-creation'
  game.log = []

  // Counters
  game.counters = {
    food: 8,
    fuel: 8,
    morale: 10,
    population: 12,

    nukes: 2,

    jumpTrack: 0,
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
      kind: 'open',
    },
    decks,
    exile: {
      name: 'exile',
      cards: [],
      kind: 'open',
    },
    quorum: {
      name: 'quorum',
      cards: [],
      kind: 'hand',
      visibility: 'president',
    },
    players: makePlayerZones(game.players),
    ships: {
      vipers: makeVipersZone(),
      damagedVipers: makeDamagedVipersZone(),
      raiders: makeRaidersZone(),
      heavyRaiders: makeHeavyRaidersZone(),
      basestarA: makeBasestarZone('A'),
      basestarB: makeBasestarZone('B'),
    },
    space: makeSpaceZones(),

    locations: {
      galactica: makeLocations('Galactica', game.options.expansions),
      colonialOne: makeLocations('Colonial One', game.options.expansions),
      cylonLocations: makeLocations('Cylon Locations', game.options.expansions),
    },
  }

  game.zones.decks.loyalty = {
    name: 'loyalty',
    cards: [],
    kind: 'bag',
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


function locationCompare(l, r) {
  if (l.hazardous && !r.hazardous) {
    return 1
  }
  else if (!l.hazardous && r.hazardous) {
    return -1
  }
  else {
    return l.name.localeCompare(r.name)
  }
}

function makeLocations(area, expansions) {
  const areaPath = util.toCamelCase(area)

  const locs = bsgutil
    .expansionFilter(locations, expansions)
    .filter(x => x.area === area)
    .sort(locationCompare)
    .map(loc => {
      const locPath = util.toCamelCase(loc.name)
      return {
        name: `locations.${areaPath}.${locPath}`,
        cards: [],
        kind: 'open',
        details: loc,
      }
    })

  const locMap = {}
  for (const loc of locs) {
    const nameSuffix = loc.name.split('.').slice(-1)[0]
    locMap[nameSuffix] = loc
  }
  return locMap
}

function makePlayerZones(players) {
  const zones = {}
  const allPlayerNames = players.map(p => p.name)

  let idx = 0
  for (const player of players) {
    zones[player.name] = {
      name: `players.${player.name}`,
      cards: [{
        name: player.name,
        kindId: idx,
        id: `player-token-${idx}`,
        kind: 'player-token',
        expansion: 'base game',
        visibility: allPlayerNames,
      }],
      kind: 'hand',
      visibility: 'owner',
    }
    idx += 1
  }

  return zones
}

function makeSpaceZones() {
  const zones = {}
  for (let i = 0; i < 6; i++) {
    const name = `space${i}`
    zones[name] = {
      name,
      cards: [],
      kind: 'open',
    }
  }
  return zones
}

function makeShipsZone(zoneName, shipName, count) {
  const zone = {
    name: zoneName,
    cards: [],
    kind: 'bag',
    visibility: 'identical',
  }
  for (let i = 0; i < count; i++) {
    zone.cards.push({
      name: shipName,
      expansion: 'base game',
      kind: zoneName,
      kindId: i,
      id: `${zoneName}-${i}`,
      visibility: 'always',
    })
  }
  return zone
}

function makeVipersZone() {
  return makeShipsZone('ships.vipers', 'viper', 6)
}

function makeDamagedVipersZone() {
  return makeShipsZone('ships.damagedVipers', '', 0)
}

function makeRaidersZone() {
  return makeShipsZone('ships.raiders', 'raider', 16)
}

function makeHeavyRaidersZone() {
  return makeShipsZone('ships.heavyRaiders', 'heavy raider', 2)
}

function makeBasestarZone(key) {
  return makeShipsZone(`ships.basestar${key}`, `Basestar ${key}`, 1)
}
