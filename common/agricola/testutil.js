const { GameOverEvent } = require('../lib/game.js')
const { AgricolaFactory } = require('./agricola.js')
const TestCommon = require('../lib/test_common.js')
const log = require('../lib/log.js')



const TestUtil = { ...TestCommon }


TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    expansions: ['baseA'],
    numPlayers: 2,
    players: [
      {
        _id: 'dennis_id',
        name: 'dennis',
      },
      {
        _id: 'micah_id',
        name: 'micah',
      },
      {
        _id: 'scott_id',
        name: 'scott',
      },
      {
        _id: 'eliya_id',
        name: 'eliya',
      },
    ]
  }, options)

  options.players = options.players.slice(0, options.numPlayers)

  const game = AgricolaFactory(options, 'dennis')

  game.testSetBreakpoint('initialization-complete', (game) => {
    // Set turn order
    game.state.players = ['dennis', 'micah', 'scott', 'eliya']
      .slice(0, game.settings.numPlayers)
      .map(name => game.players.byName(name))
      .filter(p => p !== undefined)
  })

  return game
}

module.exports = TestUtil
