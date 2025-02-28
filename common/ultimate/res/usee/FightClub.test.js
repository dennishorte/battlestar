Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Fight Club', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Fight Club'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fight Club')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Fight Club'],
      },
    })
  })

})