Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Black Market', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Black Market'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Black Market')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Black Market'],
      },
    })
  })

})