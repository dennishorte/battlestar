Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Whatchamacallit', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Whatchamacallit'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Whatchamacallit')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Whatchamacallit'],
      },
    })
  })

})