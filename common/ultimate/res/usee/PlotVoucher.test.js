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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Plot Voucher')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Plot Voucher'],
      },
    })
  })

})