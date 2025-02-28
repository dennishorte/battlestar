Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Plot Voucher', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Plot Voucher'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Plot Voucher')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Plot Voucher'],
      },
    })
  })

})