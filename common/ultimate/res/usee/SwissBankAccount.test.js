Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Swiss Bank Account', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Swiss Bank Account'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Swiss Bank Account')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Swiss Bank Account'],
      },
    })
  })

})