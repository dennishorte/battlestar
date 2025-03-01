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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Safe Deposit Box')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Safe Deposit Box'],
      },
    })
  })

})