import axios from 'axios'
import util from '@/util.js'


async function makePlayers(userIds, factory) {
  const requestResponse = await axios.post('/api/user/fetch_many', {
    userIds,
  })
  const users = requestResponse.data.users
  const players = users.map(factory)
  return util.shuffleArray(players)
}

const Factory = {}
export default Factory

Factory.initialize = async function(game) {
  if (game.initialized) {
    throw "Game already initialized"
  }

  game.initialized = true

  // Game phase and step of phase
  game.phase = 'setup-character_creation'

  game.counters = {
    food: 8,
    fuel: 8,
    morale: 10,
    population: 12,

    raptors: 4,
    vipers: 6,
    damaged_vipers: 0,

    jump_track: 0,
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
    }
  })
  game.players[0].active = true

  game.skillCheck = {
    past: [],
    active: {
      card: {},
      logIds: [],  // List of log ids that were created during resolution
      skillCards: {},
    }
  }

  game.space = {
    deployed: [
      [],
      [],
      [ 'civilian', 'civilian' ],
      [ 'viper' ],
      [ 'viper' ],
      [ 'basestar', 'raider', 'raider', 'raider' ],
    ],
  }

  game.titles = {
    admiral: '',
    president: '',
  }

  return game
}
