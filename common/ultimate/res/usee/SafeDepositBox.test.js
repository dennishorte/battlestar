Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Safe Deposit Box', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Safe Deposit Box'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Safe Deposit Box')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Safe Deposit Box'],
      },
    })
  })

})