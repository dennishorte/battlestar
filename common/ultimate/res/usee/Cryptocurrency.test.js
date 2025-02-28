Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cryptocurrency', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cryptocurrency'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Cryptocurrency')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Cryptocurrency'],
      },
    })
  })

})