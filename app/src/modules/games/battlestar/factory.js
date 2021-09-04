import axios from 'axios'
import util from '@/util.js'

import bsgutil from './util.js'
import civilianDistribution from './res/civilian_ships.js'
import destinationCards from './res/destination.js'
import quorumCards from './res/quorum.js'
import skillCards from './res/skill.js'


function fillSkillDecks(decks, expansions) {
  const cards = bsgutil.expansionFilter(skillCards, expansions)
  Object.keys(decks).forEach(skill => {
    decks[skill] = util.shuffleArray(cards.filter(c => c[skill]))
  })
}

function initializeCivilians() {
  const civilians = []
  for (let j = 0; j < civilianDistribution.length; j++) {
    const { effect, quantity } = civilianDistribution[j]
    for (let i = 0; i < quantity; i++) {
      const ship = {
        effect,
        population: 0,
        morale: 0,
        fuel: 0,
      }
      if (effect === '-1 population') {
        ship.population = -1
      }
      else if (effect === '-2 population') {
        ship.population = -2
      }
      else if (effect === '-1 population, -1 fuel') {
        ship.population = -1
        ship.fuel = 1
      }
      else if (effect === '-1 population, -1 morale') {
        ship.population = -1
        ship.morale = -1
      }
      else if (effect === 'Nothing') {
        // do nothing
      }
      else {
        throw "Unknown ship effect: " + effect
      }
      civilians.push(ship)
    }
  }

  return util.shuffleArray(civilians)
}

function makeDestinationDeck(expansions) {
  const cards = bsgutil.expansionFilter(destinationCards, expansions)
  return util.shuffleArray(cards)
}

async function makePlayers(userIds, factory) {
  const requestResponse = await axios.post('/api/user/fetch_many', {
    userIds,
  })
  const users = requestResponse.data.users
  const players = users.map(factory)
  return util.shuffleArray(players)
}

function makeQuorumDeck(expansions) {
  const cards = bsgutil.expansionFilter(quorumCards, expansions)
  return util.shuffleArray(cards)
}


const Factory = {}
export default Factory

Factory.initialize = async function(game) {
  if (game.initialized) {
    throw "Game already initialized"
  }

  game.initialized = true

  // Game phase and step of phase
  game.phase = 'setup-character-creation'

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

  game.destination = {
    deck: makeDestinationDeck(game.options.expansions),
    discard: [],
    admiralViewing: [],
    chosen: [],
    bonusDistance: 0,
  }

  game.log = []

  game.loyaltyDeck = []

  game.players = await makePlayers(game.userIds, (user) => {
    return {
      _id: user._id,
      index: 0,
      name: user.name,
      character: '',
      location: '',
      active: false,
      loyaltyCards: [],
      skillCards: [],
      oncePerGameActionUsed: false,
    }
  })
  game.players[0].active = true

  game.quorumDeck = makeQuorumDeck(game.options.expansions)
  game.quroumHand = [game.quorumDeck.pop()]

  game.skillCheck = {
    past: [],
    active: {
      card: {},
      logIds: [],  // List of log ids that were created during resolution
      skillCards: {},
    }
  }

  game.skillDecks = {
    politics: [],
    leadership: [],
    tactics: [],
    piloting: [],
    engineering: [],
    treachery: [],
  }
  fillSkillDecks(game.skillDecks, game.options.expansions)

  game.skillDiscards = {
    politics: [],
    leadership: [],
    tactics: [],
    piloting: [],
    engineering: [],
    treachery: [],
  }

  game.space = {
    ships: {
      civilian: {
        max: 12,
        destroyed: 0,
        remaining: initializeCivilians(),
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

    basestarDamageTokens: [
      "critical hit (2 damage)",
      "disabled hangar (can't launch)",
      "disabled weapons (can't shoot)",
      "structural damage (+2 to hit)",
    ],

    galacticaDamageTokens: [
      "-1 fuel",
      "-1 food",
      "Hangar Deck",
      "Armory",
      "Command",
      "Admiral's Quarters",
      "FTL Control",
      "Weapons Control",
    ],

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
