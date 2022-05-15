Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Tyrants', () => {

  test('game initializes', () => {
    const game = t.fixture()
    game.run()
  })

})
