Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Order of the Occult Hand', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Order of the Occult Hand'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Order of the Occult Hand')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Order of the Occult Hand'],
      },
    })
  })

})