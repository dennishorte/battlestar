import axios from 'axios'
import util from './util.js'


async function makePlayers(userIds, factory) {
  const users = await axios.post('/api/user/fetch_many', {
    userIds,
  })
  const players = users.map(factory)
  return util.shuffleArray(players)
}


module.exports = async function(game) {
  if (game.initialized) {
    throw "Game already initialized"
  }

  game.initialized = true

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
  game.players = await makePlayers(game.userIds, (user) => {
    return {
      _id: user._id,
      index: 0,
      name: user.name,
      character: '',
      location: '',
      admiral: false,
      president: false,
      active: false,
      skillCards: [],
    }
  })

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
  },



  return game
}
