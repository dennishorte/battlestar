Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')

describe('fixture', () => {
  test('game is created', () => {
    const game = t.fixture()
  })

  test('game can initialize', () => {
    const game = t.fixture()
    game.run()
  })
})
