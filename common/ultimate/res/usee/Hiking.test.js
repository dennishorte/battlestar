Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Hiking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hiking'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Hiking')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Hiking'],
      },
    })
  })

})