Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Denver Airport', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Denver Airport'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Denver Airport')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Denver Airport'],
      },
    })
  })

})