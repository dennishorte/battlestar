Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Area 51', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Area 51'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Area 51')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Area 51'],
      },
    })
  })

})