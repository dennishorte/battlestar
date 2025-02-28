Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Urban Legend', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Urban Legend'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Urban Legend')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Urban Legend'],
      },
    })
  })

})