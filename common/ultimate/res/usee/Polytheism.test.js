Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Polytheism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Polytheism'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Polytheism')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Polytheism'],
      },
    })
  })

})