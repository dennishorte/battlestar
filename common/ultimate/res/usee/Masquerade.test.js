Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Masquerade', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Masquerade'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Masquerade')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Masquerade'],
      },
    })
  })

})