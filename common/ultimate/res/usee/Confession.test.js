Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Confession', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confession'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Confession')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Confession'],
      },
    })
  })

})