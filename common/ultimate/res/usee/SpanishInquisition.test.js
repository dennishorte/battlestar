Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Spanish Inquisition', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Spanish Inquisition'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Spanish Inquisition')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Spanish Inquisition'],
      },
    })
  })

})