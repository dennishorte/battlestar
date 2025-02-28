Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Dance', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Dance'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Dance')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Dance'],
      },
    })
  })

})