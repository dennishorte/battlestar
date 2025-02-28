Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Handbag', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Handbag'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Handbag')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Handbag'],
      },
    })
  })

})