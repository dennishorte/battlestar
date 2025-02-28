Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Fortune Cookie', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Fortune Cookie'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fortune Cookie')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Fortune Cookie'],
      },
    })
  })

})