Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../../lib/game.js')

const t = require('./testutil_cube.js')


describe('CubeDraft', () => {

  test('game creation', () => {
    const game = t.fixture()
    const request1 = game.run()
    // If no errors thrown, success.
  })

})
